/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import Homescreen from './Homescreen';
import Searchscreen from './Searchscreen';


export default class Rootscreen extends Component{
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="home" component={Homescreen} initial={true} hideNavBar />
                    <Scene key="search" component={Searchscreen} hideNavBar />
                </Scene>
            </Router>
        );
    }
}

