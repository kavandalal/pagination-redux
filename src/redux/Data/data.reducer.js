import { STORE_TOTAL_DATA } from './data.types';

const INITIAL_STATE = {
	totalData: [],
};
const reducer = (state = INITIAL_STATE, action) => {
	console.log(action);
	switch (action.type) {
		case STORE_TOTAL_DATA:
			return { ...state, totalData: action.payload };
		default:
			return state;
	}
};
export default reducer;
