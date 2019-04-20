import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UI from '@vkontakte/vkui';
import {isWebView} from '@vkontakte/vkui/src/lib/webview';
import * as vkSelectors from '../store/vk/reducer';
import * as vkActions from '../store/vk/actions';
import AboutPanel from './AboutPanel';
import MainScreen from './MainScreen';

class App extends Component {

    componentWillMount() {
        this.props.dispatch(vkActions.initApp());
        this.props.dispatch(vkActions.fetchAccessToken());
    }

    render() {
        let activePanel = this.props.pageId === 'about' ? 'aboutPanel' : 'mainScreen';

        return (
            <UI.ConfigProvider insets={this.props.insets} isWebView={isWebView}>
                <UI.Root activeView="mainView">
                    <UI.View id="mainView" activePanel={activePanel}>
                        <MainScreen id="mainScreen" accessToken={this.props.accessToken}/>
                        <AboutPanel id="aboutPanel"/>
                    </UI.View>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }
}

function mapStateToProps(state) {
    return {
        accessToken: vkSelectors.getAccessToken(state),
        insets: vkSelectors.getInsets(state),
    };
}

export default connect(mapStateToProps)(App);
