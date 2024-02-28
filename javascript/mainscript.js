let point={
    X:null,
    Y:null,
    points:function(x,y){
        this.X = x;
        this.Y = y;
    }
};

let difficulty={
    easy: false,
    normal: true,
    hard: false,
    setDifficulty(_difficulty){
        if(_difficulty == "easy"){
            this.easy = true;
            this.normal = false; 
            this.hard = false;
        }else if(_difficulty == "normal"){
            this.easy = false;
            this.normal = true; 
            this.hard = false;
        }else if(_difficulty == "hard"){
            this.easy = false;
            this.normal = false; 
            this.hard = true;
        }
        this.displayDifficulty();
    },
    getDifficulty(){
        if(this.easy == true){return 18000;}
        if(this.normal == true){return 25000;}
        if(this.hard == true){return 30000;}
    },
    displayDifficulty(){
        if(this.easy == true){document.getElementById('difficulty').innerHTML = 'Easy';}
        if(this.normal == true){document.getElementById('difficulty').innerHTML = 'Normal';}
        if(this.hard == true){document.getElementById('difficulty').innerHTML = 'Hard';}
    }

};

let highScoreControl = {
    bestScore: null,
    hasHighScoreChanged: false,

    retrieveStoredHighScore:function(){
        this.bestScore = localStorage.getItem('elevenball');
        if(this.bestScore != null){
           highScore = this.bestScore; 
           this.updateHighScoredisplay();
        }
        
    },
    writeStoredHighScore:function(){
        if(this.hasHighScoreChanged == true){
             localStorage.setItem('elevenball',this.bestScore);
        }       
    },
    removeStoredHighScore:function(){
        localStorage.removeItem('elevenball');
    },
    determineHightScore:function(){
        if(activeScore > this.bestScore){
            this.bestScore = activeScore;
            highScore = this.bestScore;
            this.hasHighScoreChanged = true;
            this.updateHighScoredisplay();
        }
    },
    updateHighScoredisplay:function (){
        document.getElementById('highScore').innerHTML = this.bestScore;
    }
};

function objBallInformation(ballNumber,ballName){
    this.number = ballNumber;
    this.name = ballName; //getNumberStr(ballNumber) + "_of_" + index; 
}

let activeBallPosition = new point.points(45.25,78);
let activeBallInPlay = null;
let activeBallDestination = null;
let activeScore = 0;
let highScore = 0;
let activeRound = 0;
let tempTotal = null;
let soundState = true;
let arrTempBallsCollection = [];
let arrBallCollection = [];
let arrActiveBallState = [false,false,false,false,false,false,false,false,false,false,
                          false,false,false,false,false,false,false,false,false,false,false
                         ];

const arrGameBallPositions = 
[new point.points(15.5,10),new point.points(40,10),new point.points(50.5,10),new point.points(74.5,10),
 new point.points(10.25,23.5),new point.points(20.75,23.5),new point.points(45.25,23.5),new point.points(69.25,23.5),new point.points(79.75,23.5),
 new point.points(5,37),new point.points(15.5,37),new point.points(26,37),new point.points(64,37),new point.points(74.5,37),new point.points(85,37),
 new point.points(10.25,50.5),new point.points(20.75,50.5),new point.points(69.25,50.5),new point.points(79.75,50.5),
 new point.points(15.5,64),new point.points(74.5,64)
];

function startDisplay(){
    
    buildGameBoard();
    highScoreControl.retrieveStoredHighScore();
    
    //getStyleSheet();
    //console.log("%cTry me on!", "color: #FFFFFF; font-size: 45px; background: #333333; text-shadow: #FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 15px, #FF2D95 0px 0px 20px, #FF2D95 0px 0px 30px, #FF2D95 0px 0px 40px, #FF2D95 0px 0px 50px, #FF2D95 0px 0px 75px;")
    // outputs: a Vegas style super shiny string
}


function resetDisplay(){
    activeBallInPlay = null;
    activeBallDestination = null;
    activeScore = 0;
    //highScore = 0;
    activeRound = 0;
    tempTotal = null;
    arrTempBallsCollection = [];
    arrBallCollection = [];
    arrActiveBallState = [false,false,false,false,false,false,false,false,false,false,
                          false,false,false,false,false,false,false,false,false,false,false
                          ];
    const timer = document.getElementById('timerBar');
          timer.animationPlayState = "paused";
          timer.style = 'initial';

    const doc = document.getElementById('progressSheet');
    if(doc !=  null){
        gameProgressSheet.remove();
    }   
    let btn = document.getElementById('btnCycleBalls');   
    if(btn != null){btnCycleBalls.remove();}
    let btntt = document.getElementById('btnTakeTime');
    if(btntt != null){btnTakeTime.remove();}    
    
    updateBallValueTotal();
    clearBoard();
    clearSoundFx();    
    buildGameBoard();
}

function advanceRound(){
    activeBallInPlay = null;
    activeBallDestination = null;
    tempTotal = null;
    arrTempBallsCollection = [];
    arrBallCollection = [];
    arrActiveBallState = [false,false,false,false,false,false,false,false,false,false,
                          false,false,false,false,false,false,false,false,false,false,false];
    const timer = document.getElementById('timerBar');
    timer.style = '';
    gameProgressSheet.remove();
    clearBoard(); 
    clearSoundFx()
    buildGameBoard();
}

function buildGameBoard(){
    let ball = PoolBall;
    let btn = btnCycleBalls;
    let btnTimer = btnTakeTime;
    const timer = document.getElementById('timerBar');
    timer.style.animation = 'timerMeter 224s reverse';
    timer.addEventListener("animationend",timerBar);    
    
    buildBallInformation();
    for(let i=0;i<=20;i++){
        let ballSelected = arrBallCollection.shift()
      ball.mkBall(arrGameBallPositions[i].X,arrGameBallPositions[i].Y,ballSelected.number,ballSelected.name);
      arrActiveBallState[i] = true;
    }
    activeBallInPlay = arrBallCollection.shift();
    ball.mkBall(activeBallPosition.X,activeBallPosition.Y,activeBallInPlay.number,activeBallInPlay.name);
    btn.mkBtn();
    btnTimer.mkBtn();
    updateBallTotal();
    updateScoreTotal();
    updateHiScore();
    updateRound();
    difficulty.displayDifficulty();
}

function clearBoard(){
    const ballCollection = document.body.querySelectorAll("[data-game-balls]");

    for(let ball of ballCollection){
        PoolBall.removeBall(ball.id);
    }
}

function timerBar(){
    console.log("%cTimer Stopped!","font-weight: bolder; font-size:15px; color:red; background:yellow;")
    let btn = document.getElementById('btnCycleBalls');   
    if(btn != null){btnCycleBalls.remove();}
    btnTakeTime.remove();
    gameProgressSheet.mkprogressSheet(true,'Game Over','Times Up</br>Try Again');
    highScoreControl.writeStoredHighScore();
}

function takeTime(){
    console.log("%cTake Time Stop Timer","font-weight: bolder; font-size:15px; color:red; background:yellow;")
    const timer = document.getElementById('timerBar');
    timer.style.animationPlayState = "paused";
    let btn = document.getElementById('btnCycleBalls');   
    if(btn != null){btnCycleBalls.remove();}
    btnTakeTime.remove();
    if(checkScore() == true){
        gameProgressSheet.mkprogressSheet(false,'Great Job','Round ' + activeRound + ' Complete</br>Time Bonus: ' + bonusText() + '</br>Get Ready!');
        const countDownTimer = document.getElementById('countDownBkGrd');
        countDownTimer.style.animation = 'countDownTimer 5s 1 linear';
        countDownTimer.addEventListener("animationend",countDown); 
        timer.style = "";
    }else{
        gameProgressSheet.mkprogressSheet(true,'Game Over','Not Enough Points</br> to move on to</br> the next Round</br>Try Again');
        highScoreControl.writeStoredHighScore();
    }
}

