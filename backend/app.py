from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['DEBUG'] = os.getenv('DEBUG', 'True').lower() == 'true'

    from routes.vin import vin_bp

    app.register_blueprint(vin_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug = True, port = 5000)