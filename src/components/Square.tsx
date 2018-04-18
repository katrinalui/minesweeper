import * as React from 'react';
import './Square.css';
import SquareModel from '../models/SquareModel';

interface SquareProps {
  square: SquareModel;
  adjacentMineCount: number;
  onClick: (pos: number[], flagged: boolean) => void;
}

class Square extends React.Component<SquareProps> {
  constructor(props: SquareProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const flagged = e.altKey ? true : false;
    this.props.onClick(this.props.square.pos, flagged);
  }

  render() {
    const { square, adjacentMineCount } = this.props;
    let className = 'square';
    let text;
    if (square.revealed && square.explosive) {
      className += ' square--exploded';
      text = '\u{1F4A3}';
    } else if (square.revealed) {
      className += ' square--revealed';
      text = adjacentMineCount;
    } else if (square.flagged) {
      className += ' square--flagged';
      text = '\u{1F6A9}';
    }

    return (
      <button
        className={className}
        onClick={this.onClick}
      >
        {text}
      </button>
    );
  }
}

export default Square;
