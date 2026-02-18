import os
import json
import logging
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('GEMINI_API_KEY')
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set.")
            self.model = None
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')

    def classify_ticket(self, description):
        """
        Classifies a ticket description into category and priority using Gemini.
        Returns a dict or None if failed.
        """
        if not self.model:
            return None

        prompt = f"""
        You are an AI support assistant. Classify the following ticket description into a category and priority.

        Categories: billing, technical, account, general
        Priorities: low, medium, high, critical

        Description: "{description}"

        Respond ONLY with a valid JSON object in the following format, with no markdown formatting:
        {{
            "category": "...",
            "priority": "..."
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                )
            )
            
            content = response.text.strip()
            # Clean up potential markdown code blocks
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            data = json.loads(content.strip())
            
            # Validate output
            valid_categories = ['billing', 'technical', 'account', 'general']
            valid_priorities = ['low', 'medium', 'high', 'critical']

            category = data.get('category', 'general').lower()
            priority = data.get('priority', 'medium').lower()

            if category not in valid_categories:
                category = 'general'
            if priority not in valid_priorities:
                priority = 'medium'

            return {
                "suggested_category": category,
                "suggested_priority": priority
            }

        except Exception as e:
            logger.error(f"AI Classification failed: {str(e)}")
            return None
