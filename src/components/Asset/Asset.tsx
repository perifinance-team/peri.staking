import styled from 'styled-components'
import { H6 } from 'components/Text'

const Asset = ({currencyName, label}) => {
    return (
        <AssetContainer>
            <CurrencyIcon src={`images/currencies/${currencyName}.svg`} alt="currency"/>
            <H6 align={"left"}>{label}</H6>
        </AssetContainer>
    );
}

const AssetContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const CurrencyIcon = styled.img`
    margin-right: 10px;
`;


export default Asset;

