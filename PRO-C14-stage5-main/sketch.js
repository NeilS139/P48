var backgroundImg;
var screwImg;
var roverForwardImg, roverLeftImg, roverRightImg;
var fuelImg;
var fuelCount = 200;
var lifeCount = 200;
var rover;
var fuel, screws, fuelGroup, screwGroup;
var gameState = "play";
var timer = 120;
var backgroundSound;
var losingSound, winningSound;

function preload()
{
  backgroundImg = loadImage("mars-background2.webp");
  screwImg = loadImage("screw.png");
  roverForwardImg = loadAnimation("roverForward.png");
  roverLeftImg = loadAnimation("roverLeft.png");
  roverRightImg = loadAnimation("roverRight.png");
  fuelImg = loadImage("fuel_canisters.png");
  backgroundSound = loadSound("Mars-Holst.mp3");
  losingSound = loadSound("loss.wav");
  winningSound = loadSound("win.mp3");
}

function setup()
{
  createCanvas(1600,800);

  rover = createSprite(800,400,20,20);
  rover.addAnimation("forward", roverForwardImg);
  rover.addAnimation("right", roverRightImg);
  rover.addAnimation("left", roverLeftImg);
  rover.scale = 0.5;

  mute_btn = createImg('mute.png');
  mute_btn.position(width-70,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  fuelGroup = createGroup();
  screwGroup = createGroup();
  
  backgroundSound.setVolume(0.5);
  backgroundSound.play();

}

function draw()
{
  console.log(rover.position);

  background("grey");
  image(backgroundImg,0,-height*3,1600*2,800*4);
  drawSprites();
  if(rover.position.x >= 800 && rover.position.x <= 2404)
  {
    camera.position.x = rover.position.x;
  }
  if(rover.position.y <= 400 && rover.position.y >= -2014)
  {
    camera.position.y = rover.position.y;
  }

  push();
  fill("black");
  textSize(25);
  text(timer +" seconds left",camera.x-770,camera.y-350);
  pop();
 
  if(gameState == "play")
  {
    
    if(frameCount%30 == 0)
      {
        timer-=1;
      }

    setTimeout(() => {
      gameState = "win"
      rover.changeAnimation("forward");
      gameOver();
      fuelCount++;
    }, 1000);
    if(fuelCount<0 || lifeCount<0)
    {
      gameState = "lose"
      rover.changeAnimation("forward");
      gameOver();
      fuelCount++;
    }

    fuelCount -= 0.5;
    lifeCount -= 0.5;

    
    if(rover.y<=-2330)
    {
      push();
      stroke("black");
      noFill();
      rect(rover.x-100,rover.y+100,200,20);
      rect(rover.x-100,rover.y+130,200,20);

      fill("red");
      rect(rover.x-100,rover.y+100,fuelCount,20);

      fill("grey");
      rect(rover.x-100,rover.y+130,lifeCount,20);
      pop();
    }
    if(rover.y<=800)
    { 
      push();
      stroke("black");
      noFill();
      rect(rover.x-100,rover.y-100,200,20);
      rect(rover.x-100,rover.y-130,200,20);

      fill("red");
      rect(rover.x-100,rover.y-130,fuelCount,20);

      fill("grey");
      rect(rover.x-100,rover.y-100,lifeCount,20);
      pop();
    }

    if(keyDown(DOWN_ARROW) && rover.position.y <= 730)
    {
      rover.changeAnimation("forward");
      rover.position.y += 15;
    }

    if(keyDown(UP_ARROW) && rover.position.y > -2345)
    {
      rover.changeAnimation("forward");
      rover.position.y -= 15;
    }

    if(keyDown(RIGHT_ARROW) && rover.position.x <= 3040)
    {
      rover.changeAnimation("right");
      rover.position.x += 15;
    }

    if(keyDown(LEFT_ARROW) && rover.position.x >= 150)
    {
      rover.changeAnimation("left");
      rover.position.x -= 15;
    }
    fuelSpawn();
    screwSpawn();
  }
  
}

function fuelSpawn()
{
  if(frameCount%10 == 0)
  {
    fuel = createSprite(Math.round(random(150,3040)), Math.round(random(-height*3+50,750)), 20, 20);
    fuel.addImage(fuelImg);
    fuel.scale = 0.3;
    setTimeout(() => {
      fuel.destroy();
    }, 5000);
    fuelGroup.add(fuel);
  }
  rover.overlap(fuelGroup, function(collector, collected) {
    fuelCount = 200;
    collected.remove();
  });
}

function screwSpawn()
{
  if(frameCount%10 == 0)
  {
    screw = createSprite(Math.round(random(150,3040)), Math.round(random(-height*3+50,750)), 20, 20);
    screw.addImage(screwImg);
    screw.scale = 0.2;
    setTimeout(() => {
      screw.destroy();
    }, 5000);
    screwGroup.add(screw);
  }
  rover.overlap(screwGroup, function(collector, collected) {
    lifeCount = 200;
    collected.remove();
  });
}

function gameOver()
{
  backgroundSound.stop();
  if(gameState === "win")
  {
    winningSound.setVolume(0.2);
    winningSound.play();
    swal({
      title: `You won!`,
      text: "You've Survived!",
      confirmButtonText: "Ok"
    });
  }

  if(gameState === "lose")
  {
    losingSound.setVolume(0.3);
    losingSound.play();
    swal({
      title: `You lost!`,
      text: "Game over!",
      confirmButtonText: "Ok"
    });
  }

}

function mute()
{
  if(backgroundSound.isPlaying())
     {
      backgroundSound.stop();
     }
     else{
      backgroundSound.play();
     }
}