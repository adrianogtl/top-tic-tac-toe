function Gameboard() {
  const board = [];
  const rows = 3;
  const columns = 3;
  const winConditions = [[0]];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
    }
  };

  const printBoard = () => {
    const boardCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardCellValues);
  };

  return { getBoard, dropToken, printBoard };
}

function Cell() {
  let value = 0;

  const getValue = () => value;
  const addToken = (player) => (value = player.token);

  return { getValue, addToken };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    console.log(`${getActivePlayer().name}'s turn.`);
    board.printBoard();
  };

  const playRound = (row, column) => {
    board.dropToken(row, column, activePlayer);
    printNewRound();
    switchPlayerTurn();
  };

  return { playRound };
}

const game = GameController();
