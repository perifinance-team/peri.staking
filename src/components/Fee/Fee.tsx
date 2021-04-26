import styled from 'styled-components'
import { H6 } from 'components/Text'
import { SkeyBlueButton } from 'components/Button'

const Fee = () => {
    return (
        <FeeContainer>
            <H6>Ethereum network fees : $0 / 0 GWEI</H6>
            <EditButton>
                <H6 color={'primary'}>edit</H6>
            </EditButton>
        </FeeContainer>
    );
}

const FeeContainer = styled.div`
    margin: 10px;
    display: flex;
    justify-content: center;
    vertical-align: middle;
`

const EditButton = styled(SkeyBlueButton)`
    padding: 0px 10px;
    margin: 0px 10px;
`
export default Fee