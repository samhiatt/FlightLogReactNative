import { FirebaseList } from '../firebase/firebase-list';
import * as flightActions from './actions';
import { Flight } from './flight';


export const flightList = new FirebaseList({
  onAdd: flightActions.createFlightSuccess,
  onChange: flightActions.updateFlightSuccess,
  onLoad: flightActions.loadFlightsSuccess,
  onRemove: flightActions.removeFlightSuccess
}, Flight);