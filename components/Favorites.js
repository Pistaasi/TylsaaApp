import { Text, View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { ListItem, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function Favorites() {

  const db = SQLite.openDatabase('Address.db');

  const [faves, setFaves] = useState([]);

  useEffect(() => {
    getFaves();
  }, [])

  // get favorites 
  const getFaves = () => {
    db.transaction(tx => {
      tx.executeSql('select * from faves;', [], (_, { rows }) =>
        setFaves(rows._array)
      );
    }, null, null);
    console.log(faves);
  }

  // Unfavorite
  const deleteFave = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from faves where id = ?;`, [id]);
      }, null, getFaves
    )
  }

  // changing colors for FlatList
  let colors = ['#333C83', '#F24A72', '#EAEA7F'];
  let colorsTitles = ['#F24A72', '#333C83', '#F24A72'];
  let colorsSubtitles = ['#EAEA7F', '#EAEA7F', '#333C83'];

  return (
    <View style={{ padding: 20, backgroundColor: "#FDAF75", flex: 1 }}>

      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index}) =>
          <View style={{ width: "100%"}}>
            <ListItem 
            containerStyle={{ backgroundColor: colors[index % colors.length] }}>
              <ListItem.Content>
                <ListItem.Title style={{ color: colorsTitles[index % colorsTitles.length], fontWeight: "bold", fontSize: 22}}>
                  {item.activity}</ListItem.Title>
                <ListItem.Subtitle style={{ color: colorsSubtitles[index % colorsSubtitles.length], fontSize: 15}}>
                  {item.type}</ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: colorsSubtitles[index % colorsSubtitles.length]}}>
                  Participants: {item.participants}</ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: colorsSubtitles[index % colorsSubtitles.length] }}>
                  Price: {item.price} </ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: colorsSubtitles[index % colorsSubtitles.length] }}>
                  {item.link}</ListItem.Subtitle>
              </ListItem.Content>
              <Ionicons name="trash" size={40} color={colorsTitles[index % colorsTitles.length]} onPress={() => deleteFave(item.id)} />
            </ListItem>
          </View>}
        data={faves}
      />
    </View>
  );

}