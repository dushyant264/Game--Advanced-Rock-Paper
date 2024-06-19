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
    if(loser==='C')compPlayCount=computerPlayers.length
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

// create initial players no from 1 to

createInitialPlayers=(counts,side)=>{
    let players=[]
    let id=1
    for(let type in counts){
        for(let i=0;i<counts[type];i++){
            let x= Math.random()*(canvasWidth/2)+(side==='U'?0:canvasWidth/2)
            let y=Math.random()*canvasHeight
            let player=new Player(side,type,id,x,y)
            players.push(player)
            playerPos.set(side+id,{x:player.x,y:player.y})
            id++
        }
    }
    return players
}

// submit handle creating players 

subBtn.addEventListener('click',handleSubmit)

handleSubmit=()=>{
    if(subBtn.innerHTML==='Submit'){
        let counts={
            rock:parseInt(rocks.value),
            paper:parseInt(papers.value),
            scissors:parseInt(scissors.value)
        }

        startGame()

        userPlayers=createInitialPlayers(counts,'U')
        let compCnt=genRandNos(userPlayers.length)
        computerPlayers=createInitialPlayers(compCnt,'C')
        userCount=userPlayers.length
        compCnt=computerPlayers.length
        ctx.clearRect(0,0,canvasWidth,canvasHeight)
        drawMiddleDivider()  // draw div
        drawScoreboard()  // draw top score
        // draw each player
        userPlayers.forEach(player=>player.draw())
        computerPlayers.forEach(player=>player.draw())
        animate()
        subBtn.innerHTML='Restart'
    }else location.reload()
}

// randm count func for complayer

genRandNos=(userCount)=>{
    let count={rock:0,paper:0,scissors:0}

    while(userCount>0){
        let type=['rock','paper','scissors'][Math.floor(Math.random()*3)]
        if(count[type]<userCount){
            count[type]++
            userCount--
        }
    }
    return count
}

// draw grid

drawGrid=()=>{
    ctx.strokeStyle='rgba(0,0,0,0.1)'
    ctx.lineWidth=1
    ctx.font='12px Arial'
    ctx.fillStyle='black'

      // cell sizes etc
    const fixedCellCount=16
    const rowCnt=Math.ceil(Math.sqrt(fixedCellCount))
    const colCnt=math.ceil(fixedCellCount/rowCnt)
    const colWidth=canvasWidth/colCnt
    const rowHeight=canvasHeight/rowCnt
    const cellSize=Math.min(colWidth,rowHeight)*0.8

    // draw vert lines

    for(let x=0;x<canvasWidth;x+=cellSize){
        const colno=Math.floor(x/cellSize)+1
        ctx.beginPath()
        ctx.moveTo(x,0)
        ctx.lineTo(x,canvasHeight)
        ctx.stroke()
        ctx.fillText('C'+colno,x+50,10)
    }

    // draw horiz lines

    for(let y=0;y<canvasHeight;y+=cellSize){
        const rowno=Math.floor(y/cellSize)+1
        ctx.beginPath()
        ctx.moveTo(0,y)
        ctx.lineTo(canvasWidth,y)
        ctx.stroke()
        ctx.fillText('R'+rowno,10,y+50)
    }
}

// game start bool
let isGameStarted=false

// funct to set value
startGame=()=>{
    isGameStarted=true
}

// move players images

animate=()=>{
    ctx.clearRect(0,0,canvasWidth,canvasHeight)
    drawMiddleDivider()
    drawScoreboard()
    drawGrid()
    drawThickRedDots()  // next 

    if(!isCircling&&userPlayers){
        userPlayers.forEach(player=>{
            player.update()
            player.draw()
        })
    } else if(isCircling&&userPlayers){
        userPlayers.forEach((player)=>{
            player.update()
            if(player.targetCell)updatePlayerPositionForCircle(player,player.targetCell)  //later
            player.draw()
        })
    }

    if(computerPlayers){
        computerPlayers.forEach(player=>{
            player.update()
            player.draw()
        })
    }
    // check repeatedly if game over

    if(isGameStarted)gameOver()  // later

    removeCollidedPlayers()
    requestAnimationFrame(animate)
}

// reddot at cell centres

let cellCenterPoints=new Map()

calculateGridCells=()=>{
    const rowcnt=5,colcnt=10

    // cell approx size
    const cellWidth=canvasWidth/colcnt
    const cellHeight=canvasHeight/rowcnt
    const cellSize=Math.min(cellWidth,cellHeight)

    cellCenterPoints.clear()

    for(let row=1;row<=rowcnt;row++){
        for(let col=1;col<=colcnt;col++){
            const centX=(col-0.5)*cellSize
            const centY=(row-0.5)*cellSize
            const cellId='R'+row+'C'+col

            if(!cellCenterPoints.has(cellId)){
                cellCenterPoints.set(cellId,{x:centX,y:centY,size:cellSize})
            } else{
                const adjCentX=centX+cellSize/4
                const adjCentY=centY+cellSize/4
                cellCenterPoints.set(cellId,{x:adjCentX,y:adjCentY,size:cellSize})
            }
        }
    }
}

calculateGridCells()

// draw dots on centre of cell

drawThickRedDots=()=>{
    const dotRad=2
    const dotThik=1

    ctx.fillStyle='red'
    ctx.strokeStyle='red'
    ctx.lineWidth=dotThik

    // traverse map to draw

    for(let [cellId,point] of cellCenterPoints){
        ctx.beginPath()
        ctx.arc(point.x,point.y,dotRad,0,2*Math.PI)
        ctx.fill()
        ctx.stroke()
        // label

        ctx.font='12px Arial'
        ctx.fillStyle='black'
        ctx.textAlign='center'
        ctx.fillText(cellId,point.x,point.y+point.size/4) // label at top
    }
}

// all players of same type

areAllPlayersOfSameType=(userPlayers,computerPlayers)=>{
    const userTypes=new Set(userPlayers.map(player=>player.type))
    const compTypes=new Set(computerPlayers.map(player=>player.type))

    if(userTypes.size()!==1||compTypes.size()!==1)return false

    // check same type
    return userTypes.has([...compTypes][0])
}

// if game over

gameOver=()=>{
    const bothPlayersRem=userPlayers.length>0&&computerPlayers.length>0
    const samesame=areAllPlayersOfSameType(userPlayers,computerPlayers)

    if(bothPlayersRem&&samesame){
            ctx.clearRect(0,0,canvasWidth,canvasHeight)
            ctx.font='30px Arial'
            ctx.textAlign='center'
            if(userPlayers.length>computerPlayers.length){
                ctx.fillText('User Wins',canvasWidth/2,canvasHeight/2)
            } else if(userPlayers.length<computerPlayers.length){
                ctx.fillText('Computer Wins',canvasWidth/2,canvasHeight/2)
            }else ctx.fillText('Its a Draw',canvasWidth/2,canvasHeight/2)

            subBtn.innerHTML='Restart'
            cancelAnimationFrame(animationFrame)
            return
    }else{
        const winner=userPlayers.length===0?'Computer':'User'
        ctx.fillText(winner+' Wins',canvasWidth/2,canvasHeight/2)
        subBtn.innerHTML='Restart'
        cancelAnimationFrame(animationFrame)
    }
}

animate()