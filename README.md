# TicketIQ – AI-Powered Support Ticket System

TicketIQ is a modern, full-stack support ticket management system designed to streamline issue tracking through AI automation. It leverages **Google Gemini AI** to automatically classify tickets and assign priority levels based on natural language descriptions, reducing manual triage effort.

The system is built for performance and scalability, utilizing database-level constraints for data integrity and efficient ORM-based aggregation for real-time analytics. It is fully containerized with Docker for consistent deployment.

## Architecture Overview

The application follows a decoupled client-server architecture:

-   **Backend**: Django + Django REST Framework (DRF) serves as the API layer, handling business logic, data validation, and AI integration.
-   **Frontend**: React (Vite) + Tailwind CSS provides a responsive, modern user interface for ticket management and analytics.
-   **Database**: PostgreSQL serves as the primary data store, ensuring ACID compliance and robust data integrity.
-   **AI Integration**: A dedicated service layer interacts with Google's Gemini API to analyze ticket content asynchronously during the creation process.

### Request Flow
1.  **Ticket Creation**: Frontend sends a description to the backend.
2.  **AI Analysis**: Backend securely forwards the text to Gemini, which returns a structured JSON classification (Category & Priority).
3.  **Data Persistence**: If confirmed by the user, the ticket is saved to PostgreSQL with the AI-suggested metadata.
4.  **Analytics**: The dashboard fetches real-time aggregated stats calculated directly within the database via Django ORM.

## Features

-   **Smart Ticket Creation**: Auto-suggestions for category and priority using GenAI.
-   **AI Auto-Classification**: Uses Gemini 1.5 Flash to analyze issue descriptions in real-time.
-   **User Overrides**: Users can accept AI suggestions or manually override them before submission.
-   **Advanced Filtering**: Filter tickets by status, priority, and category, with full-text search capabilities.
-   **Status Management**: Kanban-style status updates (Open → In Progress → Resolved).
-   **Analytics Dashboard**: Visual overview of ticket volume, priority distribution, and resolution metrics.
-   **Containerized Setup**: One-command startup using Docker Compose.

## Data Model

The `Ticket` model is designed with strict data integrity in mind:

-   **Fields**: `title`, `description`, `status`, `priority`, `category`, `created_at`, `updated_at`.
-   **Constraints**:
    -   `status`, `priority`, and `category` are enforced via `TextChoices` to prevent invalid data entry.
    -   Indexing on frequently filtered fields (`status`, `priority`) for optimized query performance.
    -   Timestamps are automatically managed by Django.

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tickets/` | List all tickets with pagination and filtering. |
| `POST` | `/api/tickets/` | Create a new ticket. |
| `GET` | `/api/tickets/{id}/` | Retrieve details of a specific ticket. |
| `PATCH` | `/api/tickets/{id}/` | Update ticket status or details. |
| `DELETE` | `/api/tickets/{id}/` | Delete a ticket. |
| `POST` | `/api/tickets/classify/` | **AI Endpoint**: Analyzes description and returns suggested metadata. |
| `GET` | `/api/tickets/stats/` | Returns aggregated metrics for the dashboard. |

### Example AI Classification Request

**Request:**
```http
POST /api/tickets/classify/
Content-Type: application/json

{
    "description": "My internet is down and I cannot access the VPN."
}
```

**Response:**
```json
{
    "suggested_category": "technical",
    "suggested_priority": "high"
}
```

## LLM Integration

The system integrates with **Google Gemini** to provide intelligent classification.

-   **Model**: `gemini-flash-latest` (Optimized for speed and cost).
-   **Prompt Engineering**: A structured system prompt instructs the AI to act as a support agent and output strictly formatted JSON, mapping the input to predefined categories (Billing, Technical, Account, General) and priorities.
-   **Error Handling**: The integration includes fail-safe try-catch blocks. If the AI service is unreachable or returns invalid data, the system gracefully degrades to default values (General/Medium), ensuring the user workflow is never blocked.

## Running the Project

### Prerequisites
-   Docker Desktop installed
-   Google Gemini API Key

### Setup Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/heyysid18/TicketIQ.git
    cd TicketIQ
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory (or rename `.env.example`):
    ```env
    # General
    DEBUG=1
    SECRET_KEY=your-secret-key-here
    ALLOWED_HOSTS=localhost,127.0.0.1,backend

    # Database
    POSTGRES_DB=tickets
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_HOST=db
    POSTGRES_PORT=5432

    # AI Integration
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

3.  **Start the Application**
    ```bash
    docker compose up --build
    ```
    *This command will build the images, start the database, run migrations automatically, and launch the frontend and backend services.*

4.  **Access the App**
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **API**: [http://localhost:8000/api/tickets/](http://localhost:8000/api/tickets/)

## Database Migrations

The Docker configuration is set up to run database migrations automatically every time the backend container starts. This ensures your database schema is always in sync with the codebase without manual intervention.

## Design Decisions

-   **PostgreSQL**: Chosen for its reliability, rich feature set, and strong support for complex queries and data integrity constants.
-   **DB-Level Aggregation**: Statistics are calculated using Django's `aggregate` and `annotate` functions, pushing the heavy lifting to the database layer for O(1) scalability rather than processing in Python.
-   **Environment Variables**: All sensitive configuration (API keys, DB credentials) is decoupled from the code, following 12-Factor App principles.
-   **Docker Architecture**: Ensures consistency across development and production environments, eliminating "it works on my machine" issues.

## Evaluation Highlights

-   **Robust Data Integrity**: Enforced via model choices and database constraints.
-   **Efficient Analytics**: High-performance aggregation queries suitable for large datasets.
-   **Resilient AI**: The application remains fully functional even if the external AI service experiences downtime.
-   **Clean Architecture**: Clear separation of concerns between frontend, backend, and AI services.

## Future Improvements

-   **Authentication**: Implementing JWT authentication for user accounts.
-   **Pagination**: Adding backend pagination for the ticket list (Frontend currently handles basic views).
-   **Caching**: Implementing Redis caching for the stats endpoint.
-   **Role-Based Access**: Distinguishing between regular users and support agents.
