import React, {Component} from 'react';
import connect from '@vkontakte/vkui-connect';
import * as UI from '@vkontakte/vkui';
import {isWebView} from '@vkontakte/vkui/src/lib/webview';
import MainScreen from './MainScreen';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    componentDidMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({ user: e.detail.data });
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
        connect.send('VKWebAppGetUserInfo', {});
    }

    render() {
        let activePanel = 'mainScreen';

        return (
            <UI.ConfigProvider insets={this.props.insets} isWebView={isWebView}>
                <UI.Root activeView="mainView">
                    <UI.View id="mainView" activePanel={activePanel}>
                        <MainScreen id="mainScreen" user={this.state.user} />
                    </UI.View>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }
}


export default App;
