import React, {Component} from 'react';
import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';

class AboutPanel extends Component {

    render() {
        return (
            <div></div>
        );
    }

    navigationBack() {
        this.props.dispatch(goBack());
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(AboutPanel);
