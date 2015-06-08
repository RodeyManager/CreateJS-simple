/**
 * Created by Rodey on 2015-06-08.
 * Author:  Rodey
 * E-mail:  rodeyluo@gmail.com
 * Lession: http://www.roadey.com
 * GitHub:  https://github.com/RodeyManager
 */


var canvas, ctx, rws, rhs;
var shapes = [
    [
        {"x": 0,"y": 0},{"x": 176,"y": 0},{"x": 216,"y": 97},{"x": 0,"y": 106}
    ],
    [
        {"x": 182,"y": 0},{"x": 400,"y": 0},{"x": 400,"y": 229},{"x": 298,"y": 207},{"x": 277,"y": 185}
    ],
    [
        {"x": 0,"y": 112},{"x": 215,"y": 103},{"x": 272,"y": 190},{"x": 0,"y": 351}
    ],
    [
        {"x": 0,"y": 360},{"x": 277, "y": 194},{"x": 292,"y": 216},{"x": 400,"y": 242},{"x": 400,"y": 438}
    ],
    [
        {"x": 0,"y": 368},{"x": 400,"y": 450},{"x": 400,"y": 555},{"x": 0,"y": 690}
    ],
    [
        {"x": 0,"y": 695},{"x": 400,"y": 575},{"x": 400,"y": 800},{"x": 0,"y": 800}
    ]
];

window.onload = function(){

    var cw = document.documentElement.clientWidth || document.body.clientWidth;
    var ch = document.documentElement.clientHeight || document.body.clientHeight;

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    console.log(canvas.width, canvas.height);
    rws = cw / parseInt(canvas.width, 10);
    rhs = ch / parseInt(canvas.height, 10);
    console.log(rws, rhs);

    canvas.width = canvas.width * rws;
    canvas.height = canvas.height * rhs;

    for(var i = 0, len = shapes.length; i < len; ++i){
        createShape(shapes[i], null);
    }

    canvas.addEventListener('click', toClickCanvasHandler, false);

};

function toClickCanvasHandler(evt){

    ctx.clearRect(0, 0, 400, 800);

    for(var i = 0, len = shapes.length; i < len; ++i){
        createShape(shapes[i], evt, i);

        var flag = ctx.isPointInPath(evt.offsetX, evt.offsetY);
        if(flag)
            console.log(i);
    }

}

function createShape(shape, evt, index){

    var spposes = shape;
    var color = 'rgba(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ', .5)';

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(spposes[0].x * rws, spposes[0].y * rhs);
    for(var i = 1, len = spposes.length; i < len; ++i){
        ctx.lineTo(spposes[i].x * rws, spposes[i].y * rhs);
    }
    ctx.lineTo(spposes[0].x * rws, spposes[0].y * rhs);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //evt && console.log(evt.clientX, evt.clientY);


}