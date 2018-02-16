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


export function createFlight(title) {
  return dispatch => {
    flightList.push({completed: false, title})
      .catch(error => dispatch(createFlightError(error)));
  };
}

export function createFlightError(error) {
  return {
    type: CREATE_FLIGHT_ERROR,
    payload: error
  };
}

export function createFlightSuccess(flight) {
  return {
    type: CREATE_FLIGHT_SUCCESS,
    payload: flight
  };
}

export function removeFlight(flight) {
  return dispatch => {
    flightList.remove(flight.key)
      .catch(error => dispatch(removeFlightError(error)));
  };
}

export function removeFlightError(error) {
  return {
    type: REMOVE_FLIGHT_ERROR,
    payload: error
  };
}

export function removeFlightSuccess(flight) {
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
  return {
    type: UPDATE_FLIGHT_ERROR,
    payload: error
  };
}

export function updateFlight(flight, changes) {
  return dispatch => {
    flightList.update(flight.key, changes)
      .catch(error => dispatch(updateFlightError(error)));
  };
}

export function updateFlightSuccess(flight) {
  return {
    type: UPDATE_FLIGHT_SUCCESS,
    payload: flight
  };
}

export function loadFlightsSuccess(flights) {
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
    console.log(`Loading ${auth.uid}/flight_log`);
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
  return { type: 'SET_NEW_FLIGHT_START_TIME', launch_time_iso };
}
export function setEndTime(landing_time_iso) {
  return { type: 'SET_NEW_FLIGHT_END_TIME', landing_time_iso };
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
  
  return { type: 'SET_NEW_FLIGHT_DURATION', duration_total_minutes };
}
export function setLaunchName(launch_name){
  return { type:'SET_NEW_FLIGHT_LAUNCH_NAME', launch_name };
}
