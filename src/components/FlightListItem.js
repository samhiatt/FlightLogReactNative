import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'; // 2.20.1

const zeroPad = (num) => `00${num}`.slice(-2);
const formatDuration = (total_minutes) => Math.floor(total_minutes/60)+':'+zeroPad(total_minutes%60);

const formatDate = (date) => date? moment(date).format('MM/DD/YY') : '';
const formatTime = (date) => date? moment(date).format('h:mma') : '';

const formatHours = (hoursFloat)=>Math.floor(hoursFloat)+':'+zeroPad(Math.floor((hoursFloat*60)%60));

// const getLandingTime = (launchTime, durationMinutes) => moment(launchTime).add(durationMinutes,'minutes').format('h:mm a');

export const ITEM_HEIGHT=80;

const styles = StyleSheet.create({
  container: { 
    // height: (ITEM_HEIGHT-1), 
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 7,
    margin: 1,
  },
  dataColumn:{
    flex: 1, 
    alignItems: 'center', 
    flexDirection: 'column',
  },
  dataRow: {
    justifyContent: 'center', 
    alignContent:'center', 
    flexDirection: 'row',
    width: '100%',
  },
  comments: {
    flex: 1, 
    flexWrap: 'wrap',
  },
});

export default class FlightListItem extends React.Component {
  shouldComponentUpdate(nextProps/*, nextState*/) {
    return (nextProps.updated_epoch>this.props.updated_epoch);
  }
  static propTypes = {
    flight: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    duration_total_minutes: PropTypes.number.isRequired,
  };
  render(){
    const {comments, date, flight, launch_time_iso, landing_time_iso, 
      duration_total_minutes, altitude_gain, landing_altitude, landing_location, launch_altitude, launch_name, 
      launch_orientation, max_altitude, site_name, total_airtime, vertical_drop, wind_direction, wind_speed, 
      wing_name, xc_miles 
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.dataRow}>
        
          <View style={styles.dataColumn}>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:16, textAlignVertical:'top'}}>{flight}</Text>
              <Text style={{textAlign:'right', flex:1, textAlignVertical:'center', paddingRight:7}}>{formatDate(date)}</Text>
            </View>
            <Text>{formatTime(launch_time_iso)}-{formatTime(landing_time_iso)}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:16}}>
              +{formatDuration(duration_total_minutes)}
              </Text>
              <Text style={{textAlign:'right', textAlignVertical:'center', flex:1, paddingRight: 7}}>
                = {formatHours(total_airtime)}
              </Text>
            </View>
            <Text>{wind_speed? wind_speed+' mph':''}{wind_direction? ' '+wind_direction:''}</Text>
          </View>
          
          <View style={styles.dataColumn}>
            <Text>{site_name}</Text>
            <Text>{launch_name} to {landing_location}</Text>
            <Text>{wing_name}</Text>
          </View>
          
          <View style={styles.dataColumn}>
            <Text>{launch_altitude? launch_altitude+"'":''} {launch_orientation}</Text>
            <Text>{max_altitude? `${max_altitude}\' max` : ''}</Text>
            <Text>{altitude_gain? `${altitude_gain}\' above launch`:''}</Text>
            <Text>{vertical_drop? `${vertical_drop}\' vertical drop`:''}</Text>
          </View>
          
          <View style={styles.dataColumn}>
            <Text>{landing_altitude? landing_altitude+"'":''}</Text>
            <Text>{xc_miles? xc_miles+' mi' : ''}</Text>
          </View>
          
        </View>
        <View style={styles.comments}>
          <Text>{comments}</Text>
        </View>
      </View>
    );
  }
}