function isBoardCleared(){
    const boardBalls = document.body.querySelectorAll("[data-game-balls]");
    let ballsLeft = boardBalls.length + arrBallCollection.length;

    if(boardBalls.length == 1 ){
        const timer = document.getElementById('timerBar');
        timer.style.animationPlayState = "paused";
        let btn = document.getElementById('btnCycleBalls');   
        if(btn != null){btnCycleBalls.remove();}
        btnTakeTime.remove();
        gameProgressSheet.mkprogressSheet(false,'Great Job','Round ' + activeRound + ' Complete</br>Board Cleared Bonus: ' + bonusText() + '</br>Get Ready!'); 
        const countDownTimer = document.getElementById('countDownBkGrd');
        countDownTimer.style.animation = 'countDownTimer 5s 1 linear';
        countDownTimer.addEventListener("animationend",countDown);   
        timer.style = "";     
    }
    if(ballsLeft == 0){
        const timer = document.getElementById('timerBar');
        timer.style.animationPlayState = "paused";
        let btn = document.getElementById('btnCycleBalls');   
        if(btn != null){btnCycleBalls.remove();}
        btnTakeTime.remove(); 
        gameProgressSheet.mkprogressSheet(false,'Great Job','Round ' + activeRound + ' Complete</br>Cleared All Bonus: ' + bonusText() + '</br>Get Ready!'); 
        const countDownTimer = document.getElementById('countDownBkGrd');
        countDownTimer.style.animation = 'countDownTimer 5s 1 linear';
        countDownTimer.addEventListener("animationend",countDown); 
        timer.style = "";
    }
}

