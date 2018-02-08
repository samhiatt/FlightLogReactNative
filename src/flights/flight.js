import { Record } from 'immutable';


export const Flight = new Record({
  date: false,
  key: null,
  startTime: null,
  duration: null,
  takeoffLocation: null, 
  landingLocation: null,
});