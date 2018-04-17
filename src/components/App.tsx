import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import './App.css';
import Board from '../models/BoardModel';
import Square from './Square';
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
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      width: 6,
      height: 6,
      numMines: 5,
      won: false,
      lost: false
    };
    this.restartGame = this.restartGame.bind(this);
  }

  componentDidMount() {
    this.restartGame();
  }

  componentWillReceiveProps(nextProps: AppProps) {
    const { board } = nextProps;
    if (board.won()) {
      this.setState({ won: true });
    }
    if (board.lost()) {
      this.setState({ lost: true });
    }
  }

  restartGame() {
    const { width, height, numMines } = this.state;
    this.props.createGame(width, height, numMines);
    this.setState({ won: false, lost: false });
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
                onClick={this.props.revealSquare}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { won, lost } = this.state;
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