function countDown(){
    console.log('%cCount Down Timer Ended','background:yellow; color:darkgreen;')     
    advanceRound();
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

function clearTimer(){
   /*const timer = document.getElementById('timerBar');    
   timer.style.animationPlayState = "paused" ;
     //delay(100).then(() =>,);
    timer.style = "";
    */
    const timer = document.querySelector('#timerBar');
    timer.animationPlayState = "paused"
    timer.style ='';
}

function buildBallInformation(){
    let control;
   // do{
        control = true;
        for(let i=0;i<=80;i++){
            let getNumber = guessBallNumber();
            let ballInfo = new objBallInformation(getNumber,getNumberStr(getNumber) + "_of_" + i);
            arrBallCollection.push(ballInfo);
        }
       /* for(let r=1;r<=10;r++){
            let countCopies = 0; 
            for(let ballColl of arrBallCollection){
                if(ballColl.number == r){
                    countCopies++;
                }
            }
            if(countCopies > 9){
                control = false;
                arrBallCollection = [];
                break;
            }
        }*/
   // }while(control == false)
    //console.table(arrBallCollection)
}

function selectDifficulty(_difficulty){
    resetDisplay(); 
    difficulty.setDifficulty(_difficulty);
    difficulty.displayDifficulty();

}

function checkScore(){
    let isScoreValid = false;
    let validScore = difficulty.getDifficulty();
    if(activeRound == 1 && activeScore >= validScore){
        isScoreValid = true;
    }else if(activeRound > 1 && activeScore >= activeRound * validScore){
        isScoreValid = true;
    }

    return isScoreValid;
}

function bonusText(){
 const boardBalls = document.body.querySelectorAll("[data-game-balls]");
 let ballsLeft = boardBalls.length + arrBallCollection.length;
 let bounus = 0;
 
    if(boardBalls.length == 1){
        bounus = 10000;
    }else if(ballsLeft == 0){
        bounus = 20000;
    }else if(ballsLeft <= 5){
        bounus == 5000;
    }else if( ballsLeft > 5 && ballsLeft <= 10){
        bounus = 2500;
    }else if( ballsLeft > 10 && ballsLeft <= 15){
        bounus = 1500;        
    }else if( ballsLeft >= 20){
        bounus = 1000;
    }
    activeScore = activeScore + bounus;
    return bounus;
}

function getNumberStr(number){
    let strNum = "";
    switch(number){
        case 1:
            return strNum = 'one';           
        case 2:
            return strNum = 'two';
        case 3:
            return strNum = 'three';
        case 4:
            return strNum = 'four';
        case 5:
            return strNum = 'five';
        case 6:
            return strNum = 'six';
        case 7:
            return strNum = 'seven';
        case 8:
            return strNum = 'eight';
        case 9:
            return strNum = 'nine';
        case 10:
            return strNum = 'ten';
    }
}

function guessBallNumber(){
    let number = Math.floor(Math.random() * 10) + 1;
    return number;
}

function add(a,b){
    return a + b;
}

function subtract(a,b){
    return a - b;
}

function selectionConirfmation(id){
    const ball = document.getElementById(id);
    let selectionConfirmed = false;
    let ballNumber;
    if(ball.style.top != activeBallPosition.Y + "%" ){
        for(let i=0;i<=arrGameBallPositions.length;i++){
            if(arrGameBallPositions[i].X + "%" == ball.style.left && arrGameBallPositions[i].Y + "%" == ball.style.top){
                ballNumber = i;
                break;
            }
        }
    }else{selectionConfirmed = true;}  
    
    switch(ballNumber){        
        case 0:
             if(arrActiveBallState[4]==false && arrActiveBallState[5]==false && arrActiveBallState[9]==false && arrActiveBallState[10]==false &&
                arrActiveBallState[11]==false && arrActiveBallState[15]==false && arrActiveBallState[16]==false && arrActiveBallState[19]==false){
                    selectionConfirmed = true;
             }             
            break;
        case 1:
        case 2:
            if(arrActiveBallState[6]==false){
                selectionConfirmed = true;
            }
            break;
        case 3:
            if(arrActiveBallState[7]==false && arrActiveBallState[8]==false && arrActiveBallState[12]==false && arrActiveBallState[13]==false &&
                arrActiveBallState[14]==false && arrActiveBallState[17]==false && arrActiveBallState[18]==false && arrActiveBallState[20]==false){
                    selectionConfirmed = true;
             }
            break;
        case 4:
        case 5: 
        if(ballNumber == 4){
            if(arrActiveBallState[9]==false && arrActiveBallState[10]==false && arrActiveBallState[15]==false && 
               arrActiveBallState[16]==false && arrActiveBallState[19]==false){
                   selectionConfirmed = true;
                } 
        }else if(ballNumber == 5){
            if(arrActiveBallState[10]==false && arrActiveBallState[11]==false && 
                arrActiveBallState[15]==false && arrActiveBallState[16]==false && arrActiveBallState[19]==false){
                    selectionConfirmed = true;
            } 
        }           
          
            break;
        case 6:
            selectionConfirmed = true;
            break;
        case 7:
        case 8:   
        if(ballNumber == 7){
            if(arrActiveBallState[12]==false && arrActiveBallState[13]==false && arrActiveBallState[17]==false && 
               arrActiveBallState[18]==false && arrActiveBallState[20]==false){
                 selectionConfirmed = true;
            }
        }else if(ballNumber == 8){
            if(arrActiveBallState[13]==false && arrActiveBallState[14]==false && 
                arrActiveBallState[17]==false && arrActiveBallState[18]==false && arrActiveBallState[20]==false){
                    selectionConfirmed = true;
             }
        }

            break;
        case 9:
        case 10:
        case 11:
            if(ballNumber == 9){
                if(arrActiveBallState[15]==false && arrActiveBallState[19]==false ){
                    selectionConfirmed = true;
                }
            }else if(ballNumber == 10){
                    if(arrActiveBallState[15]==false && arrActiveBallState[16]==false && arrActiveBallState[19]==false){
                        selectionConfirmed = true;      
                    }
            }else if(ballNumber == 11){
                    if(arrActiveBallState[16]==false && arrActiveBallState[19]==false){
                        selectionConfirmed = true;
                    }
            }
            break;
        case 12:
        case 13:
        case 14:
            if(ballNumber == 12){
                if(arrActiveBallState[17]==false && arrActiveBallState[20]==false){
                    selectionConfirmed = true;
                }
            }else if(ballNumber == 13){
                    if(arrActiveBallState[17]==false && arrActiveBallState[18]==false && arrActiveBallState[20]==false){
                        selectionConfirmed = true;      
                    }
            }else if(ballNumber == 14){
                    if(arrActiveBallState[18]==false && arrActiveBallState[20]==false){
                        selectionConfirmed = true;
                    }
            }
            break;
        case 15:
        case 16:
            if(arrActiveBallState[19]==false){
                selectionConfirmed = true;
            }
            break;
        case 17:
        case 18:
            if(arrActiveBallState[20]==false){
                selectionConfirmed = true;
            }
            break;
        case 19:
            selectionConfirmed = true;
            break;
        case 20:
            selectionConfirmed = true;
            break;    
    }
    return selectionConfirmed;
}

function tallyScore(id){
    let ball = document.getElementById(id);
    for(let pos of arrGameBallPositions){
        if(ball.style.top == pos.Y + "%" || ball.style.top == 78 + "%"){
            if(ball.style.top == 78 + "%"){
                activeScore = activeScore + 200;
                updateScoreTotal();
                return true;
            }else{
                switch(pos.Y){
                    case 10:
                        activeScore = activeScore + 600;
                        updateScoreTotal();
                        return true;               
                    case 23.5:
                        activeScore = activeScore + 500;
                        updateScoreTotal();
                        return true;
                    case 37:
                        activeScore = activeScore + 400;
                        updateScoreTotal();
                        return true;
                    case 50.5:
                        activeScore = activeScore + 300;
                        updateScoreTotal();
                        return true;
                    case 64:
                        activeScore = activeScore + 200;
                        updateScoreTotal();
                        return true;
                }

            }
            
        }
    }
  
}
function openHelp(){
    helpDocument.mkHelpDoc();
    const timer = document.getElementById('timerBar');
    timer.style.animationPlayState = "paused";
}

function exitHelp(){
    helpDocument.closeHelp();
    const timer = document.getElementById('timerBar');
    timer.style.animationPlayState = "running";   
}

function clearSoundFx(){
    let SoundFX = document.querySelectorAll("[data-sound-FX]");
    for(let sound of SoundFX){
        sound.remove();
    }
}

function updateSoundState(){
    if(soundState == true){
        soundState = false;
        document.getElementById('sound').innerHTML = "🔇";
    }else if(soundState == false){
        soundState = true;
        document.getElementById('sound').innerHTML = "🔈";
    }
}

function updateScoreTotal(){
    highScoreControl.determineHightScore();
     document.getElementById('score').innerHTML = activeScore;     
}

function updateHiScore(){
    document.getElementById('highScore').innerHTML = highScore;
}

function updateRound(){
    activeRound = activeRound + 1;
    document.getElementById('round').innerHTML = activeRound; 
}

function updateBallTotal(){
    document.getElementById('totalBalls').innerHTML = arrBallCollection.length;
}
 function updateBallValueTotal(){
    const selectedBallsTotal = document.getElementById('centerDisplay');
    selectedBallsTotal.innerHTML = tempTotal;
 }

function updateActiveBallState(id){
    const ball = document.getElementById(id);
    if(ball.style.top != activeBallPosition.Y + "%" ){
        for(let i=0;i<=arrGameBallPositions.length;i++){
            if(arrGameBallPositions[i].X + "%" == ball.style.left && arrGameBallPositions[i].Y + "%" == ball.style.top){
                if(arrActiveBallState[i] == true){
                   arrActiveBallState[i] = false;
                   break;
                }else if(arrActiveBallState[i] == false){
                        arrActiveBallState[i] = true;
                        break;
                    }
            
            }

        }
    }
}
  
function addBallToBoard(name){
    let ballIteration = null;
    let ballposition = null;
    let ballstate = false;
    
    for(let i=0;i<=arrActiveBallState.length;i++){
        if(arrActiveBallState[i] == false){
            ballIteration = i;
            ballstate = true;
            break;
        }
    }
    if(ballstate == true){
        activeBallDestination = arrGameBallPositions[ballIteration];       
        arrActiveBallState[ballIteration] = true;
        ball = document.getElementById(activeBallInPlay.name);
        ball.style.left = arrGameBallPositions[ballIteration].X + "%";
        ball.style.top = arrGameBallPositions[ballIteration].Y + "%";
        ball.style.animationPlayState = 'paused';
    }
    return ballstate;
}


function redrawActiveBalls(){
    const selectedBallsTotal = document.getElementById('centerDisplay');
    const arrActiveBalls = document.body.querySelectorAll('[data-game-balls]');

    for(ballPosition of arrActiveBalls){
        if(ballPosition.style.animationPlayState == 'running'){
            let redrawBall = PoolBall;
            let lt,tp,tempnum,tempname;
            tempname = ballPosition.id;
            tempnum = ballPosition.innerText;
            tempnum = parseInt(tempnum);
            lt = ballPosition.style.left;
            tp = ballPosition.style.top;
            lt = lt.substring(0,lt.indexOf("%"));
            tp = tp.substring(0,tp.indexOf("%"));
            ballPosition.style.animationPlayState = 'paused';
            redrawBall.removeBall(ballPosition.id);
            redrawBall.mkBall(lt,tp,tempnum,tempname);
        }
    }
tempTotal = null;
selectedBallsTotal.innerHTML = "";
arrTempBallsCollection = [];
}

function cycleBall(){
    console.log("%cButton Pressed","color:green; font-weight:bold; background:yellow;")
    let ball = PoolBall;
    let btn = btnCycleBalls;
    let soundFX_cycleBall = new sound("./sounds/BREAK01.WAV");
    const ballsTotal = document.getElementById('totalBalls');

    if(soundState == true){       
        soundFX_cycleBall.play();
        //soundFX_cycleBall.removeSound();      
     }
    redrawActiveBalls();
   if(addBallToBoard(activeBallInPlay.name) == true){
        tempBallTotal = arrBallCollection.length;
        //ballsTotal.innerHTML = tempBallTotal;        
        
            activeBallInPlay = "";
            activeBallInPlay = arrBallCollection.shift();
            updateBallTotal()
        if(tempBallTotal > 0){    
            ball.mkBall(activeBallPosition.X,activeBallPosition.Y,activeBallInPlay.number,activeBallInPlay.name); 
        }else if(tempBallTotal <= 0){btn.remove()}

   }else{/**/
        ball.removeBall(activeBallInPlay.name);
        arrBallCollection.push(activeBallInPlay);
        activeBallInPlay = "";
        activeBallInPlay = arrBallCollection.shift();
        updateBallTotal()
        ball.mkBall(activeBallPosition.X,activeBallPosition.Y,activeBallInPlay.number,activeBallInPlay.name); 
   }

}

function ballSelected(name,value){
    //console.log("Name: %c"+ name + "%c Value: %c "+ value,  "color:lightgreen;","color:white;","color:lightgreen;");
    const selectedBallsTotal = document.getElementById('centerDisplay');
    let soundFx_selecBall = new sound("./sounds/STAPLER.WAV");
    let soundFx_ballIpocket = new sound("./sounds/BREAK02.WAV");
    let ball = document.getElementById(name);
    let pball = PoolBall;
    let isBallSelected = false;

    if(selectionConirfmation(name) == true){
        for(let tempBall of arrTempBallsCollection){ //check if ball is already selected
            if(tempBall.name == name){
                let ballPosition = document.getElementById(tempBall.name);
                let redrawBall = PoolBall;
                let lt,tp;
                lt = ballPosition.style.left;
                tp = ballPosition.style.top;
                lt = lt.substring(0,lt.indexOf("%"));
                tp = tp.substring(0,tp.indexOf("%"));
                ballPosition.style.animationPlayState = 'paused';
                redrawBall.removeBall(name);
                redrawBall.mkBall(lt,tp,tempBall.number,tempBall.name);
                if(tempTotal > 0)
                {
                    tempTotal = subtract(tempTotal, tempBall.number );
                    selectedBallsTotal.innerHTML = tempTotal;                    
                }
                isBallSelected = true;

                for(let i=0;i<=arrTempBallsCollection.length;i++){
                    if(arrTempBallsCollection[i].name == tempBall.name){
                        arrTempBallsCollection.splice(i,1);
                        break;
                    }
                }
            }
        }
        if(isBallSelected == false){
            arrTempBallsCollection.push(new objBallInformation(value,name));
                if(tempTotal == null){
                tempTotal = value;
                ball.style.animationPlayState = 'running';
                selectedBallsTotal.innerHTML = tempTotal;
                if(soundState == true){
                    //soundFx_selecBall.removeSound();
                    soundFx_selecBall.play();                    
                 }
                }else if(tempTotal < 11){
                tempTotal = add(tempTotal,value);
                if(tempTotal == 11){
                    //remove balls from arrBallCollection
                    if(soundState == true){
                        //soundFx_ballIpocket.removeSound();                    
                        soundFx_ballIpocket.play();
                    }
                    for(let balls of arrTempBallsCollection){
                        tallyScore(balls.name);
                        let ballPosition = document.getElementById(balls.name);
                        if(ballPosition.style.top == activeBallPosition.Y + "%" && ballPosition.style.left == activeBallPosition.X + "%"){
                            updateActiveBallState(balls.name);
                            pball.removeBall(balls.name);
                            activeBallInPlay = arrBallCollection.shift();
                            updateBallTotal();
                            pball.mkBall(activeBallPosition.X,activeBallPosition.Y,activeBallInPlay.number,activeBallInPlay.name);
                            isBoardCleared();
                        }else{
                            updateActiveBallState(balls.name);
                            pball.removeBall(balls.name);
                            isBoardCleared();
                        }                                        
                    }
                    //update score

                    //reset control values
                    tempTotal = null;
                    selectedBallsTotal.innerHTML = "";
                    arrTempBallsCollection = [];
                }else if(tempTotal > 11){
                    //un-select balls
                    for(let balls of arrTempBallsCollection){
                        let ballPosition = document.getElementById(balls.name);
                        ballPosition.style.animationPlayState = 'paused';
                    }
                    //clear selectedBallTotal
                    selectedBallsTotal.innerHTML = "";
                    //reset control values
                    tempTotal = null;
                    arrTempBallsCollection = [];
                }else{
                    selectedBallsTotal.innerHTML = tempTotal;
                    ball.style.animationPlayState = 'running';
                    if(soundState == true){
                       //soundFx_selecBall.removeSound();
                       soundFx_selecBall.play();
                       
                    }
                }
            } 
        }
    }
}

let PoolBall = {
    ballNumber: null,
    ballName: null,
    ballPosition: {X: null, Y: null},
    setBallName:function(Name){
        this.ballName = Name;
    },
    setBallPosition:function(x,y){
        this.ballPosition.X = x;
        this.ballPosition.Y = y;
    },
    setBallNumber:function(number){
        this.ballNumber = number;
    },
    setBallProperties:function(x,y,number,name){
        this.setBallPosition(x,y);
        this.setBallNumber(number);
        this.setBallName(name);
    },
    removeBall:function(ballId){
        let ball = document.getElementById(ballId);
        ball.parentNode.removeChild(ball);
    },
    mkBall:function(x,y,num,name){
        const parent = document.getElementById('gameInnerAreaContainer');
        this.setBallProperties(x,y,num,name);
        let node = document.createElement('div');
        let nodeChildNmber = document.createElement('div');
        let nodeChileHiBall = document.createElement('div');

        node.setAttribute('id',this.ballName);
        node.setAttribute('class','ball-item ' + getNumberStr(num) + '-ball');
        node.setAttribute('onClick', "ballSelected('" + this.ballName + "'" + "," + this.ballNumber + ")");
        node.setAttribute('style', 'top:' + this.ballPosition.Y +'%;left:' + this.ballPosition.X + '%; animation-play-state: paused;')
        node.setAttribute('data-game-balls','');

        nodeChildNmber.setAttribute('class','ball-number');
        nodeChildNmber.innerHTML = this.ballNumber
        nodeChileHiBall.setAttribute('class','' + getNumberStr(num) + '-hi-ball');

        if(num >= 9){            
            node.appendChild(nodeChileHiBall);
        }
        node.appendChild(nodeChildNmber);
        parent.appendChild(node);

    }
}

let btnCycleBalls = {
    remove:function(){
        let btn = document.getElementById('btnCycleBalls');
        btn.remove();
    },
    mkBtn:function(){
        const parent = document.getElementById('gameInnerAreaContainer');
        let node = document.createElement('button');
        node.setAttribute('id','btnCycleBalls');
        node.setAttribute('class','btn-item');
        node.setAttribute('onclick','cycleBall()');
        node.innerHTML = 'Cycle Balls';
        parent.appendChild(node);        
    }
}

let btnTakeTime = {
    remove:function(){
        let btn = document.getElementById('btnTakeTime');
        btn.remove();
    },
    mkBtn:function(){
        const parent = document.getElementById('timer');
        let node = document.createElement('button');
        node.setAttribute('id','btnTakeTime');
        node.setAttribute('class','btn-timer');
        node.setAttribute('onclick','takeTime()');
        node.innerHTML = 'Take Time';
        parent.appendChild(node);        
    }
}

let gameProgressSheet = {
    remove:function(){
        const doc = document.getElementById('progressSheet');
        doc.remove();
    },

    mkprogressSheet:function(isGameOver,header,content){
    const parent = document.getElementById('gameInnerAreaContainer');
    let node = document.createElement('div');
    let nodeChild = document.createElement('div');
    let nodeChildHeader = document.createElement('span');
    let nodeChildContent = document.createElement('div');
    let nodeChildBtn = document.createElement('button');
    let nodeChildCountDown = document.createElement('div');
    let nodeChildCountDownBkGrd = document.createElement('div');

    node.setAttribute('id','progressSheet');
    node.setAttribute('class','progress-sheet');
    
    nodeChild.setAttribute('id','sheetInformation');
    nodeChild.setAttribute('class','sheet-info');

    nodeChildHeader.setAttribute('id','sheetHeader');
    nodeChildHeader.setAttribute('class','sheet-header');
    nodeChildHeader.innerHTML = header;
    
    nodeChildContent.setAttribute('id','sheetContent');
    nodeChildContent.setAttribute('class','sheet-content');
    nodeChildContent.innerHTML = content;

    nodeChildBtn.setAttribute('id','btnRestart');
    nodeChildBtn.setAttribute('class','btn-restart');
    nodeChildBtn.setAttribute('onclick',"resetDisplay()");
    nodeChildBtn.innerHTML = 'New Game';

    nodeChildCountDownBkGrd.setAttribute('id','countDownBkGrd');
    nodeChildCountDownBkGrd.setAttribute('class','count-down-bkgrd');

    nodeChildCountDown.setAttribute('id','countDown');
    nodeChildCountDown.setAttribute('class','count-down');
   
      nodeChild.appendChild(nodeChildHeader);
      nodeChild.appendChild(nodeChildContent);
      if(isGameOver == true){
         nodeChild.appendChild(nodeChildBtn);
      }else if(isGameOver == false){
        //nodeChildCountDownBkGrd.appendChild(nodeChildCountDown);
        nodeChild.appendChild(nodeChildCountDownBkGrd);
      }
      node.appendChild(nodeChild);
      parent.appendChild(node);
    }
}    

let helpDocument = {
    helpDocName: "helpContainer",
    closeHelp:function(){
        let helpDoc = document.getElementById(this.helpDocName);
        helpDoc.remove();
    },
    mkHelpDoc:function(){
        const parent = document.getElementById('gameInnerAreaContainer');
        let node = document.createElement('div');
        let nodeChildFrame = document.createElement('iframe');
        let nodeBtnCloseHelp = document.createElement('button');

        node.setAttribute('id',this.helpDocName);
        node.setAttribute('class','help-doc');
    
        nodeChildFrame.setAttribute('id',this.helpDocName + 'Frame');
        nodeChildFrame.setAttribute('class','help-doc-frame');
        nodeChildFrame.setAttribute('title','Elevenball Help');
        nodeChildFrame.setAttribute('src','help.html');

        nodeBtnCloseHelp.setAttribute('id','btnClose');
        nodeBtnCloseHelp.setAttribute('class','help-doc-btn');
        nodeBtnCloseHelp.setAttribute('onclick','exitHelp()')
        nodeBtnCloseHelp.innerHTML = 'Close';

        node.appendChild(nodeChildFrame);
        node.appendChild(nodeBtnCloseHelp);
        parent.appendChild(node);
    }
}


/*Sound  */
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute('data-sound-FX','');
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
    this.removeSound = function(){
        let fx = document.getElementById(this.sound.id);
        fx.remove();
    }
  }
