/**
 * Created by Rodey on 2015-06-07.
 * Author:  Rodey
 * E-mail:  rodeyluo@gmail.com
 * Lession: http://www.roadey.com
 * GitHub:  https://github.com/RodeyManager
 */

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

var cjs, stage;

window.onload = function(){
    cjs = createjs;
    var cw = window.innerWidth,
        ch = window.innerHeight;
        //获取画图板
        canvas = document.getElementById('canvas').getContext('2d');

        //创建舞台
        stage = new cjs.Stage('canvas');

    cjs.Touch.enable(stage);
    cjs.Ticker.setFPS(24);


    for(var i = 0, len = shapes.length; i < len; ++i){
        createShape(shapes[i]);
    }


};


function createShape(shape){

    var spposes = shape;
    var color = 'rgba(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',.3)';
    console.log(color);
    var shape = new cjs.Shape();
    shape.graphics.beginFill(color);
    shape.graphics.moveTo(spposes[0].x, spposes[0].y);
    for(var i = 1; i < spposes.length; ++i){
        shape.graphics.lineTo(spposes[i].x, spposes[i].y);
    }
    shape.graphics.lineTo(spposes[0].x, spposes[0].y);
    shape.graphics.endFill();
    stage.addChild(shape);
    stage.update();

    shape.addEventListener('click', function(){
        console.log(spposes);
    }, false);

}




