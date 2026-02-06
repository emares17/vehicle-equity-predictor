import os
from dotenv import load_dotenv

load_dotenv()

class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = False

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_DOMAIN = None
    
    # Production CORS; To be updated**
    CORS_CONFIG = {
        'origins': ['https://vehicle-value-predictor.up.railway.app/'],
        'supports_credentials': True,
        'allow_headers': ['Content-Type', 'Authorization'],
        'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        'expose_headers': ['Set-Cookie']
    }
    