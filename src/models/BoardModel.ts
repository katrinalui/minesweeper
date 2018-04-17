import Square from './SquareModel';

const DELTAS = Object.freeze([
  [-1, -1], [0, -1], [1, -1], [-1, 0],
  [1, 0], [-1, 1], [0, 1], [1, 1]
]);

export default class Board {
  grid: Square[][] = [];

  constructor(public width: number, public height: number, public numMines: number) {
    this.generateBoard();
    this.plantMines();
  }

  generateBoard(): void {
    for (let i = 0; i < this.height; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.width; j++) {
        const square = new Square([i, j]);
        this.grid[i].push(square);
      }
    }
  }

  plantMines(): void {
    let totalMines = 0;
    while (totalMines < this.numMines) {
      const row = Math.floor(Math.random() * (this.height - 1));
      const col = Math.floor(Math.random() * (this.width - 1));
      const square = this.grid[row][col];

      if (!square.explosive) {
        square.explosive = true;
        totalMines += 1;
      }
    }
  }

  adjacentMineCount(pos: number[]): number {
    let mineCount = 0;
    this.getNeighbors(pos).forEach(neighbor => {
      if (neighbor.explosive) {
        mineCount += 1;
      }
    });
    return mineCount;
  }

  explore(pos: number[]): void {
    const square = this.grid[pos[0]][pos[1]];
    if (square.revealed) {
      return;
    }

    square.revealed = true;
    if (!square.explosive && this.adjacentMineCount(pos) === 0) {
      this.getNeighbors(pos).forEach(neighbor => {
        this.explore(neighbor.pos);
      });
    }
  }

  getNeighbors(pos: number[]): Square[] {
    const neighbors: Square[] = [];
    DELTAS.forEach(delta => {
      const newPos = [pos[0] + delta[0], pos[1] + delta[1]];
      if (this.validPosition(newPos)) {
        neighbors.push(this.grid[newPos[0]][newPos[1]]);
      }
    });

    return neighbors;
  }

  validPosition(pos: number[]): boolean {
    return (
      pos[0] >= 0 && pos[0] < this.height &&
        pos[1] >= 0 && pos[1] < this.width
    );
  }

  lost(): boolean {
    let lost = false;
    this.grid.forEach(row => {
      row.forEach(square => {
        if (square.revealed && square.explosive) {
          lost = true;
        }
      });
    });

    return lost;
  }

  won(): boolean {
    let won = true;

    this.grid.forEach(row => {
      row.forEach(square => {
        if (!square.revealed && !square.explosive) {
          won = false;
        }
      });
    });

    return won;
  }
}
