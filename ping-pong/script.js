const canvas = document.getElementsByTagName('canvas')[0];
const context = canvas.getContext('2d');
const dt = 1.05;
var score1 = document.querySelector('.score .player-1');
var score2 = document.querySelector('.score .player-2');
var scoreBoard = document.querySelector('.score');

class AudioController{
    constructor(){
        this.hitWall = new Audio('sounds/wall.mp3');
        this.hitPlayer = new Audio('sounds/hit.mp3');
        this.userScore = new Audio('sounds/userScore.mp3');
        this.comScore = new Audio('sounds/comScore.mp3');
    }
    hitWallSound(){
        this.hitWall.play();
    }
    hitPlayerSound(){
        this.hitPlayer.play();
    }
    userScoreSound(){
        this.userScore.play();
    }
    comScoreSound(){
        this.comScore.play();
    }
}

class Vect{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class Rect{
    constructor(width, height){
        this.pos = new Vect;
        this.size = new Vect(width, height);
    }
    drawRect(){
        context.beginPath();
        context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        context.fillStyle = 'white';
        context.fill();
    }
}

class Ball extends Rect{
    constructor(){
        super(4, 4);
        this.v = new Vect;
    }
    collidingWall(){
        if(ball.pos.x < 0 || ball.pos.x > canvas.width-ball.size.x){
            audioController.hitWallSound();
            scored();
            reset();
            ball.v.x = - ball.v.x;
        }
        if(ball.pos.y < 0 || ball.pos.y > canvas.height-ball.size.y){
            audioController.hitWallSound();
            ball.v.y = - ball.v.y;
        }
    }
}

class Player extends Rect{
    constructor(){
        super(5, 40);
        this.score = 0;
    }
}

const ball = new Ball;
ball.pos.x = canvas.width/2 - ball.size.x/2;
ball.pos.y = canvas.height/2 - ball.size.y/2;

const players = [new Player, new Player];
const audioController = new AudioController;

function drawPlayers(){
    players.forEach(player => player.drawRect());
    autoMove();
}

players[0].pos.x = 2;
players[1].pos.x = canvas.width - players[0].pos.x - players[1].size.x;
players[0].pos.y = canvas.height/2 - players[0].size.y/2;
players[1].pos.y = canvas.height/2 - players[1].size.y/2;

function collidingPlayer(player, ball){
    if(player.pos.x <= ball.pos.x + ball.size.x){
        if(player.pos.x + player.size.x >= ball.pos.x){
            if(player.pos.y <= ball.pos.y + ball.size.y){
                if(player.pos.y + player.size.y >= ball.pos.y - ball.size.y){
                    audioController.hitPlayerSound();
                    ball.v.x = - ball.v.x;
                    ball.v.x *= dt;
                    ball.v.y = 3 * Math.random();
                }
            }
        }
    }
}

function scored(){
    if(ball.v.x < 0){
        players[1].score++;
        score2.innerHTML = players[1].score;
        audioController.comScoreSound();
    }
    else{
        players[0].score++;
        score1.innerHTML = players[0].score;
        audioController.userScoreSound();
    }
    scoreBoard.classList.add('show');
}

function reset(){
    ball.pos.x = canvas.width/2 - ball.size.x/2;
    ball.pos.y = canvas.height/2 - ball.size.y/2;
    ball.v.x = 0;
    ball.v.y = 0;
}

function autoMove(){
    players[1].pos.y = ball.pos.y - players[1].size.y/2;
}

function drawCanvas(){
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fill();
}

scoreBoard.addEventListener('click', start);

function start(){
    scoreBoard.classList.remove('show');
    setTimeout(() => {
        ball.v.x = 3 * (Math.random() > 0.5 ? 1 : -1);
        ball.v.y = 2 * (Math.random() > 0.5 ? 1 : -1);
    }, 700);
}

function update() {
    drawCanvas();
    ball.drawRect();
    ball.pos.x += ball.v.x;
    ball.pos.y += ball.v.y;
    ball.collidingWall();
    drawPlayers();
    players.forEach(player => collidingPlayer(player, ball));
}

canvas.addEventListener('mousemove', function(e){
    const scale = e.offsetY / e.target.getBoundingClientRect().height;
    players[0].pos.y = canvas.height * scale - players[0].size.y/2;
})

function animate(){
    window.requestAnimationFrame(animate);
    update();
}

animate();