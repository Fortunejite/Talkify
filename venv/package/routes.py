"""
routes.py
==============================
This module defines the routes and views for the chat application.
"""

from package import app, login_manager, socketio
from package.models import User, Post, load_user
from datetime import datetime
from flask import render_template, request, redirect, jsonify, url_for, send_file
from flask_login import login_required, current_user, login_user, logout_user
from io import BytesIO

# Home page route
@app.route('/', methods=['POST', 'GET'])
@login_required
def index():
    """
    Renders the home page of the chat application.

    Returns:
    - render_template: The rendered home.html template.
        - posts (list): A list of dictionaries containing post details.
        - user (User): The current logged-in user object.
    """
    if request.method == 'POST':
        type_of_request = request.form.get('type')
        friend = request.form.get('friend')
        if type_of_request == 'add_friend':
            current_user.send_friend_request(friend)
        elif type_of_request == 'accept':
            current_user.accept_friend_request(friend)
        elif type_of_request == 'reject':
            current_user.reject_friend_request(friend)

    friends = current_user.get_friends()
    posts = Post.query.all()
    posts2 = []
    for post in posts:
        post_dict = {
            'id': post.id,
            'sender': post.get_sender_username(),
            'body': post.body
        }
        posts2.append(post_dict)
    return render_template('chat.html', friends=friends, user=current_user.username, us=current_user)

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handles the login functionality for the chat application.

    GET:
    - Renders the login.html template.

    POST:
    - Retrieves the username and password from the form.
    - Validates the username and password.
    - Logs in the user if the credentials are valid.

    Returns:
    - jsonify: A JSON response containing the login status and redirect URL.
    - render_template: The rendered login.html template.
    """
    if request.method == 'POST':
        username = request.form.get('username', None)
        password = request.form.get('password', None)
        if not username:
            return jsonify(message='**Username is empty**', category='danger', error=401)
        if not password:
            return jsonify(message='**Password is empty**', category='danger', error=402)
        target_user = User.query.filter_by(username=username).first()
        if target_user:
            if target_user.verify_password(password):
                login_user(target_user)
                return jsonify(message='Login Success!', category='success', redirect=url_for('index'))
            else:
                return jsonify(message='**Incorrect password!**', category='danger', error=402)
        else:
            return jsonify(message=f'**{username} does not exist**', category='danger', error=401)
    else:
        return render_template('login.html')

# Registration route
@app.route('/register', methods=['POST'])
def register():
    """
    Handles the registration functionality for the chat application.

    POST:
    - Retrieves the username, password, and email from the form.
    - Validates the input data.
    - Registers a new user if the username is unique.
    - Logs in the newly registered user.

    Returns:
    - jsonify: A JSON response containing the registration status and redirect URL.
    """
    username = request.form.get('username', None)
    password = request.form.get('password', None)
    email = request.form.get('email', None)
    image_data = request.files['image'].read()
    if not username or not password or not email:
        return jsonify(message='Username, Password, or email is empty', category='danger', redirect=url_for('index')), 400, {'ContentType': 'application/json'}
    target_username = User.query.filter_by(username=username).first()
    target_email = User.query.filter_by(email=email).first()
    if target_username:
        return jsonify(message=f'{username} already exists', category='danger', redirect=url_for('index')), 406, {'ContentType': 'application/json'}
    elif target_email:
        return jsonify(message=f'{email} already exists', category='danger', redirect=url_for('index')), 406, {'ContentType': 'application/json'}
    else:
        new_user = User(username=username, password_hash=password, email=email, avatar=image_data)
        new_user.save()
        login_user(new_user)
        return jsonify(message=f'{username} registered', category='success', redirect=url_for('index')), 200, {'ContentType': 'application/json'}

# Display user avatar route
@app.route('/image/<username>')
@login_required
def display_image(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify(message=f'{username} does not exist', category='danger', redirect=url_for('index')), 406, {'ContentType': 'application/json'}
    image = user.avatar
    return send_file(BytesIO(image), mimetype='image/jpeg')

# Unauthorized access handler
@login_manager.unauthorized_handler
def unauthorized():
    """
    Handles unauthorized access to protected routes.

    Returns:
    - redirect: Redirects the user to the login page.
    """
    return redirect(url_for('login'))

# Logout route
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Handles the logout functionality for the chat application.

    POST:
    - Logs out the current user.

    Returns:
    - redirect: Redirects the user to the login page.
    """
    logout_user()
    return redirect(url_for('login'))

# Get messages route
@app.route('/chat/<friend>', methods=['GET'])
def messages(friend):
    messages = current_user.get_messages(friend)
    return jsonify(messages=messages)

# Send message route
@app.route('/chat/<friend>/send', methods=['POST'])
@login_required
def send_message(friend):
    text = request.form.get('body')
    owner = request.form.get('sent_by')

    message = {
        'body': text,
        'time': datetime.now().strftime('%H:%M:%S'),
        'sent_by': owner 
    }
    current_user.send_message(friend, message)
    socketio.emit(f'{current_user.username}-{friend}', message)
    return jsonify(message)

# Chat room route
@app.route('/room')
@login_required
def chat_room():
    return render_template('chat.html', friends=current_user.get_friends(), user=current_user.username, us=current_user)

# Notifications route
@app.route('/notifications')
@login_required
def notifications():
    return render_template('notifications.html', notifications=current_user.get_notifications(), func=load_user)

# Users route
@app.route('/users')
@login_required
def users():
    users = User.query.all()
    friends = current_user.get_friends()
    requests = current_user.get_pending_friend_requests()
    return render_template('friends.html', user=current_user, friends=friends, users=users, requests=requests)

# About route
@app.route('/about')
def about():
    return render_template('about.html')

# User profile route
@app.route('/profile/<name>')
@login_required
def profile(name):
    user = User.query.filter_by(username=name).first()
    return render_template('profile.html', user=user, current_user=current_user)
