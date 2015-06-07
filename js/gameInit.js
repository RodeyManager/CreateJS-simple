var CJS = createjs,
	cw, ch,				//屏幕尺寸
	stage,				//舞台
	bgBlur,				//遮罩层
	bg,					//背景层
	image,				

	startShape, 		//开始按钮
	radiusStep = 10,	//按钮圆角大小
	speed = 1.5, 		//速度
	vy = 0.001, 		//加速度
	shipNum = 8,		//默认战斗机数据
	ships = [],			//战斗机数组
	temp = [],
	isOverrider = false,

	startBtnCon,		//开始容器
	startGameTXT,		//开始文本
	loadingField,		//加载进度文本
	loadingBar, 		//加载进度条
	loadingSquer, 		//加载圆

	ship, 				//战斗机
	shipCon,			//找都记容器
	bomb, 				//爆炸物
	f20_mc, 			//主机
	f20, 				//F20歼机
	bulletImg, 			//子弹图片
	bullet, 			//子弹对象
	bullets = [],		//存放子弹
	cst = null,			//定时发射子弹
	bultIndex = -1,		//索引

	bgVolum = 0.8, 		//背景音效大小
	settingCon, 		//设置面板
	setBgVolumBtn, 		//游戏音效音量
	gameSettingBtn, 	//设置按钮
	bgVolumValue, 		//音效音量显示大小

	scoeTotal = 0,		//总分
	scoeStep = 100,		//摧毁一个的的份
	scoeTxt,			//得分文本

	startTime,			//开始计时
	endTime,			//介绍记时
	timeSprite,			//计时块
	timeSpriteHeight = 5, //计时块高度
	timeStep = 0.0003, 	//时间刻度
	timeSheet, 			//效果

	startTxt = '开始游戏吧，GO！',

	musicPath = 'music/',
	imagePath = 'images/',
	queue;

window.onload = function(){

	cw = window.innerWidth;
	ch = window.innerHeight;

	//获取画图板
	var canvas = document.getElementById('canvas');
	canvas.width = cw;
	canvas.height = ch;
	//console.log(cw, ch)

	//创建舞台
	stage = new CJS.Stage('canvas');
	CJS.Touch.enable(stage);
	stage.enableMouseOver(10); 
	stage.mouseMoveOutside = true;

	/*//添加背景
	bg = new Image();
	bg.onload = setBackground;
	bg.src = 'images/bg.jpg';

	//加载战斗机
	ship = new Image();
	ship.onload = function(){};
	ship.src = 'images/ship.png';*/

	//--------------------------

	//创建加载进度条
	createLoading();
	//加载资源
	loadQueues();

	CJS.Ticker.addEventListener('tick', loadTicker);
	CJS.Ticker.setFPS(60);
	CJS.Ticker.timingMode = CJS.Ticker.RAF;

	//游戏设置
	settingCon 			= document.getElementById('gameSettingCon');
	setBgVolumBtn 		= document.getElementById('bgVolum');
	gameSettingBtn 		= document.getElementById('gameSettingBtn');
	bgVolumValue 		= document.getElementById('bgVolumValue');
	var closeSettingBtn = document.getElementById('closeSettingBtn');
	bgVolumValue.innerText = parseInt(bgVolum * 100) + '';;
	gameSettingBtn.addEventListener('touchend', gameSetting);
	closeSettingBtn.addEventListener('touchend', closeSetting);
	setBgVolumBtn.addEventListener('change', setBgVolum);
	//保证PC可用
	// gameSettingBtn.addEventListener('click', gameSetting);
	// closeSettingBtn.addEventListener('click', closeSetting);

};

function loadTicker(evt){
	if(loadingSquer){
		loadingSquer.scaleX += 0.0001;
		loadingSquer.scaleY += 0.0001;
		loadingSquer.rotation += 10;
		if(loadingSquer.rotation >= 360){
			loadingSquer.rotation = 0;
		}
		loadingSquer.x = queue.progress * cw;
	}
	stage.update();
}

