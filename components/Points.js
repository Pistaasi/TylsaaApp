import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Text, View, Alert, TextInput, Image, ScrollView, ImageBackground, Linking} from 'react-native';
import { Card, ListItem, Icon, Avatar, Button, Header} from 'react-native-elements'
import { Ionicons} from '@expo/vector-icons';  
import { Picker, selectedValue } from '@react-native-picker/picker';
import * as SQLite from'expo-sqlite';
import TouchableScale from 'react-native-touchable-scale';
import {LinearGradient} from 'expo-linear-gradient';

export default function Points (){

    const db = SQLite.openDatabase('Address.db');

    const [points, setPoints] = useState(0); 

    useEffect(() => {
       updatePoints();
      }, [])

    // - points
    const minusPoints = () => {
      db.transaction(tx => {
            tx.executeSql('UPDATE points SET userPoints = userPoints - 10 WHERE id = (1)',  
            );    
        }, null, updatePoints)
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

    const [cat, setCat] = useState({
        "fact": ""
        });
    const [joke, setJoke] = useState({
        "type": ""
        });

    const getCatFact = () => {
        fetch(`https://catfact.ninja/fact`)  
        .then(response => response.json())  
        .then(data => setCat(data))  
        .catch(error => {         
            Alert.alert('Error', error);   
          });
          console.log(cat);
          minusPoints();
          updatePoints();
          setJoke({
            "type": ""
            });
      }

      const getJoke = () => {
        fetch(`https://v2.jokeapi.dev/joke/any`)  
        .then(response => response.json())  
        .then(data => setJoke(data))  
        .catch(error => {         
            Alert.alert('Error', error);   
          });
          console.log(joke);
          minusPoints();
          updatePoints();
          setCat({
            "fact": ""
            });
      }

    return (
        <View style={styles.container}>
            <Text 
            style={{fontWeight: "bold", fontSize: 20, color: "#FDAF75"}} onPress={() => updatePoints()}>                                                        {points} points</Text>

           <View style={{flex: 1}}>
               <Text style={{fontWeight: "bold", fontSize: 27, padding: 20, color: "#FDAF75"}}>
                   Choose your reward!</Text>
              
               <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="CAT FACTS"
              titleStyle={{ fontWeight: 'bold', fontSize: 18}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: "rgba(242, 74, 114, 1)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress= {getCatFact}
            />

               <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="JOKES"
              titleStyle={{ fontWeight: 'bold', fontSize: 18}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: "rgba(242, 74, 114, 1)"
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress= {getJoke}
            />   
               
           </View> 

           <View style={{backgroundColor: "#FDAF75", flex: 2, width: 410}}>
               {cat.fact != ""?  
               <Text>{cat.fact}</Text>: null }

               {joke.type == "single"?  
               <Text>{joke.joke}</Text>: null }

               {joke.type == "twopart"?  
               <Text>{joke.setup} {joke.delivery}</Text>: null }

               <Text>{joke.type}</Text>

           </View>
           
        <StatusBar style="auto" />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333C83',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  }
});