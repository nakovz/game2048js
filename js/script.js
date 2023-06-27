var gameSize = 4;
var tiles = new Array(gameSize*gameSize).fill(0);
var directions = ['Up', 'Right', 'Down', 'Left'];
var score = 0;
var GameGoalTile = 2048;
var isThereGoalTile = { value: false, messageShow: false };

const NewGame = nSize => {
    gameSize = nSize;
    tiles = new Array(gameSize*gameSize).fill(0);
    score = 0;
    isThereGoalTile = { value: false, messageShow: false };
    InitGame();
}

const isGameOver = () => {
    // Up-Left corner
    if (tiles[0] === 0) return false;
    if (tiles[0] === tiles[1]) return false;
    if (tiles[0] === tiles[gameSize]) return false;
    // Up-Right corner
    if (tiles[gameSize-1] === 0) return false;
    if (tiles[gameSize-1] === tiles[gameSize-2]) return false;
    if (tiles[gameSize-1] === tiles[2*gameSize-1]) return false;
    // Down-Rigth corner
    if (tiles[gameSize*gameSize-1] === 0) return false;
    if (tiles[gameSize*gameSize-1] === tiles[gameSize*gameSize-2]) return false;
    if (tiles[gameSize*gameSize-1] === tiles[(gameSize-1)*gameSize-1]) return false;
    // Down-Left corner
    if (tiles[(gameSize-1)*gameSize] === 0) return false;
    if (tiles[(gameSize-1)*gameSize] === tiles[(gameSize-1)*gameSize+1]) return false;
    if (tiles[(gameSize-1)*gameSize] === tiles[(gameSize-2)*gameSize]) return false;
    // Check inner grid for neighbor with same value or 0
    for (let t=gameSize+1; t<(gameSize-1)*gameSize-1; t++){
        // Do not check edges
        if ((t+1) % gameSize === 0) t = t+2;
        if (tiles[t] === 0) return false;
        if (tiles[t] === tiles[t+1] || tiles[t+1] === 0) return false;
        if (tiles[t] === tiles[t-1] || tiles[t-1] === 0) return false;
        if (tiles[t] === tiles[t-gameSize] || tiles[t-gameSize] === 0) return false;
        if (tiles[t] === tiles[t+gameSize] || tiles[t+gameSize] === 0) return false;
    }
    //check edges
    for (let t=1; t<(gameSize-2); t++){
        if (tiles[t] === 0) return false;
        if (tiles[t] === tiles[t+1] || tiles[t+1] === 0) return false;
        if (tiles[(gameSize-1)*gameSize+t] === 0) return false;
        if (tiles[(gameSize-1)*gameSize+t] === tiles[(gameSize-1)*gameSize+t+1] || tiles[(gameSize-1)*gameSize+t+1] === 0) return false;
                
        if (tiles[(t+1)*gameSize-1] === 0) return false;
        if (tiles[(t+1)*gameSize-1] === tiles[(t+2)*gameSize-1] || tiles[(t+2)*gameSize-1] === 0) return false;
        if (tiles[t*gameSize] === 0) return false;
        if (tiles[t*gameSize] === tiles[(t+1)*gameSize] || tiles[(t+1)*gameSize] === 0) return false;        
    }
    return true;
}

const DrawGame = () => {
    const gameBoard = document.querySelector(".game-grid");
    let sHtml = '';
    for(let tile=0; tile<tiles.length; tile++) {
        let tileValue = tiles[tile]==0 ? '' : tiles[tile];
        sHtml += `<div class="tile tile-${tiles[tile]}" data-tile="${tile}">${tileValue}</div>`;
    }
    gameBoard.innerHTML = sHtml;
    document.querySelector(".score").innerHTML = score;
    if(isThereGoalTile.value && !isThereGoalTile.messageShow){
        alert("You Won!");
        isThereGoalTile.messageShow = !isThereGoalTile.messageShow;
    }
    if(isGameOver()){
        alert('Game Over!');
    }
}

const GetAvailablePositions = () => {
    const availablePosition = [];
    tiles.forEach((tile, index) => {
        if (tile === 0) {
            availablePosition.push(index);
        }
    })
    return availablePosition;
}

const GetValidPosition = () => {
    const availablePosition = GetAvailablePositions();
    let newPosition = availablePosition[Math.floor(Math.random() * availablePosition.length)];
    return newPosition;
}

const GetRandom2or4 = () => {
    let randomValue = (Math.floor(Math.random() * 4) + 1);
    return randomValue < 4 ? 2 : 4;
}

const InitGame = () => {
    const gameBoard = document.querySelector(".game-grid");
    if (gameBoard) {
        gameBoard.style.gridTemplateColumns = '1fr '.repeat(gameSize);
        gameBoard.innerHTML = '<div class="tile"></div>'.repeat(gameSize*gameSize);
        tiles[GetValidPosition()] = GetRandom2or4();
        tiles[GetValidPosition()] = GetRandom2or4();
        DrawGame();
    }
}

const GetArrayOfTiles = (data,direction='Left') => {
    const columns = [];
    for(let col=0; col<gameSize; col++) {
        let column = []
        for(let row=0; row < gameSize; row++) {
            let cell = row + col*gameSize;
            if (direction == 'Up' || direction == 'Down') cell = row*gameSize + col;
            column.push(data[cell]);
        }
        column = PushZeroToRigth(column,direction);
        columns.push(column);
    }
    return columns;
}

const PushZeroToRigth = (arr,direction) => {
    let numbersArry = arr.filter(a => a > 0);
    if (direction == 'Down' || direction == 'Right') numbersArry = numbersArry.reverse();
    return numbersArry.concat(arr.filter(a => a == 0));
}

const SumTiles = (columns,direction='Up') => {
    const newColumns = [];
    columns.forEach(col => {
        if (col.length>1) {
            for(let t=0; t<col.length-1; t++) {
                if (col[t] === col[t+1]) {
                    col[t] = col[t] + col[t+1];
                    if (col[t] === GameGoalTile) {
                        isThereGoalTile.value = true;
                    }
                    score += col[t];
                    col[t+1] = 0;
                }
            }
            col = PushZeroToRigth(col);
            if (direction == 'Down' || direction == 'Right') col = col.reverse();
            newColumns.push(col);
        }
    });
    return newColumns;
}

const TilesArray2GridArray = (columns, direction) => {
    const data = [];
    for(let t=0; t<gameSize*gameSize; t++){
        let cellX = Math.floor(t/gameSize); 
        let cellY = t % gameSize;
        if (direction == 'Up' || direction == 'Down') {
            cellX = t % gameSize;
            cellY = Math.floor(t/gameSize);
        }
        data.push(columns[cellX][cellY]);
    }
    return data;
}

const CompareTiles = (a, b) => a.every((element, index) => element === b[index] );

const MoveTiles = indexDirection => {
    const direction = directions[indexDirection]
    const oldTiles = tiles;
    tiles = TilesArray2GridArray(SumTiles(GetArrayOfTiles(tiles,direction),direction),direction);
    if (!CompareTiles(oldTiles,tiles)) {
        const validPosition = GetValidPosition();
        if (validPosition || validPosition === 0) {
            tiles[validPosition] = GetRandom2or4();
            DrawGame();
        } 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    NewGame(4);
    document.addEventListener("keydown",(event) => {
        const keyMapper = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
        const keyIndex = keyMapper.indexOf(event.code);
        if (keyIndex>=0) {
            MoveTiles(keyIndex);
        }
    });
});