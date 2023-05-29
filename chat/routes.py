from chat import app, login_manager
from chat.models import User, Post
from flask import render_template, request, redirect, jsonify, url_for
from flask_login import login_required, current_user, login_user, logout_user

@app.route('/')
@login_required
def index():
    posts = Post.query.all()
    posts2=[]
    for post in posts:
        jj = {
            'id': post.id,
            'sender': post.get_sender_username(),
            'body': post.body
        }
        posts2.append(jj)
    return render_template('home.html', posts=posts2, user=current_user)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', None)
        password = request.form.get('password', None)
        if not username:
            return jsonify(message = '**Username is empty**', category='danger', redirect = url_for('login'), error = 401), 401, {'ContentType':'application/json'}
        if not password:
            return jsonify(message = '**Password is empty**', category='danger', redirect = url_for('login'), error = 402), 402, {'ContentType':'application/json'}
        target = User.query.filter_by(username=username).first()
        if target:
            if target.password_hash == password:
                login_user(target)
                return jsonify(message = 'Login Success!', category='success', redirect =url_for('index')), 200, {'ContentType':'application/json'}
            else:
                return jsonify(message ='**Incorrect password!**', category='danger', redirect = url_for('login'), error = 402), 402, {'ContentType':'application/json'}
            
        else:
            return jsonify(message = f'**{username} does not exits**', category='danger', redirect = url_for('login'), error = 401), 401, {'ContentType':'application/json'}
    else:
        return render_template('login.html')
    
@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username', None)
    password = request.form.get('password', None)
    email = request.form.get('email', None)
    if not username or not password or not email:
        return jsonify(message = 'Username, Password or email is empty', category='danger', redirect = url_for('register')), 400, {'ContentType':'application/json'}
    target = User.query.filter_by(username=username).first()
    if target:
        return jsonify(message = f'{username} already exists', category='danger', redirect = url_for('register')), 406, {'ContentType':'application/json'}
    else:
        new_user = User(username=username, password_hash=password, email=email)
        new_user.save()
        login_user(new_user)
        return jsonify(message = f'{username} registered', category='success', redirect = url_for('index')), 200, {'ContentType':'application/json'}

@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('login'))

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))
