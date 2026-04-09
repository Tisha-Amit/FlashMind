from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import os
import re

ai_bp = Blueprint('ai', __name__)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')


def _parse_with_gemini(text: str) -> list[dict]:
    """Call Gemini API to generate Q&A flashcard pairs from text."""
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""You are a flashcard generator. Read the following notes and generate 5-10 concise flashcard question-answer pairs.

Format your output EXACTLY like this, one per line:
Q: <question>
A: <answer>

Notes:
{text}

Generate the flashcards now:"""

    response = model.generate_content(prompt)
    return _parse_qa_text(response.text)


def _parse_with_regex(text: str) -> list[dict]:
    """Simple fallback: extract sentences and turn them into basic Q&A pairs."""
    sentences = [s.strip() for s in re.split(r'[.!?]', text) if len(s.strip()) > 20]
    cards = []
    for i, sentence in enumerate(sentences[:8]):
        # Split on first comma or 'is' to create rough Q&A
        parts = re.split(r'\s+is\s+|\s+are\s+|:\s*', sentence, maxsplit=1)
        if len(parts) == 2:
            cards.append({'question': f"What {parts[0].strip().lower()}?", 'answer': parts[1].strip()})
        else:
            cards.append({'question': f"What do you know about: {sentence[:60]}?", 'answer': sentence})
    return cards


def _parse_qa_text(text: str) -> list[dict]:
    """Parse 'Q: ... A: ...' format from Gemini response."""
    cards = []
    lines = text.strip().split('\n')
    current_q = None

    for line in lines:
        line = line.strip()
        if line.startswith('Q:'):
            current_q = line[2:].strip()
        elif line.startswith('A:') and current_q:
            answer = line[2:].strip()
            if current_q and answer:
                cards.append({'question': current_q, 'answer': answer})
            current_q = None

    return cards


@ai_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_flashcards():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Text content is required'}), 400

    if len(text) < 30:
        return jsonify({'error': 'Please provide more content (at least 30 characters)'}), 400

    try:
        if GEMINI_API_KEY:
            cards = _parse_with_gemini(text)
        else:
            cards = _parse_with_regex(text)

        if not cards:
            cards = _parse_with_regex(text)

        return jsonify({'flashcards': cards, 'count': len(cards)}), 200

    except Exception as e:
        # Graceful fallback
        try:
            cards = _parse_with_regex(text)
            return jsonify({'flashcards': cards, 'count': len(cards), 'note': 'Used fallback parser'}), 200
        except Exception:
            return jsonify({'error': 'Failed to generate flashcards', 'details': str(e)}), 500
