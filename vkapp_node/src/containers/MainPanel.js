import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as vkSelectors from '../store/vk/reducer';

class MainPanel extends Component {

    render() {
        return (
            <div style={{width: "100vw", height: "100vh"}}>
            <div id="gamezone">
    <div class="center" id="main">
      <button class="btn btn-main center" id="mainButton">HANDSAPP</button>
    </div>
  </div>
  <div id="footemail">
    <a href="mailto:info@handsapp.fun" target="_top" class="footer">info@handsapp.fun</a>
  </div>
  <h2 id="timer"></h2></div>
        );
    }
}

function mapStateToProps(state) {
    return {
        notificationStatus: vkSelectors.getNotificationStatus(state),
    };
}

export default connect(mapStateToProps)(MainPanel);
