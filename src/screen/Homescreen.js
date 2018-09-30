/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, WebView, StyleSheet, Dimensions } from 'react-native';
import { Header, Card, Button, Icon, SearchBar } from 'react-native-elements';
import YouTube from 'react-native-youtube';
import { Actions } from 'react-native-router-flux';

let pVid = undefined;
let cVid = 'H0JoHyALIP4';
let nVid = undefined;

export default class Homescreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pvidbutton: false,
            playing: false,
            stopped: false,
            playnext: undefined,
        }
    }

    sendMsg(commandId, vid = undefined) {
        var enc = String(commandId);
        if (vid != undefined)
            enc = enc + String(vid);

        this.refs.myWebView.postMessage(enc);
    }

    getNextVid(id) {
        fetch('https://www.googleapis.com/youtube/v3/search/?part=snippet&type=video&videoEmbeddable=true&videoSyndicated=true&relatedToVideoId=' + id + '&key=[yourKEYhere]').then((response) => response.json()).then(respjson => {
            if (respjson.items.length > 0) {
                if (respjson.items[0].id.videoId != pVid)
                    nVid = respjson.items[0].id.videoId;
                else
                    nVid = respjson.items[1].id.videoId;
            }
            //alert('Next vide req');
        }).catch((err) => {
            alert('Error occured, ' + String(err));
        });
    }

    getVideoCode(op = 0) {
        let video;

        if (op == 0) {
            video = cVid;

            if (this.props.videoId != undefined && this.props.videoId != null) {
                video = this.props.videoId;
            }
        } else {
            video = String(op);
        }

        let ytcode = `<html><body>
        <iframe id="existing-iframe-example"
        width="`+ ((Dimensions.get('window').width) - 20) + `" height="` + ((Dimensions.get('window').width) - 20) * 0.56 + `"
        src="https://www.youtube.com/embed/`+ video + `?enablejsapi=1&cc_load_policy=0&fs=0&iv_load_policy=3&playsinline=1&controls=1&rel=0&autohide=1&modestbranding=1&vq=small&frameborder="0"></iframe>
        
        <script type="text/javascript">
          var tag = document.createElement('script');
          tag.id = 'iframe-demo';
          tag.src = 'https://www.youtube.com/iframe_api';
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
    
          var player;
          var playing = 0;

          function onYouTubeIframeAPIReady() {
            player = new YT.Player('existing-iframe-example', {
                events: {
                  'onReady': onPlayerReady,
                  'onStateChange': onPlayerStateChange,
                  'onError': onPlayerError,
                }
            });
          }
          function onPlayerReady(event) {
            setTimeout(function(){ postMessage('ready'); }, 1500);
          }

            function onPlayerError(event){
                postMessage('stopped');
            }

          function changeBorderColor(playerStatus) {
          }
          function onPlayerStateChange(event) {
            if(event.data == 0){
                postMessage('stopped');
            }else if(event.data == 1){
                postMessage('playing');
            }else if(event.data == 2){
                postMessage('paused');
            }else if(event.data == 5){
                postMessage('ready');
            }
          }
    
          function test(){
            
          }
        </script>
        
        <script>
                /*
                    
                */
                  document.addEventListener('message', function(e) {
                    if(String(e.data).substring(0,4) == 'next'){
                        player.loadVideoById(String(e.data).substring(4),0, 'small');
                        playing=1;
                    }else if(String(e.data).substring(0,4) == 'prev'){
                        player.loadVideoById(String(e.data).substring(4),0, 'small');
                        playing=1;
                    }else if(String(e.data) == 'play'){
                        player.playVideo();
                        playing=1;
                    }else if(String(e.data) == 'pause'){
                        player.pauseVideo();
                        playing=0;
                    }else if(String(e.data) == 'stop'){
                        player.stopVideo();
                        playing=0;
                    }else if(String(e.data).substring(0,3) == 'que'){

                    }else if(String(e.data) == 'status'){
                        var n = player.getPlayerState();
                        postMessage('Status '+n);
                    }
                  });
        </script>
        </html></body>`;

        return ytcode;
    }

    handleNext() {
        let curr = cVid;
        let next = nVid;
        this.getNextVid(next);
        cVid = next;
        pVid = curr;
        this.setState({ pvidbutton: true });
    }

    handlePrev() {
        let curr = cVid;
        let next = nVid;
        cVid = pVid;
        nVid = curr;
        this.setState({ pvidbutton: false });
    }

    componentDidMount() {
        if (this.props.videoId != undefined && this.props.videoId != null)
            this.getNextVid(this.props.videoId);
        else
            this.getNextVid(cVid);

    }

    render() {
        return (

            <View style={{ flex: 1, }}>
                <Header>
                    <Icon name='menu' color="#fff" />
                    <Text style={{ color: '#fff' }}>Bajao Re</Text>
                    <Icon name='search' color="#fff" onPress={() => { this.sendMsg('stop'); this.setState({ stopped: true }); Actions.pop(); Actions.search(); }} />
                </Header>
                <View ref='mystyle'>
                    <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width * 0.56, }}>

                        <WebView
                            style={{ flex: 1 }}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            ref="myWebView"
                            javaScriptEnabled={true}
                            source={this.state.playnext == undefined ? { html: this.getVideoCode() } : { html: this.getVideoCode(this.state.playnext) }}
                            onMessage={(event) => {
                                let msg = event.nativeEvent.data;
                                if (msg == 'stopped' && this.state.stopped != true) {
                                    this.sendMsg('next', nVid);
                                    this.handleNext();
                                    //this.setState({ playnext: nVid });
                                    //this.forceUpdate();
                                } else if (msg == 'paused') {
                                    this.setState({ playing: false });
                                } else if (msg == 'playing') {
                                    this.setState({ playing: true });
                                } else if (msg == 'ready' && this.state.stopped != true) {
                                    this.sendMsg('play');
                                } else if (msg.substring(0, 6) == 'Status') {
                                    alert(msg);
                                }
                            }}
                        />

                    </View>
                    <Card containerStyle={{ margin: 0, width: Dimensions.get('window').width }} wrapperStyle={{ flexDirection: 'row', justifyContent: 'center', }} style={{ backgroundColor: '#ffffff' }}>
                        <Icon
                            raised
                            reverse
                            name='backward'
                            type='font-awesome'
                            color={this.state.pvidbutton != false ? '#f50' : '#D3D3D3'}
                            onPress={() => {
                                this.sendMsg('prev', pVid);
                                this.handlePrev();
                            }} />
                        <Icon
                            raised
                            reverse
                            name={this.state.playing ? 'pause' : 'play'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => {
                                this.setState({ stopped: false });
                                if (this.state.playing)
                                    this.sendMsg('pause');
                                else
                                    this.sendMsg('play');
                            }} />
                        <Icon
                            raised
                            reverse
                            name='stop'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => {
                                this.setState({ stopped: true });
                                this.sendMsg('stop');
                            }} />
                        <Icon
                            raised
                            reverse
                            name='forward'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => {
                                this.sendMsg('next', nVid);
                                this.handleNext();
                            }} />
                    </Card>
                    <Button onPress={() => { this.sendMsg('status'); }}>Get Status</Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bg: {
        backgroundColor: 'red'
    }
})
