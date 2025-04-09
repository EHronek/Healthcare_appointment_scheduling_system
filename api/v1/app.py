#!/usr/bin/python3
"""Flask App"""
import models
from models.user import User
from flask import Flask, jsonify, url_for, session
import os
from api.v1.views import app_views
from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token
from authlib.common.security import generate_token
from flask_session import Session


app = Flask(__name__)

app.secret_key = os.getenv('SECRET_KEY')

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')



# OAuth Setup
oauth = OAuth(app)

""" google = oauth.register(
    name='google',
    client_id=os.getenv('CLIENT_ID'),
    client_secret=os.getenv('CLIENT_SECRET'),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://www.googleapis.com/oauth2/v3/userinfo',
    client_kwargs={'scope': 'openid email profile'}
) """

google = oauth.register(
    name='google',
    client_id=os.getenv('CLIENT_ID'),
    client_secret=os.getenv('CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# jwt setup
jwt = JWTManager(app)

# register bluprints
app.register_blueprint(app_views)

@app.teardown_appcontext
def teardown_db(exception):
    """Closes the current db session """
    models.storage.close()


@app.route("/login")
def login():
    # redirect_uri = url_for('authorize', _external=True)
    nonce = generate_token(32)
    session['nonce'] = nonce

    redirect_uri = url_for('authorize', _external=True)

    return google.authorize_redirect(redirect_uri, nonce=nonce)


@app.route('/authorize')
def authorize():
    try:
        token = google.authorize_access_token()
        nonce = session.get('nonce')
        user_info = google.parse_id_token(token, nonce=nonce)

        # extract user info
        email = user_info.get('email')
        name = user_info.get('name')

        # check if user exists or create them
        user = models.storage.get_user_by_email(email)

        if not user:
            user = User(
                name=name,
                email=email,
                password="",
                role="patient"
            )
            models.storage.new(user)
            models.storage.save()
        
        # Generate JWT
        access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
        refresh_token = create_refresh_token(identity=str(user.id))
        session['user_id'] = user.id
        
        user = models.storage.get(User, session['user_id'])
        print(user)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500



if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000, threaded=True, debug=True)
