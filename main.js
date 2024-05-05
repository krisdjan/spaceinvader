const gameWidth = 800;
const gameHeight = 600;

const keyShoot = 87;
const keyRight = 68;
const keyLeft = 65;

const state = { 
    xPos: 0, 
    yPos: 0, 
    cooldown: 0, 
    apples: [], 
    shoot: false, 
    moveRight: false, 
    moveLeft: false, 
    catWidth: 64 
}

//Mängija
function createPlayer($container) {
    state.xPos = gameWidth / 2;
    state.yPos = gameHeight - 70;
    const $player = document.createElement("img");
    $player.src = "img/gleb.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, state.xPos, state.yPos);
    setSize($player, state.catWidth);
}

//Määrab mängija asukoha koordinaatide järgi
function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`;
}

//määrab mängija pildi suuruse main akna sees
function setSize($element, width) {
    $element.style.width = `${width}px`;
    $element.style.height = "auto";
}

function deleteApple(apples, apple, $apple) {
    const index = apples.indexOf(apple);
    apples.splice(index, 1);
    $container.removeChild($apple);
}

function createApple($container, x, y) {
    const $apple = document.createElement("img");
    $apple.src = "img/oun.png";
    $apple.className = "apple";
    $container.appendChild($apple);
    const apple = {x, y, $apple};
    state.apples.push(apple);
    setPosition($apple, x, y);
}

function updateApple($container) {
    const apples = state.apples;
    for(let i = 0; i < apples.length; i++) {
        const apple = apples[i];
        apple.y -= 2;
        if(apple.y < 0) {
            deleteApple(apples, apple, apple.$apple);
        }
        setPosition(apple.$apple, apple.x, apple.y);
    }
}

function updatePlayer() {
    if(state.moveLeft && state.xPos >= 5) {
        state.xPos -= 8;
    }
    if (state.moveRight && state.xPos <= 725) {
        state.xPos += 8;
    }
    if(state.shoot && state.cooldown == 0) {
        createApple($container, state.xPos - state.catWidth / 2, state.yPos);
        state.cooldown = 10;
    }
    const $player = document.querySelector(".player");
    setPosition($player, state.xPos, state.yPos);
    if(state.cooldown > 0) {
        state.cooldown -= 0.5;
    }
}

//MAIN UPDATE
function update() {
    updatePlayer();
    updateApple($container);

    window.requestAnimationFrame(update); //iga framei tagant joonistab uue canvase

}


//nupud
function keyPress(event) {
    if(event.keyCode === keyRight) {
        // console.log("parem");
        state.moveRight = true;
    }
    else if(event.keyCode === keyLeft) {
        // console.log("vasak");
        state.moveLeft = true;
    } else if (event.keyCode == keyShoot) {
        // console.log("lask");
        state.shoot = true;
    }
}

function keyRelease(event) {
    if(event.keyCode === keyRight) {
        state.moveRight = false;
    }
    else if(event.keyCode === keyLeft) {
        state.moveLeft = false;
    } else if (event.keyCode === keyShoot) {
        state.shoot = false;
    }
}

//listenerid
window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyRelease);

//MÄNG
const $container = document.querySelector(".main");
createPlayer($container);
update();