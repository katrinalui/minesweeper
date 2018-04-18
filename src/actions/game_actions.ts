export const CREATE_GAME = 'CREATE_GAME';
export const REVEAL_SQUARE = 'REVEAL_SQUARE';
export const FLAG_SQUARE = 'FLAG_SQUARE';

export type Action =
  ({ type: 'CREATE_GAME', width: number, height: number, numMines: number })
| ({ type: 'REVEAL_SQUARE', pos: number[] })
| ({ type: 'FLAG_SQUARE', pos: number[] });

export function revealSquare(pos: number[]) {
  return { type: REVEAL_SQUARE, pos };
}

export function createGame(width: number, height: number, numMines: number) {
  return { type: CREATE_GAME, width, height, numMines };
}

export function flagSquare(pos: number[]) {
  return { type: FLAG_SQUARE, pos };
}
