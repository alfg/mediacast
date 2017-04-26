import React, { Component } from 'react';
import logo from './logo.svg';
import './SenderApp.css';
import Sender from './components/Sender.js';

class SenderApp extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>MediaCast Sender</h2>
        </div>
        <Sender />
      </div>
    );
  }
}


export default SenderApp;
