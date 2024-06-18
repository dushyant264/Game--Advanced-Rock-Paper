// canvas
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
let canvasWidth,canvasHeight;
let userPlayers=[],computerPlayers=[];
var sharedMsg=document.getElementById('sharedMsg');

// set dimensions
setCanvasDimensions=()=>{
    canvas.width=canvasWidth=window.innerWidth;
    canvas.height=canvasHeight=window.innerHeight-70;
}
setCanvasDimensions();
windows.addEventListner('resize',setCanvasDimensions);

// inputs rock nos etc

let rocks=document.getElementById('rocks');
let papers=document.getElementById('papers');
let scissors=document.getElementById('scissors');
let subBtn=document.getElementById('submitPlayers');

// span element for their values
let rocksValueSpan=document.getElementById('rocksValue');
let papersValueSpan=document.getElementById('papersValue');
let scissorsValueSpan=document.getElementById('scissorsValue');

// update range val display
updateRangeDisplay=(input,span)=>{
    span.textContext=input.value
}

// listeners for input elements
addInpputListeners=()=>{
    rocks.addEventListener('input',()=>{
        updateRangeDisplay(rocks,rocksValueSpan)
    });
    papers.addEventListener('input',()=>{
        updateRangeDisplay(papers,papersValueSpan)
    });
    scissors.addEventListener('input',()=>{
        updateRangeDisplay(scissors,scissorsValueSpan)
    });
}
addInpputListeners();

//define movingscissors etc

class Player{
    constructor(side,type,id,x,y){
        this.side=side
        this.type=type
        this.x=x
        this.y=y
        this.id=id
        this.size=60
        this.velocity={
            x:Math.random()*2-1,
            y:Math.random()*2-1
        }
        this.targetCell=null
        this.angle=Math.random()*2*Math.PI
        this.label=side+id
    }
    // draw
    draw(){
        ctx.fillText(this.label,this.x,this.y-30)
        ctx.fillText(
            this.type==='rock'?'🪨':this.type==='paper'?'📄':'✂️',
            this.x,this.y
        )
    }
    //uddate coords

    update(){
        this.x+=this.velocity.x
        this.y+=this.velocity.y
        if(this.x<0||this.x>canvasWidth){
            this.velocity.x*=-1
        }
        if(this.y<0||this.y>canvasHeight){
            this.velocity.y*=-1
        }
    }
    // check if collision

    checkCollision(player){
        return Math.hypot(this.x-player.x,this.y-player.y)<this.size/2+player.size/2
    }
}

// map player pos

let playerPos=new Map()

// remove player after collision

removeCollidedPlayers=()=>{
    for(let i=0;i<userPlayers.length;i++){
        for(let j=0;j<computerPlayers.length;j++){
            if(userPlayers[i].checkCollision(computerPlayers[j])){
                let usertype=userPlayers[i].type,compType=computerPlayers[j].type
                // user win
                if(usertype==='rock'&&compType==='scissors'||
                   usertype==='scissors'&&compType==='paper'||
                     usertype==='paper'&&compType==='rock'
                ){
                    computerPlayers.splice(j,1)
                    updateScoreboard('C')
                }
                // comp win
                else if(compType==='rock'&&usertype==='scissors'||
                        compType==='scissors'&&usertype==='paper'||
                        compType==='paper'&&usertype==='rock'
                ){
                    userPlayers.splice(i,1)
                    updateScoreboard('U')
                }
                break;
            }
        }
    }
}

// update scoreboard
let userPlayCount=0,compPlayCount=0

updateScoreboard=(loser)=>{
    if(loser==='C')compPlayCount=compputerPlayers.length
    else if(loser==='U')userPlayCount=userPlayers.length
}

// draw scoreboard

drawScoreboard=()=>{
    ctx.fillStyle='black'
    ctx.font='20px Arial'
    ctx.textAlign='center'
    ctx.fillText('User:' +userPlayCount,canvasWidth/4,20)
    ctx.fillText('Computer:' +compPlayCount,3*canvasWidth/4,20)
}

// draw divider line

drawDivider=()=>{
    let mid=canvasWidth/2
    ctx.strokeStyle='black'
    ctx.lineWidth=2
    ctx.beginPath()
    ctx.moveTo(mid,0)
    ctx.lineTo(mid,canvasHeight)
    ctx.stroke()
}

// create initial players