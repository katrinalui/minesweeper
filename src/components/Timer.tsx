import * as React from 'react';
import './Timer.css';

interface TimerProps {
  inProgress: boolean;
  reset: boolean;
}

interface TimerState {
  seconds: number;
  timer?: number;
}

class Timer extends React.Component<TimerProps, TimerState> {
  constructor(props: TimerProps) {
    super(props);
    this.state = { seconds: 0 };
    this.tick = this.tick.bind(this);
  }

  componentWillReceiveProps(nextProps: TimerProps) {
    if (nextProps.inProgress && !this.props.inProgress) {
      this.setState({
        seconds: 0,
        timer: window.setInterval(this.tick, 1000)
      });
    }
    if (!nextProps.inProgress && this.props.inProgress) {
      clearInterval(this.state.timer);
    }
    if (nextProps.reset && !this.props.reset) {
      this.setState({ seconds: 0 });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  tick() {
    this.setState(prevState => {
      return { seconds: prevState.seconds + 1 };
    });
  }

  render() {
    return (
      <div className="timer">
        Time: {this.state.seconds}
      </div>
      );
  }
}

export default Timer;
