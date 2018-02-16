// import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';
const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
import {
  CREATE_FLIGHT_SUCCESS,
  REMOVE_FLIGHT_SUCCESS,
  FILTER_FLIGHTS,
  LOAD_FLIGHTS_SUCCESS,
  UPDATE_FLIGHT_SUCCESS
} from './action-types';


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