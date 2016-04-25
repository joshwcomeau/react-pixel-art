import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { DrawingBoard } from '../index.js';

storiesOf('DrawingBoard', module)
  .add('default view', () => (
    <DrawingBoard onPaint={action('paint')}/>
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
