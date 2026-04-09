import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app import create_app
from models import db


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()


def register(client, username='tisha', email='tisha@test.com', password='test123'):
    return client.post('/api/auth/register', json={
        'username': username, 'email': email, 'password': password
    })


def login(client, email='tisha@test.com', password='test123'):
    return client.post('/api/auth/login', json={'email': email, 'password': password})


# ── Auth Tests ──────────────────────────────────────────────────────────────

def test_register_success(client):
    res = register(client)
    assert res.status_code == 201
    data = res.get_json()
    assert 'token' in data
    assert data['user']['email'] == 'tisha@test.com'


def test_register_duplicate_email(client):
    register(client)
    res = register(client)
    assert res.status_code == 409


def test_register_missing_fields(client):
    res = client.post('/api/auth/register', json={'email': 'a@b.com'})
    assert res.status_code == 400


def test_login_success(client):
    register(client)
    res = login(client)
    assert res.status_code == 200
    assert 'token' in res.get_json()


def test_login_wrong_password(client):
    register(client)
    res = login(client, password='wrongpass')
    assert res.status_code == 401


def test_login_nonexistent_user(client):
    res = login(client, email='nobody@test.com')
    assert res.status_code == 401


# ── Flashcard Tests ──────────────────────────────────────────────────────────

def get_token(client):
    register(client)
    res = login(client)
    return res.get_json()['token']


def auth_header(token):
    return {'Authorization': f'Bearer {token}'}


def test_create_flashcard(client):
    token = get_token(client)
    res = client.post('/api/flashcards', json={
        'question': 'What is photosynthesis?',
        'answer': 'The process by which plants make food from sunlight.',
        'subject': 'Biology',
        'difficulty': 'Easy',
    }, headers=auth_header(token))
    assert res.status_code == 201
    data = res.get_json()
    assert data['flashcard']['question'] == 'What is photosynthesis?'


def test_list_flashcards(client):
    token = get_token(client)
    h = auth_header(token)
    client.post('/api/flashcards', json={
        'question': 'Q1', 'answer': 'A1', 'subject': 'Math', 'difficulty': 'Easy'
    }, headers=h)
    res = client.get('/api/flashcards', headers=h)
    assert res.status_code == 200
    assert len(res.get_json()['flashcards']) == 1


def test_create_flashcard_missing_fields(client):
    token = get_token(client)
    res = client.post('/api/flashcards', json={'question': 'Q only'}, headers=auth_header(token))
    assert res.status_code == 400


def test_unauthorized_access(client):
    res = client.get('/api/flashcards')
    assert res.status_code == 401


def test_delete_flashcard(client):
    token = get_token(client)
    h = auth_header(token)
    create = client.post('/api/flashcards', json={
        'question': 'Q', 'answer': 'A', 'subject': 'Test', 'difficulty': 'Easy'
    }, headers=h)
    card_id = create.get_json()['flashcard']['id']
    res = client.delete(f'/api/flashcards/{card_id}', headers=h)
    assert res.status_code == 200
    # Confirm deleted
    list_res = client.get('/api/flashcards', headers=h)
    assert len(list_res.get_json()['flashcards']) == 0
