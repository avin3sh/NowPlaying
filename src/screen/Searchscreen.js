/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

const searchUrl = 'https://www.googleapis.com/youtube/v3/search/?part=snippet&type=video&videoEmbeddable=true&videoCategoryId=10&key=[yourKEYhere]&q=';

export default class Searchscreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: undefined,
            isSearching: false,
            searchResult: [],
        }
    }

    componentDidMount() {
        this.search.focus();
    }
    searchVideo(q) {
        const fullUrl = searchUrl + String(q);
        this.setState({ isSearching: true });
        fetch(fullUrl).then((response) => response.json()).then(respjson => {
            //alert('Search fetch');

            if (respjson.items.length > 0) {
                this.setState({ searchResult: respjson.items });
            }
        }).catch((err) => {
            alert('Error occured, ' + String(err));
        });
        this.setState({ isSearching: false });
    }

    render() {
        return (
            <View>
                <SearchBar
                    ref={search => this.search = search}
                    onChangeText={(searchQuery) => this.setState({ searchQuery })}
                    onSubmitEditing={() => { this.searchVideo(this.state.searchQuery); }}
                    showLoading
                    lightTheme
                    clearIcon
                    platform="android"
                    placeholder='Search' />

                {
                    this.state.searchResult.map((song, i) => (
                        <ListItem
                            key={i}
                            leftAvatar={{ rounded: true, source: { uri: song.snippet.thumbnails.default.url } }}
                            title={song.snippet.title}
                            onPress={() => { Actions.pop(); Actions.home({ videoId: song.id.videoId }); }}
                        />
                    ))
                }
            </View>
        );
    }
}

