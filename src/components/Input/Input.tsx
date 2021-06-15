import { useState } from 'react'
import styled from 'styled-components';
import { BlueBorderRoundContainer } from 'components/Container'
import Asset from 'components/Asset'
import LPAsset from 'components/Asset/LPAsset'
import { BlueGreenButton } from 'components/Button';
import { H6 } from 'components/Text'
import { formatCurrency } from 'lib'

const Input = (
    {
        disabled = false, currencyName,
        onChange = undefined, onBlur = undefined, value, maxAction = undefined,
        isLp= false,
        fixed = false,
        fixedAction = undefined,
        maxAmount = undefined,
        currencies = undefined
    }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <Container>
            <AssetContainer isCurrencies={currencies ? true: false} onClick={ () => currencies ? setIsOpen(!isOpen) : false }>
                {
                    isLp ? 
                    (<LPAsset currencyName={currencyName} label={currencyName}></LPAsset>)
                    :
                    (<Asset currencyName={currencyName} label={currencyName}></Asset>)
                    
                }
                </AssetContainer>
                
                {isOpen && 
                    <CurrenciesContainer>
                        <Currencies>
                            123123
                        </Currencies>
                    </CurrenciesContainer>
                }

                <Border></Border>
                
                <InputContainer>
                    <AmountInput disabled={disabled} onChange={onChange} defaultValue="" value={value} onBlur={onBlur}></AmountInput>
                    { fixedAction && <MaxButton active={fixed} onClick={fixedAction}>Fixed{fixed}</MaxButton>}
                    { disabled || <MaxButton onClick={maxAction}>MAX</MaxButton>}
                </InputContainer>
            </Container>
            <MaxContainer>
                {maxAmount && <MaxAmount>MAX: {formatCurrency(maxAmount)} {currencyName}</MaxAmount>}
            </MaxContainer>
            
        </>
    )
}
const CurrenciesContainer = styled.div`
    z-index: 11;
	position: absolute;
    top: 60px;
    width: 250px;
	height: 240px;
	padding: 16px;
    background: transparent;
    border: 2px solid ${props => props.theme.colors.border};
	border-radius: 5px;
`
const Currencies = styled.div`

`

const Container = styled(BlueBorderRoundContainer)`
    position: relative;
    height: 50px;
    flex-direction: row;
    flex: 1 2;
    justify-content: space-between;
    margin: 10px 0px 0px 0px;
`

const AssetContainer = styled.div<{isCurrencies?: boolean}>`
    flex: 1;
    padding: 10px;
    display: flex;
    align-items: center;
    cursor: ${props => props.isCurrencies ? 'pointer' : 'default'};
`

const Border = styled.div`
    height: 25px;
    margin: 10px;
    border-right: 2px solid ${props => props.theme.colors.border};
`

const InputContainer = styled.div`
    display: flex;
    vertical-align: middle;
    flex: 3;
    margin: 0px 10px;
    background: transparent;
`

const AmountInput = styled.input`
    height: 50px;
    width: 100%;
    font-size: 16px;
    border: none;
    background: transparent;

    color: ${props => props.theme.colors.font.secondary};
    :focus {
        outline: none;
    }
    :disabled {
        opacity: 0.5
    }
    
`

const MaxButton = styled(BlueGreenButton)<{active?: boolean}>`
    font-size: 14px;
    width: 70px;
    height: 30px;
    margin: auto 5px;
    color: ${props => props.active ? props.theme.colors.font.red : ''};
`;
const MaxContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`
const MaxAmount = styled(H6)`
    text-align: right;
    padding: 0px 10px;
`;



export default Input;
