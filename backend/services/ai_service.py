"""
AI Service — abstracts OpenAI and Gemini API calls.
Falls back gracefully if no API key is configured.
"""

import httpx
import json
from typing import List, Dict, Optional
from backend.config import settings


async def call_ai(
    user_message: str,
    system: str = "",
    history: List[Dict] = [],
) -> str:
    """
    Route to configured AI provider (Gemini or OpenAI).
    Falls back to rule-based response if no key is set.
    """
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        return await _call_gemini(user_message, system, history)
    elif settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        return await _call_openai(user_message, system, history)
    else:
        return _fallback_response(user_message)


async def _call_gemini(user_message: str, system: str, history: List[Dict]) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"

    # Build contents array
    contents = []
    for msg in history:
        contents.append({
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [{"text": msg["content"]}]
        })
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    payload = {
        "system_instruction": {"parts": [{"text": system}]} if system else None,
        "contents": contents,
        "generationConfig": {
            "temperature":     0.7,
            "maxOutputTokens": 800,
            "topP":            0.9,
        },
    }
    if not system:
        del payload["system_instruction"]

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def _call_openai(user_message: str, system: str, history: List[Dict]) -> str:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type":  "application/json",
    }

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    payload = {
        "model":       "gpt-4o-mini",
        "messages":    messages,
        "max_tokens":  800,
        "temperature": 0.7,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


def _fallback_response(message: str) -> str:
    """Used when no AI key is configured."""
    msg = message.lower()
    if "career" in msg:
        return "Based on your profile, AI/ML Engineering is your top career match with 95%+ demand growth. Head to the Career page for full analysis!"
    if "skill" in msg or "gap" in msg:
        return "Your priority gaps are: System Design, Kubernetes, and MLOps. Start with the System Design Primer — it's free and high-impact."
    if "predict" in msg or "future" in msg:
        return "You're at 82% job readiness and trending upward. Close your System Design gap to hit 90%+ in 3 months!"
    return "I'm your NEXUS AI mentor! Ask me about careers, skill gaps, courses, simulations, or career predictions."
