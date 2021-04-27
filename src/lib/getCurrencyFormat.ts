import numbro from 'numbro'

export const getCurrencyFormat = (value) => {    
    let formatValue;
    try {
        formatValue = numbro(value).format({
            thousandSeparated: true,
            mantissa: 2
        });
    }catch (e) {
        formatValue = '0';
    }
    return formatValue
}