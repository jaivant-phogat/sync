import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def generate_intervention(risk_data):
    if risk_data["risk_score"] == 0:
        return {
            "generated_text": "Project is healthy. No intervention needed.",
            "recommendation": None
        }

    reasons_text = "\n".join(f"- {r}" for r in risk_data["reasons"])

    prompt = f"""You are a project management assistant helping a student group.

A project has a risk score of {risk_data['risk_score']}/100 (status: {risk_data['status']}).

Here are the detected issues:
{reasons_text}

Write a short, clear alert (2-3 sentences) explaining the risk in plain language, followed by ONE specific, actionable recommendation to fix it. Be direct and practical. Do not use markdown formatting."""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    text = response.text.strip()

    return {
        "generated_text": text,
        "recommendation": text
    }