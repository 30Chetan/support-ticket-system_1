import os
import json
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('OPENAI_API_KEY')
        if not self.api_key:
            logger.warning("OPENAI_API_KEY is not set.")
            self.client = None
        else:
            self.client = OpenAI(api_key=self.api_key)

    def classify_ticket(self, description):
        """
        Classifies a ticket description into category and priority.
        Returns a dict or None if failed.
        """
        if not self.client:
            return None

        prompt = f"""
        You are an AI support assistant. Classify the following ticket description into a category and priority.

        Categories: billing, technical, account, general
        Priorities: low, medium, high, critical

        Description: "{description}"

        Respond ONLY with a valid JSON object in the following format:
        {{
            "category": "...",
            "priority": "..."
        }}
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that outputs JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
            )
            
            content = response.choices[0].message.content.strip()
            data = json.loads(content)
            
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
