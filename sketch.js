const singlePlayer = true;
let ball,
    leftBar,
    rightBar,
    elements;

function setup() {
    createCanvas(windowWidth, windowHeight);

    elements = new elementsObject();
    ball = new ballObject();
    leftBar = new barObject('LEFT');
    rightBar = new barObject('RIGHT');
}

function draw() {
    background(0);

    for (let i = 0; i < ball.vel; i++) {
        leftBar.update();
        rightBar.update();
        if (ball.moving) {
            ball.update();
            ball.wallCollider();
            ball.barCollider();
        }
    }

    elements.show();
    leftBar.show();
    rightBar.show();
    ball.show();
}

class ballObject {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        const s = elements.size * 0.75;
        this.size = createVector(s, s);
        this.maxAng = PI / 3;
        this.sideStart = random(['RIGHT', 'LEFT']);
        this.startVel = width / 100; //min 1
        this.maxVel = width / 20;
        this.maxVel = (this.startVel > this.maxVel) ? this.startVel : this.maxVel;
        this.velInc = 1;
        this.throughLeft = false;
        this.throughRight = false;
        this.moving = false;
    }
    update() {
        this.pos.x += cos(this.ang);
        this.pos.y += sin(this.ang);
    }
    show() {
        noStroke();
        fill(255);
        rect(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y);
    }
    wallCollider() {
        if (this.pos.x <= this.size.x / 2) {
            ball.moving = false;
            elements.rightScore++;
            this.sideStart = 'RIGHT';
        }
        else if (this.pos.x >= width - this.size.x / 2) {
            ball.moving = false;
            elements.leftScore++;
            this.sideStart = 'LEFT';
        }
        if (this.pos.y <= this.size.y / 2 + elements.size || this.pos.y >= height - this.size.y / 2 - elements.size) {
            this.ang *= -1;
        }
    }
    barCollider() {
        if (ball.pos.x - ball.size.x / 2 <= leftBar.pos.x + leftBar.size.x / 2) {
            if (!this.throughLeft && ball.pos.y + ball.size.y / 2 >= leftBar.pos.y - leftBar.size.y / 2 && ball.pos.y - ball.size.y / 2 <= leftBar.pos.y + leftBar.size.y / 2) {
                this.ang = map((ball.pos.y - leftBar.pos.y), -leftBar.size.y / 2, leftBar.size.y / 2, -this.maxAng, this.maxAng);
                this.vel += this.velInc;
            }
            else {
                this.throughLeft = true;
            }
        }
        else {
            this.throughLeft = false;
        }
        if (ball.pos.x + ball.size.x / 2 >= rightBar.pos.x - rightBar.size.x / 2) {
            if (!this.throughRight && ball.pos.y + ball.size.y / 2 >= rightBar.pos.y - rightBar.size.y / 2 && ball.pos.y - ball.size.y / 2 <= rightBar.pos.y + rightBar.size.y / 2) {
                this.ang = PI - map((ball.pos.y - rightBar.pos.y), -rightBar.size.y / 2, rightBar.size.y / 2, -this.maxAng, this.maxAng);
                this.vel += this.velInc;
            }
            else {
                this.throughRight = true;
            }
        }
        else {
            this.throughRight = false;
        }
    }
    start() {
        this.ang = (this.sideStart == 'RIGHT') ? random(-this.maxAng, this.maxAng) : random(PI + this.maxAng, PI - this.maxAng);
        this.vel = this.startVel;
        ball.pos.x = width / 2;
        ball.pos.y = height / 2;
        ball.moving = true;
    }
}

class barObject {
    constructor(which) {
        const h = height / 8,
            margin = 50;
        this.size = createVector(elements.size, h);
        this.pos = createVector((which == 'LEFT') ? margin + this.size.x / 2 : width - margin - this.size.x / 2, height / 2);
        this.vel = 10;
        this.move = 'NONE'; //NONE, UP, DOWN
    }
    update() {
        if (singlePlayer) {
            this.pos.y = constrain(mouseY, this.size.y / 2 + elements.size, height - this.size.y / 2 - elements.size);
        }
        else if (this.move == 'UP') {
            this.pos.y = constrain(this.pos.y - (this.vel / ball.vel), this.size.y / 2 + elements.size, height - this.size.y / 2 - elements.size);
        }
        else if (this.move == 'DOWN') {
            this.pos.y = constrain(this.pos.y + (this.vel / ball.vel), this.size.y / 2 + elements.size, height - this.size.y / 2 - elements.size);
        }
    }
    show() {
        noStroke();
        fill(255);
        rect(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y);
    }
}

class elementsObject {
    constructor() {
        this.size = ceil(min(width, height) / 40);
        this.leftScore = 0;
        this.rightScore = 0;
    }
    show() {
        noStroke();
        fill(255);

        rect(0, 0, width, this.size);
        rect(0, height - this.size, width, height);

        const h = height - 2 * this.size,
            nFloor = floor((h - this.size) / (2 * this.size)),
            gap = (h - nFloor * this.size) / (nFloor + 1),
            n = (h - gap) / (this.size + gap);

        for (let i = 0; i < n; i++) {
            square((width - this.size) / 2, this.size + gap + (this.size + gap) * i, this.size);
        }

        textFont('Courier New');
        textSize(5 * this.size);
        textStyle(BOLD);
        textAlign(RIGHT);

        const scalar = 0.8;

        text(this.leftScore, width / 2 - this.size * 3, this.size * 3 + (textAscent() * scalar));

        textAlign(LEFT);

        text(this.rightScore, width / 2 + this.size * 3, this.size * 3 + (textAscent() * scalar));
    }
}

function keyPressed() {
    if (keyCode === 87) //w
    {
        leftBar.move = 'UP';
    }
    else if (keyCode === 83) //s
    {
        leftBar.move = 'DOWN';
    }

    if (keyCode === UP_ARROW) {
        rightBar.move = 'UP';
    }
    else if (keyCode === DOWN_ARROW) {
        rightBar.move = 'DOWN';
    }

    if (keyCode === 32 && !ball.moving) //space
    {
        ball.start();
    }
}

function keyReleased() {
    if (keyCode === 87 /*w*/ || keyCode === 83 /*s*/) {
        leftBar.move = 'NONE';
    }

    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        rightBar.move = 'NONE';
    }
}

function mousePressed() {
    if (!ball.moving) {
        ball.start();
    }
}