import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { DrawingBoard } from '../index.js';

const cells = [
  [ '#FF0000', '#FF0000', '#000000' ],
  [ '#FF0000', '#000000', '#FF0000' ],
  [ '#000000', '#FF0000', '#FF0000' ]
];

storiesOf('DrawingBoard', module)
  .add('default view', () => (
    <Controller cells={cells} />
  ))
  .add('with border', () => (
    <DrawingBoard style={{border: '1px solid #000'}} onPaint={action('paint')}/>
  ))
  .add('with red background', () => (
    <DrawingBoard canvasBgColor="#FF0000" onPaint={action('paint')}/>
  ))
  .add('with offwhite grid lines', () => (
    <DrawingBoard gridLineColor="#EEEEEE" onPaint={action('paint')}/>
  ))
  .add('with green paint', () => (
    <DrawingBoard paintColor="#00FF00" onPaint={action('paint')}/>
  ))
  .add('tiny', () => (
    <DrawingBoard width={400} height={300} onPaint={action('paint')}/>
  ))
  .add('invalid props', () => (
    <DrawingBoard width="1000" onPaint={action('paint')}/>
  ));

class Controller extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: props.cells
    };
  }

  clickCell({x, y}, eventType) {
    if (eventType === 'hover') return
    const newCells = this.state.cells.slice();
    newCells[x][y] = eventType === 'left-click' ? '#FF0000' : null;

    this.setState({
      cells: newCells
    })
  }

  render() {
    return <DrawingBoard cells={this.state.cells} onChange={::this.clickCell} />
  }
}
