import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import './App.css';
import Board from '../models/BoardModel';
import Square from './Square';
import Timer from './Timer';
import { createGame, revealSquare, Action } from '../actions/game_actions';

interface StateProps {
  board: Board;
}

interface DispatchProps {
  createGame: (width: number, height: number, numMines: number) => void;
  revealSquare: (pos: number[]) => void;
}

type AppProps = StateProps & DispatchProps;

interface AppState {
  width: number;
  height: number;
  numMines: number;
  won: boolean;
  lost: boolean;
  started: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      width: 6,
      height: 6,
      numMines: 5,
      won: false,
      lost: false,
      started: false
    };
    this.restartGame = this.restartGame.bind(this);
    this.onSquareClick = this.onSquareClick.bind(this);
  }

  componentDidMount() {
    this.restartGame();
  }

  componentWillReceiveProps(nextProps: AppProps) {
    const { board } = nextProps;
    if (board.won()) {
      this.setState({ won: true, started: false });
    }
    if (board.lost()) {
      this.setState({ lost: true, started: false });
    }
  }

  onSquareClick(pos: number[]) {
    this.props.revealSquare(pos);
    if (!this.state.started) {
      this.setState({ started: true });
    }
  }

  restartGame() {
    const { width, height, numMines } = this.state;
    this.props.createGame(width, height, numMines);
    this.setState({ won: false, lost: false, started: false });
  }

  renderBoard() {
    const { board } = this.props;
    return (
      <div className="board">
        {board.grid.map((row, i) => (
          <div key={`row-${i}`} className="board__row">
            {row.map((square, j) => (
              <Square
                key={`square=${j}`}
                square={square}
                adjacentMineCount={board.adjacentMineCount(square.pos)}
                onClick={this.onSquareClick}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { won, lost, started } = this.state;
    let modal;
    if (won || lost) {
      const text = won ? 'You won! \u{1F389}' : 'Game over \u2620';
      modal = (
        <div className="modal modal__overlay">
          <div className="modal modal__content">
            <p>{text}</p>
            <button onClick={this.restartGame}>Play Again</button>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Minesweeper</h1>
        </header>
        {modal}
        <Timer inProgress={started} reset={!won && !lost && !started} />
        {this.renderBoard()}
      </div>
    );
  }
}

function mapStateToProps(state: Board): StateProps {
  return {
    board: state
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
  return {
    createGame: (width: number, height: number, numMines: number) => (
      dispatch(createGame(width, height, numMines))
    ),
    revealSquare: (pos: number[]) => dispatch(revealSquare(pos))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
