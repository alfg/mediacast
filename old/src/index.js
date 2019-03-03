import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import SenderApp from './SenderApp';
import ReceiverApp from './ReceiverApp';
import './index.css';

// injectTapEventPlugin();

const path = window.location.pathname;

let app = <MuiThemeProvider><SenderApp /></MuiThemeProvider>;
if (path === '/receiver' || path === '/mediacast/receiver') {
  app = <ReceiverApp />
}

ReactDOM.render(
  app,
  document.getElementById('root')
);
