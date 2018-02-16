import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, VirtualizedList, ActivityIndicator, Button, ScrollView } from 'react-native';
// import { List, ListItem } from 'react-native-elements';

import { loadFlights } from '../flights/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

class FlightItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.flight!=this.props.flight);
  }
  render(){
    const {comments, date, flight, start_time, end_time, duration_hours, duration_minutes, 
         altitude_gain, landing_altitude, landing_zone, launch_altitude, launch_name, launch_orientation, 
         max_altitude, site_name, total_airtime, vertical_drop, wind_direction, wind_speed, wing_name, xc_miles 
    } = this.props;
    return (
      <View style={{ height: 59, width: '100%'}}>
        <View style={{justifyContent: 'center', alignContent:'center', flexDirection: 'row', width: '100%' }}>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
            <Text>{flight}</Text>
            <Text>{date}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
            <Text>{start_time}</Text>
            <Text>{end_time}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', width: '100%'}}>
          <Text style={{flex: 1, flexWrap: 'wrap'}}>{comments}</Text>
        </View>
      </View>
    )
  }
}

const ITEM_HEIGHT=60;

class FlightsList extends React.Component {
  render(){
    const { flights } = this.props;
    if (false) return (
      <ScrollView>
      {(flights).map((item,key)=><FlightItem key={key} flight={item.flight} date={item.date} comments={item.comments}/>)}
      </ScrollView>
    )
    return (
      <VirtualizedList data={flights} 
        renderItem={({item})=>{
          return (<FlightItem {...item}/>)
        }}
        ItemSeparatorComponent={()=>{return(
          <View style={{ height: 1, width: "73%", backgroundColor: "#CED0CE", marginLeft: "14%"}}/>
        )}}
        ListHeaderComponent={()=>{return(
          <View><Text>{flights.length||flights.size} flights</Text></View>
        )}}
        /*maxToRenderPerBatch={20}*/
        initialNumToRender={30}
        keyExtractor = {(item,index)=>index.toString()}
        getItemCount={(data)=>data.length||data.size}
        getItem={(data,index)=>{
          if (typeof data.get=='function') {
            return data.get(index)
          } else {
            return data[index]
          }
        }}
        getItemLayout={(data, index) => ( {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index} )}
      />
    )
  }
}
//        getItemLayout={(data, index) => ( {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index} )}

class FlightsScreen extends React.Component {
  componentWillMount(){
    // console.log("Getting flights ...");
    // this.props.getFlights();
  }
  render(){
    const { isLoggedIn, displayName, isFirebaseAuthenticated, flights, getFlights } = this.props;
    return (isLoggedIn)? (
      <View style={styles.container}>
        <Button
          title='Load Flights'
          onPress={getFlights}
        />
        <FlightsList flights={flights}/>
      </View>
    ):(
      <View style={styles.container}>
        <Text style={styles.text}>Not logged in</Text>
        <AuthButton /> 
      </View>
    );
    
  }
}

FlightsScreen.navigationOptions = {
  title: 'Flights',
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn || state.firebase.isAuthenticated,
  isFirebaseAuthenticated: state.firebase.isAuthenticated, 
  displayName: (state.firebase.auth)? state.firebase.auth.displayName : "",
  flights: state.flights.list,
});
const mapDispatchToProps = {
  getFlights: ()=>dispatch=>{
    dispatch(loadFlights());
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FlightsScreen);
