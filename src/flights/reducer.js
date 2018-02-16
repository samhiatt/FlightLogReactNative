// import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';
const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
import {
  CREATE_FLIGHT_SUCCESS,
  REMOVE_FLIGHT_SUCCESS,
  FILTER_FLIGHTS,
  LOAD_FLIGHTS_SUCCESS,
  UPDATE_FLIGHT_SUCCESS
} from './action-types';

import moment from 'moment'; // 2.20.1

export const defaultState = {
  deleted: null,
  filter: '',
  list: [],
  previous: null
};

export function flightsReducer(state = defaultState, {payload, type}) {
  // if (typeof state=='object') state = new FlightState(state);
  switch (type) {
    case CREATE_FLIGHT_SUCCESS:
      if (state.deleted && state.deleted.key === payload.key) state.list = state.previous;
      else state.list.unshift(payload);
      return { ...state, 
        deleted: null,
        previous: null,
      };

    case REMOVE_FLIGHT_SUCCESS:
      return { ...state,
        deleted: payload,
        previous: state.list,
        list: state.list.filter(task => task.key !== payload.key)
      };

    case FILTER_FLIGHTS:
      // return state.set('filter', payload.filterType || '');
      return { ...state, filter: payload.filterType || '' };

    case LOAD_FLIGHTS_SUCCESS:
      console.log("LOAD_FLIGHTS_SUCCESS, state is",state)
      // return state.set('list', new List(payload).reverse() );
      // return state.set('list', payload)
      // return { ...state, list: new List(payload).reverse() };
      return { ...state, list: payload };

    case UPDATE_FLIGHT_SUCCESS:
      return { ...state,
        deleted: null,
        previous: null,
        list: state.list.map(task => {
          return task.key === payload.key ? payload : task;
        })
      };

    case SIGN_OUT_SUCCESS:
    case 'Logout':
      return { ...state, defaultState };

    default:
      return state;
  }
}

const timeFormat = "h:mm a";
export function newFlightReducer(state={launch_time_iso:null,landing_time_iso:null,duration_total_minutes:null}, action){
  switch (action.type) {
    case 'SET_NEW_FLIGHT_LAUNCH_NAME':
      return { ...state, 
        launch_name:action.launch_name, 
      };
    case 'SET_NEW_FLIGHT_START_TIME':
      return { ...state, 
        launch_time_iso:action.launch_time_iso,
        duration_total_minutes:(state.landing_time_iso)? 
          moment(state.landing_time_iso).diff(moment(action.launch_time_iso),'minutes').toString()
          :state.duration_total_minutes, 
      };
    case 'SET_NEW_FLIGHT_DATE':
      return { ...state, 
        date:action.date, 
      };
    case 'SET_NEW_FLIGHT_END_TIME': 
      return { ...state, 
        landing_time_iso: action.landing_time_iso,
        duration_total_minutes: (state.launch_time_iso)?
          moment(action.landing_time_iso).diff(moment(state.launch_time_iso),'minutes').toString()
          :state.launch_time_iso, 
      }
    case 'SET_NEW_FLIGHT_DURATION':
      var duration_total_minutes = parseInt(action.duration_total_minutes);
      return {...state, 
        duration_total_minutes: action.duration_total_minutes,
        landing_time_iso: (state.launch_time_iso)? 
          moment(state.launch_time_iso).add(duration_total_minutes,'minutes').toISOString()
          :state.launch_time_iso,
      };
    default:
      return state
  }
}