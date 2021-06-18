import styled from 'styled-components'
import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux"
import * as dateFns from 'date-fns';
import numbro from 'numbro'
import { useHistory, useLocation } from 'react-router-dom';

import { pynthetix, calculator } from 'lib'
import { utils } from 'ethers'

import { RootState } from 'config/reducers'
import { setIsLoading } from 'config/reducers/app'
import { updateTransaction } from 'config/reducers/transaction'
import { gasPrice } from 'helpers/gasPrice'


import Action from 'screens/Action'

import { Cell,
    Row,
    StyledTBody, 
    StyledTHeader,
} from 'components/Table'
import { H3, H4, H6 } from 'components/Text'
import { LightBlueButton } from 'components/Button';
import { BlueGreenButton } from 'components/Button'
import Input from 'components/Input'
import Fee from 'components/Fee'



const Vesting = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const { seletedFee } = useSelector((state: RootState) => state.seletedFee);

    const {js: {PeriFinanceEscrow}} = pynthetix as any
    const [vestingData, setVestingData] = useState([]);
    const [totalVesting, setTotalVesting] = useState('0');

    useEffect(() => {
        const init = async () => {
            const vestingTotalCount = await PeriFinanceEscrow.numVestingEntries(currentWallet);
            const nextVestingIndex:number = (await PeriFinanceEscrow.getNextVestingIndex(currentWallet)).toNumber();
            const nowToEpoch = Math.floor(new Date().getTime() / 1000);
            
            let datas = new Array(Number(vestingTotalCount.toString()))
            let index = 0;
            let totalVesting = utils.bigNumberify('0');

            for await (let data of datas) {
                const [date, quantity] = await PeriFinanceEscrow.getVestingScheduleEntry(currentWallet, index);
                datas[index] = {
                    date: date.isZero() ? '-' : dateFns.format(calculator(date, utils.bigNumberify('1000'), 'mul').toNumber(), 'yyyy-MM-dd hh:mm'),
                    quantity: quantity.isZero() ? 'already received' : utils.formatEther(quantity)
                };
                
                if(!quantity.isZero() && index >= nextVestingIndex) {
                    if(date.toNumber() < nowToEpoch) {
                        totalVesting = calculator(totalVesting, quantity, 'add');
                    }
                }
                index++;
            }

            setTotalVesting(utils.formatEther(totalVesting));
            setVestingData(datas);
        }
        init();
        // eslint-disable-next-line
    }, [currentWallet])

    const getGasEstimate = async () => {
        let estimateGasLimit;
        try {
            estimateGasLimit = await PeriFinanceEscrow.contract.estimate.vest();
        } catch (e) {
            estimateGasLimit = 200000;
            console.log(e);
        }
        return numbro(estimateGasLimit).multiply(1.2).value();
    }

    const onVest = async () => {
        dispatch(setIsLoading(true));

        const transactionSettings = {
            gasPrice: gasPrice(seletedFee.price),
			gasLimit: getGasEstimate(),
        }

        try {
            const transaction = await PeriFinanceEscrow.vest(transactionSettings);
            history.push('/')
            dispatch(updateTransaction({
                hash: transaction.hash,
                message: `Claimed rewards`,
                type: 'CLAIM'
            }
        ));
        }catch(e) {

        }
        dispatch(setIsLoading(false));
    }

    return (
        <Action title="VEST" subTitles={[1, 2]}>
            <Container>    
                <VestingStyledTHeader>
                    <StyledCell><H6>No</H6></StyledCell>
                    <StyledCell><H6>QUANTITY</H6></StyledCell>
                    <StyledCell><H6>VESTABLE DATE</H6></StyledCell>
                </VestingStyledTHeader>
                <StyledTBody height={200}>
                    {vestingData.length > 0 ? 
                        vestingData.map((data, index) => (
                            <Row key={index}>
                                <StyledCell><H6>{index+1}</H6></StyledCell>
                                <StyledCell><H6>{data.quantity}</H6></StyledCell>
                                <StyledCell><H6>{data.date}</H6></StyledCell>
                            </Row>
                    )) : null
                    }
                </StyledTBody>
                <div>
                    <Input key="primary"
                        currencyName="PERI"
                        value={`current vestable rewards  : ${totalVesting}`}
                        disabled={true}
                    />   
                    <VestButton onClick={ () => onVest()} disabled={Number(totalVesting) === 0}>
                        <H4 weigth="bold">VEST</H4>
                    </VestButton>
                
                    <Fee gasPrice={seletedFee.price}/>
                </div> 
            </Container>
        </Action>
    );
}
const Cancel = styled(LightBlueButton)`
    height: 40px;
    width: 120px;
`

const Arrow = styled.img`
    width: 15px;
    margin: 0px 5px;
`

const VestingStyledTHeader = styled(StyledTHeader)`
    flex: 1 2 3 3;
`

const TableTitle = styled(H3)`
    margin: 10px;
`;

const StyledCell = styled(Cell)`
    padding: 10px;
`

const Container = styled.div`
    width: 100%;
    height: 100%;
`

const VestButton = styled(BlueGreenButton)`
    width: 100%;
    margin-top: 10px;
    height: 50px;
`
export default Vesting;


