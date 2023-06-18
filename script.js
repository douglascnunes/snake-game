const game = document.getElementById('game');
const actButton = document.getElementById('act');


class Snake {

    constructor(x, y, food) {
        this.headX = x;
        this.headY = y;
        this.command = 'ArrowRight';
        this.commandLastMov = '';
        this.body = [];
        document.addEventListener('keydown', this.commander.bind(this));
        this.food = food;
        this.start();
    }
    
    start() {
        this.create(this.headX, this.headY);
    }
    
    create(x, y) {
        const unit = document.createElement('div');
        unit.classList.add('snakeUnit');
        const location = game.getElementsByClassName(`x${x} y${y}`);
        location[0].appendChild(unit);
        this.body.push([x,y]);
    }
    
    delete(x, y) {
        const location = game.getElementsByClassName(`x${x} y${y}`);
        const snakeUnit = location[0].children[0];
        if(snakeUnit != null) {
            snakeUnit.remove();
            this.body.shift();
        }
    }
    
    reset() {
        const allSnakeUnits = document.getElementsByClassName('snakeUnit');
        for(let snakeUnit of allSnakeUnits) {
            snakeUnit.remove();
        }
        this.body = [];
        this.food.initScore();
        this.food.delete();
        this.headX = 3;
        this.headY = 7;
        this.start();
        this.command = "ArrowRight";
        this.commandLastMov = '';
    }

    checkMove(x, y, interval, growth) {
        console.log("x:"+x+"\ny:"+y)
        if(x < 0 || x >= 15 || y < 0 || y >= 15) {
            clearInterval(interval);
            console.log("Game Over.");
            this.reset();
            return;
        }
        const location = game.getElementsByClassName(`x${x} y${y}`);
        if(location[0].children.length === 0) {
            console.log("oi")
            return;
        }
        else {
            this.food.eating();
            return true;
        }
    }

    move() {
        let interval = setInterval(() => {
            let growth = false;
            if(this.command === 'ArrowUp') {
                growth = this.checkMove(this.headX, this.headY - 1, interval, growth);
                this.headY -= 1;
            }
            else if(this.command === 'ArrowRight') {
                growth = this.checkMove(this.headX + 1, this.headY, interval, growth);
                this.headX += 1;
            }
            else if(this.command === 'ArrowDown') {
                growth = this.checkMove(this.headX, this.headY + 1, interval, growth);
                this.headY += 1;
            }
            else {
                growth = this.checkMove(this.headX - 1, this.headY, interval, growth);
                this.headX -= 1;
            }
            this.commandLastMov = this.command;
            this.create(this.headX, this.headY);
            if(growth === false) {
                this.delete(this.body[0][0],this.body[0][1],);
            }
        }
        , 500);
    }

    commander(event) {
        const moveKeys = ['ArrowUp','ArrowRight','ArrowDown','ArrowLeft']
        if(!(event.key ==='ArrowUp' && this.commandLastMov === 'ArrowDown') &&
           !(event.key ==='ArrowDown' && this.commandLastMov === 'ArrowUp') &&
           !(event.key ==='ArrowRight' && this.commandLastMov === 'ArrowLeft') &&
           !(event.key ==='ArrowLeft' && this.commandLastMov === 'ArrowRight') ) {
            for (let key of moveKeys) {
                if(event.key === key) {
                    this.command = key;
                }
            }  
        }
    }

}


class Food {
    constructor(snakeBody) {
        this.posX = 0;
        this.posY = 0;
        this.scorePoints = 0;
        this.score = this.initScore();
    }

    initScore() {
        const score = document.getElementById('score');
        score.innerHTML = '0';
        return score;
    }

    create() {
        let accept = false;
        while(accept === false) {
            this.posX = parseInt(Math.floor(Math.random() * 15))
            this.posY = parseInt(Math.floor(Math.random() * 15))
            const location = game.getElementsByClassName(`x${this.posX} y${this.posY}`);
            if(location[0].children.length === 0) {
                const food = document.createElement('div');
                food.classList.add('foodUnit');
                location[0].appendChild(food);
                accept = true;
            }
        } 
    }

    delete() {
        const location = game.getElementsByClassName(`x${this.posX} y${this.posY}`);
        const foodUnit = location[0].children[0];
        if(foodUnit != null) {
            foodUnit.remove();
        }
    }

    eating() {
        this.delete();
        this.create();
        this.scorePoints++;
        this.score.innerText = this.scorePoints;
    }
}


const buildTable = () => {
    for(let y = 0; y < 15; y++) {
        for(let x = 0; x < 15; x++) {
            const space = document.createElement('div');
            space.classList.add('space');
            space.classList.add(`x${x}`);
            space.classList.add(`y${y}`);
            game.appendChild(space);
        }
    };
}

const startGame = () => {
    const actb = actButton.addEventListener('click', () => {
        console.log("Go!")
        snake.move();
        food.create();
    })
    
    buildTable();
    let food = new Food();
    let snake = new Snake(3, 7, food);
}


startGame();
