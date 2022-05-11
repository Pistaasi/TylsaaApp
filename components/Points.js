import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'react-native-elements'
import * as SQLite from 'expo-sqlite';
import TouchableScale from 'react-native-touchable-scale';
import { animated, useSpring, config } from 'react-spring';

const AnimatedText = animated(Text);

export default function Points() {

  const db = SQLite.openDatabase('Address.db');

  const [points, setPoints] = useState(0);
  const [flip, set] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePoints();
    }, 5000);

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
      tx.executeSql('select * from points;', [], (_, { rows }) =>
        setPoints(rows._array[0].userPoints)
      );
    }, null, null);
  }

  const [cat, setCat] = useState({
    "fact": ""
  });
  const [joke, setJoke] = useState({
    "type": ""
  });

  const getCatFact = () => {
    updatePoints()
    if (points == 0) {
      Alert.alert("Need 10 points!")
    } else if (points > 9) {
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

  }

  const getJoke = () => {
    updatePoints()

    if (points == 0) {
      Alert.alert("Need 10 points!")
    } else if (points > 9) {
      fetch(`https://v2.jokeapi.dev/joke/any?safe-mode`)
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
  }

  const props = useSpring({
    from: { opacity: 0, fontSize: 10, color: "#FDAF75" },
    to: { opacity: 1, fontSize: 27, color: "#F24A72" },
    reset: true,
    delay: 400,
    reverse: flip,
    config: config.molasses
  })

  return (
    <View style={styles.container}>
      <Text
        style={ styles.pointsText } onPress={() => updatePoints()}>                                                        {points} points</Text>

      <View style={{ flex: 1 }}>
        <Text style={ styles.titleText }>
          Choose your reward!</Text>

        <Button
          TouchableComponent={TouchableScale}
          friction={90}
          tension={100}
          activeScale={0.95}
          title="CAT FACTS"
          titleStyle={ styles.buttonTitle }
          buttonStyle={ styles.buttonStyle }
          containerStyle={ styles.buttonContainer }
          icon={{
            name: 'arrow-right',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
          iconRight
          iconContainerStyle={ styles.iconContainer }
          onPress={getCatFact}
        />

        <Button
          TouchableComponent={TouchableScale}
          friction={90}
          tension={100}
          activeScale={0.95}
          title="JOKES"
          titleStyle={ styles.buttonTitle }
          buttonStyle={ styles.buttonStyle }
          containerStyle={ styles.buttonContainer }
          icon={{
            name: 'arrow-right',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
          iconRight
          iconContainerStyle={ styles.iconContainer }
          onPress={getJoke}
        />

      </View>

      <View style={ styles.lowCont }>
        {cat.fact != "" ?
          <AnimatedText style={{ ...props, ...styles.jokeText }}
          >{cat.fact}</AnimatedText> : null}

        {joke.type == "single" ?
          <AnimatedText style={{ ...props, ...styles.jokeText }}
          >{joke.joke}</AnimatedText> : null}

        {joke.type == "twopart" ?
          <View>
            <Text style={{ ...styles.jokeText, fontSize: 27, color: "#F24A72" }}
            >{joke.setup}</Text>
            <AnimatedText style={{ ...props, ...styles.jokeText}}>{joke.delivery}
            </AnimatedText>
          </View> : null}

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
  jokeText: {
    fontWeight: "bold", 
    padding: 20, 
    alignSelf: "center", 
    textAlign: "center", 
    paddingTop: 10
  }, 
  lowCont: {
    backgroundColor: "#FDAF75", 
    flex: 2, 
    width: "100%"
  }, 
  buttonStyle: {
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 20,
    backgroundColor: "rgba(242, 74, 114, 1)"
  }, 
  iconContainer: {
    marginLeft: 10, 
    marginRight: -10
  }, 
  buttonTitle: {
    fontWeight: 'bold', 
    fontSize: 18
  }, 
  buttonContainer: {
    width: 200,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center"
  }, 
  pointsText: {
    fontWeight: "bold", 
    fontSize: 20, 
    color: "#FDAF75"
  }, 
  titleText: {
    fontWeight: "bold", 
    fontSize: 27, 
    padding: 20, 
    color: "#FDAF75"
  }

});