import styled from 'styled-components';

import { H2, H5 } from 'components/Text';
import { LightBlueButton } from 'components/Button';
import { useHistory, useLocation } from 'react-router-dom';

const Action = ({children, title, subTitles}) => {
    const history = useHistory();
    const location = useLocation();

    const goToBack = () => {
        try {
            const locations = location.pathname.split(/\//i);
            if(locations.length > 2) {
                history.push(`/${locations[1]}`);
            } else {
                history.push(`/`);
            }
        } catch (e){
            history.push(`/`);
        }
    }

    return (
        <ActionContainer>
            <LeftContainer>
                <Cancel onClick={() => goToBack()}>
                    <Arrow src={`/images/dark/arrow/arrow-left.svg`} alt="arrow-left"/>
                    CANCEL
                </Cancel>
                <TitleContainer>
                    <Title color={'primary'} weigth={'black'}>{title}</Title>
                    <SubTitleContainer>
                        {subTitles.map((text, index) => (
                            <H5 key={index}>{text}</H5>
                        ))}
                    </SubTitleContainer>
                </TitleContainer>
            </LeftContainer>
            <ActionBodyContainer>
                <ContentContainer key={1}>
                    {children}
                </ContentContainer>
            </ActionBodyContainer>
        </ActionContainer>
    );
}

const ActionContainer = styled.div`
    display: flex;
    height: 100%;
    padding: 10px 100px;
    flex-direction: row;
    flex: 1;
`;

const LeftContainer = styled.div`
    display: flex;
    flex: 2;
    flex-direction: column;
`;

const TitleContainer = styled.div`
    justify-content: center;
    padding: 100px 100px 100px 0px;
`

const Title = styled(H2)`
    margin: 0;
    text-align: left;
`
const SubTitleContainer = styled.div`
    margin-top: 10px;
    H5 {
        text-align: left;
    }
`

const ActionBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 3;
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