import React from 'react';
import {Alert} from 'react-native';
import Loading from "./Loading";
import * as Location from 'expo-location';
import axios from "axios";
import Weather from "./Weather";


const API_KEY = "7d12558dfca8a1e443c68091eb24d35f";

export default class extends React.Component{
  
  // state 초기화
  state = {
    isLoading : true
  };

  getWeather = async(latitude, longitude) => {
    const {
      data : {
        main :{temp},
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );

    this.setState({
      isLoading: false, 
      condition: weather[0].main, 
      temp
    });

  };

  getLocation = async() => {
   
    try {
      // 퍼미션을 먼저 확인함.
      await Location.requestPermissionsAsync();

      // coords(오브젝트)의 latitude와 longitude를 가져옴
      const { 
        coords: {latitude, longitude} 
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);
     
    } catch (error) {
      Alert.alert("Can't find you.","So sad");
    }  
  };

  //- 첫 렌더링을 다 마친 후 실행되는 메소드.
  componentDidMount(){
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state; // state 선언
    return (isLoading ? <Loading />: <Weather temp={Math.round(temp)} condition={condition}/>); //반올림
  }
}


