import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Vibration,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const PlayMaths = ({ route, navigation }) => {
  const { icon, digits, level, title } = route.params;
  const [resultVal, setResult] = useState(null);
  navigation.setOptions({
    title: title,
    headerStyle:
      resultVal === "Correct" || resultVal === null
        ? { backgroundColor: "#93f5a6" }
        : { backgroundColor: "#f27272" },
  });
  // navigation.setParams({ headerColor: "green" });
  // const [submitVal, setSubmitVal] = useState(null);
  // resultVal === "Correct" || resultVal === null
  //   ? navigation.setParams({ headerColor: "green" })
  //   : null;
  // console.log(navigation);
  const input = useRef(null);
  const soundClean = useRef(true);
  const [endResult, setEndResult] = useState(null);

  // console.log("this is render");
  // console.log(digits);
  let digit1;
  let digit2;
  let result;
  let prevResult;
  let font;
  useEffect(() => {
    soundClean.current = true;
    return () => {
      soundClean.current = false;

      prevResult = resultVal;
      // console.log(prevResult);
      // console.log(soundClean.current);

      // soundObject.unloadAsync();
      // soundObject = new Audio.Sound();
    };
  });
  //  useEffect(() => {
  //   console.log("in Use Effect");
  switch (digits) {
    case 1:
      digit1 = getRndInteger(1, 9, level);
      digit2 = getRndInteger(1, 9, level);
      font = 90;
      break;
    case 2:
      digit1 = getRndInteger(10, 99, level);
      digit2 = getRndInteger(10, 99, level);
      font = 80;
      break;
    case 3:
      digit1 = getRndInteger(100, 999, level);
      digit2 = getRndInteger(100, 999, level);
      font = 70;
      break;
    default:
      digit1 = getRndInteger(1000, 9999, level);
      digit2 = getRndInteger(1000, 9999, level);
      font = 60;
  }
  //  useEffect(() => {
  // console.log(font);
  switch (icon) {
    case "plus":
      // console.log(typeof parseFloat(digit1));
      // console.log(digit2);
      result = parseFloat(digit1) + parseFloat(digit2);

      break;
    case "minus":
      result = parseFloat(digit1) - parseFloat(digit2);
      break;
    case "multiplication":
      result = parseFloat(digit1) * parseFloat(digit2);
      break;
    case "square-root":
      result = Math.sqrt(digit2).toFixed(2);
      break;
    case "cube-outline":
      result = Math.cbrt(digit2).toFixed(2);
      break;
    default:
      result = (parseFloat(digit1) / parseFloat(digit2)).toFixed(2);
  }
  // }, []);
  // function getRndInteger(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
  function getRndInteger(min, max, decimalPlaces) {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    if (decimalPlaces === 0) {
      return Math.floor(rand * power) / power;
    } else if (decimalPlaces === 1) {
      return parseFloat(Math.floor(rand * power) / power).toFixed(1);
    } else {
      return parseFloat(Math.floor(rand * power) / power).toFixed(2);
    }
  }

  const handelSubmit = async (e) => {
    const soundObject = new Audio.Sound();
    console.log("Ans:", result);
    console.log("given:", parseFloat(e.nativeEvent.text));
    if (result == parseFloat(e.nativeEvent.text)) {
      setResult("Correct");
      try {
        // await Audio.setIsEnabledAsync(true);
        if (soundClean.current) {
          await soundObject.loadAsync(require("../../assets/right.mp3"));
          const status = await soundObject.playAsync();
          // console.log(status);
          setTimeout(() => {
            soundObject.unloadAsync();
          }, status.durationMillis);
        }
      } catch (err) {
        console.warn("Couldn't Play audio", err);
      }
    } else {
      setResult("Wrong");
      try {
        // await Audio.setIsEnabledAsync(true);
        if (soundClean.current) {
          await soundObject.loadAsync(require("../../assets/wrong.mp3"));
          const status = await soundObject.playAsync();
          // console.log(status);
          setTimeout(() => {
            soundObject.unloadAsync();
          }, status.durationMillis);
        }
      } catch (err) {
        console.warn("Couldn't Play audio", err);
      }

      Vibration.vibrate(400);
    }
    // soundObject.stopAsync();
    if (input.current) {
      input.current.clear();
      // input.current.focus();
    }
    if (prevResult !== resultVal) {
      setEndResult(Math.random());
    }
    // setTerm(null);
  };

  return (
    <>
      <LinearGradient
        style={[styles.topView]}
        start={[0.5, 0]}
        end={[0.5, 0.8]}
        colors={["#495057", "#0D1517"]}
      >
        <View style={styles.main}>
          <MaterialCommunityIcons
            style={{ color: "#6EECB3", alignSelf: "center", paddingBottom: 30 }}
            name={icon}
            size={font + 60}
          />
          <View style={styles.innerMain}>
            {icon === "cube-outline" || icon === "square-root" ? null : (
              <Text style={[styles.text, { fontSize: font }]}>{digit1}</Text>
            )}

            <Text
              style={[styles.text, { borderBottomWidth: 1, fontSize: font }]}
            >
              {digit2}
            </Text>

            {/* <Text style={styles.result}>{result}</Text> */}
            <TextInput
              ref={input}
              style={styles.result}
              placeholder="**"
              keyboardType="numeric"
              autoFocus={true}
              blurOnSubmit={false}
              // value={term}
              // onChangeText={handelTerm}
              onSubmitEditing={(e) => handelSubmit(e)}
            />
          </View>
        </View>
        {icon === "square-root" || icon === "cube-outline" ? (
          <Text style={styles.note}>
            NOTE : Give the solution upto 2 decimal places
          </Text>
        ) : null}
        <Text
          style={[
            styles.resultCheck,
            resultVal === "Correct" || resultVal === null
              ? { backgroundColor: "#93f5a6" }
              : { backgroundColor: "#f27272" },
          ]}
        >
          {resultVal}
        </Text>
      </LinearGradient>
      <StatusBar
        backgroundColor={
          resultVal === "Correct" || resultVal === null ? "#93f5a6" : "#f27272"
        }
      />
    </>
  );
};
const styles = StyleSheet.create({
  note: { color: "white", textAlign: "center" },
  resultCheck: {
    // backgroundColor: "#6EECB3",
    color: "white",
    textAlign: "center",
    // width: ,
    // alignSelf: "center",
    // borderRadius: 12,
    fontSize: 30,
    // paddingVertical: 5,
  },
  result: {
    color: "#6EECB3",
    fontWeight: "bold",
    fontSize: 40,
    fontFamily: "sans-serif-thin",
    marginRight: 10,
    // alignSelf: "flex-start",
    // borderColor: "orange",
    // borderWidth: 1,
    // paddingLeft: 50,
  },
  text: {
    color: "#FAFEFF",
    fontWeight: "bold",
    // fontSize: 100,
    fontFamily: "sans-serif-thin",
    justifyContent: "space-around",
    borderColor: "#6EECB3",
  },
  innerMain: {
    flexDirection: "column",
    // borderColor: "orange",
    // borderWidth: 1,
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 20,

    // fontSize: 15,
    // color: "#6EECB3",
  },
  main: {
    flexDirection: "row",

    height: "60%",
    flex: 1,
  },
  topView: {
    height: "100%",
    // paddingTop: 10,
  },
});
export default PlayMaths;
