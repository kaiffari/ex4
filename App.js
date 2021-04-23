import React from 'react';
import { View, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotesList from './notesList.js';


function AddNote({ navigation, route }) {
  const [postText, setPostText] = React.useState('');

  console.log('AddNote render...', postText);
  return (
    <View>
      <TextInput
        placeholder="Write the note here"
        style={{ height: 50, padding: 10, backgroundColor: 'powderblue' }}
        autoFocus={true}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        title="Done"
        onPress={() => {
          // Pass params back to home screen
          console.log('done pressed')
          navigation.navigate('YourNotes', { post: postText });
        }}
      />
    </View>
  );
}

const Stack = createStackNavigator();

//------------------------------------------------------
//  App 
const App = () => {

  console.log('App starting, return navigation container')
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="YourNotes" 
          component={NotesList} 
          options={({route, navigation}) => (
            {route: {route},
            navigation: {navigation}}
          )}  />
        <Stack.Screen name="AddNote" component={AddNote} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;