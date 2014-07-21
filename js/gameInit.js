var CJS = createjs,
	cw, ch,
	stage,
	bgBlur,
	bg,
	image,
	startShape,
	radiusStep = 10,
	shipNum = 5,
	ships = [],
	temp = [],

	startBtnCon,
	startGameTXT,

	ship,
	shipCon,

	scoeTotal = 0,
	scoeStep = 100,
	scoeTxt,

	startTime,
	endTime,
	timeSprite,
	timeSpriteHeight = 5;

window.onload = function(){

	cw = window.innerWidth;
	ch = window.innerHeight;

	var canvas = document.getElementById('canvas');
	canvas.width = cw;
	canvas.height = ch;
	//console.log(cw, ch)

	stage = new CJS.Stage('canvas');
	CJS.Touch.enable(stage);
	stage.enableMouseOver(10); 
	stage.mouseMoveOutside = true;

	//添加背景
	bg = new Image();
	bg.onload = setBackground;
	bg.src = 'images/bg.jpg';

	//加载战斗机
	ship = new Image();
	ship.onload = function(){};
	ship.src = 'images/ship.png';

};

function setBackground(evt){
	var bitmap = new CJS.Bitmap(bg);
	bitmap.width = cw;
	bitmap.height = ch;
	bitmap.x = 0;
	bitmap.y = 0;

	//创建遮罩
	bgBlur = createBlur();

	//创建文本
	startBtnCon = new CJS.Container();
	startGameTXT = createTxt();
	startGameTXT.mouseEnabled = true;
	startBtnCon.addChild(startGameTXT);
	//创建按钮
	startShape = createStartBtn();
	startBtnCon.addChild(startShape);

	stage.addChild(bitmap, bgBlur, startBtnCon);
	//侦听开始事件
	startShape.addEventListener('click', startGame);
	stage.update();
}


//开始游戏
function startGame(evt){
	var target = evt.currentTarget;
	//var mc = target.getChildByName('_mc');
	var startShape = target.getChildByName('_startShape');
	var startShapeTxt = target.getChildByName('_startShapeTxt');
	// console.log(startShape);
	// console.log(startShapeTxt);
	
	stage.removeChild(startBtnCon);
	stage.removeChild(bgBlur);
	stage.update();

	//创建分数文本
	scoeTxt = createTxt('总分： ' + scoeTotal, 'bold 20px Arial', '#FFFFFF', cw - 100, 30);
	stage.addChild(scoeTxt);

	createShips(shipNum); 

	startTime = Date.now || new Date().getTime();
	timeSprite = createTimeSprite();
	stage.addChild(timeSprite);
	stage.update();
}

function createShips(){
	shipCon = new CJS.Container();
	stage.addChild(shipCon);
	ships = [];
	var i = 0;
	var len = shipNum;

	for(; i < len; ++i){
		createShip(i);
		//bitship.addEventListener('tick', shipMove);
	}

	CJS.Ticker.addEventListener("tick", tick);
	CJS.Ticker.setFPS(60);

	/*setTimeout(function(){
		CJS.Ticker.removeEventListener('tick', tick);
	}, 8000);*/

	stage.update();
}

function tick(evt){
	var len = ships.length;
	
	if(len > 0){
		var i = 0;
		for(; i < len; ++i){

			if(ships[i]){
				if(ships[i].y < -120){
					ships[i].y = ch + Math.random() * 500;
				}
				ships[i].y -= Math.random() + 1;
			}
			stage.update();
		}
		//console.log(ships)
	}
	var shapeTime = timeSprite.getChildByName('_shapeTime');
	shapeTime.scaleX -= 0.0005;
	if(shapeTime.scaleX <= 0){
		stop();
	}
}

function stop(evt){
	CJS.Ticker.removeEventListener('tick', tick);
	stage.removeChild(shipCon);
	bgBlur = createBlur();
	stage.addChild(bgBlur);
	stage.update();
}

function shipPong(evt){
	console.log(evt.currentTarget)
	var target = evt.currentTarget;
	var index = target.name.match(/\d/)[0];
	shipCon.removeChild(evt.currentTarget);
	var ship = createShip(index);
	resetBitShip(ship);
	ships[index] = ship;
	shipCon.addChild(ship);
	scoeTotal += scoeStep;
	scoeTxt.text = '总分： ' + scoeTotal;
	if(scoeTotal >= 2000){
		scoeTxt.color = '#D76433';
	}else if(scoeTxt >= 5000){
		scoeTxt.color = '#E81741';
	}
	//stage.update();
}


function createBlur(){
	//创建遮罩
	var bgBlur = new CJS.Bitmap(bg);
	bgBlur.filters = [new CJS.BlurFilter(20, 20, 10)];
	bgBlur.cache(0, 0, cw, ch);
	bgBlur.alpha = 0.9;
	bgBlur.width = cw;
	bgBlur.height = ch;
	bgBlur.x = 0;
	bgBlur.y = 0;
	bgBlur.name = '_bgBlur';
	return bgBlur;
}

function createShip(index){
	var bitship = new CJS.Bitmap(ship);
	bitship.name = '_bitship_' + index;
	bitship.regX = ship.width * .5;
	bitship.regY = ship.height * .5;
	bitship.x = Math.random() * cw + 20;
	resetBitShip(bitship);
	shipCon.addChild(bitship);
	ships.push(bitship);
	bitship.addEventListener('click', shipPong);
	return bitship;
}

function resetBitShip(ship){
	var x = Math.random() * cw + 20;
	var y = ch + Math.random() * 500;
	if(x > cw) x = Math.random() * cw / 2 + 20;
	ship.x = x;
	ship.y = y;
	ship.mouseEnabled = true;
}


function createTxt(txt, style, color, x, y){
	var txt = new CJS.Text(txt || "开始游戏", style || "bold 36px Arial", color || "#FFFFFF"); 
	txt.textBaseline = "alphabetic";
	txt.textAlign = 'center';
	txt.cursor = 'pointer';
	txt.mouseEnabled = true;
	txt.x = x || ((cw - txt.lineWidth) * .5);
	txt.y = y || (ch - txt.lineHeight) * .5;
	return txt;
}

function createStartBtn(){
	var mc = new CJS.Container();
	mc.name = '_mc';
	var startShape = new CJS.Shape();
	startShape.graphics.beginFill("#FFF").drawRoundRectComplex(0, 0, 100, 40, radiusStep, radiusStep, radiusStep, radiusStep);
	startShape.x = (cw - 100) * .5;
	startShape.y = (ch - 40) * .5 + 40;
	startShape.mouseEnabled = true;
	startShape.name = '_startShape';
	//按钮文字
	var startShapeTxt = new CJS.Text('GO', 'bold 28px Arial', '#333');
	startShapeTxt.x = cw * .5 - 20;
	startShapeTxt.y = ch * .5 + 25;
	startShapeTxt.name = '_startShapeTxt';
	mc.addChild(startShape, startShapeTxt);
	return mc;
}

function createTimeSprite(){
	var mc = new CJS.Container();
	mc.x = 0;
	mc.y = 0;
	var shapeBG = new CJS.Shape(new CJS.Graphics().beginFill('rgba(255, 255, 255, .6)').drawRect(0, 0, cw, timeSpriteHeight));
	var shapeTime = new CJS.Shape(new CJS.Graphics().beginFill('rgba(125, 122, 130, .9)').drawRect(0, 0, cw, timeSpriteHeight));
	shapeTime.name = '_shapeTime';
	mc.addChild(shapeBG, shapeTime);
	return mc;
}
