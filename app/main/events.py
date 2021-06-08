from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    name = session.get('name')
    join_room(name)
    emit('status', {'msg': session.get('name') + ' has entered the room.'}, name=name)


@socketio.on('text', namespace='/chat')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    name = session.get('name')
    emit('message', {'msg': session.get('name') + ':' + message['msg']}, name=name)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    name = session.get('name')
    leave_room(name)
    emit('status', {'msg': session.get('name') + ' has left the room.'}, name=name)

