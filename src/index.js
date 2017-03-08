import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Data from './components/data'
import './index.css';

ReactDOM.render(
    <div>
    <App />
    <Data domain="DOMAIN"/>
    </div>,
    document.getElementById('root')
);