/**
 * 游戏设置
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function gameSetting(evt){
	showHideSettingCon(true);
}
function closeSetting(evt){
	showHideSettingCon(false);
}
function showHideSettingCon(flag){
	if(flag){
		settingCon.style.display = 'block';
		settingCon.style.opacity = '1';
	}else{
		settingCon.style.display = 'none';
		settingCon.style.opacity = '0';
	}
}
function setBgVolum(evt){
	var value = evt.target.value;
	bgVolum = Number(value);
	bgVolumValue.innerText = parseInt(bgVolum * 100) + '';
}

/**
 * 加载资源
 * @return {[type]} [description]
 */
function loadQueues(){
	//加载音乐
	//var item = {src: musicPath + "18-machinae_supremacy-lord_krutors_dominion.ogg", id: "music"};
	var manifest = [
		{id: 'bgMusic', 	src: musicPath + "18-machinae_supremacy-lord_krutors_dominion.ogg"},
		{id: 'breakMusic', 	src: musicPath + "Game-Break.ogg"},
		{id: 'startMusic', 	src: musicPath + "Game-Start.ogg"},
		{id: 'bgImage', 	src: imagePath + "bg.jpg"},
		{id: 'shipImage', 	src: imagePath + "ship.png"},
		{id: 'bombImage', 	src: imagePath + "bomb.png"},
		{id: 'timeImage', 	src: imagePath + "timeSprite.png"},
		{id: 'F20', 		src: imagePath + 'F20.png'},
		{id: 'Bullet', 		src: imagePath + 'Bullet.png'}
	];
	// Instantiate a queue.
    queue = new CJS.LoadQueue();
	CJS.Sound.alternateExtensions = ["mp3"];
	queue.installPlugin(CJS.Sound);
    queue.addEventListener("complete", loadComplete);
    queue.addEventListener("fileload", fileComplete);
    queue.addEventListener("error",handleFileError);
    queue.addEventListener("progress",handleProgress);
    for (var i = manifest.length - 1; i >= 0; i--) {
    	queue.loadFile(manifest[i], true);
    };
    
    //queue.loadManifest(manifest);
}

/**
 * 资源加载完成
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function loadComplete(evt) {
	console.log("Complete :)");

	CJS.Ticker.removeEventListener('tick', loadTicker);

	loadingBar.scaleX = 1;
	loadingSquer.x = cw + 200;
	loadingSquer.alpha = 0;
	var loadMc = stage.getChildByName('_loadMc');
	stage.removeChild(loadMc);
	//设置背景
	bg = queue.getResult('bgImage');
	ship = queue.getResult('shipImage');
	if(bg){
		setTimeout('setBackground()', 300);
	}
	f20 = queue.getResult('F20');
	bulletImg = queue.getResult('Bullet');
}

function fileComplete(evt){}
function handleFileError(evt){}
function handleProgress(evt){
	loadingField.text = 'Loading: ' + (queue.progress * 100 | 0) + '%';
	if(queue.progress == 1){
		loadingBar.scaleX = 1;
		loadingSquer.alpha = 0;
	}
	loadingBar.scaleX = queue.progress;
	loadingSquer.x = queue.progress * cw;
	stage.update();
}

/**
 * 音效控制函数
 * @param  {[type]} name [音效ID]
 * @return {[type]}      [description]
 */
function playSound(name){
    return CJS.Sound.play(name);
}
function stopSound(name){
	return CJS.Sound.stop(name);
}


/**
 * 设置背景
 * @param {[type]} evt [description]
 */
