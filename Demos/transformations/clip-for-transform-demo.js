drawSquare2(ctx,200,100,100,100,Math.PI/4.0,"purple",0.75);
drawSquare2(ctx,350,100,100,100,Math.PI/4.0,"purple",1.0);
drawSquare2(ctx,500,100,100,100,Math.PI/4.0,"purple",1.25);

function drawSquare2(ctx,x,y,width,height,rotation,fillStyle,scale){
  ctx.save();  // save the old state attributes
  ctx.fillStyle=fillStyle;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  // now we'll draw from the center to get the rotation right
  ctx.fillRect(0-width/2, 0-height/2, width, height);
  ctx.restore(); 
  // the old state attributes are restored, ctx is 
  // as it was before this function was called
}