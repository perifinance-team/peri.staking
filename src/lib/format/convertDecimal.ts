import numbro from 'numbro';

export const convertDecimal = (value, decimal) => {
    
    if(isNaN(Number(value)) || value === "") {
        return numbro(0).format({mantissa: decimal});
    } else {
        value = numbro(value).value().toString();
        if(decimal < 18) {
            const reg = new RegExp(`(\d+\.)+\d{0,${decimal}}`, 'g')
            if((reg).test(value)) {
                value = value.match(reg)[0];
            }
        }
        return numbro(value).format({mantissa: decimal});
    }
}