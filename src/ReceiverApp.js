import React, { Component } from 'react';
import logo from './logo.svg';
import './ReceiverApp.css';
import Receiver from './components/Receiver.js';

class ReceiverApp extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>MediaCast Receiver</h2>
        </div>
        <Receiver />
      </div>
    );
  }
}


export default ReceiverApp;
