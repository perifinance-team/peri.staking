import { useState } from 'react';

import styled from 'styled-components';
import { BlueBorderRoundContainer } from 'components/Container'
import Asset from 'components/Asset'
import { BlueGreenButton } from 'components/Button';
import { H4 } from 'components/Text'

const Input = (
    {
        disabled = false, currencyName,
        currencies=[],
        tooltip = undefined, onChange = undefined, onBlur = undefined, value, maxAction = undefined
    }
    ) => {
    const [currencyListIsOpen, toggleCurrency] = useState(false);
    
    return (
        <Container>
            <DropdownContainer>
                <DropdownButton disabled={disabled}>
                    <Asset currencyName={currencyName} label={currencyName}></Asset>
                </DropdownButton>
                {currencyListIsOpen && (<Currencies>
                    {currencies.map(currency => <Asset currencyName={currency} label={currency} key={currency}></Asset>)}
                </Currencies>)}
                <Border></Border>
            </DropdownContainer>
            <InputContainer>
                <AmountInput disabled={disabled} onChange={onChange} defaultValue={null} value={value} onBlur={onBlur}></AmountInput>
                { disabled || <MaxButton onClick={maxAction}>MAX</MaxButton>}
            </InputContainer>
        </Container>
    )
}
const Currencies = styled.div`
    z-index: 11;
	position: absolute;
    top: calc(100% - 680px);
    width: 250px;
	height: 240px;
	padding: 16px;
	border-radius: 5px;
`
const Container = styled(BlueBorderRoundContainer)`
    height: 50px;
    flex-direction: row;
    flex: 1 2;
    justify-content: space-between;
    margin: 10px 0px;
`

const DropdownContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`

const DropdownButton = styled.button`
    width: 110px;
    height: 50px;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0px 20px;
    :focus {
        outline: none;
    }
`

const Border = styled.div`    
    height: 25px;
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

const MaxButton = styled(BlueGreenButton)`
    font-size: 14px;
    width: 70px;
    height: 30px;
    margin: auto;
`




export default Input;
