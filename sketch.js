var trex, trex_running, trex_collided;
var ground, groundImage, invisibleground;
var cloud, cloudImage, cloudsgroup;
var backgroudImg, suna, sun;

var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, cactusgroup;

var puntaje;
var comienzo = 1;
var final = 0;
var gamestate = comienzo;

var gameover, gameoverImg;
var boton, botonImg;
//variables para el sonidero
var die, jump, checkpoint;

function preload(){
  backgroudImg= loadImage("backgroundImg.png");
  suna= loadImage("sun.png");
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  groundImage = loadImage("ground.png");
  cloudImage = loadImage("cloud-1.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  gameoverImg = loadImage ("gameOver-1.png");
  botonImg = loadImage ("restart-1.png");
  
  cactus1 = loadImage("obstacle1-1.png");
  cactus2 = loadImage("obstacle2-1.png");
  cactus3 = loadImage("obstacle3-1.png");
  cactus4 = loadImage("obstacle4-1.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sun= createSprite(width-50, 100, 10, 10);
  sun.addImage(suna);
  sun.scale= 0.1;

  //Crea el Sprite del trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //añade escala y posición al Trex
  trex.scale = 0.08;
  trex.setCollider("rectangle",0,0,trex.width,trex.heigth);
  trex.debug= false;

  //crea el Sprite del suelo
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground", groundImage);
  ground.x = width/2;
  ground.depth= trex.depth;
  trex.depth= trex.depth+1;
  //suelo invisible
  invisibleground = createSprite (width/2, height-10, width, 125);
  invisibleground.visible = false;
  invisibleground.shapeColor= "#f4cbaa"
  
  puntaje=0;
  
  //creagrupo de cactus y de nubes
  cloudsgroup = new Group();
  cactusgroup = new Group();
  
  //crea los sprites de las imagenes de gameover y boton
  gameover = createSprite(width/2,height/2-50);
  gameover.addImage(gameoverImg);
  gameover.scale = 0.5;
  gameover.visible = false;
  
  boton = createSprite(width/2,height/2);
  boton.addImage(botonImg);
  boton.scale = 0.1;
  boton.visible = false;
}

function draw() {
  //establece el color de fondo
  background(backgroudImg);
  
  //puntuacion
  fill("orange");
  stroke("white");
  strokeWeight(4);
  textSize(20);
  text("puntuacion     "+puntaje,30,50);
  
  //añade estados del juego
  if (gamestate=== comienzo){
    //mueve el sulo
    ground.velocityX = -(2+3*puntaje/100);
    //comienza el puntaje
    puntaje=puntaje+Math.round(getFrameRate()/60);
    if(puntaje>0&&puntaje%500===0){
      checkpoint.play();
    }
    if(ground.x<0){
       ground.x = ground.width/2;
    }
     //salta cuando preciono la barra espaciadora
    if(touches.length>0||keyDown("space") && trex.y>=height-120) {
      trex.velocityY = -10;  
      jump.play();
      touches=[];
    }  
    
    trex.velocityY = trex.velocityY + 0.8 
    //evita que el trex caiga
    trex.collide(invisibleground);  
    spawncloud();
    spawnobstaculos();
    
    if(trex.isTouching(cactusgroup)){
      gamestate= final;
      die.play();
    }
  }
  else if(gamestate=== final){
    // detiene el suelo 
    ground.velocityX = 0;
    cactusgroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    //cambia la animacion del trex
    trex.changeAnimation("collided", trex_collided);
    // nunca desaparecer objetos
    cactusgroup.setLifetimeEach(-1);
    cloudsgroup.setLifetimeEach(-1);
    trex.velocityY= 0;
    gameover.visible = true;
    boton.visible = true;
     // condicion para tocar el boton de reinicio 
    if(touches.length>0||keyDown("space")||mousePressedOver(boton)){
      reset();
      touches=[];
    }
  }
  
  
  drawSprites();
  
}

//funcion para que aparescan las nubes
function spawncloud(){
  if(frameCount%60===0){
    cloud = createSprite(width+20, height-300, 40, 10);
    cloud.velocityX = -(2+puntaje/200);
    cloud.addImage(cloudImage);
    cloud.y=Math.round(random(10,60));
    cloud.scale=0.6;
    //tiempo de vida de las nubes
    cloud.lifetime=320;
    //ajusta la profundidad de las nubes
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    //añade cada nuve al grupo de nubes
    cloudsgroup.add(cloud);
  } 
}

function spawnobstaculos(){
  if(frameCount%60===0){
    cactus = createSprite(1000, height-95, 20, 30);
    cactus.velocityX = -(6+puntaje/100);
    //genera los actus alazar
    var rand=Math.round(random(1,2));
    switch(rand){
      case 1:cactus.addImage(cactus1);
      break;
      case 2:cactus.addImage(cactus2);
      break;
      case 3:cactus.addImage(cactus3);
      break;
      case 4:cactus.addImage(cactus4);
      break;
      case 5:cactus.addImage(cactus5);
      break;
      case 6:cactus.addImage(cactus6);
      break;
      default:break;
    }
   //asigno escala y tempo de vida alos obstaculos
   cactus.scale = 0.3; 
   cactus.lifetime = 320;
    
   //añade cada cactus al grupo de cactus
   cactusgroup.add(cactus); 
  }
}

function reset(){
  gamestate= comienzo;
  gameover.visible = false;
  boton.visible = false;
  cactusgroup.destroyEach();
  cloudsgroup.destroyEach();
  trex.changeAnimation("running", trex_running);                    
  puntaje = 0;
}