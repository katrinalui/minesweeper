import Board from '../models/BoardModel';
import { CREATE_GAME, REVEAL_SQUARE, Action } from '../actions/game_actions';

const defaultState = new Board(6, 6, 5);

function rootReducer(state: Board = defaultState, action: Action) {
  switch (action.type) {
    case CREATE_GAME: {
      const { width, height, numMines } = action;
      return new Board(width, height, numMines);
    }
    case REVEAL_SQUARE: {
      const newState = Object.assign(Object.create(Object.getPrototypeOf(state)), state);
      newState.explore(action.pos);
      return newState;
    }
    default:
      return state;
  }
}

export default rootReducer;
