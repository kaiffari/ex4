import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotesList extends React.Component {
  state = {
    loading: true,
    error: false,
    notes: []
  }

  componentDidMount() {
    console.log('did mount ')
    // get notes from async-storage !!!!
    var notes = []
    console.log('getAllKeys and data')
    AsyncStorage.getAllKeys((err, keys) => {
      if (err) {
        console.log('get keys error: ', err)
        this.setState( {error: true} )
      } else {
        AsyncStorage.multiGet(keys, (err, gotNotes) => {
          if (err) {
            console.log('multiGet error: ', err)
            this.setState( {error: true} )
          } else {
              gotNotes.map((result, i, note) => {
              // get at each key/value so you can work with it
              let value = JSON.parse(note[i][1]);
              notes[i] = value;
              console.log('result: ', result)
            });
          }
            console.log('got notes: ', notes)
            this.setState({ loading: false, error: false, notes: notes })
        });
      }
    })
  }

  render () {
    console.log('NotesList beginning')

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        marginTop: 8,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "aliceblue"}
      });
  

    if (this.state.loading) {
      console.log('loading...')
      return (
        <View>
          <ActivityIndicator animating={true} />
        </View>
      )
    }

    if (this.state.error) {
      return (
        <View>
          <Text>Failed to load notes!</Text>
        </View>
      )
    }

    if (this.props.route.params?.post) { // Post updated, do something with `route.params.post`
      var postText = this.props.route.params.post
      console.log('postText: ', postText) //${this.props.route.params.post}`)
      // Prevent duplicates
      var pos = this.state.notes.findIndex(n => n.content === postText)
      console.log('pos: ', pos)
      //var litania = 
      if (pos == -1) {
        // construct new object
        var maxid = 0
        this.state.notes.map(n => {if (n.id > maxid) maxid = n.id})
        maxid = maxid + 1
        var now = new Date();
        const noteObject = {
          id: maxid,
          content: postText,
          date: now.toISOString(),
          important: Math.random() > 0.7
        }
        this.storeData(noteObject)
      } else {
        // ilmoitetaan duplikaatista. 
        // HUOM tämä ei toimi selaimella paikallisesti testattaessa!
        console.log('alert')
        const al = this.createDuplicateAlert()
      }
    }

    console.log('Return notes list to scroll view')
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        {this.state.notes.map(note => <Text key={note.id}>{note.content}</Text>)}
        <Button
          title="Add note"
          onPress={() => this.props.navigation.navigate('AddNote')} />
      </ScrollView>
    );
  }

  storeData = async (value) => {
    // add to local storage
    try {
      var jsonValue = JSON.stringify(value);
      var key = value.id.toString();
      console.log('storeData value: ', value, key)
      await AsyncStorage.setItem(key, jsonValue)
      const test = await AsyncStorage.getItem(key)
      console.log('read back: ', test)
    } catch (e) {
      // saving error
      console.log('storeData error: ', e)
    }
    console.log("storeData done.")
    // update state after storage successful
    // concatenate notes
    var newNotes = this.state.notes.concat(value)
    // clear post
    this.props.route.params.post = ""
    // set to state and trigger rendering
    this.setState({ error: false, notes: newNotes })
  }

  createDuplicateAlert() {
  /* define alert format for duplicates */
  console.log('alertissa');
    Alert.alert(
      "Add note problem!",
      "Duplicate note exists already. Not added.",
      [
        /*{
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },*/
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }
}
  
export default NotesList;