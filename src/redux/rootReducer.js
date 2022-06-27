import { combineReducers } from 'redux';
import dataReducer from './Data/data.reducer.js';

const rootReducer = combineReducers({
	total: dataReducer,
});
export default rootReducer;
