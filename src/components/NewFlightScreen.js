import React, { Component } from 'react';
import { connect } from 'react-redux'; // 5.0.6
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker'; // 1.6.0
import { FormLabel, FormInput } from 'react-native-elements'; // 0.19.0
import Autocomplete from 'react-native-autocomplete-input'; // 3.5.0
import moment from 'moment'; // 2.20.1
import "redux"; // 3.7.2
import {testAction, setStartTime, setEndTime, setDuration, setLaunchName, setDate } from '../flights/actions';
import { sites } from '../../data/stubs';

const timePickerStyle = {
  dateIcon: {
    width:0,
  },
  dateText: {
    color: '#222',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 24,
    marginTop: 0,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10
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
    return (locs.length>1)? locs : [];
  }
  // _getDuration(){
  //   const dt = moment(this.state.landing_time_iso,"h:mm a").diff(moment(this.state.launch_time_iso,"h:mm a"),'minutes');
  //   return (dt)? Math.floor(dt/60)+':'+('00'+dt%60).slice(-2) :'-:-';
  // }
  // _dispatchTestAction(){
  //   this.props.dispatchTestAction();
  // }
  render() {
    return (
      <ScrollView style={styles.container} 
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.header}>
          New Flight
        </Text>
        <FormLabel>Date</FormLabel>
        <DatePicker
          style={{width: 120}}
          date={this.props.date}
          mode="date"
          format="YYYY-MM-DD"
          customStyles={timePickerStyle}
          onDateChange={date => {this.props.setDate(date)}}
        />
        <FormLabel>Start Time</FormLabel>
        <DatePicker
          date={moment(this.props.launch_time_iso).format('h:mm a')}
          mode="time"
          format="h:mm a"
          is24Hour={false}
          customStyles={(this.props.launch_time_iso)?timePickerStyle:{...timePickerStyle, dateText:{color:'#aaa'}}}
          onDateChange={time=>this.props.setStartTime(moment(this.props.date+' '+time).toISOString())}
        />
        <FormLabel>End Time</FormLabel>
        <DatePicker
          date={moment(this.props.landing_time_iso).format('h:mm a')}
          mode="time"
          format="h:mm a"
          is24Hour={false}
          customStyles={(this.props.landing_time_iso)?timePickerStyle:{...timePickerStyle, dateText:{color:'#aaa'}}}
          onDateChange={(time)=>this.props.setEndTime(moment(this.props.date+' '+time).toISOString())}
        />
        <FormLabel>Duration</FormLabel>
        <FormInput keyboardType='numeric' value={this.props.duration_total_minutes} 
          onEndEditing={()=>console.log('TODO: Implement Validation')}
          onChangeText={this.props.setDuration.bind(this)}/>
        
        <Text style={{height:100, alignItems:'center'}} >
          {this.props.launch_time_iso} to {this.props.landing_time_iso} is {this.props.duration_total_minutes}?
        </Text>
        {this.props.validationErrors && this.props.validationErrors.map(err=><Text>{err}</Text>)}
        
        <FormLabel>Takeoff Location</FormLabel>
        <Autocomplete
          autoCapitalize="words"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
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
        <FormLabel>Landing Location</FormLabel>
        <FormInput placeholder=""/>
        <FormLabel>Comments</FormLabel>
        <FormInput multiline placeholder=""/>
      </ScrollView>
    );
  }
}

NewFlightScreen.navigationOptions = {
  title: 'New Flight',
};

const mapStateToProps = (state)=>{
  return {
    // sites:state.sites,
    sites, // use stub
  id: null,
  flight: null,
    date:state.newFlight.date,
    launch_name:state.newFlight.launch_name,
    launch_time_iso:state.newFlight.launch_time_iso,
    duration_total_minutes:state.newFlight.duration_total_minutes,

  site_name: null,
  wing_name: null,
  launch_altitude: null,
  launch_orientation: null,
  wind_speed: null,
  wind_direction: null,
  max_altitude: null,
  landing_zone: null,
  landing_altitude: null,
  xc_miles: null,
  comments: null,

  // derived:
  landing_time_iso:state.newFlight.landing_time_iso,
  launch_time_epoch: null,
  landing_time_epoch: null,
  altitude_gain: null,
  total_airtime: null,
  vertical_drop: null,
  updated_epoch: null,

    validationErrors:state.newFlight.validationErrors,

    isLoggedIn: state.auth.isLoggedIn || state.firebase.isAuthenticated,
    isFirebaseAuthenticated: state.firebase.isAuthenticated, 
  };
}

const mapDispatchToProps = (dispatch, state)=>{
  return {
    dispatchTestAction:()=>{
      console.log("testing action...",testAction('testy'))
      dispatch(testAction('testy'));
    },
    setDate:(time) => {
      dispatch(setDate(time));
    },
    setStartTime:(t)=>{
      dispatch(setStartTime(t))
    },
    setEndTime:(time) => {
      dispatch(setEndTime(time));
    },
    setDuration:(duration) => {
      console.log("Dispatching action",duration);
      dispatch(setDuration(duration));
    },
    setLaunchName:(name)=>{
      console.log("setLaunchName",setLaunchName(name));
      dispatch(setLaunchName(name));
    },
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewFlightScreen);