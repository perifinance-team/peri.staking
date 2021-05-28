import styled from 'styled-components'
import { H6 } from 'components/Text'

const Asset = ({currencyName, label}) => {
    return (
        <AssetContainer>
            <CurrencyIcon src={`/images/currencies/${currencyName}.svg`} alt="currency"/>
            <AssetLabel align={"left"}>{label}</AssetLabel>
        </AssetContainer>
    );
}

const AssetContainer = styled.div`
    display: flex;
    vertical-align: middle;
    flex-direction: row;
`;

const CurrencyIcon = styled.img`
    width: 24px;
    margin-right: 10px;
`;

const AssetLabel = styled(H6)`
    margin: auto;
`


export default Asset;

