const Gameboard = (() => {
  function Cell() {
    let value = "";

    const getValue = () => value;
    const resetValue = () => (value = "");
    const changeValue = (newValue) => {
      if (value === "") {
        value = newValue;
      }
    };

    return { getValue, resetValue, changeValue };
  }

  const board = [];
  const boardSize = 3;

  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const getBoardSize = () => boardSize;

  const dropMark = (row, column, mark) => {
    board[row][column].changeValue(mark);
  };

  const resetBoard = () => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        board[i][j].resetValue();
      }
    }
  };

  return { getBoard, getBoardSize, dropMark, resetBoard };
})();

const gameController = (() => {
  function Player(name, mark) {
    this.name = name;
    this.mark = mark;
  }

  const board = Gameboard.getBoard();
  const boardSize = Gameboard.getBoardSize();
  let players = [new Player("Player one", "X"), new Player("Player two", "O")];

  const updatePlayerName = (playerOneName, playerTwoName) => {
    players[0].name = playerOneName;
    players[1].name = playerTwoName;
  };

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkForWin = () => {
    const activePlayerMark = getActivePlayer().mark;

    // Horizontal
    for (let i = 0; i < boardSize; i++) {
      if (
        activePlayerMark === board[i][0].getValue() &&
        activePlayerMark === board[i][1].getValue() &&
        activePlayerMark === board[i][2].getValue()
      ) {
        return true;
      }
    }

    // Vertical
    for (let i = 0; i < boardSize; i++) {
      if (
        activePlayerMark === board[0][i].getValue() &&
        activePlayerMark === board[1][i].getValue() &&
        activePlayerMark === board[2][i].getValue()
      ) {
        return true;
      }
    }

    // Diagonal
    if (
      (activePlayerMark === board[0][0].getValue() &&
        activePlayerMark === board[1][1].getValue() &&
        activePlayerMark === board[2][2].getValue()) ||
      (activePlayerMark === board[0][2].getValue() &&
        activePlayerMark === board[1][1].getValue() &&
        activePlayerMark === board[2][0].getValue())
    ) {
      return true;
    }
  };

  const checkForDraw = () => {
    const availableCells = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j].getValue() === "") {
          availableCells.push(board[i][j]);
        }
      }
    }

    if (!availableCells.length) {
      return true;
    }
  };

  const playRound = (row, column) => {
    if (Gameboard.getBoard()[row][column].getValue() !== "") {
      return;
    }

    Gameboard.dropMark(row, column, getActivePlayer().mark);

    if (checkForWin()) {
      return `${getActivePlayer().name} won!`;
    }

    if (checkForDraw()) {
      return "It's a draw!";
    }

    switchPlayerTurn();
  };

  return { updatePlayerName, getActivePlayer, playRound };
})();

const screenController = (() => {
  const startPage = document.querySelector("#start-page");
  const playerOne = document.querySelector("#player-one");
  const playerTwo = document.querySelector("#player-two");
  const startButton = document.querySelector("#start-button");

  const gamePage = document.querySelector("#game-page");
  const message = document.querySelector("#message");
  const gameboardDiv = document.querySelector("#gameboard");
  const restartButton = document.querySelector("#restart-button");

  const renderBoard = () => {
    gameboardDiv.textContent = "";

    const board = Gameboard.getBoard();
    const activePlayerName = gameController.getActivePlayer().name;

    if (!endGame) {
      message.textContent = `${activePlayerName}'s turn`;
    } else {
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        cellButton.addEventListener("click", clickHandler);
        gameboardDiv.appendChild(cellButton);
      });
    });
  };

  let endGame = false;

  const startGame = () => {
    if (playerOne.value && playerTwo.value) {
      gameController.updatePlayerName(playerOne.value, playerTwo.value);
    }
    toggleDisplay(startPage);
    toggleDisplay(gamePage);
    renderBoard();
  };

  const restartGame = () => {
    endGame = false;
    Gameboard.resetBoard();
    toggleVisibility(restartButton);
    renderBoard();
  };

  function toggleVisibility(element) {
    element.classList.toggle("hidden");
  }

  function toggleDisplay(element) {
    element.classList.toggle("none");
  }

  function clickHandler(event) {
    if (event.target.dataset.button === "start") {
      startGame();
    }

    if (event.target.dataset.button === "restart") {
      restartGame();
    }

    if (event.target.classList.contains("cell") && !endGame) {
      const row = event.target.dataset.row;
      const column = event.target.dataset.column;
      let result = null;
      result = gameController.playRound(row, column);

      // Win or draw
      if (result) {
        endGame = true;
        message.textContent = result;
        setTimeout(() => {
          toggleVisibility(restartButton);
        }, 1000);
      }
      renderBoard();
    }
  }

  startButton.addEventListener("click", clickHandler);
  restartButton.addEventListener("click", clickHandler);
})();
