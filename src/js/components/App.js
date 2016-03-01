/*
 App
 */
import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin'
import autobind from 'autobind-decorator';

import Video from './Video';


@autobind
class App extends React.Component {


    constructor() {
        super();
    }


    render() {
        return (
            <div className="container-fluid">
                <div className="col-xs-12">
                    <Video  />
                </div>
            </div>
        )
    }
}



reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;