import * as React from 'react';
import SquareModel from '../models/SquareModel';

interface SquareProps {
  square: SquareModel;
  adjacentMineCount: number;
  onClick: (pos: number[]) => void;
}

class Square extends React.Component<SquareProps> {
  constructor(props: SquareProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.square.pos);
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
