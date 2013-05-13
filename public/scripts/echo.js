document.addEventListener('DOMContentLoaded', function() {
    // var socket = io.connect('http://localhost');
    var socket = io.connect('http://127.0.0.1');
    
    socket.socket.on('error', function(reason) {
        console.error('Could not connect to socket.', reason);
    });
    
    socket.on('connect', function () {
        console.log('Connected to server');
    });
    
    handleEcho(socket);
    sendTextOnEnter(socket);
});

function handleEcho(socket) {
    var display = document.getElementById('display');
    socket.on('echo', function(data) {
        console.log(data);
        display.appendChild(document.createTextNode(data.echo));
        display.appendChild(document.createElement('br'));
    });
}

function sendTextOnEnter(socket) {
    var input = document.getElementById('input');
    input.addEventListener('keydown',  function(event) {
        if (event.keyIdentifier === 'Enter') {
            socket.emit('sometext', { message: input.value } );
            input.value = "";
        }
    });
}
