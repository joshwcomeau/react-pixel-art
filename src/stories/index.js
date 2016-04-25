import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { DrawingBoard } from '../index.js';

console.log(DrawingBoard);

storiesOf('DrawingBoard', module)
  .add('default view', () => (
    <DrawingBoard />
  ))
  .add('with border', () => (
    <DrawingBoard style={{border: '1px solid #000'}} />
  ))
  .add('with red background', () => (
    <DrawingBoard canvasBgColor="#FF0000" />
  ))
  .add('with blue grid lines', () => (
    <DrawingBoard gridLineColor="#0000FF" />
  ))
  .add('tiny', () => (
    <DrawingBoard width={400} height={300} />
  ))
  .add('invalid props', () => (
    <DrawingBoard width="1000" />
  ));
