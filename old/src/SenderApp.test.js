import React from 'react';
import ReactDOM from 'react-dom';
import SenderApp from './SenderApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SenderApp />, div);
});
