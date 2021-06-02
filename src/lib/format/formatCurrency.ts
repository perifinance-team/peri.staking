import numbro from 'numbro';

export const formatCurrency = (value, decimals = 2) => {
	if (!value) return "0";
	if (!Number(value)) return "0";
	const discardValue = numbro(value).format({mantissa: decimals}).match(/(\d+\.)+\d{0,4}/g);
	return numbro(discardValue[0]).format( {thousandSeparated: true, mantissa: decimals} ).toString();
};
