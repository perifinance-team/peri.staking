import { get } from "../service";
import { getAPY } from "../queries";

export const getTotalAPY = async (): Promise<string> => {
	return await get(getAPY());
};
