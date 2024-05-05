const gameWidth = 800;
const gameHeight = 600;

const keyShoot = 87;
const keyRight = 68;
const keyLeft = 65;

const state = { 
    xPos: 0, 
    yPos: 0, 
    cooldown: 0, 
    monsterCooldown: 0,
    monsterApples: [],
    apples: [], 
    monsters: [],
    monsterWidth: 64,
    numOfMonsters: 16,
    shoot: false, 
    moveRight: false, 
    moveLeft: false, 
    catWidth: 64,
    gameOver: false
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

//Määrab asukoha koordinaatide järgi
function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`;
}

//määrab pildi suuruse main akna sees
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


//Õunad(ehk kuulid)
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
        const appleRectangle = apple.$apple.getBoundingClientRect();
        const monsters = state.monsters;
        for (let j = 0; j < monsters.length; j++) {
            const monster = monsters[j];
            const monsterRectangle = monster.$monster.getBoundingClientRect();
            if(collideRect(monsterRectangle, appleRectangle)) {
                deleteApple(apples, apple, apple.$apple);
                const index = monsters.indexOf(monster);
                monsters.splice(index, 1);
                $container.removeChild(monster.$monster);
            }
        }
    }
}

//kollid
function createMonster($container, x, y) {
    const $monster = document.createElement("img");
    $monster.src = "img/koll.png";
    $monster.className = "monster";
    $container.appendChild($monster);
    const monsterCooldown = Math.floor(Math.random()*100);
    const monster = {x, y, $monster, monsterCooldown};
    state.monsters.push(monster);
    setSize($monster, state.monsterWidth);
    setPosition($monster, x, y);
}

function createMonsterApple($container, x, y) {
    const $monsterApple = document.createElement("img");
    $monsterApple.src = "img/madaOun.png";
    $monsterApple.className = "monsterApple";
    $container.appendChild($monsterApple);
    const monsterApple = {x, y, $monsterApple};
    state.monsterApples.push(monsterApple);
    setPosition($monsterApple, x, y);
}

function updateMonsterApple() {
    const monsterApples = state.monsterApples;
    for(let i = 0; i <monsterApples.length; i++) {
        const monsterApple = monsterApples[i];
        monsterApple.y += 2;
        if(monsterApple.y > gameHeight - 30) {
            deleteApple(monsterApples, monsterApple, monsterApple.$monsterApple);
        }
        const monsterAppleRectangle = monsterApple.$monsterApple.getBoundingClientRect();
        const catRectangle = document.querySelector(".player").getBoundingClientRect();
        if(collideRect(catRectangle, monsterAppleRectangle)) {
            state.gameOver = true;
        }
        setPosition(monsterApple.$monsterApple, monsterApple.x + state.monsterWidth / 2, monsterApple.y + 15);
    }
}

function updateMonsters($container) {
    // ~~~~~~~~~~~~~~ laenatud
    const dx = Math.sin(Date.now()/1000) * 40; 
    const dy = Math.cos(Date.now()/1000) * 30;
    const monsters = state.monsters;
    for(let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        var a = monster.x + dx - 20;
        var b = monster.y + dy - 50;
        setPosition(monster.$monster, a, b);
        if(monster.monsterCooldown == 0) {
            createMonsterApple($container, a, b);
            monster.monsterCooldown = Math.floor(Math.random()*50)+100;
        }
        monster.monsterCooldown -= 0.5;
    }
}

function createMonsters($container) {
    for(let i = 0; i <= state.numOfMonsters / 2; i++) {
        createMonster($container, i*80, 100);
    } for(let i = 0; i <= state.numOfMonsters / 2; i++) {
        createMonster($container, i*80, 180);
    }
}

//laenatud
function collideRect(rect1, rect2) {
    return!(rect2.left > rect1.right || rect2.right < rect1.left 
        ||rect2.top > rect1.bottom || rect2.bottom < rect1.top);
}

//MAIN uuendus
function update() {
    updatePlayer();
    updateApple($container);
    updateMonsters($container);
    updateMonsterApple();
    window.requestAnimationFrame(update); //iga framei tagant joonistab uue canvase

    if(state.gameOver) {
        document.querySelector(".lose").style.display = 'block';
    } if (state.monsters.length == 0) {
        document.querySelector(".win").style.display = 'block';
    }

}


//nupud
function keyPress(event) {
    if(!state.gameOver) {
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
createMonsters($container);
update();