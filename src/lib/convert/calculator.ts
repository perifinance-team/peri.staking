import { utils } from 'ethers'

export const calculator = (perator, operand, arithmetic) => {
    if(isNaN(Number(perator)) || perator === "") {
        perator = '0';
    }
    if(isNaN(Number(operand)) || operand === "") {
        operand = '0';
    }
    
    
    perator = typeof perator === "string" ? utils.parseEther(perator) : perator;
    operand = typeof operand === "string" ? utils.parseEther(operand) : operand;
    if((arithmetic === 'div' || arithmetic === 'mul')) {
        if(
            perator.eq(utils.parseEther('0')) ||
            operand.eq(utils.parseEther('0'))
        )  {
            return utils.bigNumberify('0');
        }
    }   
    return perator[arithmetic](operand);
}