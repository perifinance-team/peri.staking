import styled from 'styled-components'
import { H6 } from 'components/Text'

const LPAsset = ({currencyName, label}) => {
    return (
        <AssetContainer>
            <CurrencyIcon src={`/images/currencies/${currencyName}.svg`} alt="currency"/>
            <AssetLabel align={"left"}>{label}</AssetLabel>
        </AssetContainer>
    );
}

const AssetContainer = styled.div`
    height: 30px;
    display: flex;
    align-content: center;
    flex-direction: row;
`;

const CurrencyIcon = styled.img`
    width: 40px;
    margin-right: 10px;
`;

const AssetLabel = styled(H6)`
    margin: auto;
`


export default LPAsset;

