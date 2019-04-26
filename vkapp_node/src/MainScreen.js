import React, {Component} from 'react';

class MainPanel extends Component {

    render() {
        return(
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
                <span className="d-none" id="userid">{this.props.user.id}</span>
            </div>
        );
    }
}

export default MainPanel;
