import { flightList } from './flight-list';

import {
  CREATE_FLIGHT_ERROR,
  CREATE_FLIGHT_SUCCESS,
  REMOVE_FLIGHT_ERROR,
  REMOVE_FLIGHT_SUCCESS,
  FILTER_FLIGHTS,
  LOAD_FLIGHTS_SUCCESS,
  UNDELETE_FLIGHT_ERROR,
  UNLOAD_FLIGHTS_SUCCESS,
  UPDATE_FLIGHT_ERROR,
  UPDATE_FLIGHT_SUCCESS
} from './action-types';

export function createFlightError(error) {
  console.log('CREATE_FLIGHT_ERROR',flight);
  return {
    type: CREATE_FLIGHT_ERROR,
    payload: error
  };
}

export function createFlightSuccess(flight) {
  console.log('CREATE_FLIGHT_SUCCESS',flight);
  return {
    type: CREATE_FLIGHT_SUCCESS,
    payload: flight
  };
}

export function removeFlight(flight) {
  console.log('REMOVE_FLIGHT',flight);
  return dispatch => {
    flightList.remove(flight.key)
      .catch(error => dispatch(removeFlightError(error)));
  };
}

export function removeFlightError(error) {
  console.log('REMOVE_FLIGHT_ERROR',flight);
  return {
    type: REMOVE_FLIGHT_ERROR,
    payload: error
  };
}

export function removeFlightSuccess(flight) {
  console.log('REMOVE_FLIGHT_SUCCESS',flight);
  return {
    type: REMOVE_FLIGHT_SUCCESS,
    payload: flight
  };
}

export function undeleteFlight() {
  return (dispatch, getState) => {
    const flight = getState().flights.deleted;
    if (flight) {
      flightList.set(flight.key, flight)
        .catch(error => dispatch(undeleteFlightError(error)));
    }
  };
}

export function undeleteFlightError(error) {
  return {
    type: UNDELETE_FLIGHT_ERROR,
    payload: error
  };
}

export function updateFlightError(error) {
  console.log('UPDATE_FLIGHT_ERROR',flight);
  return {
    type: UPDATE_FLIGHT_ERROR,
    payload: error
  };
}

export function updateFlight(flight, changes) {
  console.log('UPDATE_FLIGHT',flight);
  return dispatch => {
    flightList.update(flight.key, changes)
      .catch(error => dispatch(updateFlightError(error)));
  };
}

export function updateFlightSuccess(flight) {
  console.log('UPDATE_FLIGHT_SUCCESS',flight);
  return {
    type: UPDATE_FLIGHT_SUCCESS,
    payload: flight
  };
}

export function loadFlightsSuccess(flights) {
  console.log('LOAD_FLIGHTS_SUCCESS',flights.length+" flights loaded");
  return {
    type: LOAD_FLIGHTS_SUCCESS,
    payload: flights
  };
}

export function filterFlights(filterType) {
  return {
    type: FILTER_FLIGHTS,
    payload: {filterType}
  };
}

export function loadFlights() {
  return (dispatch, getState) => {
    const { auth } = getState().firebase;
    console.log(`Subscribing to ${auth.uid}/flight_log`);
    flightList.path = `${auth.uid}/flight_log`;
    flightList.subscribe(dispatch);
  };
}

export function unloadFlights() {
  flightList.unsubscribe();
  return {
    type: UNLOAD_FLIGHTS_SUCCESS
  };
}



export function setDate(date) {
  return { type: 'SET_NEW_FLIGHT_DATE', date };
}
export function setStartTime(launch_time_iso) {
  return { type: 'SET_NEW_FLIGHT_LAUNCH_TIME', launch_time_iso };
}
export function setEndTime(landing_time_iso) {
  return { type: 'SET_NEW_FLIGHT_LANDING_TIME', landing_time_iso };
}
export function setDuration(duration_total_minutes) {
  // let errors = [];
  //   mins=null,
  //   hours=0;
  // if (duration){
  //   try{
  //     let parts = duration.split(':');
  //     mins = parseInt(parts[0]);
  //     if (parts.length==2) {
  //       hours = mins;
  //       mins = parseInt(parts[1]);
  //     }
  //     if (parts.length>2) errors.append("Expected format HH:MM")
  //     if (mins<0) errors.append("Minutes should be a positive number.");
  //     if (hours<0) errors.append("Hours should be a positive number.");
  //     console.log("Setting duration ",hours+":"+mins);
  //     if (errors.length==0) return { type: 'SET_DURATION', duration:hours+":"+('00'+mins).slice(-2) }
  //   } catch(err){
  //     errors.append("Expected format HH:MM");
  //   }
  // }
  
  return { type: 'SET_NEW_FLIGHT_DURATION', duration_total_minutes: parseInt(duration_total_minutes) };
}
export function setSiteName(site_name){
  return { type:'SET_NEW_FLIGHT_SITE_NAME', site_name };
}
export function setLaunchName(launch_name){
  return { type:'SET_NEW_FLIGHT_LAUNCH_NAME', launch_name };
}
export function setLandingLocation(landing_location){
  return { type:'SET_NEW_FLIGHT_LANDING_LOCATION', landing_location };
}
export function setComments(comments){
  return { type:'SET_NEW_FLIGHT_COMMENTS', comments };
}
export function setWingName(wing_name){
  return { type:'SET_NEW_FLIGHT_WING_NAME', wing_name };
}
export function setLaunchAltitude(launch_altitude){
  return { type:'SET_NEW_FLIGHT_LAUNCH_ALTITUDE', launch_altitude:parseInt(launch_altitude) };
}
export function setLaunchOrientation(launch_orientation){
  return { type:'SET_NEW_FLIGHT_LAUNCH_ORIENTATION', launch_orientation };
}
export function setWindSpeed(wind_speed){
  return { type:'SET_NEW_FLIGHT_WIND_SPEED', wind_speed };
}
export function setWindDirection(wind_direction){
  return { type:'SET_NEW_FLIGHT_WIND_DIRECTION', wind_direction };
}
export function setMaxAltitude(max_altitude){
  return { type:'SET_NEW_FLIGHT_MAX_ALTITUDE', max_altitude:parseInt(max_altitude) };
}
export function setLandingAltitude(landing_altitude){
  return { type:'SET_NEW_FLIGHT_LANDING_ALTITUDE', landing_altitude:parseInt(landing_altitude) };
}
export function setXcMiles(xc_miles){
  return { type:'SET_NEW_FLIGHT_XC_MILES', xc_miles:parseFloat(xc_miles) };
}
export function submitNewFlight(payload,ref){
  return { type:'SUBMIT_NEW_FLIGHT', 
    payload,
    meta: {
      offline: {
        effect: { ref },
        commit: { type:'SUBMIT_NEW_FLIGHT_SUCCESS', payload },
        rollback: { type:'SUBMIT_NEW_FLIGHT_ERROR', payload },
      }
    }
  };
}
