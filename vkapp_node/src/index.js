import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js'
import connect from '@vkontakte/vkui-connect';

connect.send('VKWebAppInit', {});

ReactDOM.render(
    <div style={{width: "100vw", height: "100vh"}}>
                <div id="gamezone">
                    <div className="center" id="main">
                        <button className="btn btn-main center" id="mainButton">HANDSAPP</button>
                    </div>
                </div>
                <div id="footemail">
                    <a href="mailto:info@handsapp.fun" target="_top" className="footer">info@handsapp.fun</a>
                </div>
                <h2 id="timer"></h2>
            </div>,
    document.getElementById('root')
);