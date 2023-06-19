const game = document.getElementById('game');
const actButton = document.getElementById('act');


class Snake {

    constructor() {
        this.headX;                     // Posição X da cabeça.
        this.headY;                     // Posição Y da cabeça.
        this.command = 'ArrowRight';    // Comando do movimento.
        this.lastCommand = '';          // Último comando realizado.
        this.body = [];                 // Posições das unidades do corpo da cobrinha.
        this.food = new Food();         // Referência para a instância Food.
        this.canGrowth = false;         // Informa se a cobrinha pode ou não crescer.
        this.isGaming = false;          // Informa se a cobrinha está em uma partida.
        this.interval;                  // Objeto que controla o intervalo do move().
        this.speed = 150;               // Velocidade da cobrinha (em míliseguindos),
        document.addEventListener('keydown', this.commander.bind(this));
        this.newGame();                 // Construir um novo jogo.
    }
    
    
    create(x, y) {
        const location = game.querySelector(`.x${x}.y${y}`);
        location.innerHTML = '<div class="snakeUnit"></div>';
        this.body.push([x,y]);
    }
    
    delete(x, y) {
        const location = game.querySelector(`.x${x}.y${y}`);
        const snakeUnit = location.children[0];
        if(snakeUnit) {
            snakeUnit.remove();
            this.body.shift();
        }
    }
    
    newGame() {
        clearInterval(this.interval);
        this.headX = 3;
        this.headY = 7;
        this.command = "ArrowRight";
        this.lastCommand = '';
        this.body = [];
        this.canGrowth = false;
        this.isGaming = false;
        const spaces = document.getElementsByClassName('space');
        for(let space of spaces) {
            space.innerHTML = '';
        }
        this.create(this.headX, this.headY);
        this.food.init();
    }

    checkMove(x, y) {
        // Se a cobrinha encostar na parede, então o jogo acaba.
        if(x < 0 || x >= 15 || y < 0 || y >= 15) {
            console.log("Game Over.");
            this.newGame();
            this.canGrowth = false;
            return;
        }
        // Selecinar o local onde a cobrinha quer andar.
        const location = game.querySelector(`.x${x}.y${y}`);
        // Se o local onde a cobrinha avançar for vazio, então ela só anda.
        if(location.children.length === 0) {
            this.canGrowth = false;
            return;
        }
        // Se location tem comida, então a comida soma, reaparece e a cobrinha cresce.
        if(location.children[0].classList.contains('foodUnit')) {
            this.food.eating();
            this.canGrowth = true;
            return;
        }
        // Se location tem o corpo da cobrinha, então o jogo acaba.
        if(location.children[0].classList.contains('snakeUnit')) {
            console.log("Game Over.");
            this.newGame();
            this.canGrowth = false;
            return;
        }
    }

    move() {
        const commandFunctions = {
            'ArrowUp': () => this.moveUp(),
            'ArrowRight': () => this.moveRight(),
            'ArrowDown': () => this.moveDown(),
            'ArrowLeft': () => this.moveLeft()
        };

        this.interval = setInterval(() => {
            const moveFunction = commandFunctions[this.command];
            if (moveFunction) {
                moveFunction();
                this.lastCommand = this.command;
                
                if (!this.canGrowth) {
                    this.delete(this.body[0][0], this.body[0][1]);
                }
                this.create(this.headX, this.headY);
            }
        }, this.speed);
    }

    moveUp() {
        this.checkMove(this.headX, this.headY - 1);
        this.headY -= 1;
    }
    moveRight() {
        this.checkMove(this.headX + 1, this.headY);
        this.headX += 1;
    }
    moveDown() {
        this.checkMove(this.headX, this.headY + 1);
        this.headY += 1;
    }
    moveLeft() {
        this.checkMove(this.headX - 1, this.headY);
        this.headX -= 1;
    }


    commander(event) {
        const moveKeys = new Map([
            ['ArrowUp', 'ArrowDown'],
            ['ArrowRight', 'ArrowLeft'],
            ['ArrowDown', 'ArrowUp'],
            ['ArrowLeft', 'ArrowRight']
        ]);
    
        const newCommand = moveKeys.get(event.key);
    
        if (!newCommand || newCommand !== this.lastCommand) {
            this.command = event.key;
        }
    }
}


class Food {
    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.scorePoints = 0;
        this.score = document.getElementById('score');
    }

    init() {
        this.score.textContent = '0';
        this.delete();
        this.create();
    }

    create() {
        const getRandomPosition = () => parseInt(Math.floor(Math.random() * 15));
        let accept = false;
        while(accept === false) {
            this.posX = getRandomPosition();
            this.posY = getRandomPosition();
            const location = game.querySelector(`.x${this.posX}.y${this.posY}`);
            if(location.children.length === 0) {
                location.innerHTML = '<div class="foodUnit"></div>';
                accept = true;
            }
        } 
    }

    delete() {
        const location = game.querySelector(`.x${this.posX}.y${this.posY}`);
        const foodUnit = location.children[0];
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
    document.addEventListener('keydown', (event) => {
        const startKey = ['ArrowUp', 'ArrowDown','ArrowRight', 'ArrowLeft'];
        if(startKey.includes(event.key) && snake.isGaming === false) {
            snake.isGaming = true;
            snake.move();
        }
    })
    
    buildTable();
    let snake = new Snake();
}

startGame();
