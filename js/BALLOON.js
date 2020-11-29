const BALLOON={author: 'HPC',version: 'V19.1.13'};
BALLOON.init=function(containerId){
	let container;
	if(containerId)
		container=document.getElementById(containerId);
	else{
		container=document.createElement('div');
		container.setAttribute('id','BALLOON-OUTPUT');
		container.style.position='absolute';
		container.style.width='100%';
		container.style.height='100%';
		document.body.appendChild(container)
	}
	container.style.backgroundColor='#2a2a30';
	container.style.overFlow='hidden';
	let style=window.getComputedStyle(container);
	let width=style.width.replace('px','')*1,height=style.height.replace('px','')*1;
	let left=style.left.replace('px','')*1+style.marginLeft.replace('px','')*1,top=style.top.replace('px','')+style.marginTop.replace('px','')*1;
	let canvas=document.createElement('canvas');
	canvas.width=width,canvas.height=height;
	canvas.style.backgroundColor='#2a2a30';
	let graphic=canvas.getContext('2d');
	graphic.lineWidth=1;
	graphic.globalAlpha=1;
	graphic.lineCap='round';
	graphic.lineJoin='round';
	container.appendChild(canvas);
	BALLOON.container=container;
	BALLOON.containerWidth=width;
	BALLOON.containerHeight=height;
	BALLOON.boundaryLeft=left;
	BALLOON.boundaryTop=top;
	BALLOON.canvas=canvas;
	BALLOON.graphic=graphic;
	BALLOON.balloons=[];
	BALLOON.delta=0;
	BALLOON.oldTime=Date.now();
	BALLOON.balloonDensity=10;
	BALLOON.establishedRadiu=3;
	BALLOON.variableRadiu=20;
	BALLOON.establishedSpeed=5e-2;
	BALLOON.variableSpeed=1;
	BALLOON.friction=95e-2;
	BALLOON.establishedGravity=.1;
	BALLOON.variableGravity=1;
	let bloom=function(){
		let x=event.clientX-BALLOON.boundaryLeft,y=event.clientY-BALLOON.boundaryTop;
		for(let i=0,j=BALLOON.balloonDensity;i<j;i++){
			BALLOON.balloons.push(new BALLOON.balloon(x,y))
		}
		container.addEventListener('mousemove',bloom,false)
	}
	let release=function(){
		container.removeEventListener('mousemove',bloom,false)
	}
	let bendEvents=function(){
		container.addEventListener('mousedown',bloom,false);
		container.addEventListener('mouseup',release,false) 
	}
	bendEvents();
	let updateDelta=function(){
		let newTime=Date.now();
		let delta=newTime-BALLOON.oldTime;
		BALLOON.delta=delta<5?5:delta;
		BALLOON.oldTime=newTime
	}
	let clear=function(){
		graphic.clearRect(0,0,width,height)
	}
	let animate=function(){
		updateDelta();
		clear();
		let index=BALLOON.balloons.length;
		while(index--){
			BALLOON.balloons[index].update(index)
		}
		requestAnimationFrame(animate)
	}
	animate()
}
BALLOON.balloon=function(x,y){
	let self=this;
	this.cx=x;
	this.cy=y;
	this.radiu=BALLOON.establishedRadiu+Math.random()*BALLOON.variableRadiu;
	this.gradientRadiu=this.radiu/5;
	this.hue=~~(Math.random()*360);
	this.saturation=~~(Math.random()*100);
	this.lightness=~~(Math.random()*50+50);
	this.launchAlpha=Math.random()*.5+.5;
	this.tuningWind=5e-2-Math.random()*1e-1;
	this.launchSpeed=BALLOON.establishedSpeed+Math.random()*BALLOON.variableSpeed;
	this.launchAngle=Math.random()*Math.PI*2;
	this.speedX=this.launchSpeed*Math.cos(this.launchAngle);
	this.speedY=this.launchSpeed*Math.sin(this.launchAngle);
	this.gravity=BALLOON.establishedGravity+Math.random()*BALLOON.variableSpeed;
	return self
}
BALLOON.balloon.prototype.update=function(index){
	this.index=index;
	let advancedX=BALLOON.delta*this.speedX,advancedY=BALLOON.delta*this.speedY;
	this.cx+=advancedX;
	this.cy-=advancedY;
	this.hsl='hsla('+this.hue+','+this.saturation+'%,'+this.lightness+'%,'+this.launchAlpha+')';
	this.gradientHSL='hsla(200,80%,80%,'+this.launchAlpha+')';
	BALLOON.graphic.beginPath();
	let gradient=BALLOON.graphic.createRadialGradient(this.cx,this.cy,this.gradientRadiu,this.cx,this.cy,this.radiu);
	gradient.addColorStop(0,this.gradientHSL);
	gradient.addColorStop(1,this.hsl);
	BALLOON.graphic.fillStyle=gradient;
	BALLOON.graphic.globalAlpha=this.launchAlpha;
	BALLOON.graphic.arc(this.cx,this.cy,this.radiu,0,Math.PI*2,false);
	BALLOON.graphic.fill();
	BALLOON.graphic.closePath();
	if(this.hitTest()){
		this.remove();
		return
	}
	this.launchSpeed*=BALLOON.friction;
	this.launchAngle+=this.tuningWind;
	this.speedX=this.launchSpeed*Math.cos(this.launchAngle);
	this.speedY=this.launchSpeed*Math.sin(this.launchAngle);
	if(this.launchAlpha>=1e-2)
		this.launchAlpha-=1e-2
}
BALLOON.balloon.prototype.hitTest=function(){
	return (this.launchAlpha<.5||(this.cx+this.radiu<0)||(this.cx-this.radiu>BALLOON.width)||(this.cy+this.radiu<0)||(this.cy-this.radiu>BALLOON.height))
}
BALLOON.balloon.prototype.remove=function(){
	BALLOON.balloons.splice(this.index,1)
}

































































































