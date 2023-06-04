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