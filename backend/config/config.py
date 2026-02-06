import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', os.urandom(24).hex())
    
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_NAME = 'session'
    SESSION_COOKIE_MAX_AGE = 3600
    
    # CORS configuration 
    CORS_CONFIG = {
        'origins': ['http://localhost:5173'],  
        'supports_credentials': True,
        'allow_headers': ['Content-Type', 'Authorization'],
        'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }

class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = 'Lax'

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_DOMAIN = None
    
    # Production CORS; To be updated**
    CORS_CONFIG = {
        'origins': ['https://vehicle-value-predictor.up.railway.app'],
        'supports_credentials': True,
        'allow_headers': ['Content-Type', 'Authorization'],
        'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        'expose_headers': ['Set-Cookie']
    }
    