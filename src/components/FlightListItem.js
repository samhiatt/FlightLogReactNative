import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'; // 2.20.1

const zeroPad = (num) => `00${num}`.slice(-2);
const formatDuration = (total_minutes) => Math.floor(total_minutes/60)+':'+zeroPad(total_minutes%60);

const formatDate = (date) => date? moment(date).format('MM/DD/YY') : '';
const formatTime = (date) => date? moment(date).format('h:mma') : '';

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
  flightNumber: {
    fontWeight: 'bold',
    // alignSelf: 'center',
    paddingRight: 3,
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
    // TODO: Add check for updated value
    return (nextProps.flight!=this.props.flight);
  }
  static propTypes = {
    flight: PropTypes.object.isRequired,
  };
  render(){
    const {comments, date, flight, /*launch_time_epoch,*/ launch_time_iso, /*landing_time_epoch,*/ landing_time_iso, 
      duration_total_minutes, altitude_gain, landing_altitude, landing_zone, launch_altitude, launch_name, 
      launch_orientation, max_altitude, site_name, total_airtime, vertical_drop, wind_direction, wind_speed, 
      wing_name, xc_miles 
    } = this.props.flight;
    return (
      <View style={styles.container}>
        <View style={styles.dataRow}>
          <Text style={styles.flightNumber}>{flight}</Text>
          <View style={{...styles.dataColumn, flex:2}}>
            <Text>{formatDate(date)}</Text>
            <Text>{formatTime(launch_time_iso)}-{formatTime(landing_time_iso)}</Text>
            <Text>{wind_speed? wind_speed+' mph':''}{wind_direction? ' '+wind_direction:''}</Text>
            <Text>{wing_name}</Text>
          </View>
          <View style={{...styles.dataColumn, flex:2}}>
            <Text>{site_name}</Text>
            <Text>{launch_name} to {landing_zone}</Text>
            <Text>{launch_altitude? launch_altitude+"'":''} {launch_orientation}</Text>
          </View>
          <View style={styles.dataColumn}>
            <Text>{max_altitude? `${max_altitude}\' max` : ''}</Text>
            <Text>{altitude_gain? `${altitude_gain}\' above launch`:''}</Text>
            <Text>{vertical_drop? `${vertical_drop}\' vertical drop`:''}</Text>
          </View>
          <View style={styles.dataColumn}>
            <Text>{landing_altitude? landing_altitude+"'":''}</Text>
            <Text>{xc_miles? xc_miles+' mi.' : ''}</Text>
          </View>
          <View style={styles.dataColumn}>
            <Text>{formatDuration(duration_total_minutes)}</Text>
            <Text>{total_airtime} hrs total</Text>
          </View>
        </View>/* end dataRow*/
        <View style={styles.comments}>
          <Text>{comments}</Text>
        </View>
      </View>/*end container view*/
    );
  }
}
