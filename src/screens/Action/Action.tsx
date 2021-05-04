import styled from 'styled-components';

import { H3, H5 } from 'components/Text';
import { RoundContainer } from 'components/Container'
import { LightBlueButton } from 'components/Button';
import { useHistory } from 'react-router-dom';

const Action = ({children, title, subTitles, notice = undefined}) => {
    const history = useHistory();
    return (
        <ActionContainer>
            <Cancel onClick={() => history.push('/')}>
                <Arrow src={`images/dark/arrow/arrow-left.svg`} alt="arrow-left"/>
                CANCEL
            </Cancel>
            
            <ActionBodyContainer>
                <Title color={'primary'} weigth={'black'}>{title}</Title>
                <SubTitleContainer>
                    {subTitles.map((text, index) => (
                        <H5 key={index}>{text}</H5>
                    ))}
                </SubTitleContainer>
                <ContentContainer key={1}>
                    {children}
                </ContentContainer>
            </ActionBodyContainer>
        </ActionContainer>
    );
}

const ActionContainer = styled.div`
    display: flex;
    flex: 1 9;
    height: 100%;
    padding: 20px 200px;
    display: flex;
    flex-direction: row;
`;

const Notice = styled(RoundContainer)`
    border-radius: 5px;
`

const Title = styled(H3)`
    margin: 0;
`
const SubTitleContainer = styled.div`
    margin-top: 10px;
`

const ActionBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    
    justify-content: center;
`

const ContentContainer = styled.div`
    height: 100%;
    padding: 10px;
`

const Cancel = styled(LightBlueButton)`
    height: 40px;
    width: 120px;
`

const Arrow = styled.img`
    width: 15px;
    margin: 0px 5px;
`

export default Action;