import { STORE_TOTAL_DATA } from './data.types';
export const storeDataAction = (total_Data) => {
	return {
		type: STORE_TOTAL_DATA,
		payload: total_Data,
	};
};