function setBackground(evt){
	var bitmap = new CJS.Bitmap(bg);
	bitmap.width = bitmap.image.width * (cw / bitmap.image.width );
	bitmap.height = bitmap.image.height * (ch / bitmap.image.height );
	bitmap.x = 0;
	bitmap.y = 0;
	bitmap.scaleX = (cw / bitmap.image.width); //bitmap.image.width * (bitmap.image.width / cw );
	bitmap.scaleY = (ch / bitmap.image.height); //bitmap.image.height * (bitmap.image.height / cw );

	//创建遮罩
	bgBlur = createBlur();

	//创建文本
	startBtnCon = new CJS.Container();
	startGameTXT = createTxt(startTxt);
	startGameTXT.filters = [new CJS.BlurFilter(20, 20, 10)];
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
	var startShape = target.getChildByName('_startShape');
	var startShapeTxt = target.getChildByName('_startShapeTxt');
	
	//重置全局参数
	resetGlobal();

	//隐藏设置
	gameSettingBtn.style.display = 'none';
	
	//清理舞台
	stage.removeChild(startBtnCon);
	stage.removeChild(bgBlur);
	stage.update();

	//创建分数文本
	scoeTxt = createTxt('总分： ' + scoeTotal, 'bold 1.0em Arial', '#FFFFFF', 0, 30, 'right');
	stage.addChild(scoeTxt);

	//创建主机
	//createF20();

	//创建战斗机
	createShips(shipNum); 

	startTime = Date.now || new Date().getTime();
	timeSprite = createTimeSprite();
	stage.addChild(timeSprite);

	//播放音效
	var startMusic = playSound('startMusic');
	if(bgVolum > 0){
		var bgMusic = playSound('bgMusic');
		bgMusic.setVolume(bgVolum);
	}
	//console.log(bgMusic.getVolume())

	//添加动画
	CJS.Ticker.addEventListener("tick", tick);
	CJS.Ticker.setFPS(60);
	CJS.Ticker.timingMode = CJS.Ticker.RAF;
	//移出开始按钮事件侦听
	startShape.removeEventListener('click', startGame);

	stage.update();
}




/**
 * 开始动画
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function tick(evt){
	//加速
	//if(scoeTotal > 1000){
		speed += vy;
	//}
	if(speed > 6.5) speed = 6.5;

	//子弹发射
	/*for(var i = 0; i < bullets.length; i++){
		bullets[i].y -= speed;
	}*/

	//控制战斗机移动
	var len = ships.length;
	if(len > 0){
		var i = 0;
		for(; i < len; ++i){

			if(ships[i]){
				if(ships[i].y < -120){
					ships[i].y = ch + Math.random() * 500;
					//ships[i].y = -Math.random() * 500;
				}
				ships[i].y -= Math.floor(Math.random() + speed);
				//ships[i].y += Math.floor(Math.random() + speed);
			}
			
			stage.update();
		}
		//console.log(speed)
	}
	//时间控制
	var shapeTime = timeSprite.getChildByName('_shapeTime');
	
	if(shapeTime.scaleX <= 0){
		stop();
	}else{
		/*if(shapeTime.scaleX < 0.3)
			shapeTime.scaleX -= 0.0003;
		else
			shapeTime.scaleX -= 0.0005;*/
		shapeTime.scaleX -= timeStep;
		timeSheet.x = shapeTime.scaleX * cw - 10;
	}
	//console.log('ships.length = ' + ships.length)
}

/**
 * 停止动画
 * @return {[type]}     [description]
 */
function stop(){
	speed = 1.5;
	ships = [];
	temp = [];
	//移出侦听事件
	CJS.Ticker.removeEventListener('tick', tick);
	//清理舞台不需要的元素
	clearStage();
	//移出音效
	stopSound('bgMusic');
	//清楚子弹发射
	//clearInterval(cst);
	//再来一次
	gameAgain();
	
}

/**
 * 重玩
 * @return {[type]} [description]
 */
function gameAgain(){
	//出现再来一次
	bgBlur = createBlur();
	stage.addChild(bgBlur);
	//是否重玩标记
	isOverrider = true;

	//创建文本
	startBtnCon = new CJS.Container();
	startGameTXT = createTxt('您的得分是：' + scoeTotal, 'bold 26px Arial', '#FFFFFF');
	startBtnCon.addChild(startGameTXT);
	//创建按钮
	startShape = createStartBtn();
	startBtnCon.addChild(startShape);

	stage.addChild(bgBlur, startBtnCon);
	//侦听开始事件
	startShape.addEventListener('click', startGame);

	stage.update();
}

