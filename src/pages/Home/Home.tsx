import { useSelector } from "react-redux";
import { getBalance } from 'helpers/wallet'
import { RootState } from 'config/reducers'

const Home = () => {
    const connectedWallet = useSelector((state: RootState) => state.wallet);
    return (
        <div onClick={async () => console.log(getBalance(connectedWallet.currentWallet, 'pUSD'))}></div>
    );
}

export default Home;