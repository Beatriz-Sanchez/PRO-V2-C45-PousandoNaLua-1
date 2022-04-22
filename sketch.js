let ground;
let lander;
var lander_img;
var bg_img;
var thrust,crash,land;
var rcs_left;
var rcs_right;
var obs;

var vx = 0;
var vy = 0;
var g = 0.05;
var fuel = 100;
var timer;
var obstacle_img;
var lz_img;

function preload()
{
  //imagem inicial do sprite
  lander_img = loadImage("normal.png");
  bg_img = loadImage("bg.png");
  //animações: cima, direita, esquerda, normal e pouso
  thrust = loadAnimation("b_thrust_1.png","b_thrust_2.png","b_thrust_3.png");
  crash= loadAnimation("crash1.png","crash2.png","crash3.png");
  land = loadAnimation("landing1.png" ,"landing2.png","landing_3.png");
  rcs_left = loadAnimation("left_thruster_1.png","left_thruster_2.png");
  normal = loadAnimation("normal.png");
  rcs_right = loadAnimation("right_thruster_1.png","right_thruster_2.png");
 
  obstacle_img = loadImage("obstacle.png");
  //zona de pouso
  lz_img = loadImage("lz.png");

  //looping falso para todas as animações
  thrust.playing= true;
  thrust.looping= false;
  land.looping = false;
  crash.looping = false; 
  rcs_left.looping = false;
  rcs_right.looping = false;
}

function setup() {
  createCanvas(1000,700);
  frameRate(80);
  timer = 1500;

  //velocidade correta de cada animação
  thrust.frameDelay = 5;
  land.frameDelay = 5;
  crash.frameDelay = 10;
  rcs_left.frameDelay = 5;

  //foguete e suas animações
  lander = createSprite(100,50,30,30);
  lander.addImage(lander_img);
  lander.scale = 0.1;
  lander.setCollider("rectangle",0,0,200,200)

  //lander.addAnimation('thrust',"b_thrust_1.png","b_thrust_2.png","b_thrust_3.png" );
  lander.addAnimation('thrusting',thrust);
  lander.addAnimation('crashing',crash);
  lander.addAnimation('landing',land);
  lander.addAnimation('left',rcs_left);
  lander.addAnimation('normal',normal);
  lander.addAnimation('right',rcs_right);

  //obstaculo
  obs = createSprite(320,530,50,100);
  obs.addImage(obstacle_img);
  obs.scale = 0.5;
  obs.setCollider("rectangle",0,100,300,300);

  ground = createSprite(500,690,1000,20);
  
  //zona de pouso
  lz = createSprite(880,610,50,30);
  lz.addImage(lz_img);
  lz.scale = 0.3;
  lz.setCollider("rectangle",0,180,400,100)
  
  rectMode(CENTER);
  textSize(15);
}

function draw() 
{
  //pade colocar a imagem direto no background também
  background(bg_img);
  
  //textos
  push()
  fill(255);
  text("Velocidade Horizontal: " +round(vx,2),800,50);
  text("Combustível: "+fuel,800,25);
  text("Velocidade Vertical: "+round(vy),800,75);
  pop();

  //velocidade e gravidade
  vy +=g;
  lander.position.y+=vy;
  lander.position.x +=vx;
  
  //detecção de colisão com o solo
  if(lander.collide(ground)==true)
  {
    console.log("collided");
    lander.changeAnimation('crashing');
    vx = 0;
    vy = 0;
    g = 0;
  }

  //detecção de obstáculo
  if(lander.collide(obs)==true)
  {
    lander.changeAnimation('crashing');
    stop();
  }

  //detecção de pouso;
  var d = dist(lander.position.x,lander.position.y,lz.position.x,lz.position.y);
  console.log(d);

  if(d<=35 && (vy<2 && vy>-2 ) && (vx<2 && vx >-2) )
  {
    console.log("landed");
    vx = 0;
    vy = 0;
    g=0;
    lander.changeAnimation('landing');
  }

  drawSprites();
}

//movimentos
function keyPressed()
{
  if(keyCode==UP_ARROW && fuel>0)
  {
    upward_thrust();
    lander.changeAnimation('thrusting');
    thrust.nextFrame();
    
  }
  if(keyCode==RIGHT_ARROW && fuel>0)
  {
    lander.changeAnimation('left');
    right_thrust();
  }

  if(keyCode==LEFT_ARROW && fuel>0)
  {
    lander.changeAnimation('right');
    left_thrust();
  }
}

function upward_thrust()
{
  vy = -1;
  fuel-=1;
}

function right_thrust()
{ 
  vx += 0.2;
  fuel -=1;
}

function left_thrust()
{
  vx -= 0.2;
  fuel-=1;
}

function stop()
{
  vx = 0;
  vy = 0;
  fuel = 0;
  g = 0;
}