/**
 * 摧毁战斗机
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function shipPong(evt){
	//console.log(evt.currentTarget)
	var target = evt.currentTarget;
	var index = target.name.match(/\d/)[0];
	shipCon.removeChild(target);
	var ship = createShip(index);
	resetBitShip(ship);
	ships[index] = ship;
	shipCon.addChild(ship);
	//得分控制
	scoeTotal += scoeStep;
	scoeTxt.text = '总分： ' + scoeTotal;
	if(scoeTotal >= 5000){
		scoeTxt.color = 'rgba(24, 174, 180, .8)';
	}else if(scoeTotal >= 10000){
		scoeTxt.color = 'rgba(243, 69, 14, .8)';
	}
	//播放爆炸声
	var breakMusic = playSound('breakMusic');
	//创建爆炸Sprite
	stage.removeChild(bomb);
	bomb = null;
	delete bomb;
	createBomb(target.x - target.image.width / 2, target.y - target.image.height / 2);
	setTimeout(function(){
		stage.removeChild(bomb);
		stage.update();
	}, 60);
}

/**
 * 重置全局参数
 * @return {[type]} [description]
 */
function resetGlobal(){
	isOverrider = false;
	scoeTotal = 0;
	speed = 1.5;
	ships = [];
	temp = [];
	scoeTxt = null;
}

/**
 * 清理舞台
 * @return {[type]} [description]
 */
function clearStage(){
	stage.removeChild(shipCon);
	stage.removeChild(scoeTxt);
	stage.removeChild(timeSprite);
	stage.removeChild(bomb);
	stage.removeChild(f20_mc);
	timeSprite.removeChild(timeSheet);
	shipCon = null;
	scoeTxt = null;
	timeSprite = null;
	bomb = null;
	//显示设置
	gameSettingBtn.style.display = 'block';
	stage.update();
}

/**
 * 创建遮罩
 * @return {[type]} [description]
 */
function createBlur(){
	var bgBlur = new CJS.Bitmap(bg);
	bgBlur.filters = [new CJS.BlurFilter(20, 20, 10)];
	bgBlur.cache(0, 0, cw, ch);
	bgBlur.alpha = 0.9;
	bgBlur.width = bgBlur.image.width * (cw / bgBlur.image.width );
	bgBlur.height = bgBlur.image.height * (ch / bgBlur.image.height );
	bgBlur.x = 0;
	bgBlur.y = 0;
	bgBlur.scaleX = (cw / bgBlur.image.width);
	bgBlur.scaleY = (ch / bgBlur.image.height);
	bgBlur.name = '_bgBlur';
	return bgBlur;
}

/**
 * 创建单个战斗机
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
function createShip(index){
	var bitship = new CJS.Bitmap(ship);
	bitship.name = '_bitship_' + index;
	/*bitship.regX = ship.width * .5;
	bitship.regY = ship.height * .5;*/
	//bitship.x = ship.width * .5 + Math.random() * (cw - ship.width * .5);
	resetBitShip(bitship);
	//shipCon.addChild(bitship);
	//ships.push(bitship);
	bitship.addEventListener('click', shipPong);
	return bitship;
}

/**
 * 创建战斗机组
 * @return {[type]} [description]
 */
function createShips(){
	shipCon = new CJS.Container();
	stage.addChild(shipCon);
	ships = [];
	var i = 0;
	var len = shipNum;

	for(; i < len; ++i){
		var ship = createShip(i);
		shipCon.addChild(ship);
		ships.push(ship);
		//bitship.addEventListener('tick', shipMove);
	}
	stage.update();
}

/**
 * 重置战斗机位置
 * @param  {[type]} ship [description]
 * @return {[type]}      [description]
 */
function resetBitShip(ship){
	var w = ship.image.width;
	var h = ship.image.height;
	var x = w * .5 + Math.random() * (cw - w);
	var y = ch + Math.random() * 500;
	//var y = - Math.random() * 500;
	//if(x > cw) x = Math.random() * cw / 2 + 20;
	ship.x = x;
	ship.y = y;
	ship.regX = ship.image.width * .5;
	ship.regY = ship.image.height * .5;
	ship.mouseEnabled = true;
}

