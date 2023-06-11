from package import app, socketio
from waitress import serve
from gevent import monkey
monkey.patch_all()


if __name__ == '__main__':
    """
    Entry point of the application.
    """
    socketio.run(app)
    
