var
background,
ground,
TopPipe,
BottomPipe,
F_text,
F_Score,
Button,
Bird,
scoreNum,
splash;

function Sprite(image,x,y,width,height)
{
	this.image = image;
	this.x = x*2;
	this.y = y*2;
	this.width = width*2;
	this.height = height*2;
};

Sprite.prototype.draw = function(ctx,x,y)
{
	ctx.drawImage(this.image,this.x,this.y,this.width,this.height,
					x,y,this.width,this.height);
};

function initial_Sprite(image)
{
	background = new Sprite(image,0,0,138,114);
	background.color = "#70C5CF";
	ground = new Sprite(image,138,0,112,56);
	
	
	Bird = [
			new Sprite(image,156,115,17,12),
			new Sprite(image,156,128,17,12),
			new Sprite(image,156,141,17,12)
	];
	splash =  new Sprite(image,0,114,59,49);
	F_text ={
		Title: new Sprite(image,59,114,96,22),
		endGame: new Sprite(image,59,136,94,19),
		G_ready: new Sprite(image,59,155,87,22)
	}
	
	Button = {
		ok: new Sprite(image,119,191,40,14),
		menu: new Sprite(image,119,177,40,14),
		start: new Sprite(image,159,191,40,14),
		Rate: new Sprite(image,79,177,40,14),
		Share: new Sprite(image,159,177,40,14),
	}
	TopPipe = new Sprite(image,251,0,26,200);
	BottomPipe = new Sprite(image,277,0,26,200);
	
	F_Score = new Sprite(image,138,56,113,58);
	scoreNum = new Sprite(image,0,188,7,10);
	
	//score increment
	scoreNum.draw = function(ctx,x,y,num,offset)
	{
		num = num.toString();
		var step = this.width + 2;
		if(offset)
		{
			x = x+step*(offset - num.length);
		}
		for(var i=0,len = num.length;i<len;i++)
		{
			var n = parseInt(num[i]);
			ctx.drawImage(image,step*n,this.y,this.width,this.height,x,y,
							this.width,this.height)
			x+=step;
		}
	}
}