/**
 * 创建文本
 * @param  {[type]} txt   [文本内容]
 * @param  {[type]} style [样式]
 * @param  {[type]} color [颜色]
 * @param  {[type]} x     [初始水平位置]
 * @param  {[type]} y     [初始垂直位置]
 * @return {[type]}       [description]
 */
function createTxt(txt, style, color, x, y, align){
	var txt = new CJS.Text(txt || "开始游戏", style || "bold 30px Arial", color || "#FFFFFF"); 
	txt.textBaseline = "alphabetic";
	txt.textAlign = align || 'center';
	/*txt.lineWidth = width || 0;
	txt.lineHeight = height || 0;*/
	txt.x = x || ((cw - txt.lineWidth) * .5);
	txt.y = y || (ch - txt.lineHeight) * .5;
	return txt;
}

function createLoading(){
	var loadMc = new CJS.Container();
	loadMc.name = '_loadMc';
	loadingField = new CJS.Text("Loading", "bold 24px Arial", "#FFFFFF");
	loadingField.name = '_loadingField';
	loadingField.maxWidth = cw;
	loadingField.textAlign = "center";
	loadingField.x = cw * .5;
	loadingField.y = ch * .5;

	loadingBar = new CJS.Shape(new CJS.Graphics().beginFill('rgba(255, 255, 255, .8)').drawRect(0, loadingField.y - 20 , cw, 3));
	loadingBar.name = '_loadingBar';
	loadingBar.scaleX = 0;

	loadingSquer = new CJS.Shape(new CJS.Graphics().beginFill('rgba(255, 255, 255, .9)').drawRect(0, 0, 10, 10));
	loadingSquer.name = '_loadingSquer';
	loadingSquer.regX = 5;
	loadingSquer.regY = 5;
	loadingSquer.x = -10;
	loadingSquer.y = ch * .5 - 18;
	loadingSquer.filters = [new CJS.BlurFilter(20, 20, 10)];
	loadMc.addChild(loadingField, loadingBar);
	stage.addChild(loadMc, loadingSquer);
	stage.update();
}

/**
 * 创建开始按钮
 * @return {[type]} [description]
 */
function createStartBtn(){
	var mc = new CJS.Container();
	mc.name = '_mc';
	var startShape = new CJS.Shape();
	var sw = isOverrider ? 150 : 100;
	var sh = 40;
	startShape.graphics.setStrokeStyle(2)
				.beginStroke('rgba(255,255,255,.9)')
				.beginFill("rgba(255,255,255,.6)")
				.drawRoundRectComplex(0, 0, sw, sh, radiusStep, radiusStep, radiusStep, radiusStep)
				.endFill()
				.endStroke();
	startShape.x = (cw - sw) * .5;
	startShape.y = (ch - sh) * .5 + sh;
	startShape.mouseEnabled = true;
	startShape.name = '_startShape';
	//按钮文字
	var txt = isOverrider ? 'Go Again' : 'Start';
	var tw = isOverrider
	var startShapeTxt = new CJS.Text(txt, 'bold 28px Arial', '#333');
	startShapeTxt.lineWidth = sw;
	startShapeTxt.lineHeight = sh;
	startShapeTxt.textAlign = 'center';
	startShapeTxt.textBaseline = 'middle';
	startShapeTxt.x = startShape.x + startShapeTxt.lineWidth / 2; //cw * .5 - (sw / 4);
	startShapeTxt.y = startShape.y + startShapeTxt.lineHeight / 2; //ch * .5 + 25;
	startShapeTxt.name = '_startShapeTxt';
	mc.addChild(startShape, startShapeTxt);
	//console.log(startShapeTxt)
	return mc;
}

/**
 * 创建计时块
 * @return {[type]} [description]
 */
