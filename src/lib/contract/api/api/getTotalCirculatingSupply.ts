import { get } from "../service";
import { getCirculatingSupply } from "../queries";

export const getTotalCirculatingSupply = async (): Promise<bigint> => {
	return await get(getCirculatingSupply());
};
