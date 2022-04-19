import { Text, View, FlatList, Image, TouchableOpacity, Button} from "react-native";
import {useEffect, useRef, useState} from "react";
import * as SQLite from'expo-sqlite';
import { Card, ListItem, Icon, CheckBox} from 'react-native-elements';
//import {useSpring, to, animated} from "react-spring"

export default function Favorites(route, navigation){

    const db = SQLite.openDatabase('Address.db');

    const [laskut, setLaskut] = useState([]); 

    useEffect(() => {
       getList(); 
      }, [])

    const getList = () => {
        db.transaction(tx => {
              tx.executeSql('select * from faves;', [], (_, { rows }) =>
                  setLaskut(rows._array)
                  );   
              }, null, null);
              console.log(laskut);
          }

    // Unfavorite
    const deleteFave = (id) => {
        db.transaction(
            tx => {
            tx.executeSql(`delete from faves where id = ?;`, [id]);
            }, null, getList
        )    
    }

    return (
        <View style={{padding: 20}}>

            <FlatList 
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={{width: 400}}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{item.id}</ListItem.Title>
            <ListItem.Subtitle>{item.activity}</ListItem.Subtitle>
            <ListItem.Subtitle>{item.type}</ListItem.Subtitle>
            <ListItem.Subtitle>{item.participants}</ListItem.Subtitle>
            <ListItem.Subtitle>{item.price}</ListItem.Subtitle>
            <ListItem.Subtitle>{item.link}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon type="material" reverse color="red" name="delete" onPress={() => deleteFave(item.id)} />
          </ListItem>
        </View>} 
          data={laskut} 
      />  
        </View>
      );

}