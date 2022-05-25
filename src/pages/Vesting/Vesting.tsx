import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState } from 'config/reducers'
import styled from 'styled-components';
import { H1, H4 } from 'components/heading'
import { RoundButton } from 'components/button/RoundButton'
import { Input } from 'components/input'
import { StyledTHeader, StyledTBody, Row, Cell, BorderRow } from 'components/Table'
import { contracts } from 'lib/contract'
import { formatCurrency } from 'lib'
import * as dateFns from 'date-fns';
import { setLoading } from 'config/reducers/loading'
import { updateTransaction } from 'config/reducers/transaction'

const Vesting = () => {
    const dispatch = useDispatch()
    const { address, isConnect } = useSelector((state: RootState) => state.wallet);
    const { gasPrice } = useSelector((state: RootState) => state.networkFee);
    const [vestingData, setVestingData] = useState([]);
    const [totalVesting, setTotalVesting] = useState(0n);

    const getGasEstimate = async () => {
        let gasLimit = 200000n;
        dispatch(setLoading({name: 'gasEstimate', value: true}));
        try {
            gasLimit = BigInt((await contracts.signers.PeriFinanceEscrow.estimateGas.vest()).toString());
        } catch(e) {
            console.log(e);
        }
        dispatch(setLoading({name: 'gasEstimate', value: false}));
        return (gasLimit * 12n /10n).toString();
    }

    const onVest = async () => {
        const transactionSettings = {
            gasPrice: gasPrice.toString(),
			gasLimit: await getGasEstimate(),
        }

        try {
            const transaction = await contracts.signers.PeriFinanceEscrow.vest(transactionSettings);
                dispatch(updateTransaction({
                    hash: transaction.hash,
                    message: `vesting rewards`,
                    type: 'CLAIM'
                }
            ));
        } catch(e) {

        }
    }

    useEffect(() => {
        const init = async () => {
            dispatch(setLoading({name: 'vestingData', value: true}));
            const vestingTotalCount = await contracts.PeriFinanceEscrow.numVestingEntries(address);
            const nextVestingIndex:number = (await contracts.PeriFinanceEscrow.getNextVestingIndex(address)).toNumber();
            const nowToEpoch = Math.floor(new Date().getTime() / 1000);
            
            let dataList = new Array(Number(vestingTotalCount.toString()))
            let index = 0;
            let totalVesting = 0n;

            // eslint-disable-next-line
            for await (let data of dataList) {    
                let [date, quantity] = await contracts.PeriFinanceEscrow.getVestingScheduleEntry(address, index);
                date = BigInt(date.toString());
                quantity = BigInt(quantity.toString());

                dataList[index] = {
                    date: dateFns.format(Number((date * 1000n).toString()), 'yyyy-MM-dd hh:mm'),
                    quantity: quantity
                };
                
                if(quantity !== 0n && index >= nextVestingIndex) {
                    if(Number(date.toString()) < nowToEpoch) {
                        totalVesting = totalVesting + quantity;
                    }
                }
                index++;
            }
            dispatch(setLoading({name: 'vestingData', value: false}));
            setTotalVesting(totalVesting);
            setVestingData(dataList);
        }
        if(isConnect) {
            init();
        } else {
            window.location.replace('/')
        }
        
        // eslint-disable-next-line
    }, [isConnect])

    return (
        <Container>
            <Title> <H1>VESTING</H1> </Title>
            <TableContainer>
                <StyledTHeader>
                    <Row>
                        <Cell><H4 weight={'b'}>No</H4></Cell>
                        <Cell><H4 weight={'b'}>QUANTITY</H4></Cell>
                        <Cell><H4 weight={'b'}>VESTABLE DATE</H4></Cell>
                    </Row>
                </StyledTHeader>
                <StyledTBody height={20}>
                    {vestingData.map((e, index) => (
                        <BorderRow key={index}>
                        <Cell><H4 weight={'m'}>{index+1}</H4></Cell>
                        <Cell><H4 weight={'m'}>{e.quantity === 0n ? 'Already Received' : formatCurrency(e.quantity, 18)}</H4></Cell>
                        <Cell><H4 weight={'m'}>{e.date === 0n ? '-' : e.date}</H4></Cell>
                        </BorderRow>    
                    ))}
                </StyledTBody>
            </TableContainer>            
            <Content>
                <RowContainer>
                    <Label>{'PERI'}</Label>
                    <Input height={40} currencyName={'PERI'} value={formatCurrency(totalVesting, 18)} color={'secondary'} disabled={true}/>
                </RowContainer>
                <RowContainer>
                    <RoundButton disabled={totalVesting === 0n} height={40} onClick={() => {onVest()}} padding={0} color={'primary'} border={'none'} width={320} margin={'0px 0px 0px 50px'}>
                        <H4 weight={'b'} color={'primary'}>VEST</H4>
                    </RoundButton>
                </RowContainer>
            </Content>
        </Container>
    );
}
const RowContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    img{
        margin-top: 2px;
        width: 25px;
        height: 25px;
    }
`
const Container = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    flex-direction: column;
    justify-content: center;
`

const Title = styled.div`
    margin-left: 100px;
    position: absolute;
    z-index: 0;
    top: 5vh;
`;

const Content = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const Label = styled(H4)`
    width: 50px;
`

const TableContainer = styled.div`
    z-index: 1;
    border-radius: 25px;
    height: 30vh;
    max-height: 550px;
    margin: 0 70px;
    padding: 5vh 70px;
    background-color: ${props => props.theme.colors.background.panel};
    box-shadow: ${props => `0px 0px 25px ${props.theme.colors.border.primary}`};
    border: ${props => `2px solid ${props.theme.colors.border.primary}`};
`

export default Vesting;