/*
 App
 */
import React from 'react';
import autobind from 'autobind-decorator';

import Actions from './Actions';

@autobind class Video extends React.Component {

    static RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;

    //    static localPeerConnection;
    //    static remotePeerConnection;

    static contraints = {
        audio: false,
        video: true
    };

    static peerConnectionConfig = {
        iceServers: [
            {url: 'stun:stun.l.google.com:19302'}
        ]
    };

    constructor() {
        super();

        this.state = {
            caller: false,
            source: {
                self: null,
                remote: null
            }
        };

        //Peer Connection instance
        this.PC = null;

        this.server = null;

        this.stream = {
            self: null,
            remote: null
        };

    }

    componentDidMount() {

        //If not exist mediaDevices object
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        //If not exist getUserMedia
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = this.fallbackUserMedia;
        }
    }

    fallbackUserMedia(constraints, successCallback, errorCallback) {

        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(successCallback, errorCallback) {
            getUserMedia.call(navigator, constraints, successCallback, errorCallback);
        });
    }

    /**
     * Faz a chamada
     */
    call() {

        this.setState({
            caller: true
        });

        //Init cam
        this.getVideo();

        this.PC = new Video.RTCPeerConnection(Video.peerConnectionConfig);
        this.PC.onicecandidate = this.gotIceCandidate;
        this.PC.onaddstream = this.onAddStream;
    }

    /**
     * Atender a chamada
     */
    answer() {

        this.setState({
            caller: false,
            answer: true
        });

        //Init cam
        this.getVideo();

        this.PC = new Video.RTCPeerConnection(Video.peerConnectionConfig);
        this.PC.onicecandidate = this.gotIceCandidate;
        this.PC.onaddstream = this.onAddStream;

    }

    /**
     * Obtem o icecandidate e envia uma mensagem pela realtime para a conexao remota
     */
    gotIceCandidate(event) {
        if (event.candidate) {

            console.log(event.candidate);
            //            signalingChannel.send(JSON.stringify({
            //                'candidate': event.candidate
            //            }));

        }
    }

    /**
     * Adiciona o stream ao source remoto
     */
    onAddStream(event) {
        if (!event) {
            return;
        }
        this.source.remote = URL.createObjectURL(event.stream);
    }

    /**
     * Obtem o video
     */
    getVideo() {
        navigator.mediaDevices.getUserMedia(Video.contraints).then(this.gotStream);
    }

    /**
     * Processa o stream do video
     */
    gotStream(stream) {

        this.stream.self = stream;

        this.setState({
            source: {
                self: URL.createObjectURL(stream)
            }
        });

        this.PC.addStream(stream);

        if (this.state.caller) {
            this.PC.createOffer(this.gotDescription);
        }
        else if (this.state.answer) {
            this.PC.createAnswer(this.PC.remoteDescription, this.gotDescription);
        }
    }

    /**
     * Adiciona o description como local e envia para o usuário remoto
     */
    gotDescription(description) {

        this.PC.setLocalDescription(description);
        console.log(description);
        //signalingChannel.send(JSON.stringify({ "sdp": description }));
    }


    onMessage(event) {

        if (this.PC) {
            answer();
        }
        var signal = JSON.parse(event.data);

        if (signal.sdp) {
            this.PC.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        } else {
            this.PC.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
    }

    //    gotRemoteStream(event) {
    //
    //        let src = URL.createObjectURL(event.stream);
    //
    //        this.source.remote = src;
    //
    //        this.setState({
    //            stream: {
    //                remote: event.stream
    //            }
    //        });
    //    }
    //
    //    /**
    //     * Cria uma conexao peer local
    //     */
    //    createLocalPeerConnection() {
    //        Video.localPeerConnection = new Video.RTCPeerConnection(Video.peerConnectionConfig);
    //        Video.localPeerConnection.onicecandidate = this.gotLocalIceCandidate;
    //    }
    //
    //    /**
    //     * Cria uma conexao peer remota
    //     */
    //    createRemotePeerConnection() {
    //        Video.remotePeerConnection = new Video.RTCPeerConnection(Video.servers);
    //        Video.remotePeerConnection.onicecandidate = this.gotRemoteIceCandidate;
    //        Video.remotePeerConnection.onaddstream = this.gotRemoteStream;
    //    }
    //
    //    connectStream() {
    //        Video.localPeerConnection.addStream(this.state.stream.local);
    //        Video.localPeerConnection.createOffer(this.gotLocalDescription);
    //    }
    //
    //    gotLocalDescription(description) {
    //        Video.localPeerConnection.setLocalDescription(description);
    //        Video.remotePeerConnection.setRemoteDescription(description);
    //        Video.remotePeerConnection.createAnswer(this.gotRemoteDescription);
    //    }
    //
    //    gotRemoteDescription(description) {
    //        Video.remotePeerConnection.setLocalDescription(description);
    //        Video.localPeerConnection.setRemoteDescription(description);
    //    }
    //
    //    gotLocalIceCandidate(event) {
    //        if (event.candidate) {
    //            Video.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    //        }
    //    }
    //
    //    gotRemoteIceCandidate(event) {
    //        if (event.candidate) {
    //            Video.localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    //        }
    //    }

    render() {
        return (
            <div>
                <video src={this.state.source.self} autoPlay/>
                <Actions
                    getVideo={this.getVideo}
                    call={this.call}
                    />
            </div>
        )
    }
}

export default Video;