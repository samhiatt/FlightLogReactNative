import React from 'react';
import { View, Text } from 'react-native';

const formatDuration = (total_minutes) => Math.floor(total_minutes/60)+':'+total_minutes%60;

const formatDate = (date) => date? new Date(date).toLocaleString() : '';

export const ITEM_HEIGHT=60;

export default class FlightListItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // TODO: Add check for updated value
    return (nextProps.flight!=this.props.flight);
  }
  render(){
    const {comments, date, flight, launch_time_epoch, launch_time_iso, landing_time_epoch, landing_time_iso, 
      duration_total_minutes, altitude_gain, landing_altitude, landing_zone, launch_altitude, launch_name, 
      launch_orientation, max_altitude, site_name, total_airtime, vertical_drop, wind_direction, wind_speed, 
      wing_name, xc_miles 
    } = this.props;
    return (
      <View style={{ height: 59, width: '100%'}}>
        <View style={{justifyContent: 'center', alignContent:'center', flexDirection: 'row', width: '100%' }}>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
            <Text>{flight}</Text>
            <Text>{date}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
            <Text>{formatDate(launch_time_iso)}</Text>
            <Text>{formatDate(landing_time_iso)}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
            <Text>{formatDuration(duration_total_minutes)}</Text>
            <Text>{total_airtime} hrs total</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', width: '100%'}}>
          <Text style={{flex: 1, flexWrap: 'wrap'}}>{comments}</Text>
        </View>
      </View>
    );
  }
}
