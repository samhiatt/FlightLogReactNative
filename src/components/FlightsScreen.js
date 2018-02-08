import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { loadFlights } from '../flights/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  flights: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

class FlightsScreen extends React.Component {
  componentWillMount(){
    console.log("Getting flights...");
    this.props.getFlights();
  }
  render(){
    const { isLoggedIn, displayName, isFirebaseAuthenticated, flights } = this.props;
    return (isLoggedIn)? (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome {displayName}</Text>
        <Text>{(isFirebaseAuthenticated)? "Authenticated with Firebase":"Not authenticated with Firebase"}</Text>
        <FlatList data={flights}
          renderItem={({item}) => <Text>{item.toString()}</Text>} />
      </View>
    ):(
      <View style={styles.container}>
        <Text style={styles.welcome}>Not logged in</Text>
        <AuthButton /> 
      </View>
    );
    
  }
}
// const FlightsScreen = ({
//     isLoggedIn, 
//     displayName, 
//     isFirebaseAuthenticated, 
//     flights
//   }) => (isLoggedIn)? (
//     <View style={styles.container}>
//       <Text style={styles.welcome}>Welcome {displayName}</Text>
//       <Text>{(isFirebaseAuthenticated)? "Authenticated with Firebase":"Not authenticated with Firebase"}</Text>
//       <FlatList data={flights}
//         renderItem={({item}) => <Text>{item.toString()}</Text>} />
//     </View>
//   ):(
//     <View style={styles.container}>
//       <Text style={styles.welcome}>Not logged in</Text>
//       <AuthButton /> 
//     </View>
//   );

FlightsScreen.navigationOptions = {
  title: 'Flights',
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn || state.firebase.isAuthenticated,
  isFirebaseAuthenticated: state.firebase.isAuthenticated, 
  displayName: (state.firebase.auth)? state.firebase.auth.displayName : "",
  flights: state.firebase.flights,
});
const mapDispatchToProps = {
  getFlights: ()=>dispatch=>{
    dispatch(loadFlights());
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FlightsScreen);
