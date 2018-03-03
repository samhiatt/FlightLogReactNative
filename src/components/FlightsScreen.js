import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, VirtualizedList, ActivityIndicator, Button, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
// import { List, ListItem } from 'react-native-elements';

import FlightListItem, { ITEM_HEIGHT } from './FlightListItem';
// import { loadFlights } from '../flights/actions';

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

class FlightsList extends React.Component {
  render(){
    const { flights } = this.props;
    if (false) return (
      <ScrollView>
      {(flights).map((item,key)=><FlightItem key={key} {...item}/>)}
      </ScrollView>
    )
    return (
      <VirtualizedList data={flights} 
        renderItem={({item})=>{
          return (<FlightListItem {...item}/>)
        }}
        ItemSeparatorComponent={()=>{return(
          <View style={{ height: 1, width: "73%", backgroundColor: "#CED0CE", marginLeft: "14%"}}/>
        )}}
        ListHeaderComponent={()=>{return(
          <View><Text>{flights.length} flights</Text></View>
        )}}
        initialNumToRender={30}
        keyExtractor = {(item,index)=>index.toString()}
        getItemCount={(data)=>data.length}
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

class FlightsScreen extends React.Component {
  componentWillMount(){
    // console.log("Getting flights ...");
    // this.props.getFlights();
  }
  render(){
    const { isLoggedIn, displayName, isFirebaseAuthenticated, flights, goToNewFlightScreen } = this.props;
    return (isLoggedIn)? (
      <View style={styles.container}>
        <Button
          title='New Flight'
          onPress={goToNewFlightScreen}
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
  // getFlights: ()=>dispatch=>{
  //   dispatch(loadFlights());
  // },
  goToNewFlightScreen: ()=>dispatch=>{
    dispatch(NavigationActions.navigate({routeName:'NewFlight'}));
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(FlightsScreen);
