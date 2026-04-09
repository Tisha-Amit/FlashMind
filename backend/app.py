from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Always load .env from the backend folder, regardless of working directory
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_BASE_DIR, '.env'))



def create_app():
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-prod')
    # Use absolute path so database is always created in the backend folder
    db_path = os.path.join(_BASE_DIR, 'flashcards.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Import db from models (single instance)
    from models import db
    db.init_app(app)

    # Extensions
    CORS(app,
         origins=[
             "http://localhost:5173",
             "http://127.0.0.1:5173",
             "http://127.0.0.1:5174"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True)
    JWTManager(app)

    # Blueprints
    from routes.auth import auth_bp
    from routes.flashcards import flashcards_bp
    from routes.ai_generate import ai_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(flashcards_bp, url_prefix='/api/flashcards')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')

    # Create tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
