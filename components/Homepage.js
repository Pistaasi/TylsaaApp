import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Text, View, Alert, Image, ScrollView, ImageBackground, Linking, AppState} from 'react-native';
import { Card, ListItem, Icon, CheckBox, Button} from 'react-native-elements'
import { Ionicons} from '@expo/vector-icons';  
import { Picker, selectedValue } from '@react-native-picker/picker';
import * as SQLite from'expo-sqlite';
import { FlatList } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { animated } from "react-spring";
import glow from "@pistaasi/react-native-glow";

const AnimatedIcon = animated(Ionicons); 

export default function Homepage({ navigation }) {
// IMPORTANTÈ

    // change tab bar colors !!!

    // dont let user buy rewards with 0 points

// optimization 
    // points update without button press
    // global variable? 
    // react context? 

// the "mayhaps"
    // text fade in would be cool with jokes etc with react-spring native

    //parametrit
    const [dailies, setDailies] = useState([]);
    const [type, setType] = useState('');
    const [participants, setParticipants] = useState('');
    const [price, setPrice] = useState(false);
    const [cash, setCash] = useState("");
    const [acc, setAcc] = useState('');
    const [laskut, setLaskut] = useState([]); 
    const [points, setPoints] =useState(0); 
    const [banned, setBanned] = useState([]);
    const [activity, setActivity] = useState({
        "activity": "Find a new activity!",
        "type": "",
        "participants": null,
        "price": null,
        "link": "",
        "key": "",
        "accessibility": null
        });

    // open db
    const db = SQLite.openDatabase('Address.db');

    // create tables
    useEffect(() => {
        updateList();
        getActivity(); 
        db.transaction(tx => {
            tx.executeSql("create table if not exists faves (id integer primary key not null unique, activity text, type text, participants int, price double, link text);");
            tx.executeSql("create table if not exists dailies (id integer primary key not null unique, activity text, type text, link text);");
            tx.executeSql("create table if not exists points (id integer primary key not null unique, userPoints int);");
            tx.executeSql("create table if not exists blacklist (id integer primary key not null unique, bannedId text);");
            }, null, updateList);
      }, [])

      // dailies
      useEffect(() => {
        getDailies(); 
        updateBlacklist();

        let currTime = new Date();

        let timeHour = currTime.getHours()
        let timeMinute = currTime.getMinutes();
        let timeHourLeft = (23 - timeHour) * 60; 
        let timeMinLeft = 60 - timeMinute; 
        let secondsLeft = ((timeHourLeft + timeMinLeft) * 60) * 1000; 

          const interval = setInterval(() => {
            console.log("the day has changed!")
            getDailies();
          }, secondsLeft);

        // 86 400 seconds in a day

        // sets points if they don't exist in the db
        try {
          db.transaction(tx => {
            tx.executeSql('select * from points;', [], (_, { rows }) =>
                setPoints(rows._array[0].userPoints)
                );   
            }, console.log(points), null);
        } catch (error) {
          db.transaction(tx => {
         tx.executeSql("INSERT INTO points (userPoints) VALUES (10);");
          }, null, updateList);
        }
        
        console.log(dailies);
        return () => clearInterval(interval);
      }, [])



    // FAVORITES




    // update list (faves list)
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




    // POINTS




    // add points
    const addPoints = () => {
      db.transaction(tx => {
            tx.executeSql('UPDATE points SET userPoints = userPoints + 10 WHERE id = (1)',  
            );    
        }, null, null)
        getActivity();
        updatePoints();
      // add points = pressing done button
  }

  // add points dailies
  const addPointsDailies = (delKey) => {
    db.transaction(tx => {
          tx.executeSql('UPDATE points SET userPoints = userPoints + 20 WHERE id = (1)');
          //tx.executeSql(`delete from dailies where id = ?;`, [id]);    
      }, null, null)
      getDailies();
      updatePoints();
      dailiesDel = dailies.filter(function(item) {
        return item.key != delKey;
    });
      setDailies(dailiesDel);
}

  // update points
  const updatePoints = () => {
    db.transaction(tx => {
          tx.executeSql('select * from points;', [], (_, { rows }) =>
              setPoints(rows._array[0].userPoints)
              );   
          }, console.log(points), null);
      }





    // BLACKLISTING




    const saveBlacklist = () => {
      db.transaction(tx => {
            tx.executeSql('insert into blacklist (bannedId) values (?);',  
            [activity.key]);    
        }, null, updateList)
  }

    const updateBlacklist = () => {
    db.transaction(tx => {
          tx.executeSql('select * from blacklist;', [], (_, { rows }) =>
              setBanned(rows._array)
              );   
          }, console.log(banned), null);
      }




    // get activity
    async function getActivity() {

        updateBlacklist();
        updateList();

        // set price parameter from checker boolean
          if (price === true) {
              setCash("0"); 
          } else {
              setCash(""); 
          }

          // fetch activity, redo fetch until a non banned activity comes up
          fetch(`https://www.boredapi.com/api/activity/?type=${type}&participants=${participants}&price=${cash}&accessibility=${acc}`)  
          .then(response => response.json())  
          .then(data => {
            let i = 0
            while (i < banned.length) {
          
            if (data.key == banned[i].bannedId) {
              console.log("banned id !!!")
              i++;
              getActivity();
              break; 
            } else {
              setActivity(data)
            }
            
            i++;
          }}) 
          .catch(error => {         
              Alert.alert('Error', error.message);   
            });
        }

    // get dailies
    const getDailies = () => {

      let i = 0; 
      if (dailies.length == 3) {
        
      } else if (dailies.length < 1){

        while (i < 3) {
            fetch(`https://www.boredapi.com/api/activity`)  
                  .then(response => response.json())  
                  .then(data => dailies.push(data)) 
                  .catch(error => {         
                      Alert.alert('Error', error);   
                    });
        i++;
      }

      } else if (dailies.length > 3) {
        setDailies([]); 
      }
      }

    // glow effect for favorites
    let glowSettings = glow(1, 10, "red", "#ff599e", true); 
   

    let colors = ['#333C83', '#F24A72', '#EAEA7F'];
    let colorsTitles = ['#F24A72', '#333C83', '#F24A72'];
    let colorsSubtitles = ['#EAEA7F', '#EAEA7F', '#333C83'];

    function glowHeart() {
     let i = 0; 
     let checker = false; 
     while (i < laskut.length) {
      if (activity.activity == laskut[i].activity) {
        checker = true; 
        break; 
      }
       i++;
     }

     if (checker) {
      return(
      <AnimatedIcon name="heart" size={30} color="red" onPress= {saveFave} style={glowSettings}/>);
     } else {
      return(
       <Ionicons name="heart" size={30} color="red" onPress= {saveFave}/>
      );
    }
    }

    return (
      <View style={styles.container}>

        <View style={{flex: 1}}> 

        <Text style={{fontWeight: "bold", fontSize: 20, padding: 5, color: "#FDAF75", alignSelf: "center"}}>
          Parameters </Text>

        <Picker
        selectedValue={type}
        style={{ height: 50, width: 250, backgroundColor: "#F24A72", color: "#333C83", alignSelf: "center"}}
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
        style={{ height: 50, width: 250, backgroundColor: "#FDAF75", color: "#333C83", alignSelf: "center"}}
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
            containerStyle={{backgroundColor: "#EAEA7F", width: 250}}
            textStyle={{color: "#333C83"}}
            center
            title="Free"
            iconType="material"
            checkedIcon="check"
            checkedColor='green'
            uncheckedIcon="clear"
            uncheckedColor='red'
            checked={price}
            onPress={() => setPrice(!price)}
            />

        </View>


          <View style={{backgroundColor: "#FDAF75", flex: 2, width: 415, padding: 20}}>

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
                marginHorizontal: 30,
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
    
            {glowHeart()}
            <Text>                              </Text>
            <Ionicons name="refresh" size={30} color="green" onPress= {getActivity}/>
            <Text>                               </Text>
            <Ionicons name="trash" size={30} color="grey" onPress= {saveBlacklist}/>
            </View>

            </View>
          </Card>

          <Text> </Text>

          <FlatList 
        keyExtractor={item => item.key.toString()} 
        renderItem={({item, index}) => 
        <View style={{width: 380}}>
        <ListItem
        containerStyle={{backgroundColor: colors[index % colors.length]}}>
          <Text style={{color: colorsTitles[index % colorsTitles.length], fontWeight: "bold", fontSize: 30}}>2x</Text>
          <ListItem.Content>
            <ListItem.Title style={{color: colorsTitles[index % colorsTitles.length], fontWeight: "bold"}}>{item.activity}</ListItem.Title>
            <ListItem.Subtitle style={{color: colorsSubtitles[index % colorsSubtitles.length]}}>{item.type}</ListItem.Subtitle>
            <ListItem.Subtitle style={{color: colorsSubtitles[index % colorsSubtitles.length]}} onPress={() => Linking.openURL(item.link)}>{item.link}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon type="material" color="green" name="done" size={40} onPress={() => addPointsDailies(item.key)} />
          </ListItem>
        </View>} 
          data={dailies} 
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