from package import app, socketio
from waitress import serve

if __name__ == '__main__':
    """
    Entry point of the application.
    """
    serve(app, host='127.0.0.1', port=8000)
    socketio.run(app)
    