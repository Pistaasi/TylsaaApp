import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Text, View, Alert, TextInput, Image, ScrollView, ImageBackground, Linking} from 'react-native';
import { Card, ListItem, Icon, CheckBox, Button} from 'react-native-elements'
import { Ionicons} from '@expo/vector-icons';  
import { Picker, selectedValue } from '@react-native-picker/picker';
import * as SQLite from'expo-sqlite';
import { FlatList } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import TouchableScale from 'react-native-touchable-scale';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function Homepage({ navigation }) {
  // background img? 
  // current task, find new task, level etc. 
  // dailies
  // stack nav to "favorites"
  // dailies on top of page, disappear when done from flatlist
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
    const [price, setPrice] = useState(false);
    const [cash, setCash] = useState("");
    const [acc, setAcc] = useState('');
    const [laskut, setLaskut] = useState([]); 
    const [points, setPoints] =useState(0); 

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
        updateList();
        getActivity(); 
        db.transaction(tx => {
            tx.executeSql("create table if not exists faves (id integer primary key not null unique, activity text, type text, participants int, price double, link text);");
            tx.executeSql("create table if not exists points (id integer primary key not null unique, userPoints int);");
            tx.executeSql("create table if not exists blacklist (id integer primary key not null unique, bannedId text);");
            }, null, updateList);
            console.log(laskut); 
      }, [])

       // update list
    const updateList = () => {
        db.transaction(tx => {
              tx.executeSql('select * from faves;', [], (_, { rows }) =>
                  setLaskut(rows._array)
                  );   
              }, null, null);
          }

    // Unfavorite
    const deleteFave = (id) => {
        db.transaction(
            tx => {
            tx.executeSql(`delete from faves where id = ?;`, [id]);
            }, null, updateList
        )    
    }

    // Favorite
    const saveFave = () => {
        db.transaction(tx => {
              tx.executeSql('insert into faves (activity, type, participants, price, link) values (?, ?, ?, ?, ?);',  
              [activity.activity, activity.type, activity.participants, activity.price, activity.link]);    
          }, null, updateList)
          console.log(laskut);
    }

    // add points
    const addPoints = () => {
      let pointsDB = points + 10; 
      db.transaction(tx => {
            tx.executeSql('UPDATE points SET userPoints = (?) WHERE id = (1)',  
            [pointsDB]);    
        }, null, setPoints(pointsDB))
        console.log(points);
        getActivity();
  }

  // update points
  const updatePoints = () => {
    db.transaction(tx => {
          tx.executeSql('select * from points;',[], (_, { rows }) =>
              setPoints(rows._array[0].userPoints)
              );   
          }, null, null);
          console.log(points);
      }


    // get activity
    const getActivity = () => {

          if (price === true) {
              setCash("0"); 
          } else {
              setCash(""); 
          }

          fetch(`https://www.boredapi.com/api/activity/?type=${type}&participants=${participants}&price=${cash}&accessibility=${acc}`)  
          .then(response => response.json())  
          .then(data => setActivity(data))  
          .catch(error => {         
              Alert.alert('Error', error);   
            });
            console.log(activity);
        }

    return (
      <View style={styles.container}>

        <View style={{flex: 1}}> 

        <Text>Parameters: </Text>

        <Picker
        selectedValue={type}
        style={{ height: 50, width: 250, backgroundColor: "yellow", borderRadius: 10, borderWidth: 0}}
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

        <Picker
        selectedValue={participants}
        style={{ height: 50, width: 250, backgroundColor: "green", borderRadius: 10, borderWidth: 0}}
        onValueChange={(itemValue, itemIndex) => setParticipants(itemValue)}>

        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="8" value="8" />
        <Picker.Item label="reset" value="" />
        </Picker>

        <CheckBox
            center
            title="Free?"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={price}
            onPress={() => setPrice(!price)}
            />

        </View>


          <View style={{backgroundColor: "#FDAF75", flex: 2, width: 415, padding: 20}}>

            <Text>{points}</Text>
          <View style={{flexDirection: "row"}}>
          <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="FAVORITES"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: "rgba(242, 74, 114, 1)"
                
              }}
              containerStyle={{
                width: 150,
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              icon={{
                name: 'heart',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => navigation.navigate('Favorites')}
            />

              <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="DONE   🎉"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: "rgba(242, 74, 114, 1)"
                
              }}
              containerStyle={{
                width: 110,
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={addPoints}
            />
            </View>

          <Card containerStyle={{width:350, backgroundColor: "#333C83"}}
          wrapperStyle={{backgroundColor: "#333C83"}}>
              <Card.Title style={{color: "#F24A72"}}>{activity.activity}</Card.Title>
              <Card.Divider />

              <Text style={{color: "#EAEA7F"}}>Type: {activity.type}</Text>
              <Text style={{color: "#EAEA7F"}}>Participants: {activity.participants}</Text>
              <Text style={{color: "#EAEA7F"}}>Price: {activity.price}</Text>
              <Text style={{color: "#FDAF75"}}
      onPress={() => Linking.openURL(activity.link)}>{activity.link}</Text> 

              

            <View style={{paddingTop: 20}}>

            <View style={{flexDirection: "row"}}>
            <Ionicons name="heart" size={30} color="red" onPress= {saveFave}/>
            <Text>                              </Text>
            <Ionicons name="refresh" size={30} color="green" onPress= {getActivity}/>
            <Text>                               </Text>
            <Ionicons name="trash" size={30} color="grey" />
            </View>

            </View>
          </Card>

          <Text> </Text>

          <FlatList 
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={{width: 400}}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{item.id}</ListItem.Title>
            <ListItem.Subtitle>{item.activity}</ListItem.Subtitle>
            <ListItem.Subtitle>{item.type}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon type="material" reverse color="red" name="delete" onPress={() => deleteFave(item.id)} />
          </ListItem>
        </View>} 
          data={laskut} 
      />  
          </View>
      
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
    backgroundColor: '#333C83'
  },
});