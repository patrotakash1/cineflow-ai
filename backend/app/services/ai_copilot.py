from groq import Groq
from app.config import settings
import json
import re
import io

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """You are CineFlow AI Copilot — an expert film production assistant.
You help independent filmmakers with:
- Script breakdown and scene analysis
- Shooting schedule optimization
- Budget planning and cost-saving tips
- Crew management and call sheet generation
- Equipment recommendations
- Industry best practices for Indian independent cinema

Always give practical, actionable advice. Keep responses concise and filmmaker-friendly.
Use rupees (INR) for all cost estimates. Reference Bollywood and Indian indie context where relevant.
Current project: Shadows of Tomorrow"""


def chat_with_copilot(messages: list, user_message: str) -> str:
    conversation = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in messages[-10:]:
        conversation.append(msg)

    conversation.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=conversation,
        max_tokens=1024,
        temperature=0.7,
    )

    return response.choices[0].message.content


def analyze_script_text(script_text: str) -> dict:
    prompt = f"""Analyze this film script and return a JSON object with exactly these fields:
{{
  "scenes": [
    {{
      "number": 1,
      "heading": "INT. COFFEE SHOP - DAY",
      "location": "Coffee Shop",
      "int_ext": "INT",
      "time_of_day": "DAY",
      "characters": ["CHARACTER1", "CHARACTER2"],
      "props": ["prop1", "prop2"],
      "estimated_pages": 1.5
    }}
  ],
  "characters": ["NAME1", "NAME2"],
  "locations": ["Location 1", "Location 2"],
  "total_scenes": 5,
  "estimated_shoot_days": 10,
  "budget_estimate_inr": 500000
}}

Script:
{script_text[:4000]}

Return ONLY valid JSON, no explanation, no markdown, no code blocks."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2048,
        temperature=0.1,
    )

    text = response.choices[0].message.content

    # Try to extract JSON from response
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group())

    return json.loads(text)


def optimize_schedule(scenes: list, constraints: str = "") -> str:
    prompt = f"""You are a film scheduling expert for Indian independent cinema.
Optimize this shooting schedule:

Scenes: {scenes}
Constraints: {constraints}

Provide a day-by-day shooting schedule that:
1. Groups scenes by location to minimize travel costs
2. Considers actor availability windows
3. Shoots all night scenes together to avoid reset costs
4. Minimizes equipment moves between locations
5. Accounts for Mumbai traffic and golden hour timing

Format as a clear day-by-day plan like:
DAY 1 - Location Name
- Scene 1: Description (Morning)
- Scene 5: Description (Afternoon)
Estimated cost: INR X

Include total estimated budget at the end."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024,
        temperature=0.3,
    )

    return response.choices[0].message.content