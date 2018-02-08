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
      flightList.set(flight.key, {completed: flight.completed, title: flight.title})
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
    console.log("Loading flights for user",auth.uid);
    flightList.path = `${auth.uid}/flights`;
    console.log("Subscribing to",flightList.path);
    flightList.subscribe(dispatch);
  };
}

export function unloadFlights() {
  flightList.unsubscribe();
  return {
    type: UNLOAD_FLIGHTS_SUCCESS
  };
}