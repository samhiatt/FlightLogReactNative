import React, { Component } from 'react';
import { connect } from 'react-redux'; // 5.0.6
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import DatePicker from 'react-native-datepicker'; // 1.6.0
import Autocomplete from 'react-native-autocomplete-input'; // 3.5.0
import moment from 'moment'; // 2.20.1
import "redux"; // 3.7.2
import {testAction, setStartTime, setEndTime, setDuration, setLaunchName, setDate,
        setSiteName, setLandingLocation, setComments, setWingName, setWindSpeed, setWindDirection,
        setLaunchOrientation, setLaunchAltitude, setMaxAltitude, setLandingAltitude, setXcMiles, submitNewFlight
 } from '../flights/actions';
import firebase from 'firebase';
import { sites } from '../../data/stubs';

const timePickerStyle = {
  dateIcon: {
    width:0,
  },
  dateText: {
    color: '#222',
  },
  dateInput: {

  },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  header: {
    margin: 24,
    marginTop: 0,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  autocompleteInputContainer: {
    borderColor:'black',
    // marginLeft: 10,
    // marginRight: 10
  },
});

class NewFlightScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      editingStartingLocation: false,
      editingLandingLocation: false,
    };
  }
  _getFilteredStartingLocations(){
    const { sites, launch_name } = this.props;
    const locs = sites[0].locations.filter(loc=>loc.name.match(RegExp(launch_name,'i')));
    // return (locs.length>1)? locs : [];
    return locs;
  }
  // _getDuration(){
  //   const dt = moment(this.state.landing_time_iso,"h:mm a").diff(moment(this.state.launch_time_iso,"h:mm a"),'minutes');
  //   return (dt)? Math.floor(dt/60)+':'+('00'+dt%60).slice(-2) :'-:-';
  // }
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={80}>  
      <ScrollView contentContainerStyle={styles.container} >
      <View style={{flex:1}}>
        <Text style={styles.header}>
          New Flight
        </Text>

        {false && this.props.validationErrors && this.props.validationErrors.map(err=><Text>{err}</Text>)}

        <View style={{flexDirection:'row', width:'100%', padding: 3}}>
          <View style={{flex:1}}>
            <Text>Date</Text>
            <DatePicker
              style={{width: '100%' }}
              date={this.props.date}
              mode="date"
              format="YYYY-MM-DD"
              customStyles={timePickerStyle}
              onDateChange={date => {this.props.setDate(date)}}
            />
          </View>
          <View style={{flex:1}}>
            <Text>Launch</Text>
            <DatePicker
              style={{width: '100%' }}
              date={moment(this.props.launch_time_iso).format('h:mm a')}
              mode="time"
              format="h:mm a"
              is24Hour={false}
              customStyles={(this.props.launch_time_iso)?timePickerStyle:{...timePickerStyle, dateText:{color:'#aaa'}}}
              onDateChange={time=>this.props.setStartTime(moment(this.props.date+' '+time,"YYY-MM-DD h:mm a").toISOString())}
            />
          </View>
          <View style={{flex:1}}>
            <Text>Landing</Text>
            <DatePicker
              style={{width: '100%' }}
              date={moment(this.props.landing_time_iso).format('h:mm a')}
              mode="time"
              format="h:mm a"
              is24Hour={false}
              customStyles={(this.props.landing_time_iso)?timePickerStyle:{...timePickerStyle, dateText:{color:'#aaa'}}}
              onDateChange={(time)=>this.props.setEndTime(moment(this.props.date+' '+time,"YYY-MM-DD h:mm a").toISOString())}
            />
          </View>
          <View style={{flex:1}}>
            <Text>Duration</Text>
            <TextInput keyboardType='numeric' value={(this.props.duration_total_minutes!=null)?this.props.duration_total_minutes.toString():''} 
              inputStyle={{ width:'100%', color: 'black', fontSize: 14, textAlign:'center' }}
              onEndEditing={()=>console.log('TODO: Implement Validation')}
              onChangeText={this.props.setDuration.bind(this)}/>
          </View>
        </View>
        
        <View style={{flexDirection:'row', width:'100%'}}>

          <View style={{flex:1, padding:3}}>
            <Text>Site</Text>
            <TextInput placeholder="" value={this.props.site_name}
              onChangeText={this.props.setSiteName.bind(this)} />
          </View>

          <View style={{flex:1, padding:3}}>
            <Text>Wing Name</Text>
            <TextInput placeholder="" value={this.props.wing_name}
              onChangeText={this.props.setWingName.bind(this)}
            />
          </View>

        </View>
        
        <View style={{flexDirection:'row', width:'100%'}}>

          <View style={{flex:1, padding:3}}>
            <Text>Takeoff</Text>
            <Autocomplete
              autoCapitalize="words"
              autoCorrect={false}
              inputContainerStyle={styles.autocompleteInputContainer}
              data={this.state.editingStartingLocation? this._getFilteredStartingLocations() : []}
              defaultValue={this.props.launch_name}
              onChangeText={text => this.props.setLaunchName(text) }
              placeholder="Site name"
              renderItem={({ name }) => (
                <TouchableOpacity style={{height:30}} onPress={() => {
                    console.log("pressed",name);
                    this.props.setLaunchName(name);
                  }}>
                  <Text style={{fontSize:18}}>{name}</Text>
                </TouchableOpacity>
              )}
              onEndEditing={()=>this.setState({'editingStartingLocation':false})}
              onFocus={()=>this.setState({'editingStartingLocation':true})}
            />
          </View>
          <View style={{flex:1, padding:3}}>
            <Text>Launch Altitude</Text>
            <TextInput placeholder="" keyboardType="numeric"
              value={(this.props.launch_altitude!=null)?this.props.launch_altitude.toString():''}
              onChangeText={this.props.setLaunchAltitude.bind(this)}
            />
          </View>
          <View style={{flex:1, padding:3}}>
            <Text>Launch Orientation</Text>
            <TextInput placeholder="" autoCapitalize='characters'
              value={this.props.launch_orientation}
              onChangeText={this.props.setLaunchOrientation.bind(this)}
            />
          </View>
        </View>

        <View style={{flexDirection:'row', width:'100%'}}>

          <View style={{flex:1, padding:3}}>
            <Text>Wind Speed</Text>
            <TextInput keyboardType="numeric"
              value={this.props.wind_speed}
              onChangeText={this.props.setWindSpeed.bind(this)}
              style={{width:'100%' }} placeholder=""/>
          </View>
          <View style={{flex:1, padding:3}}>
            <Text>Wind Direction</Text>
            <TextInput autoCapitalize='characters'
              value={this.props.wind_direction}
              onChangeText={this.props.setWindDirection.bind(this)}
              style={{width:'100%' }} placeholder=""/>
          </View>
        </View>
        
        <View style={{flexDirection:'row', width:'100%'}}>

          <View style={{flex:1, padding:3}}>
            <Text>Landing Location</Text>
            <TextInput value={this.props.landing_location}
            onChangeText={this.props.setLandingLocation.bind(this)}
            style={{width:'100%' }} placeholder=""/>
          </View>
          <View style={{flex:1, padding:3}}>
            <Text>Landing Altitude</Text>
            <TextInput keyboardType="numeric"
              value={(this.props.landing_altitude!=null)?this.props.landing_altitude.toString():''}
              onChangeText={this.props.setLandingAltitude.bind(this)}
              style={{width:'100%' }} placeholder=""/>
          </View>
        </View>

        <View style={{flexDirection:'row', width:'100%'}}>

          <View style={{flex:1, padding:3}}>
            <Text>Max Altitude</Text>
            <TextInput keyboardType="numeric"
              value={(this.props.max_altitude!=null)?this.props.max_altitude.toString():''}
              onChangeText={this.props.setMaxAltitude.bind(this)}
              style={{width:'100%' }} placeholder=""/>
          </View>
          <View style={{flex:1, padding:3}}>
            <Text>XC Miles</Text>
            <TextInput keyboardType="numeric"
              value={(this.props.xc_miles!=null)?this.props.xc_miles.toString():''}
              onChangeText={this.props.setXcMiles.bind(this)}
              style={{width:'100%' }} placeholder=""/>
          </View>
        </View>

        <Text>Comments</Text>
        <TextInput multiline placeholder="" value={this.props.comments}
          onChangeText={this.props.setComments.bind(this)}
        />


        <Button
          title='Submit'
          style={{height:70}}
          onPress={this.props.submitNewFlight.bind(this)}
        />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
