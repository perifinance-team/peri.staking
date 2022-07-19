import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "config/reducers";

const LeftAside = () => {
	const { loadings } = useSelector((state: RootState) => state.loading);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(Object.values(loadings).reduce((a, b) => a || b));
	}, [loadings]);

	return (
		<div className={isLoading ? "loading-back" : "loading-hidden"}>
			<div className="loading-container">
				<div className="loading"></div>
				<div id="loading-text">loading</div>
			</div>
		</div>
	);
};
export default LeftAside;
