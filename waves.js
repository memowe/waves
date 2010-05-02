$(function(){

    // get rid of the no js warning
    $('#no-js-warning').remove();

    // metric
    function d(p1,p2) {
        return Math.sqrt( (p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y) );
    }

    
    //
    // configuration
    //

    var count       = 10;
    var distance    = 20;
    var size        = 10;
    var gravity     = { x: 15, y: 0 };
    var slowness    = 80;
    var lightness   = .98;


    //
    // generate oszillators
    //

    function Osz(id) {

        this.id     = id;
        this.x      = 0;
        this.y      = 0;
        this.lastX  = 0;
        this.lastY  = 0;
        this.env    = new Array();
        this.jqo    = $('<div/>', {
            id: 'osz' + id,
            class: 'osz',
            css: {
                width: size + 'px',
                height: size + 'px',
            },
        });

        this.updateJqo = function() {
            this.jqo.css({
                left: this.x.toFixed(0) + 'px',
                top: this.y.toFixed(0) + 'px',
            });
        };

        this.moveTo = function(point) {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x = point.x;
            this.y = point.y;
            this.updateJqo();
        };

        this.move   = function() {
            var movement = {
                x: this.x - this.lastX,
                y: this.y - this.lastY,
            };
            var envVector = { x: gravity.x, y: gravity.y };
            for ( var i = 0; i < this.env.length; i++ ) {
                var diff = {
                    x: this.env[i].x - this.x,
                    y: this.env[i].y - this.y,
                };
                var dist = d(this,this.env[i]) / distance;
                var scalar = dist > 1
                    ? ( dist <=   2 ? dist - 1   :  1 )
                    : dist - 1;
                envVector.x += scalar * diff.x;
                envVector.y += scalar * diff.y;
            }
            this.moveTo({
                x: this.x + ( envVector.x / slowness + movement.x * lightness ),
                y: this.y + ( envVector.y / slowness + movement.y * lightness ),
            });
        };
    }

    var osz     = new Array();
    var canvas  = $('<div/>', { id: 'canvas' }).insertAfter($('#config'));

    for ( var id = 0; id < count; id++ ) { // creashun
        osz[id] = new Osz(id);
        canvas.append(osz[id].jqo);
    }

    for ( var id = 1; id < osz.length; id++ ) { // envirenmentalization
        osz[id].env.push( osz[ id - 1 ] );
        if ( id + 1 < osz.length ) {
            osz[id].env.push( osz[ id + 1 ] );
        }
    }


    //
    // mouse interaction
    //

    var active = false;

    function mouseMoveAction(e) {
        if ( active ) osz[0].moveTo({ x: e.pageX - 12, y: e.pageY -12 });
    }

    canvas
        .mousemove(mouseMoveAction)
        .click(function(e) {
            active = ! active;
            mouseMoveAction(e);
        });


    //
    // updateupdateupdate
    //
    
    function update() {
        for ( var id = 1; id < osz.length; id++ ) {
            osz[id].move();
        }
    };

    var update = window.setInterval(update, 10);

});
