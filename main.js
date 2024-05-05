const gameWidth = 800;
const gameHeight = 600;

const keyShoot = 87;
const keyRight = 68;
const keyLeft = 65;

const state = {xPos: 0, yPos: 0, moveRight : false, moveLeft : false, catWidth: 64}

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

function updatePlayer() {
    if(state.moveLeft && state.xPos >= 5) {
        state.xPos -= 8;
    }
    if (state.moveRight && state.xPos <= 725) {
        state.xPos += 8;
    }
    const $player = document.querySelector(".player");
    setPosition($player, state.xPos, state.yPos);
}

function update() {
    updatePlayer();

    window.requestAnimationFrame(update); //iga framei tagant joonistab uue canvase

}


//nupud
function keyPress(event) {
    if(event.keyCode === keyRight) {
        console.log("parem");
        state.moveRight = true;
    }
    else if(event.keyCode === keyLeft) {
        console.log("vasak");
        state.moveLeft = true;
    }
}

function keyRelease(event) {
    if(event.keyCode === keyRight) {
        state.moveRight = false;
    }
    else if(event.keyCode === keyLeft) {
        state.moveLeft = false;
    }
}

//listenerid
window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyRelease);

//MÄNG
const $container = document.querySelector(".main");
createPlayer($container);
update();