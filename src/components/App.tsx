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
    this.onWidthChange = this.onWidthChange.bind(this);
    this.onHeightChange = this.onHeightChange.bind(this);
    this.onMineChange = this.onMineChange.bind(this);
    this.onResetSubmit = this.onResetSubmit.bind(this);
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

  onWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = parseInt(e.target.value, 10);
    let width = input < 2 ? 2 : input;
    if (width > 50) {
      width = 50;
    }
    this.setState({ width });
  }

  onHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = parseInt(e.target.value, 10);
    let height = input < 2 ? 2 : input;
    if (height > 50) {
      height = 50;
    }
    this.setState({ height });
  }

  onMineChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { width, height } = this.state;
    const input = parseInt(e.target.value, 10);
    const maxMines = width * height / 2;
    let numMines = input > maxMines ? maxMines : input;
    if (numMines < 1) {
      numMines = 1;
    }
    this.setState({ numMines });
  }

  onResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.restartGame();
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
    const { won, lost, started, width, height, numMines } = this.state;
    let modal;
    if (won || lost) {
      const text = won ? 'You won! \u{1F389}' : 'Game over \u2620';
      modal = (
        <div className="modal modal__overlay">
          <div className="modal modal__content">
            <p className="modal modal_text">{text}</p>
            <button className="button button__modal" onClick={this.restartGame}>Play Again</button>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <header className="header">
          <h1 className="title">Minesweeper</h1>
        </header>
        {modal}
        <form className="options" onSubmit={this.onResetSubmit}>
          <label className="label">
            Width
            <input
              type="number"
              value={width}
              name="width"
              className="input"
              autoComplete="off"
              onChange={this.onWidthChange}
            />
          </label>
          <label className="label">
            Height
            <input
              type="number"
              value={height}
              name="height"
              className="input"
              autoComplete="off"
              onChange={this.onHeightChange}
            />
          </label>
          <label className="label">
            Mines
            <input
              type="number"
              value={numMines}
              name="numMines"
              className="input"
              autoComplete="off"
              onChange={this.onMineChange}
            />
          </label>
          <input
            type="submit"
            className="button button__reset"
            value="Reset"
          />
        </form>
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
