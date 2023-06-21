
var gameSize = 4;
var tiles = new Array(gameSize*gameSize).fill(0);
var directions = ['Up', 'Right', 'Down', 'Left'];
var score = 0;

const DrawGame = () => {
    const gameBoard = document.querySelector(".game-grid");
    let sHtml = '';
    for(let tile=0; tile<tiles.length; tile++) {
        let tileValue = tiles[tile]==0 ? '' : tiles[tile];
        sHtml += `<div class="tile tile-${tiles[tile]}" data-tile="${tile}">${tileValue}</div>`;
    }
    gameBoard.innerHTML = sHtml;
    document.querySelector(".score").innerHTML = score;
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
    let randomValue = (Math.floor(Math.random() * 2) + 1) * 2;
    return randomValue;
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

const GetColumnsX = (data) => {
    const columns = [];
    for(let col=0; col<gameSize; col++) {
        // columns.push(data.slice(col*gameSize,(col+1)*gameSize)); // get rows
        let column = []
        for(let row=0; row < gameSize; row++) {
            column.push(data[row*gameSize + col]);
        }
        column = PushZeroToRigth(column);
        columns.push(column);
    }
    return columns;
}

const PushZeroToRigth = arr => {
    return arr.filter(a => a > 0).concat(arr.filter(a => a == 0));
}

const SumColumnsUp = columns => {
    const newColumns = [];
    columns.forEach(col => {
        if (col.length>1) {
            for(let t=0; t<col.length-1; t++) {
                if (col[t] === col[t+1]) {
                    col[t] = col[t] + col[t+1];
                    score += col[t];
                    col[t+1] = 0;
                }
            }
            col = PushZeroToRigth(col);
            newColumns.push(col);
        }
    });
    return newColumns;
}

const ColumnsToArray = columns => {
    const data = [];
    for(let t=0; t<gameSize*gameSize; t++){
        data.push(columns[t % gameSize][Math.floor(t/gameSize)]);
    }
    return data;
}

const MoveTilesUp = () => {
    tiles = ColumnsToArray(SumColumnsUp(GetColumnsX(tiles)));
}

// const CompareStates = (a, b) => a.every((element, index) => element === b[index] );

const MoveTiles = direction => {
    switch (directions[direction]) {
        case 'Up':
            MoveTilesUp();
            break;
        // case 'Right':
        //     MoveTilesRight();
        //     break;
        // case 'Down':
        //     MoveTilesDown();
        //     break;
        // case 'Left':
        //     MoveTilesLeft();
        //     break;                
    }
    const validPosition = GetValidPosition();
    if (validPosition) {
        tiles[validPosition] = GetRandom2or4();
        DrawGame();
    } else {
        alert('Game Over');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    InitGame();
    document.addEventListener("keydown",(event) => {
        const keyMapper = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
        const keyIndex = keyMapper.indexOf(event.code);
        if (keyIndex>=0) {
            MoveTiles(keyIndex);
        }
    })
});