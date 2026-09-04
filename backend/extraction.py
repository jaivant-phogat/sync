import os
import json
from pypdf import PdfReader
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def extract_text_from_pdf(file_bytes):
    reader = PdfReader(file_bytes)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def extract_tasks_from_text(text):
    prompt = f"""You are helping a student group break down an assignment into tasks.

Here is the assignment text:
---
{text[:6000]}
---

Extract a list of concrete tasks needed to complete this assignment. For each task, provide:
- title (short, a few words)
- description (one sentence)
- estimated_effort (a rough number of hours, integer)

Respond in the same language as the assignment text above (English or French). Respond with ONLY valid JSON in this exact format, nothing else, no markdown formatting:
{{
  "project_title": "a short title for this overall assignment",
  "tasks": [
    {{"title": "...", "description": "...", "estimated_effort": 0}}
  ]
}}"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    raw_text = response.text.strip()
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
    raw_text = raw_text.strip()

    return json.loads(raw_text)