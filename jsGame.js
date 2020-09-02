//DOMContentLoader is added to make sure that JS is read after all the code in the HTML file has been read. 
document.addEventListener('DOMContentLoaded', () => {
//we will use js inbuilt method querySelector to look through HTML and find '.grid' class or element
//this way in future if we use grid js will know we are refering to thr grid class or element
const grid = document.querySelector('.grid')
const miniGrid = document.querySelector('.miniGrid')

//with querySelectorAll js inbuilt method we will be accesing all the divs in .grid class
//inbuilt js method array.form, with this we will push in all the divs and make an array
//with each div having index from 0 to n
let squares = Array.from(document.querySelectorAll('.grid div'))
//console.log(squares.length)
//console.log(miniGridSquares)

//we are using '#' to find specific id
const displayScore = document.querySelector('#score')
const startButton = document.querySelector('#startBtn')
let timerId
let score = 0

//we will tell our js the width of the grid and squares
const width = 10

//code for tetrominoes start from here

//array of L shape Tetromino all rotations
const lTetromino = [
    [1,width+1,width*2+1,2],
    [width,width+1,width+2,width*2+2],
    [1,width+1,width*2+1,width*2],
    [width,width*2,width*2+1,width*2+2]
]

//array of Z shape Tetromino all rotations
const zTetromino = [
    [width*2,width*2+1,width+1,width+2],
    [0,width,width+1,width*2+1],
    [width*2,width*2+1,width+1,width+2],
    [0,width,width+1,width*2+1]
]

//array of T shape Tetromino all rotations
const tTetromino = [
    [width,width+1,width+2,1],
    [1,width+1,width*2+1,width+2],
    [width,width+1,width+2,width*2+1],
    [1,width+1,width*2+1,width]
]

//array of Square shape Tetromino all rotations
const sqTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

//array of | shape Tetromino all rotations
const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

//array of all the individual shaped tetramino shaped array
const theTetromino = [lTetromino,zTetromino,tTetromino,sqTetromino,iTetromino]

//setting the current position in the grid
let currentPosition = 4

//setting a variable to select the curreunt roation of tetromino
let currentRoation = 0;

//miniGrid
const mgWidth = 4
//upcoming tetrominos
const upNextTetromios = [
    [1,mgWidth+1,mgWidth*2+1,2], //L_tetromino
    [0,mgWidth,mgWidth+1,mgWidth*2+1], //Z_tetromino
    [1,mgWidth,mgWidth+1,mgWidth+2], //T_tetromino
    [0,1,mgWidth,mgWidth+1], //O_tetromino
    [1,mgWidth+1,mgWidth*2+1,mgWidth*3+1] //i_tetromino
]

let RandNextTetromino = Math.floor(Math.random()*upNextTetromios.length)

//hardcoded slection of tetromino
//selecting a tetromino, theTetromino[0] will select ltetromino, 1st from the array and 
// the tetromino[0][0] will give lTetromino first rotation from the array.
/* code----------- */ // let currentTetromino = theTetromino[0][0];
//console.log(theTetromino[0][0])
//******************************************************************************************//
//here we are using js inbuilt methods, Math.random and length, which will give a random number from our array length
//theTetromino array length which we can get by writing theTetromino.length 
//fianly with yet another js inbuilt method Math.floor which will round our result to nearest interger
let randomT = Math.floor(Math.random()*theTetromino.length)
//console.log(random)

let currentTetromino = theTetromino[randomT][currentRoation];
//console.log(currentTetromino)

//function for drawing the tetromino
function drawTetramino(){
    currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        //console.log(currentPosition + index)
    })
}
//drawTetramino()

//function to erase the tetromino drawn by the draw function
function eraseTetramino(){
    currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}
//eraseTetramino()

//to move tetromino move down every second
//timerId = setInterval(moveDown,500)

//keyboard controls 
function keyControl(e){
    if(e.keyCode == 37){
        //moveleft
        moveLeft()
    }
    else if(e.keyCode == 38){
        //rotate
        rotate()
    }
    else if(e.keyCode == 39){
        //moveright
        moveRight()
    }
    else if(e.keyCode == 40){
        //moveDownFaster
        moveDown()
        
    }
}
document.addEventListener('keyup',keyControl)

//function to move down the tetrominos
function moveDown(){
    eraseTetramino()
    currentPosition += width
    drawTetramino()
    freeze()
}

//freeze function
//with the help of this function we are stopping the tetrominos to go off the screen from below and giving 
//something similar to hard ground to stand on so they don't keep falling
//we are using and inbuilt function called some, which works like OR where even if the condition for atleast one is true
//condition will be fulfilled and function will be executed
function freeze(){
    if(currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        //if the coloumn grid below is div with class taken, then it will execute this function
        //here it will change each of the squares (divs) to class taken so that next shape can stand on this shape
        currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //here we will make new tetromino and make is fall down
        //randomT = Math.floor(Math.random() * theTetromino.length)
        randomT = RandNextTetromino
        RandNextTetromino = Math.floor(Math.random()*upNextTetromios.length)
        currentTetromino = theTetromino[randomT][currentRoation]
        currentPosition = 4
        drawTetramino() 
        mgDraw()
        addScore()
        gameOver()
    }
}

//move tetrominos to left direction
function moveLeft(){
    //todo: problem with l shaped tetromino ****************
    eraseTetramino()
    const leftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)
    if(!leftEdge){
        currentPosition -= 1;
    }
    if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition += 1;
    }
    drawTetramino()
}

// move tetromino to right direction
function moveRight(){
    //TODO: problemwith l shaped tetramino *****************************************
    eraseTetramino()
    const rightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1)
     if(!rightEdge){
         currentPosition += 1;
     }
     if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
         currentPosition -= 1
     }
     drawTetramino()
}

//rotate the tetromino
function rotate(){
    eraseTetramino()
    currentRoation ++
    if(currentRoation >= currentTetromino.length){
        currentRoation = 0
    }
    currentTetromino = theTetromino[randomT][currentRoation]
    drawTetramino()
}

let miniGridSquares = Array.from(document.querySelectorAll('.miniGrid div'))

//setting the current position in the miniGrid
let mgCurrPos = 0

//drawing upcoming tetromino on the minigrid
function mgDraw(){
    let mgTetromino = upNextTetromios[RandNextTetromino]
    //remove anytrace of tetromino from the mini grid

    miniGridSquares.forEach(square=>{
        square.classList.remove('mTetromino')
    })

    mgTetromino.forEach(item => {
        miniGridSquares[mgCurrPos + item].classList.add('mTetromino')
    })
}


// add function to button
startButton.addEventListener('click', () => {
    if(timerId){
        clearInterval(timerId)
        timerId = null
    }
    else{
        drawTetramino()
        timerId = setInterval(moveDown, 1000)
        RandNextTetromino = Math.floor(Math.random()*upNextTetromios.length)
        mgDraw()
    }
})

//display score
function addScore(){
    for(let i = 0; i < 199; i++){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        console.log(row)

        if(row.every(index => squares[index].classList.contains('taken'))){
            score += 10
            displayScore.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const squares_removed = squares.splice(i,width)
            squares = squares_removed.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}


//game over
function gameOver(){
    if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
        displayScore.innerHTML = 'end'
        clearInterval(timerId)
    }
}

})