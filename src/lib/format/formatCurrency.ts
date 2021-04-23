import numbro from 'numbro';

export const formatCurrency = (value, decimals = 2) => {
	if (!value) return 0;
	if (!Number(value)) return 0;
	return numbro(value).format( {thousandSeparated: true, mantissa: 2} ).toString();
};