/*
        <FormLabel>Takeoff Location</FormLabel>
        <Autocomplete
          autoCapitalize="words"
          autoCorrect={false}
          inputContainerStyle={styles.autocompleteInputContainer}
          data={this.state.editingStartingLocation? this._getFilteredStartingLocations() : []}
          defaultValue={this.props.launch_name}
          onChangeText={text => this.props.setLaunchName(text) }
          placeholder="Site name"
          renderItem={({ name }) => (
            <TouchableOpacity style={{height:30}} onPress={() => {
                console.log("pressed",name);
                this.props.setLaunchName(name);
              }}>
              <Text style={{fontSize:18}}>{name}</Text>
            </TouchableOpacity>
          )}
          onEndEditing={()=>this.setState({'editingStartingLocation':false})}
          onFocus={()=>this.setState({'editingStartingLocation':true})}
        />
*/
NewFlightScreen.navigationOptions = {
  title: 'New Flight',
};

const mapStateToProps = (state)=>{
  return {
    // sites:state.sites,
    sites, // use stub
    date:state.newFlight.date,
    launch_time_iso:state.newFlight.launch_time_iso,
    duration_total_minutes:state.newFlight.duration_total_minutes,
    launch_name:state.newFlight.launch_name,
    site_name: state.newFlight.site_name,
    landing_location: state.newFlight.landing_location,

    comments: state.newFlight.comments,
    wing_name: state.newFlight.wing_name, // TODO: implement lastFlight || state.lastFlight.wing_name
  launch_altitude: state.newFlight.launch_altitude,
  launch_orientation: state.newFlight.launch_orientation,
  wind_speed: state.newFlight.wind_speed,
  wind_direction: state.newFlight.wind_direction,
  max_altitude: state.newFlight.max_altitude,
  landing_altitude: state.newFlight.landing_altitude,
  xc_miles: state.newFlight.xc_miles,

  // derived:
  id: null,
  flight: null,
  landing_time_iso:state.newFlight.landing_time_iso,
  altitude_gain: null,
  total_airtime: null,
  vertical_drop: null,
  updated_epoch: null,

    validationErrors:state.newFlight.validationErrors,

    isLoggedIn: state.auth.isLoggedIn || state.firebase.isAuthenticated,
    isFirebaseAuthenticated: state.firebase.isAuthenticated, 
  };
}

