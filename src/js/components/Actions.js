/**
 * Actions of Video
 * */

import React from 'react';
import autobind from 'autobind-decorator';

@autobind
class Actions extends React.Component{

    constructor(){
        super();

        this.state = {
            start: false,
            call: false,
            hangUp: false
        }
    }



    call(){

        this.setState({
            call: true
        });

        this.props.call();


        //this.props.createLocalPeerConnection();

        //this.props.createRemotePeerConnection();

        //this.props.connectStream();

    }

    hangUp(){
        console.log('hang up');
    }

    render(){
        return (
            <div>
                <div className="btn-group" role="group">
                    <button type="button" disabled={this.state.call} className="btn btn-danger" onClick={this.call} >Call</button>
                    <button type="button" className="btn btn-secondary" onClick={this.hangUp} >Hang Up</button>
                </div>
            </div>
        )
    }

}


Actions.propTypes = {
    getVideo: React.PropTypes.func.isRequired,
    call: React.PropTypes.func.isRequired
};


export default Actions;