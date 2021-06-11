var socket;
var current_mem = {};
var mycolor;

function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


$(document).ready(function () {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    socket.on('connect', function () {
        var name = document.getElementsByTagName('meta')[0].getAttribute('name');
        console.log(mycolor,name);
        socket.emit('joined', { color: mycolor, cname: name});
    });
    socket.on('new_change', function (data) {
        var namec = data.name;
        if(typeof current_mem[namec] == 'undefined'){
            return;
        }
        var newx = data.newx;
        var newy = data.newy;
        current_mem[namec].x = newx;
        current_mem[namec].y = newy;
        current_mem[namec].update();
    });
    socket.on('status', function (data) {
        $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    socket.on('status_join', function (data) {
        $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
        var name = document.getElementsByTagName('meta')[0].getAttribute('name');
        console.log(data.color,data.jname);
        if( data.jname!=name){
            make_object(data.color, data.jname);
            console.log("making object");
        }
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
        window.location.href = "/";
    });
}

function make_object(color, name){
    current_mem[name] = new component2(30, 30, color, 10, 120);
    console.log(current_mem[name]);
}


var myGamePiece;

function startGame(name, color) {
    current_mem[name] = new component(30, 30, color, 10, 120);
}

function starta(){
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    mycolor = generateRandomColor();
    startGame(name, mycolor);
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1500;
        this.canvas.height = 650;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 150);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component2(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        if (this.x < 1 & this.speedX < 0) {
            this.speedX = 0;
        }
        else if (this.x > 1470 & this.speedX > 0) {
            this.speedX = 0;
        }
        else if (this.y < 1 & this.speedY < 0) {
            this.speedY = 0;
        }
        else if (this.y > 620 & this.speedY > 0) {
            this.speedY = 0;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        if (this.x < 1 & this.speedX < 0) {
            this.speedX = 0;
        }
        else if (this.x > 1470 & this.speedX > 0) {
            this.speedX = 0;
        }
        else if (this.y < 1 & this.speedY < 0) {
            this.speedY = 0;
        }
        else if (this.y > 620 & this.speedY > 0) {
            this.speedY = 0;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
}

function updateGameArea() {
    myGameArea.clear();
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    current_mem[name].newPos();
    current_mem[name].update();
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    socket.emit('change', {cname: name, newx: current_mem[name].x, newy: current_mem[name].y});

}

function moveup() {
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    current_mem[name].speedY -= 1;
}

function movedown() {
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    current_mem[name].speedY += 1;
}

function moveleft() {
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    current_mem[name].speedX -= 1;
}

function moveright() {
    var name = document.getElementsByTagName('meta')[0].getAttribute('name');
    current_mem[name].speedX += 1;
}