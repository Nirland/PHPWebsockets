var ball = document.getElementById('ball');

ball.init = function(){  
    this.style.position = 'absolute';
    document.body.appendChild(this);
    this.style.zIndex = 1000; 
};

ball.onmousedown = function(e) {
    e = fixEvent(e);

    var coords = getCoords(this);

    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    moveAt(e);
    
    function moveAt(e) {
        var coords = {
            left: e.pageX - shiftX,
            top: e.pageY - shiftY
        };
        
        if (Connection.isBroadcaster){
            Connection.send(coords);
        }        
    }

    document.onmousemove = function(e) {
        e = fixEvent(e);
        moveAt(e);
    };

    this.onmouseup = function() {
        document.onmousemove = self.onmouseup = null;
    };

};

ball.ondragstart = function() {
    return false;
};

var Connection = {
    socket: null,
    host: socketHost,
    isBroadcaster: broadcast,
    
    init: function() {
        if (!("WebSocket" in window)) {
            alert("WebSockets not supported! Test this application in other browsers, like Chrome, Firefox, Safari!");
            return;
        }

        this.socket = new WebSocket(this.host);

        this.socket.onopen = function() {
            console.log('Connected to ' + socketHost);
            
        };

        this.socket.onmessage = function(message) {            
            Connection.handle(JSON.parse(message.data));
        };

        this.socket.onclose = function() {
            console.log('Disconnected from' + socketHost);
        };
    },
    
    send: function(message) {
        this.socket.send(JSON.stringify(message));
    },
    
    handle: function(data) {       
        ball.style.left = data.left + 'px';
        ball.style.top = data.top + 'px';
    }
};

function fixEvent(e) {
    // получить объект событие для IE
    e = e || window.event

    // добавить pageX/pageY для IE
    if (e.pageX == null && e.clientX != null) {
        var html = document.documentElement
        var body = document.body
        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
    }

    // добавить which для IE
    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0))
    }

    return e;
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return {top: Math.round(top), left: Math.round(left)};
}

Connection.init();
ball.init();