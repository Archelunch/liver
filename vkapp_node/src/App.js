import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import {isWebView} from '@vkontakte/vkui/src/lib/webview';
import MainScreen from './MainScreen';

class App extends Component {
    render() {
        let activePanel = 'mainScreen';

        return (
            <UI.ConfigProvider insets={this.props.insets} isWebView={isWebView}>
                <UI.Root activeView="mainView">
                    <UI.View id="mainView" activePanel={activePanel}>
                        <MainScreen id="mainScreen" />
                    </UI.View>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }
}


export default App;
