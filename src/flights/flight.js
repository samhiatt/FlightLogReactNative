import { Record } from 'immutable';


export const Flight = new Record({
	id: null,
	flight: null,
	date: false,
	start_time: null,
	end_time: null,
	duration_hours: null,
	duration_minutes: null,
	comments: null,
	// key:null,
	altitude_gain: null,
	landing_altitude: null,
	landing_zone: null,
	launch_altitude: null,
	launch_name: null,
	launch_orientation: null,
	max_altitude: null,
	site_name: null,
	total_airtime: null,
	vertical_drop: null,
	wind_direction: null,
	wind_speed: null,
	wing_name: null,
	xc_miles: null,
});