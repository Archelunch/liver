import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vkui-connect';

connect.send('VKWebAppInit', {});

ReactDOM.render(
    <div style={{width: "100vw", height: "100vh"}}>
                <div id="gamezone">
                    <div className="center" id="main">
                        <button className="btn btn-main center" id="mainButton">ADD VK</button>
                    </div>
                </div>
                <div id="footemail">
                    <a href="https://vk.com/hands_app" target="_top" className="footer">Сделано в HandsApp</a>
                </div>
                <h2 id="timer"></h2>
            </div>,
    document.getElementById('root')
);