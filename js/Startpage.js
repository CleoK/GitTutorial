 var
 canvas,
 ctx,
 width,
 height,
 evt,
 buttons,
 GroundPos = 0,
 frames = 0,
 score = 0,
 best = 0,
 currentstate;
 //sound file
var birdmoves = new Audio();
var point = new Audio();

 
//sound file
birdmoves.src = "sound/fly.mp3";
//point.src = "sound/score.mp3";

 states = {
	 Splash: 0, Game: 1, Score: 2
 },
 
 
 bird = {
		 x:60,
		 y:0,
		 velocity:0,
		 frame: 0,
		 animation:[0,1,2,1], //rep bird in diff wing positions
		 rotation:0,
		 radius: 12,
		 gravity: 0.25,
		 jump:4.6,
		 
		 Jump: function()
		 {
			 this.velocity = -this.jump;
			 birdmoves.play();
		 },
		 update: function()
		 {
			 //bird flapping wings
			 var i = currentstate === states.Splash ? 10:5;
			 this.frame += frames % i === 0 ? 1:0;
			 this.frame %= this.animation.length; 
			 
			 if(currentstate === states.Splash)
			 {
				 this.y = height - 280 +5 * Math.cos(frames/10);
				 this.rotation = 0;
			 }
			 else
			 {
				 //if not the splash state
				 this.velocity= this.velocity + this.gravity;
				 this.y = this.y + this.velocity;
				 if(this.y>=canvas.height - ground.height -10)
				 {
					 this.y = canvas.height - ground.height-10;
					 if(currentstate === states.Game)
					 {
						 currentstate = states.Score;
					 }
					 this.velocity = this.jump;
				 }
				 
				 if(this.velocity >= this.jump)
				 {
					 this.frame=1;
					 this.rotation = Math.min(Math.PI/2,this.rotation +0.3);
				 }
				 else
				 {
					 this.rotation = -0.3
				 }
				 
			 }
		 },
		 draw: function(ctx)
		 {
			 ctx.save();
			 ctx.translate(this.x,this.y);//translate the bird movements
			 ctx.rotate(this.rotation); 
			 
			 //bird position according to the 3 different sprites
			 var i = this.animation[this.frame];
			 Bird[i].draw(ctx,-Bird[i].width/2,-Bird[i].height/2); //Bird - sprite bird
			
			ctx.restore()
		 }
 },
 
 pipes = {
	Pipes: [],
	 reset: function(){
		 this.Pipes = []; //empty pipes
	 },
	 
	 update: function(){
		 if(frames % 100 === 0){
			 var Y = height -(BottomPipe.height + ground.height + 100 + 200*Math.random());
			 this.Pipes.push({
				x: 500,
				y: Y,
				width: BottomPipe.width,
				height: BottomPipe.height
			 });
		 }
		 //update all pipes
		 for(var i=0;len = this.Pipes.length, i<len; i++){
			var p = this.Pipes[i];
			
			//collision detection using circle rect collision
			if(i===0)
			{
				//score incrementing
				score += p.x === bird.x ? 1: 0;
				
			   //checking the front most pipes
			   //checking the closest x position
				var cx = Math.min(Math.max(bird.x,p.x),p.x+p.width);
				var cy1 = Math.min(Math.max(bird.y,p.y),p.y+p.width); //south facing pipes
				var cy2 = Math.min(Math.max(bird.y,p.y+p.height+80),p.y+2*p.height+80);
				
				//check diff in x and y position
				var dx = bird.x - cx;
				var dy1 = bird.y - cy1;
				var dy2= bird.y - cy2;
				//equation of a cirlce
				var d1 = dx*dx + dy1*dy1;
				var d2 = dx*dx + dy2*dy2;
				
				var r = bird.radius*bird.radius;
				if(r > d1 || r > d2)
				{
					currentstate = states.Score;
					
				}
			}
			 
			p.x-=2;
			if(p.x < -50){
				this.Pipes.splice(i,1);
				i--;
				len--;
			 }
		 }
	 },
	 
	 draw: function(ctx){
		 for(var i=0,len = this.Pipes.length; i<len; i++)
		 {
			 var p = this.Pipes[i];
			 BottomPipe.draw(ctx,p.x,p.y);
			 TopPipe.draw(ctx,p.x,p.y+80+p.height);
		 }
	 }
	
 };
 

 onpress(evt);
 //Game state
 function onpress(evt)
 {
	 switch(currentstate)
	 {
		case states.Splash:
			currentstate = states.Game;
			bird.Jump();
		    break;
		case states.Game:
			bird.Jump();
			break;
		case states.Score:
			var mx = evt.offsetX, my = evt.offsetY;
			//checking if position mx and my is in function
			if(buttons.x < mx && mx <buttons.x + buttons.width && buttons.y < my &&
				my < buttons.y + buttons.height){
					pipes.reset();
					currentstate = states.Splash;
					score = 0;
				}
			break;
	 }
 }
 
 main();
 //function main()
 function main()
 {
	  function requestFullScreen(element)
	 {
		 var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen ||element.moztRequestFullScreen ||element.msRequestFullScreen;
		 
		 if(requestMethod)
		 {
			 requestMethod.call(element);
		 }
		 else if(typeof window.ActiveXObject !== "undefined")
		 {
			 var wscript = new ActiveXObject("WScript.Shell");
			 if(wscript !== null)
			 {
			 wscript,sendKeys("{F11}");
			 }
		 }
		canvas = document.createElement("canvas");
		width = window.innerWidth;
		height = window.innerHeight;
	 
	 }
	 var elem = document.body; //make the body go full screen
	 requestFullScreen(elem);
	/* canvas = document.createElement("canvas");
	 width = window.innerWidth;
	 height = window.innerHeight;*/
	 
	 
	 var evt = "clickstart";
	 if(width >=500){
		width = 400;
		height = 480;
		evt = "mousedown";
	 } 
	 
	 document.addEventListener(evt,onpress);
	 
	 canvas.width = width;
	 canvas.height = height;
	 ctx = canvas.getContext("2d");
	 
	 currentstate = states.Splash; 
	
	 document.body.appendChild(canvas);
	 
	 var image = new Image();
	 image.onload = function()
	 {
		initial_Sprite(this);
		ctx.fillStyle = background.color;
		buttons = {
			x:(width-Button.ok.width)/2,
			y: height - 200,
			width: Button.ok.width,
			height: Button.ok.height
		}
		
		run();
	 }
	 image.src = "images/sheet.png";
 }
 function run ()
 {
	 var loop = function()
	 {
		 update();
		 render();
		 window.requestAnimationFrame(loop, canvas);
	 }
	  window.requestAnimationFrame(loop, canvas);
 }
 function update()
 {
	 //movement of the ground
	 frames++;
	 if(currentstate!== states.Score)
	 {   
		  GroundPos= (GroundPos-2)%12;
		  best = Math.max(best,score); //update best score
	 }
	 
	if(currentstate === states.Game)
	{
		 pipes.update();
	}
	 bird.update();
	
 }
 function render()
 {
	 //color of the canvas
	 ctx.fillRect(0,0,width,height);
	 //showing background
	 background.draw(ctx,0,height-background.height);
	 background.draw(ctx,background.width,height-background.height);
	 
	
	 //show pipes
	 pipes.draw(ctx);
	 
	  //showing bird
	 bird.draw(ctx);
	 
	 //showing ground
	 ground.draw(ctx,GroundPos, canvas.height-ground.height);
	 ground.draw(ctx,GroundPos+ground.width, canvas.height-ground.height);
	 
	 var W2 = width/2;
	 if(currentstate === states.Splash)
	 {
		 //centering the img
		 splash.draw(ctx,W2-splash.width/2,height-300);
		 F_text.G_ready.draw(ctx,W2 - F_text.G_ready.width/2,height-380);
		 
	 }
	 
	 if(currentstate === states.Score)
	 {
		 //display game over text
		 F_text.endGame.draw(ctx,W2-F_text.endGame.width/2,height-400);
		 //display score board
		 F_Score.draw(ctx,W2-F_Score.width/2,height-340);
		 //display button
		 Button.ok.draw(ctx,buttons.x, buttons.y);

		 //display results in board
		 scoreNum.draw(ctx,W2+60,height-304,score,null,10);
		 scoreNum.draw(ctx,W2+60,height-262, best,null,10);
	 }
	 else
	 {
		 //display score
		 scoreNum.draw(ctx,W2,20,score)
		 
	 }
	 
 }
