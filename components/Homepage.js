import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Text, View, Button, Alert, TextInput, Image, ScrollView, ImageBackground, Linking} from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements'
import { Ionicons} from '@expo/vector-icons';  
import { Picker, selectedValue } from '@react-native-picker/picker';
import * as SQLite from'expo-sqlite';

export default function Homepage({ navigation }) {
  // background img? 
  // current task, find new task, level etc. 
  // stack nav to "favorites"
  // dailies on top of page, disappear when done from flatlist
  // bottom nav to "points" page, show points and reward options
  // swipable component for buying rewards? 
  // text fade in would be cool with jokes etc with react-spring native

  // save blacklisted tasks and faves in sqlite local db
  // when fetching task, check if id matches blacklisted task
  // if does --> redo fetch 
  // if id matches faves 1. heart icon = favorited
  // animation? 

  // tap on daily task = open popup view 
  // simpler than normal view

    //parametrit
    const [type, setType] = useState('');
    const [participants, setParticipants] = useState('');
    const [price, setPrice] = useState('');
    const [acc, setAcc] = useState('');
    const [laskut, setLaskut] = useState([]); 

    const [activity, setActivity] = useState({
        "activity": "Find a new activity!",
        "type": "",
        "participants": null,
        "price": null,
        "link": "",
        "key": "",
        "accessibility": null
        });

    const db = SQLite.openDatabase('Address.db');

    //create list
    useEffect(() => {
        getActivity(); 
        db.transaction(tx => {
            tx.executeSql("create table if not exists fave (id integer primary key not null unique, type text, participants int, price double, link text);");
            }, null, updateList);
      }, [])

       // update list
    const updateList = () => {
        db.transaction(tx => {
              tx.executeSql('select * from fave;', [], (_, { rows }) =>
                  setLaskut(rows._array)
                  );   
              }, null, null);
          }

    // Unfavorite
    const deleteFave = (id) => {
        db.transaction(
            tx => {
            tx.executeSql(`delete from fave where id = ?;`, [id]);
            }, null, updateList
        )    
    }

    // Favorite
    const saveFave = () => {
        db.transaction(tx => {
              tx.executeSql('insert into fave (type, participants, price, link) values (?, ?, ?, ?);',  
              [activity.type, activity.participants, activity.price, activity.link]);    
          }, null, updateList)
    }

    const getActivity = () => {
          fetch(`https://www.boredapi.com/api/activity/?type=${type}&participants=${participants}&price=${price}&accessibility=${acc}`)  
          .then(response => response.json())  
          .then(data => setActivity(data))  
          .catch(error => {         
              Alert.alert('Error', error);   
            });
            console.log(activity);
        }

    return (
      <View style={styles.container}>

        <View style={{backgroundColor: "red"}}> 

        <Text>Parameters: </Text>

        <ListItem>
        <ListItem.Content>
        <ListItem.Title>TYPE</ListItem.Title>
        <ListItem.Input>
        </ListItem.Input>
        </ListItem.Content>
        </ListItem>

        </View>

        <Picker
        selectedValue={type}
        style={{ height: 50, width: 150, backgroundColor: "yellow", borderRadius: 10, borderWidth: 0}}
        onValueChange={(itemValue, itemIndex) => setType(itemValue)}>

        <Picker.Item label="recreational" value="recreational" />
        <Picker.Item label="social" value="social" />
        <Picker.Item label="busywork" value="busywork" />
        <Picker.Item label="cooking" value="cooking" />
        <Picker.Item label="relaxation" value="relaxation" />
        <Picker.Item label="charity" value="charity" />
        <Picker.Item label="education" value="education" />
        <Picker.Item label="DIY" value="diy" />
        <Picker.Item label="music" value="music" />
        <Picker.Item label="reset" value="" />
        </Picker>
        

          
          <Card containerStyle={{width:350}}>
              <Card.Title>{activity.activity}</Card.Title>
              <Card.Divider />

              <Text>Type: {activity.type}</Text>
              <Text>Participants: {activity.participants}</Text>
              <Text>Price: {activity.price}</Text>
              <Text style={{color: 'blue'}}
      onPress={() => Linking.openURL(activity.link)}>{activity.link}</Text> 

              

            <View style={{paddingTop: 20}}>

            <View style={{flexDirection: "row"}}>
            <Ionicons name="heart" size={30} color="red" />
            <Text>                              </Text>
            <Ionicons name="refresh" size={30} color="green" onPress= {getActivity}/>
            <Text>                               </Text>
            <Ionicons name="trash" size={30} color="grey" />
            </View>

            </View>
          </Card>
      
        <StatusBar style="auto" />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});