from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from .hashingfun import HashTable

hash_mem = []
hash_color = HashTable(1000)
hash_x = HashTable(1000)
hash_y = HashTable(1000)


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    name = session.get('name')
    color = message['color']
    # print(name,color,"==========",hash_color,hash_color.get_val(name))
    if(hash_color.get_val(name) == 'nan'):
        hash_color.set_val(name, color)
        join_room(name)
        hash_mem.append(name)
        hash_x.set_val(name, 30)
        hash_y.set_val(name, 30)
        # print("------------",hash_mem)

    # print(color, name,"//////////",hash_mem)
    for n in hash_mem:
        # print(n,"**************")
        emit('status_join', {'msg': n + ' has entered the room.', 'jname': n, 'color': hash_color.get_val(n)}, room = name)
    
    for n in hash_mem:
        if(n!=name):
            emit('status_join', {'msg': session.get('name') + ' has entered the room.', 'jname': name, 'color': color}, room = n)
        


@socketio.on('change', namespace='/chat')
def change(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    name = session.get('name')
    newx = message['newx']
    newy = message['newy']
    namec = message['cname']
    hash_x.set_val(namec, newx)
    hash_y.set_val(namec,newy)


    for n in hash_mem:
        # if( name != n ):
        emit('new_change', {'name': namec, 'newx': newx, 'newy': newy}, room = n)



@socketio.on('text', namespace='/chat')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    name = session.get('name')
    near = []
    for i in hash_mem:
        if(i!=name):
            if(((hash_x.get_val(i)-hash_x.get_val(name))**2) + ((hash_y.get_val(i)-hash_y.get_val(name))**2) < 10000 ):
                near.append(i)


    emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=name)
    for i in near:
        emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=i)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    name = session.get('name')
    leave_room(name)
    hash_color.delete_val(name)
    hash_x.delete_val(name)
    hash_y.delete_val(name)
    for n in hash_mem:
        emit('status', {'msg': session.get('name') + ' has left the room.'}, room=n)

