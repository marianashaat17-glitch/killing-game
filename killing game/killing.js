//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize; // el tahkom bta3 el ship fy el speed aw el etgah bta3ha mn el akher

//aliens
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1; //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //dy 3shan el bullets bttl3 ly fo2

let score=0;
let gameover= false;


window.onload = function(){   //built in function 3shan yetl3 code lma el window y5las loading
    board = document.getElementById("board"); //built in function 3shan ygeb element beta3 el canvas
    board.width=boardWidth;//dy w ely tahtaha home ely khalo el function tshtghl w khala el width w el height ykbro
    board.height = boardHeight;
    context=board.getContext("2d"); //hnstkhdmha 3shan el rsma tzhr 3la el board

    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function(){
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
 }

alienImg = new Image();
alienImg.src="./alien.png";


createAliens();

 requestAnimationFrame(update); //built in function to call update
 document.addEventListener("keydown",moveShip);
 document.addEventListener("keyup", shoot);

}
 
function update(){
    requestAnimationFrame(update);

     if(gameover){
        return;
     }

//clear dy ana bastkhdmha 3shan el frame myfdlsh ytkrr 3ndy ykon frame wahda bs ely tkon mawgoda w hya ely tthark
 context.clearRect(0, 0, board.width, board.height);

    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

//alien
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
        alien.x += alienVelocityX;  //dy ely btkhly el aliens tthark

    
        //if alien touches the borders
        if (alien.x + alien.width >= board.width || alien.x <= 0) {
            alienVelocityX *= -1; //btkhleha lw wslt ly el boarders nahyt el ymen trg3 mn el awl tany nahyt el shemal
            alien.x+=alienVelocityX*2; //3shan el aliens kol ma tkhbt fy edge troh nazla row taht


        //dy ely btkhly en kol ma alien ylms el edges ynzl rows taht
        for (let j = 0; j < alienArray.length; j++) {
            alienArray[j].y += alienHeight;
                }
            }
    


            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if(alien.y >= ship.y){
                gameover=true;
            }
        }
    }

   //bullets
   for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //bullet collision with alliens
    for(let j=0; j<alienArray.length; j++){
    let alien = alienArray[j];
     if(!bullet.used && alien.alive && detectCollision(bullet,alien)){
        bullet.used = true;
        alien.alive= false;
        alienCount--;
        score+=200;
     }
    }

 }
    //clear bullets 3shan akhleha kolha ttl3 b nfs el size
      while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
      bulletArray.shift();//removes the first element of the array
 }

//next level(3shan azwd el aliens lama ykhlso)
 if(alienCount==0){
    //increase the number of aliens in columns and rows by 1
    alienColumns = Math.min(alienColumns+1,columns/2-2);
    alienRows = Math.min(alienRows+1,rows-4);
    //alienVelocityX+=0.2; //byzwd sor3t harkt el aliens fy kol mara
    alienArray = [];
    bulletArray = [];
    createAliens();
 }
    //score
    context.fillStyle="white";
    context.font="16px courier";
    context.fillText(score,5,20);
}

function moveShip(e){

    if(gameover){
        return;
    }
    //3momn bytharko tile wahda bs eza kant ymen aw shemal
    //ship.x - shipVelocityX>=0 w ship.x + shipVelocityX + shipWidth<=boardWidth 
    //dol 3shan tkhly el ship tthark fy hedod el canvas bs
if(e.code == "ArrowLeft" && ship.x - shipVelocityX>=0){
    ship.x -= shipVelocityX; //3shan el ship trg3 ly wara troh nahyt el shemal y3ni
}
else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidth<=boardWidth){
    ship.x += shipVelocityX; //3shan tthark ly odam ely howa nahyt el ymen
}
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e){

   if(gameover){
    return;
     }

    if(e.code =="Space"){
        let bullet={
            x:ship.x + shipWidth*15/32,
            y:ship.y,
            width: tileSize/8, //3shan tob2a rofy3a gdn
            height:tileSize/2,
            used:false

             
        }
        bulletArray.push(bullet);

    }

}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}