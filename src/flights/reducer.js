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
export function newFlightReducer(state={
  date:null,
  launch_time_iso:null,
  duration_total_minutes:null,
  launch_name:null,
  site_name: null,
  landing_location: null,

  comments: null,
  wing_name: null, 
  launch_altitude: null,
  launch_orientation: null,
  wind_speed: null,
  wind_direction: null,
  max_altitude: null,
  landing_altitude: null,
  xc_miles: null,

  // derived: 
  // TODO: set derrived values in reducer below
  id: null,
  flight: null,
  landing_time_iso:null,
  altitude_gain: null,
  total_airtime: null,
  vertical_drop: null,
  updated_epoch: null,

  validationErrors:[],
}, action){
  switch (action.type) {
    case 'SET_NEW_FLIGHT_SITE_NAME':
      return { ...state, 
        site_name:action.site_name, 
      };
    case 'SET_NEW_FLIGHT_LAUNCH_NAME':
      return { ...state, 
        launch_name:action.launch_name, 
      };
    case 'SET_NEW_FLIGHT_LANDING_LOCATION':
      return { ...state, 
        landing_location:action.landing_location, 
      };
    case 'SET_NEW_FLIGHT_WING_NAME':
      return { ...state, 
        wing_name:action.wing_name, 
      };
    case 'SET_NEW_FLIGHT_COMMENTS':
      return { ...state, 
        comments:action.comments, 
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
    case 'SET_NEW_FLIGHT_LAUNCH_ALTITUDE':
      return { ...state, 
        launch_altitude:action.launch_altitude, 
        vertical_drop: (state.landing_altitude!=null)? (action.launch_altitude - state.landing_altitude) : state.vertical_drop, 
        altitude_gain: (state.max_altitude!=null)? (state.max_altitude - action.launch_altitude) : state.altitude_gain,
      };
    case 'SET_NEW_FLIGHT_LAUNCH_ORIENTATION':
      return { ...state, 
        launch_orientation:action.launch_orientation, 
      };
    case 'SET_NEW_FLIGHT_MAX_ALTITUDE':
      return { ...state, 
        max_altitude:action.max_altitude, 
        altitude_gain: (state.launch_altitude!=null)? (action.max_altitude - state.launch_altitude):state.altitude_gain,
      };
    case 'SET_NEW_FLIGHT_LANDING_ALTITUDE':
      return { ...state, 
        landing_altitude:action.landing_altitude, 
        vertical_drop: (state.launch_altitude!=null)? (state.launch_altitude - action.landing_altitude):state.vertical_drop,
      };
    case 'SET_NEW_FLIGHT_WIND_SPEED':
      return { ...state, 
        wind_speed:action.wind_speed, 
      };
    case 'SET_NEW_FLIGHT_WIND_DIRECTION':
      return { ...state, 
        wind_direction:action.wind_direction, 
      };
    case 'SET_NEW_FLIGHT_XC_MILES':
      return { ...state, 
        xc_miles:action.xc_miles, 
      };
    case 'SUBMIT_NEW_FLIGHT':
      let newState = { ...state, 
        updated_epoch: new Date().getTime(), // TODO: set this server-side?
      }
      console.log("SUBMIT_NEW_FLIGHT reducer has state", newState);
      console.log("SUBMIT_NEW_FLIGHT NOT YET IMPLEMENTED");
      return newState;
    default:
      return state
  }
}