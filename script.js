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

  const checkForTie = () => {
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

    if (checkForTie()) {
      return "It's a tie!";
    }

    switchPlayerTurn();
  };

  return { updatePlayerName, getActivePlayer, playRound };
})();

const screenController = (() => {
  const startPage = document.querySelector("#start-page");
  const playerOne = document.querySelector("#player-one");
  const playerTwo = document.querySelector("#player-two");

  const gamePage = document.querySelector("#game-page");
  const turnMessage = document.querySelector("#turn-message");
  const gameboardDiv = document.querySelector("#gameboard");

  const restartPage = document.querySelector("#restart-page");
  const resultMessage = document.querySelector("#result-message");

  const renderBoard = () => {
    gameboardDiv.textContent = "";

    const board = Gameboard.getBoard();
    const activePlayerName = gameController.getActivePlayer().name;

    turnMessage.textContent = `${activePlayerName}'s turn`;

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

  const startGame = () => {
    if (playerOne.value && playerTwo.value) {
      gameController.updatePlayerName(playerOne.value, playerTwo.value);
    }
    toggleDisplay(startPage);
    toggleDisplay(gamePage);
    renderBoard();
  };

  const restartGame = () => {
    Gameboard.resetBoard();
    toggleDisplay(restartPage);
    toggleDisplay(gamePage);
    renderBoard();
  };

  function toggleDisplay(element) {
    element.classList.toggle("hidden");
  }

  function clickHandler(event) {
    if (event.target.dataset.button === "start") {
      startGame();
    }

    if (event.target.dataset.button === "restart") {
      restartGame();
    }

    if (event.target.classList.contains("cell")) {
      const row = event.target.dataset.row;
      const column = event.target.dataset.column;
      let result = null;
      result = gameController.playRound(row, column);

      // Win or tie
      if (result) {
        resultMessage.textContent = result;
        toggleDisplay(gamePage);
        toggleDisplay(restartPage);
      }
      renderBoard();
    }
  }

  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", clickHandler);
  const restartButton = document.querySelector("#restart-button");
  restartButton.addEventListener("click", clickHandler);
})();
