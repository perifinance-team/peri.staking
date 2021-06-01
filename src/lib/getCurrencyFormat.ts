import numbro from 'numbro'

export const getCurrencyFormat = (value, decimal = 6) => {    
    
    let formatValue;
    try {
        if(decimal) {
            formatValue = numbro(value).format({
                thousandSeparated: true,
                mantissa: decimal
            });
        } else {
            formatValue = numbro(value).format({
                thousandSeparated: true,
                mantissa: 6
            });
        }
        
    }catch (e) {
        formatValue = '0';
    }
    return formatValue
}