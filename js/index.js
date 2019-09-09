/*
	showJsVal.text(scale + 'scaleX');

 */ 

var showJsVal = $('#showJsVal');

var gameParameter = {
	viewWrapper: document.getElementById('gameWrapper'),
	view : document.getElementById('draw'),
	selectScene : null,
	canvasW: 333,
	canvasH: 563,
	beeSize: 70,
	onlyTouchHand: 1,
	moreTouchHand: 2,
	isMoreTouch: false,
	isTouch: false
};
var gameSpirtePosiArr = [];
var stage = null;

// 初始化游戏参数
var initGame = function(){
	stage = new createjs.Stage(gameParameter.view);
    createjs.Touch.enable(stage);   
    createjs.Ticker.setFPS(60);
    createjs.Touch.enable(stage);
    createjs.Ticker.addEventListener("tick", stage);
}
initGame();
// 绘制基础场景
function initGameScene(){
	createjs.Container.call(this);
	this.drawScene();
}
initGameScene.prototype = new createjs.Container();
initGameScene.prototype.drawScene = function(){
    //根据地图数组创建色块 -- 在 1 的位置创建蓝色障碍
    this.bee = new createjs.Bitmap('images/bee.png');
    this.bee.x = 100 + gameParameter.beeSize
    this.bee.y = 200 + gameParameter.beeSize;
	this.bee.regX = gameParameter.beeSize;
	this.bee.regY = gameParameter.beeSize;
    this.addChild(this.bee);
}
var gameScene = new initGameScene();
stage.addChild(gameScene);


function handleTouchEvent(evt){
	var touchListLength = evt.touches.length
	touchListLength == gameParameter.onlyTouchHand ? 1 : 2;
}

function bindMoveBehaviorEvent(){

}

// 添加touch事件
var startPoint = {};
var spriteAttr = {};
var offsetLeft = stage.canvas.offsetLeft + gameParameter.viewWrapper.offsetLeft;
var offsetTop = stage.canvas.offsetTop + gameParameter.viewWrapper.offsetTop;

// 事件类
function handleTouchEvents(spriteObj, touchNum){
	this.spriteObj = spriteObj;
	this.touchNum = touchNum;
	this.spriteAttr = {};
	this.preSpriteAttr = {};
}

handleTouchEvents.prototype.eventStart = function (evt){
	//alert(evt.touches.length + 'touchL');
	evt.stopPropagation();   
	evt.preventDefault();
	if( evt.touches.length == gameParameter.onlyTouchHand ){
		gameParameter.isTouch = true;
		startPoint.x = evt.touches[0].clientX;
		startPoint.y = evt.touches[0].clientY;
	}else{
		gameParameter.isMoreTouch = true;
		startPoint = evt.touches;
	}
}

handleTouchEvents.prototype.eventMoveCompute = function (evt){
	evt.stopPropagation();   
	evt.preventDefault();
	//alert(evt.touches.length + 'touchL');
	try{
		if( evt.touches.length == gameParameter.onlyTouchHand  && gameParameter.isTouch){
			this.spriteAttr.x = evt.touches[0].clientX - offsetLeft;
			this.spriteAttr.y = evt.touches[0].clientY - offsetTop;
			this.changePic(this.spriteObj, this.spriteAttr, evt.touches.length);
		}else if(evt.touches.length == gameParameter.moreTouchHand && gameParameter.isMoreTouch){
			var movePoint = evt.touches;
	        var scale = computeTouchAttr.getDistance( movePoint[0], movePoint[1] ) / computeTouchAttr.getDistance( startPoint[0], startPoint[1] );
	        var rotation = computeTouchAttr.getAngle( movePoint[0], movePoint[1] ) - computeTouchAttr.getAngle( startPoint[0], startPoint[1] );
	        this.spriteAttr.scale = scale.toFixed(2);
	        this.spriteAttr.rotation = rotation.toFixed(2);
	        this.changePic(this.spriteObj, this.spriteAttr, evt.touches.length);
		}
	}catch (e) { 
		alert(e);
	}

};
handleTouchEvents.prototype.eventEnd = function (evt){
	evt.stopPropagation();   
	evt.preventDefault();
	if(	gameParameter.isMoreTouch === true ){
		this.touchNum++;
		this.preSpriteAttr.scale = this.spriteObj.scaleX;
		this.preSpriteAttr.rotation = this.spriteObj.rotation;
		gameParameter.isMoreTouch = false;
	}
	gameParameter.isTouch = false;
	stage.canvas.removeEventListener('touchmove', handleTouchFn.eventMoveCompute, false);
	stage.canvas.removeEventListener('touchend', handleTouchFn.eventEnd, false);
}
// change sprite massage-attribute
handleTouchEvents.prototype.changePic = function(spriteObj, attrObj, touchT) {
	var that = this;
	try{
		if(touchT == gameParameter.onlyTouchHand){
			spriteObj.x = attrObj.x;
			spriteObj.y = attrObj.y;
		}else{

			if(this.touchNum > 0){
				var scale = parseFloat(this.preSpriteAttr.scale) + parseFloat(attrObj.scale) - 1;
				scale <= 0.5 ? scale = 0.5 : scale = scale;
				var rotation = parseFloat(this.preSpriteAttr.rotation) + parseFloat(attrObj.rotation);
				spriteObj.scaleX = spriteObj.scaleY = scale;
				spriteObj.rotation = rotation;

			}else{
				spriteObj.scaleX = spriteObj.scaleY = parseFloat(attrObj.scale);
				spriteObj.rotation = parseFloat(attrObj.rotation);
			}
		}
	}catch (e) { 
		alert(e);
	}
}


