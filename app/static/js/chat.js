var socket;
$(document).ready(function () {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    socket.on('connect', function () {
        socket.emit('joined', {});
    });
    socket.on('status', function (data) {
        $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    socket.on('message', function (data) {
        $('#chat').val($('#chat').val() + data.msg + '\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    $('#text').keypress(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            text = $('#text').val();
            $('#text').val('');
            socket.emit('text', { msg: text });
        }
    });
});
function leave_room() {
    socket.emit('left', {}, function () {
        socket.disconnect();

        // go back to the login page
        window.location.href = "{{ url_for('main.index') }}";
    });
}

function random_color(){
    return Math.floor(Math.random()*16777215).toString(16);
}

var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, random_color(), 10, 120);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height =  800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
      ctx = myGameArea.context;
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if(this.x < 1 & this.speedX < 0){
            this.speedX = 0;
        }
        else if(this.x > 960 & this.speedX > 0){
            this.speedX = 0;
        }
        else if(this.y < 1 & this.speedY < 0){
            this.speedY = 0;
        }
        else if(this.y > 770 & this.speedY > 0){
            this.speedY = 0;
        }
        else{
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
  }
  
  function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
  }
  
  function moveup() {
    myGamePiece.speedY -= 1;
  }
  
  function movedown() {
    myGamePiece.speedY += 1;
  }
  
  function moveleft() {
    myGamePiece.speedX -= 1;
  }
  
  function moveright() {
    myGamePiece.speedX += 1;
  }