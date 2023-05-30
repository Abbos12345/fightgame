const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.6; 


class Sprite{
    constructor({position, velocity, color = 'red', offset}){
        this.position = position;
        this.velocity = velocity;
        this.height = 160;
        this.width = 60;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100, 
            height: 50
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    draw(){
        // hero
        c.fillStyle = this.color;  
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attackBox
        if(this.isAttacking){
            c.fillStyle = 'green';
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            );
        }
    }

    upgrade(){
        this.draw()
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.height + this.position.y + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        } else{
            this.velocity.y += gravity;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(()=>{
            this.isAttacking = false;
        }, 100)
    }
}

const player1 = new Sprite({
    position:{
       x: 0,
       y: 0 
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
    
})

const player2 = new Sprite({
    position:{
        x: 500,
        y: 0 
     },
     velocity:{
         x: 0,
         y: 0
     },
     color: 'blue',
     offset: {
        x: 40,
        y: 0
     }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rectangular1, rectangular2 }) {
    return (
        rectangular1.attackBox.position.x + rectangular1.attackBox.width >= rectangular2.position.x && 
        rectangular1.attackBox.position.x <= rectangular2.position.x + rectangular2.width &&
        rectangular1.attackBox.position.y + rectangular1.attackBox.height >= rectangular2.position.y &&
        rectangular1.attackBox.position.y <= rectangular2.position.y + rectangular2.height
    )
}

function determineWinner({player1, player2, timerId}){
    clearTimeout(timerId);
    document.querySelector('#result').style.display = 'flex';
    if(player1.health === player2.health){
        document.querySelector('#result').innerHTML = 'Tie';
    } else if(player1.health > player2.health){
        document.querySelector('#result').innerHTML = 'Player 1 Wins';
    } else if(player1.health < player2.health){
        document.querySelector('#result').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId;

function decreaseTimer() {
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if(timer === 0){
        determineWinner({player1, player2, timerId})
    }
}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = "purple";
    c.fillRect(0, 0, canvas.width, canvas.height)
    player1.upgrade();
    player2.upgrade();

    player1.velocity.x = 0;
    player2.velocity.x = 0;

    // player1
    if(keys.a.pressed && player1.lastKey === 'a'){
        player1.velocity.x = -1;
    } else if(keys.d.pressed && player1.lastKey === 'd'){
        player1.velocity.x = 1;
    } 

    // player2 
    if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
        player2.velocity.x = -1;
    } else if(keys.ArrowRight.pressed && player2.lastKey === "ArrowRight"){
        player2.velocity.x = 1;
    } 

    // collision
    if(
        rectangularCollision({
            rectangular1: player1,
            rectangular2: player2
        }) &&
        player1.isAttacking
    )
        {
            player1.isAttacking = false; 
            document.getElementById('player-two__health').style.width = player2.health + '%';
            player2.health -= 10;
            console.log('collision')
    }

    if(
        rectangularCollision({
            rectangular1: player2,
            rectangular2: player1
        }) &&
        player2.isAttacking
    )
        {
            player2.isAttacking = false; 
            document.getElementById('player-one__health').style.width = player1.health + '%';
            player1.health -= 10;
            console.log('Player2 is attacking')
    }

    // End game according to health == 0
    if(player1.health <= 0 || player2.health <= 0){
        determineWinner({player1, player2, timerId})
    }
}

animate()


window.addEventListener('keydown', (event) => {
    console.log(event.key);

    switch(event.key){
        case 'd': keys.d.pressed = true;
        player1.lastKey = 'd';
        break;

        case 'a': keys.a.pressed = true;
        player1.lastKey = 'a';
        break; 

        case 'w': player1.velocity.y = -10;
        break;

        case 'x': player1.attack();
        break;


        case 'ArrowRight': keys.ArrowRight.pressed = true;
        player2.lastKey = 'ArrowRight';
        break;

        case 'ArrowLeft': keys.ArrowLeft.pressed = true;
        player2.lastKey = 'ArrowLeft';
        break; 

        case 'ArrowUp': player2.velocity.y = -10;
        break;

        case 'ArrowDown': player2.attack();
        break;
    }
})

window.addEventListener('keyup', (event) => {
    console.log(event.key);

    switch(event.key){
        // player1
        case 'd': keys.d.pressed = false;
        break;

        case 'a': keys.a.pressed = false;
        break; 
    }

    // player 2 
    switch(event.key){
        case 'ArrowRight': keys.ArrowRight.pressed = false;
        break;

        case 'ArrowLeft': keys.ArrowLeft.pressed = false;
        break; 
    }
})





