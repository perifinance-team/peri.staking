import { useState } from 'react';

import styled from 'styled-components';
import { BlueBorderRoundContainer } from 'components/Container'
import Asset from 'components/Asset'
import { BlueGreenButton } from 'components/Button';
import { H4 } from 'components/Text'
const Input = ({disabled = false, currencyName, tooltip = undefined, onChange, onBlur, value, maxAction}) => {
    const [currencyListIsOpen, toggleCurrency] = useState(false);
    return (
        <Container disabled={disabled}>
            <DropdownContainer>
                <DropdownButton disabled={disabled}>
                    <Asset currencyName={currencyName} label={currencyName}></Asset>
                </DropdownButton>
                <Border></Border>
            </DropdownContainer>
            <InputContainer>
                <AmountInput disabled={disabled} onChange={onChange} value={value} onBlur={onBlur}></AmountInput>
                { disabled || <MaxButton onClick={maxAction}>MAX</MaxButton>}
            </InputContainer>
        </Container>
    )
}

const Container = styled(BlueBorderRoundContainer)<{disabled: boolean}>`
    height: 50px;
    flex-direction: row;
    flex: 1 2;
    justify-content: space-between;
    opacity: ${props => props.disabled ? 0.5 : 1};
    margin: 0px;
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
    
`

const MaxButton = styled(BlueGreenButton)`
    font-size: 14px;
    width: 70px;
    height: 30px;
    margin: auto;
`




export default Input;
