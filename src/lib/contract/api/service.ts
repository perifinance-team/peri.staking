import axios from "axios";

export const get = ({ url, params, mapping }) => {
	const API_URL = `${process.env.REACT_APP_THEGRAPH_URL}api/v1/`;
	
	axios.defaults.withCredentials = true;
	return axios({
		method: "get",
		url: API_URL + url,
		params,
	}).then((data) => mapping(data));
};