const mapDispatchToProps =  {
    setDate:(time)=>(dispatch,getState) => {
      dispatch(setDate(time));
    },
    setStartTime:(t)=>(dispatch,getState)=>{
      dispatch(setStartTime(t))
    },
    setEndTime:(time)=>(dispatch,getState) => {
      dispatch(setEndTime(time));
    },
    setDuration:(duration)=>(dispatch,getState) => {
      console.log("Dispatching action",duration);
      dispatch(setDuration(duration));
    },
    setSiteName:(name)=>(dispatch,getState)=>{
      console.log("setSiteName",setSiteName(name));
      dispatch(setSiteName(name));
    },
    setLaunchName:(name)=>(dispatch,getState)=>{
      console.log("setLaunchName",setLaunchName(name));
      dispatch(setLaunchName(name));
    },
    setLandingLocation:(name)=>(dispatch,getState)=>{
      console.log("setLandingLocation",setLandingLocation(name));
      dispatch(setLandingLocation(name));
    },
    setWingName:(wing_name)=>(dispatch,getState)=>{
      console.log("setComments",setWingName(wing_name));
      dispatch(setWingName(wing_name));
    },
    setWindSpeed:(wind_speed)=>(dispatch,getState)=>{
      console.log("setWindSpeed",setWindSpeed(wind_speed));
      dispatch(setWindSpeed(wind_speed));
    },
    setWindDirection:(wind_direction)=>(dispatch,getState)=>{
      console.log("setWindDirection",setWindDirection(wind_direction));
      dispatch(setWindDirection(wind_direction));
    },
    setLaunchOrientation:(launch_orientation)=>(dispatch,getState)=>{
      console.log("setLaunchOrientation",setLaunchOrientation(launch_orientation));
      dispatch(setLaunchOrientation(launch_orientation));
    },
    setLaunchAltitude:(launch_altitude)=>(dispatch,getState)=>{
      console.log("setLaunchAltitude",setLaunchAltitude(launch_altitude));
      dispatch(setLaunchAltitude(launch_altitude));
    },
    setMaxAltitude:(max_altitude)=>(dispatch,getState)=>{
      console.log("setMaxAltitude",setMaxAltitude(max_altitude));
      dispatch(setMaxAltitude(max_altitude));
    },
    setLandingAltitude:(landing_altitude)=>(dispatch,getState)=>{
      console.log("setLandingAltitude",setLandingAltitude(landing_altitude));
      dispatch(setLandingAltitude(landing_altitude));
    },
    setXcMiles:(xc_miles)=>(dispatch,getState)=>{
      console.log("setXcMiles",setXcMiles(xc_miles));
      dispatch(setXcMiles(xc_miles));
    },
    setComments:(comments)=>(dispatch,getState)=>{
      console.log("setComments",setComments(comments));
      dispatch(setComments(comments));
    },
    submitNewFlight:(e)=>(dispatch,getState)=>{
      const state = getState();
      const ref = state.firebase.auth.uid + '/flight_log/';
      // Set flight number before submitting 
      const newFlight = { ...state.newFlight, 
        flight: state.flights.list.length+1,
        updated_epoch: firebase.database.ServerValue.TIMESTAMP,
      };
      console.log("Submitting new flight:",newFlight);
      dispatch(submitNewFlight(newFlight, ref));
    },
  };

export default connect(mapStateToProps,mapDispatchToProps)(NewFlightScreen);