function createTimeSprite(){
	var mc = new CJS.Container();
	mc.x = 0;
	mc.y = 0;
	var shapeBG = new CJS.Shape(new CJS.Graphics().beginFill('rgba(255, 255, 255, .5').drawRect(0, 0, cw, timeSpriteHeight));
	var shapeTime = new CJS.Shape(new CJS.Graphics().beginFill('rgba(243, 69, 14, .8)').drawRect(0, 0, cw, timeSpriteHeight));
	shapeTime.name = '_shapeTime';
	createTimeSheet(cw, -18);
	mc.addChild(shapeBG, shapeTime, timeSheet);
	return mc;
}

/**
 * 创建爆炸效果
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
function createBomb(x, y){
	var data = new CJS.SpriteSheet({
			"images": [queue.getResult("bombImage")],
			"frames": {"regX": 30, "height": 120, "count": 19, "regY": 30, "width": 120},
			"animations": {"run": [0, 19, "run", .5]}
		});
	bomb = new CJS.Sprite(data, "run");
	bomb.setTransform(x || 0, y || 0, .8, .8);
	bomb.framerate = 19;
	//bomb.regX = (cw - bomb.width) * .5 - bomb.width;
	//bomb.regY = (ch - bomb.height) * .5 - bomb.height;
	stage.addChild(bomb);
	stage.update();
}
/**
 * 时间燃烧效果
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
function createTimeSheet(x, y){
	var data = new CJS.SpriteSheet({
			"images": [queue.getResult("timeImage")],
			"frames": {"regX": 0, "height": 50, "count": 20, "regY": 0, "width": 100},
			"animations": {"run": [0, 20, "run", .5]}
		});
	timeSheet = new CJS.Sprite(data, "run");
	timeSheet.setTransform(x || cw + 10, y || 0, .8, .8);
	timeSheet.framerate = 20;
	timeSheet.name = '_timeSheet';
	stage.update();
	//return timeSheet;
}

/**
 * 创建F20歼灭机
 * @return {[type]} [description]
 */
function createF20(){
	f20_mc = new CJS.Container();
	f20_mc.name = '_f20_mc';
	f20 = new CJS.Bitmap(queue.getResult('F20'));
	f20.name = '_f20';
	f20.x = (cw - f20.image.width) * .5;
	f20.y = ch - f20.image.height;
	console.log(f20)
	/*bulletBmp = createBullet();
	bulletBmp.x = f20Bm.x + (f20Bm.image.width - bulletBmp.image.width ) * .5;
	bulletBmp.y = f20Bm.y - bulletBmp.image.height;*/
	f20_mc.addChild(f20);
	//子弹发射
	setInterval('createBullet()', 1000);
	stage.addEventListener('stagemousedown', stageMouseDown);
	stage.addEventListener('stagemouseup', stageMouseUp);
	stage.addChild(f20_mc);
	stage.update();
}

function stageMouseDown(evt){
	//console.log(evt);
	stage.addEventListener('stagemousemove', stageMouseMove);
}
function stageMouseMove(evt){
	//console.log(evt);
	f20.x = evt.stageX - f20.image.width * .5;
	f20.y = evt.stageY - f20.image.height * .5;
}
function stageMouseUp(evt){
	//console.log(evt);
	stage.removeEventListener('stagemousemove', stageMouseMove);
}


/**
 * 创建子弹
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
function createBullet(x, y){
	bultIndex++;
	var bult = new CJS.Bitmap(queue.getResult('Bullet'));
	bult.name = '_bullet_' + bultIndex;
	//bult.x = x || 0;
	//bult.y = y || 0;
	bult.x = f20.x + (f20.image.width - bult.image.width ) * .5;
	bult.y = f20.y - bult.image.height * .5;
	bullets.push(bult);
	f20_mc.addChild(bult);
	stage.update();
	return bult;
	/*for(var i = 0; i < 2; i++){
		var bult = new CJS.Bitmap('Bullet');
		bult.x = x || 0;
		bult.y = y || 0;
		bullets.push(bult);
	}*/
	

}

