var handleTouchFn = new handleTouchEvents(gameScene.bee, 0);

stage.canvas.addEventListener('touchstart', handleTouchFn.eventStart);
stage.canvas.addEventListener('touchmove', handleTouchFn.eventMoveCompute.bind(handleTouchFn));
stage.canvas.addEventListener('touchend', handleTouchFn.eventEnd.bind(handleTouchFn));

// 计算方法
var computeTouchAttr = {
	//得到缩放比例，getDistance是勾股定理的一个方法 sqrt : 平方根，两点之间的距离公式
	getDistance: function(p1, p2) {
	    var x = p2.clientX - p1.clientX,
        y = p2.clientY - p1.clientY;
   		return Math.sqrt((x * x) + (y * y));
	},
	//得到旋转角度，getAngle是得到夹角的一个方法
	getAngle: function(p1, p2) {
	    var x = p1.clientX - p2.clientX,
        y = p1.clientY - p2.clientY;
    	return Math.atan2(y, x) * 180 / Math.PI;
	}
};

// 获得图片
function getResultPic(canvas) {
    var imgUrl = canvas.toDataURL("image/png", 1);
    document.getElementById('img').src = imgUrl;
    $('.imgwrapper').show();
}
document.getElementById('getPicBtn').onclick = function(){
	getResultPic(stage.canvas);
}

/*

	基于createjs 框架的图片合成应用

		项目应用预期：

			1.第一阶段
				1）默认图片
				2）支持移动，缩放，旋转
				3）支持导出合成图片
				
					难点：双指算法，旋转逻辑
					
						  如何封装多个交互行为

				
				做法一：不使用交互库
					1.交互事件不对具体元素添加，对整个stage舞台添加交互行为
					2.对每个元素绑定一个单击激活flag
					3.在stage touchmove 中检测flag, 从而操作当前需要处理的元素
					4.在stage end 中释放掉所有flag

				做法二：结合交互库
					1.同比把canvas和dom 尺寸缩放一致
					2.使用交互库去操作DOM元素
					3.完成时获取所有图片的 massage（size，position， rotation，scale等），统一绘制到canvas


			2.第二阶段
				1）支持选择图片，或者拍照

		
		常见的图片合成方式：
			较简单：
				方式1.位置已经固定，仅提供用户可选择的图片，依据选择项进行图片渲染，合成

			复杂：
				方式2.画面的所有元素都支持用户交互，包括大小，位置，角度等。



		进展：
			第一阶段基本 完成

			第二阶段选择照片暂时没有处理



问题：

	1.如何在 事件行为在非匿名传递this***  
		bind(handleTouchFn)

	2.touch库无法使用在canvas 元素中，仅支持在dom

	3.使用createjs 'touch'事件中没有多指的事件list的数组，无法对双指行为处理

	4.使用原生canvas，画面元素需要自己处理交互事件

	*5.canvas 如何绘制视频某一帧到画布上


		bug 反馈：
			操作之后，第二次操作旋转缩放，sprite会出现一个归位的问题
			可能是没有沿用上一次的状态继续处理
				改变算法，不能每次做简单的重新计算操作
				要在原来的基础上累加
		
		解决：scale: 第二次不直接操作，计算出差值做累计：
						计算出的新的scale - 1 然后做累加
			  
			  rotation 计算出新的 rotation 然后累加



    box.style.transform="scale("+e.scale+") rotate("+e.rotation+"deg)";//改变目标元素的大小和角度

    	switch (touchListLength) {
		case gameParameter.onlyTouchHand
			bindMoveBehaviorEvent();
		}

 */
