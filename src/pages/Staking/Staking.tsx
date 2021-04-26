import styled from 'styled-components'
import Action from 'screens/Action'
import Input from 'components/Input'
import { BlueGreenButton } from 'components/Button'
import { H4, H5 } from 'components/Text'
import Fee from 'components/Fee'
const Staking = () => {
    const subTitles = [
        "Mint pUSD by staking your PERI.",
        "This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards."
    ]
    return (
        <Action title="STAKING"
                subTitles={subTitles}
        >
            <Container>
                <div>
                    <Input key="primary"
                        currencyName="pUSD"
                    />
                    <StakingInfoContainer>
                        <H5>Staking: 0 PERI</H5>
                        <H5>Estimated C-Ratio: 0%</H5>
                    </StakingInfoContainer>
                </div>
                <div>
                    <StakingButton><H4 weigth="bold">STAKE & MAINT</H4></StakingButton>
                    <Fee/>
                </div>
            </Container>
            
        </Action>
        
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: auto;
    width: 50%;
    height: 100%;
`

const StakingInfoContainer = styled.div`
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
`

const StakingButton = styled(BlueGreenButton)`
    width: 100%;
    height: 50px;
`
export default Staking;