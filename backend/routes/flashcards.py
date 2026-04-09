from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Flashcard

flashcards_bp = Blueprint('flashcards', __name__)


@flashcards_bp.route('', methods=['GET'])
@jwt_required()
def get_flashcards():
    user_id = int(get_jwt_identity())
    subject = request.args.get('subject')

    query = Flashcard.query.filter_by(user_id=user_id)
    if subject:
        query = query.filter_by(subject=subject)

    flashcards = query.order_by(Flashcard.created_at.desc()).all()
    return jsonify({'flashcards': [f.to_dict() for f in flashcards]}), 200


@flashcards_bp.route('', methods=['POST'])
@jwt_required()
def create_flashcard():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    question = data.get('question', '').strip()
    answer = data.get('answer', '').strip()
    subject = data.get('subject', 'General').strip() or 'General'
    difficulty = data.get('difficulty', 'Medium').strip()

    if not question or not answer:
        return jsonify({'error': 'Question and answer are required'}), 400

    if difficulty not in ['Easy', 'Medium', 'Hard']:
        difficulty = 'Medium'

    card = Flashcard(
        question=question,
        answer=answer,
        subject=subject,
        difficulty=difficulty,
        user_id=user_id
    )
    db.session.add(card)
    db.session.commit()

    return jsonify({'message': 'Flashcard created', 'flashcard': card.to_dict()}), 201


@flashcards_bp.route('/<int:card_id>', methods=['PUT'])
@jwt_required()
def update_flashcard(card_id):
    user_id = int(get_jwt_identity())
    card = Flashcard.query.filter_by(id=card_id, user_id=user_id).first()

    if not card:
        return jsonify({'error': 'Flashcard not found'}), 404

    data = request.get_json()
    card.question = data.get('question', card.question).strip() or card.question
    card.answer = data.get('answer', card.answer).strip() or card.answer
    card.subject = data.get('subject', card.subject).strip() or card.subject
    if data.get('difficulty') in ['Easy', 'Medium', 'Hard']:
        card.difficulty = data['difficulty']

    db.session.commit()
    return jsonify({'message': 'Flashcard updated', 'flashcard': card.to_dict()}), 200


@flashcards_bp.route('/<int:card_id>', methods=['DELETE'])
@jwt_required()
def delete_flashcard(card_id):
    user_id = int(get_jwt_identity())
    card = Flashcard.query.filter_by(id=card_id, user_id=user_id).first()

    if not card:
        return jsonify({'error': 'Flashcard not found'}), 404

    db.session.delete(card)
    db.session.commit()
    return jsonify({'message': 'Flashcard deleted'}), 200


@flashcards_bp.route('/subjects', methods=['GET'])
@jwt_required()
def get_subjects():
    user_id = int(get_jwt_identity())
    subjects = db.session.query(Flashcard.subject).filter_by(user_id=user_id).distinct().all()
    return jsonify({'subjects': [s[0] for s in subjects]}), 200
