from package import app, socketio
from gevent import monkey
monkey.patch_all()

if __name__ == '__main__':
    """
    Entry point of the application.
    """
    socketio.run(app, host='0.0.0.0', port=8000)
    
