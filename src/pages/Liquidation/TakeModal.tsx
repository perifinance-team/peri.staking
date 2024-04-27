import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import { RootState } from "config/reducers";
import { SmallLoadingSpinner } from "../../components/heading";
import { getTake } from "lib/liquidation/getTake";
import { formatCurrency } from "lib/format";
import { divideDecimal, fromBigInt, multiplyDecimal, toBigInt } from "lib/etc/utils";
import { getNetworkPrice } from "lib/fee/networkPrice";
import { extractMessage } from "lib/error";
import "./RangeInput.css";

const decimalSplit = (value: string | number) => {
  if (!value) return "0";
  const splitStr = String(value).split(".");
  if (!splitStr[1]) return splitStr[0];

  if (Number(splitStr[0]) > 10) {
    return `${splitStr[0]}.${splitStr[1].slice(0, 2)}`;
  } else if (Number(splitStr[0]) > 0) {
    return `${splitStr[0]}.${splitStr[1].slice(0, 4)}`;
  } else {
    return `${splitStr[0]}.${splitStr[1].slice(0, 8)}`;
  }
};

const TakeModal = ({
  idx,
  address,
  list,
  dispatch,
  contracts,
  debt,
  exEA,
  collateral,
  toggleModal,
  cRatio,
}) => {
  const { balances }: any = useSelector((state: RootState) => state.balances);
  const { gasPrice } = useSelector((state: RootState) => state.networkFee);
  const exchangeRates = useSelector((state: RootState) => state.exchangeRates);
  const { networkId } = useSelector((state: RootState) => state.wallet);

  const [value, setValue] = useState<string>("0");
  const [gas, setGas] = useState<string>("0");
  const [profit, setProfit] = useState<string>(null);
  const [per, setPer] = useState<number>(0);
  const [exSR, setExSR] = useState<any>(0n);
  const [maxLiquidAmt, setMaxLiquidAmt] = useState<string>("0");
  const [viewValue, setViewValue] = useState({});

  const maxBalance = balances.pUSD.transferable;
  const modalRef = useRef<HTMLDivElement>(null);
  const closeModalHandler = (e) => {
    console.log("e.target", e.target);
    if (
      e.target.id === "close_caller" &&
      list[idx].toggle &&
      !modalRef.current?.contains(e.target)
    ) {
      console.log("closeModalHandler");
      toggleModal(idx);
    }
  };

  const getProfit = () => {
    if (value === undefined || value === null || value === "" || value === "0") {
      setProfit("0");
      getViewValue(0);
      return;
    }
    setProfit(value ? (Number(value.replaceAll(",", "")) * 0.1 - Number(gas)).toFixed(4) : "0");
    getViewValue(Number(value.replaceAll(",", "")));
  };

  const sumCollateralHandler = async () => {
    console.log(address, "tRatio", list[idx].tRatio, "exTRatio", list[idx].exTRatio);
    // const tokens = Object.keys(balances).filter((key) => !["DEBT", "pUSD", "LP"].includes(key));
    // console.log("tokens", tokens);
    // console.log("list", list);

    let sum = 0;
    const collateralList = {};
    await Promise.all(
      collateral.map(async (token) => {
        collateralList[token.name] = token.value.isZero()
          ? "0"
          : fromBigInt(multiplyDecimal(token.value.toBigInt(), exchangeRates[token.name]));
      })
    );

    // console.log("PERI :", collateral[0].value.toBigInt());

    console.log("collateral", collateral);

    console.log("collateralList", collateralList);

    // setCollateralList(collateral);

    Object.values(collateralList).forEach((value) => (sum += Number(value)));

    console.log("collateral sum:", sum);

    // setTotalEA(toBigInt(sum));

    // getMaxFlagValue(maxLiquidAmt, collateral);
    getMaxExSA(sum);

    // const maxLiquidAmt = tokens.reduce((acc, token) => {

    /* const peri = (BigInt(list[idx].collateral[0].value) * BigInt(collateral.PERI)) / 10n ** 18n;
		const dai = (BigInt(list[idx].collateral[1].value) * BigInt(collateral.Dai)) / 10n ** 18n;
		const usdc = (BigInt(list[idx].collateral[2].value) * BigInt(collateral.USDC)) / 10n ** 18n;

		setMaxLiquidAmt(
			String((Number(debt.replaceAll(",", "")) - Number(formatCurrency(peri + dai + usdc).replaceAll(",", "")) / 1.5) * 1.1)
		);

		getMaxFlagValue(
			String((Number(debt.replaceAll(",", "")) - Number(formatCurrency(peri + dai + usdc).replaceAll(",", "")) / 1.5) * 1.1)
		); */
  };

  /**
   * r = target issuance ratio
   * D = debt balance
   * V = Collateral
   * P = liquidation penalty
   * Calculates amount of pynths = (D - V * r) / (1 - (1 + P) * r)
   */
  const calcAmtToFixCollateral = (debtBalance: bigint, collateral: bigint, tRatio: bigint) => {
    const unit = toBigInt("1");
    console.log(
      "debtBalance",
      debtBalance,
      "multiplyDecimal(collateral, tRatio)",
      multiplyDecimal(collateral, tRatio)
    );
    const dividend = debtBalance - multiplyDecimal(collateral, tRatio);
    const divisor = unit - multiplyDecimal(unit + toBigInt("0.1"), tRatio);
    console.log("dividend", dividend, "divisor", divisor);
    return divideDecimal(dividend, divisor);
  };

  const getMaxExSA = (totalEA: number) => {
    // get periSA
    // derived peri Staked Amount from _existDebt and save it to periSA
    console.log("debt", debt, "exEA", exEA, "list[idx].exTRatio", list[idx].exTRatio);
    console.log("collateral[0]", collateral[0]);
    const exDebt = multiplyDecimal(exEA, list[idx].exTRatio);
    const periDebt = debt > exDebt ? debt - exDebt : 0n;
    const periCol = BigInt(collateral[0].value);
    const periSA = divideDecimal(periDebt, BigInt(collateral[0].IR));

    console.log(
      "periSA",
      periSA,
      "periDebt",
      periDebt,
      "periCol",
      multiplyDecimal(periCol, exchangeRates["PERI"])
    );

    const totalSA = periCol < periSA ? periCol + exEA : periSA + exEA;
    const exSR = totalSA > 0n && divideDecimal(exEA, totalSA);

    setExSR(exSR);

    console.log("debt", debt, "totalEA", totalEA, "list[idx].tRatio", list[idx].tRatio);
    let totalRedeem = calcAmtToFixCollateral(debt, toBigInt(totalEA), list[idx].tRatio);
    let amountToLiquidate = totalRedeem;

    const penaltyRate = toBigInt("1.1");
    const bnTotalEA = toBigInt(totalEA);
    totalRedeem = multiplyDecimal(amountToLiquidate, penaltyRate);
    console.log("totalRedeem", totalRedeem, "bnTotalEA", bnTotalEA);

    // cap liquidating amount to staked amount
    amountToLiquidate =
      totalRedeem > bnTotalEA ? divideDecimal(bnTotalEA, penaltyRate) : amountToLiquidate;

    console.log("amountToLiquidate", fromBigInt(amountToLiquidate));

    setMaxLiquidAmt(fromBigInt(amountToLiquidate));
    // calc peri Staked Amount out of peri staked amount and peri issuance ratio
    /*periSA = _preciseDivToDecimal(periSA, getIssuanceRatio());

        if (_periCol < periSA) {
            idealExSA = _periCol.add(exEA);
            exSR = exEA.divideDecimal(idealExSA);
            idealExSA = exEA;
        } else {
            idealExSA = periSA.add(exEA);
            exSR = exSR > maxSR ? maxSR : exSR;
            idealExSA = _preciseMulToDecimal(idealExSA, exSR);
        } */
  };

  const getViewValue = (amount: number) => {
    const totalRedeem = Number(maxLiquidAmt) < amount ? toBigInt(maxLiquidAmt) : toBigInt(amount);
    console.log("totalRedeem", totalRedeem);
    const exRedeem = multiplyDecimal(totalRedeem, exSR);
    console.log("exRedeem", exRedeem, "exSR", exSR, "totalRedeem", totalRedeem);
    const periRedeem = totalRedeem > 0n ? totalRedeem - exRedeem : 0n;

    const viewValue = {};

    viewValue["PERI"] = fromBigInt(divideDecimal(periRedeem, exchangeRates["PERI"]));

    collateral.forEach((item) => {
      if (item.name === "PERI") return;
      console.log(item.name, item.value, "exEA", exEA);
      const stakeRatio =
        !item.value.isZero() && exEA > 0n ? divideDecimal(BigInt(item.value), exEA) : 0n;
      // console.log("stakeRatio", stakeRatio);
      viewValue[item.name] = !item.value.isZero()
        ? fromBigInt(divideDecimal(multiplyDecimal(exRedeem, stakeRatio), exchangeRates[item.name]))
        : 0;
    });

    setViewValue(viewValue);
  };

  const getGasPrice = async () => {
    try {
      // set 1n on convertValue when value == 0 for gas estimate of liquidateDelinquentAccount
      const convertValue = Number(value) > 0 ? toBigInt(value) : 1n;
      console.log("convertValue", convertValue, "list[idx].address", list[idx].address);

      const estimateGas =
        await contracts.signers.PeriFinance.estimateGas.liquidateDelinquentAccount(
          address,
          convertValue
        );
      const netPrice = await getNetworkPrice(networkId);

      console.log(
        "netPrice",
        netPrice,
        "gasPrice",
        gasPrice,
        "estimateGas",
        estimateGas.toBigInt()
      );

      console.log(
        `Gas Fee: ${fromBigInt(multiplyDecimal(estimateGas.mul(gasPrice).toBigInt(), netPrice))}`
      );

      const estimateGasPrice =
        gasPrice > 0n
          ? fromBigInt(multiplyDecimal(estimateGas.mul(gasPrice).toBigInt(), netPrice))
          : "0";
      setGas((Number(estimateGasPrice) * 1.1).toFixed(3));
    } catch (e) {
      console.error("getGasPrice ERROR:", extractMessage(e));
      // console.error("getGasPrice ERROR:", e.data.message ? e.data.message : e?.message);
      NotificationManager.warning(extractMessage(e), "WARNING");

      setGas("0");
    }
  };

  const getMaxAmount = (per = 1) => {
    if (maxLiquidAmt) {
      const trulyMax = Number(maxLiquidAmt);
      const nMaxBal = Number(fromBigInt(maxBalance));
      // console.log("trulyMax", trulyMax, "nMaxBal", nMaxBal);

      const maxAmt =
        Number(nMaxBal) > Number(trulyMax) ? Number(trulyMax) * per : Number(nMaxBal) * per;

      // getMaxExSA(maxLiquidAmt, maxAmt);
      return maxAmt.toFixed(2);
    }
  };

  const onChangeTakeInput = (value) => {
    const available = Number(formatCurrency(maxBalance).replaceAll(",", ""));
    available >= Number(value) && setValue(value);
  };

  useEffect(() => {
    // getGasPrice();
    getProfit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setValue(getMaxAmount(per));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [per]);

  useEffect(() => {
    sumCollateralHandler();
    getGasPrice();

    window.addEventListener("click", closeModalHandler);
    return () => {
      window.removeEventListener("click", closeModalHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TakeModalItem >
      <Area ref={modalRef}>
        <CloseBtn
          id="close_caller"
          src={`/images/icon/close.svg`}
          onClick={() => toggleModal(idx)}
        />
        <InputBox>
          <SubIndicator>
            <span>{`Payable: ${formatCurrency(maxBalance)}`}</span>
            {/* {gas ? ( */}
            <span>{`Gas Fee: ${gas}`}</span>
            {/* ) : (
							<span style={{ display: "flex" }}>
								<span>Gas Fee:</span>
								<SmallLoadingSpinner />
							</span>
						)} */}
          </SubIndicator>
          <img src={`/images/currencies/pUSD.png`} alt="pUSD" />
          <TakeInput
            type="number"
            placeholder="0"
            min="0"
            max={getMaxAmount(1)}
            step="0.01"
            value={value === "0" ? "" : value}
            autoFocus={true}
            onChange={(e) => onChangeTakeInput(e.target.value)}
          />
          <MaxBtn onClick={() => setValue(getMaxAmount())}>max</MaxBtn>
        </InputBox>

        <SlideInputBox>
          <SliderSection>
            <TakeSlider
              type="range"
              min="0"
              max={getMaxAmount()}
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <PerBox>
              <SliderInput
                type="text"
                value={`${per * 100}`}
                onChange={(e) => setPer(Number(e.target.value) / 100)}
              />
              <p>%</p>
            </PerBox>
          </SliderSection>
          <TakePercentage>
            <PercentageBtn $isActive={per === 0} onClick={() => setPer(0)}>
              0%
            </PercentageBtn>
            <PercentageBtn $isActive={per === 0.25} onClick={() => setPer(0.25)}>
              25%
            </PercentageBtn>
            <PercentageBtn $isActive={per === 0.5} onClick={() => setPer(0.5)}>
              50%
            </PercentageBtn>
            <PercentageBtn $isActive={per === 0.75} onClick={() => setPer(0.75)}>
              75%
            </PercentageBtn>
            <PercentageBtn $isActive={per === 1} onClick={() => setPer(1)}>
              100%
            </PercentageBtn>
          </TakePercentage>
        </SlideInputBox>

        <ContentSection>
          <ContentBoxContainer>
            <ContentBox>
              <span className="title">{`C-Ratio`}</span>
              <span className="content">
                <span style={{ display: "flex" }}>{cRatio}</span>
              </span>
            </ContentBox>
            <ContentBox>
              <span className="title">{`Pay off` /*  ( $ ${Number(value).toFixed(2)} )` */}</span>
              <span className="content">
                <span>
                  <img className="icon" src={`/images/currencies/pUSD.png`} alt="pUSD" />
                  {Number(value).toFixed(2)}
                </span>
              </span>
            </ContentBox>
          </ContentBoxContainer>
          <ContentBoxContainer>
            <ContentBox>
              <span className="title">{`Estimate Profit`}</span>
              <span className="content">
                {value || profit ? (
                  <span>{`$${value === "0" ? "0" : profit}`}</span>
                ) : (
                  <span style={{ display: "flex" }}>
                    $<SmallLoadingSpinner />
                  </span>
                )}
              </span>
            </ContentBox>
            <ContentBox>
              {value || maxLiquidAmt ? (
                <span className="title">{
                  `Take away` /*  ( $ ${
									Number(formatCurrency(maxBalance).replaceAll(",", "")) < viewValue[0] * 0.08
										? decimalSplit(formatCurrency(maxBalance).replaceAll(",", ""))
										: decimalSplit(viewValue[0] * 0.08)
								} )` */
                }</span>
              ) : (
                <span className="title" style={{ display: "flex" }}>
                  Take away ( $ <SmallLoadingSpinner /> )
                </span>
              )}

              <span className="content">
                {collateral.map((item, idx) => {
                  return (
                    viewValue[item.name] > 0 && (
                      <span key={`collateral_${item.name}`}>
                        <img
                          className="icon"
                          src={`/images/currencies/${item.name.toUpperCase()}.png`}
                          alt={item.name.toUpperCase()}
                        />
                        <span>{`${item.name} ${decimalSplit(viewValue[item.name])}`}</span>
                      </span>
                    )
                  );
                })}
              </span>
            </ContentBox>
          </ContentBoxContainer>
        </ContentSection>

        <SubmitBtn
          id="close_caller"
          onClick={() =>
            getTake(value, idx, address, list, dispatch, contracts, balances, toggleModal)
          }
        >
          Take
        </SubmitBtn>
      </Area>
    </TakeModalItem>
  );
};

const TakeModalItem = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: transparent;
  cursor: default;
`;

const CloseBtn = styled.img`
  width: 13px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const Area = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-width: 400;
  min-height: 420;
  padding: 10px 10px 30px 10px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.body};
  border: ${({ theme }) => `1px solid ${theme.colors.border.primary}`};
  box-shadow: ${({ theme }) => `0px 0px 10px ${theme.colors.border.primary}`};
  color: #fefffe;
  font-weight: 500;
  position: relative;
`;

const SlideInputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 18rem;
`;

const SliderSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: justify-between;
`;

const PerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: fit-content;
  margin-left: 2px;
`;

const TakeSlider = styled.input`
  width: 100%;
  height: fit-content;
  // padding-left: 1px;
`;

const SliderInput = styled.input`
  display: flex;
  width: 1.6rem;
  align-items: center;
  height: 24px;
  background: #0e101e;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 300;
  outline: none;
  outline-offset: 0px;
  border-style: solid;
  border-width: 0.2px;
  border-radius: 6px;
  color: #fefffe;
  p {
    text-size: 0.85ren;
  }
`;

const PercentageBtn = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.font.fourth : theme.colors.font.primary)};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const TakePercentage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.6875rem;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 16rem;
  height: 1.5rem;
  padding: 3px 0 3px 3px;
  border-radius: 35px;
  background: #0e101e;
  position: relative;
  margin-top: 50px;
  margin-bottom: 5px;

  img {
    width: 20px;
  }
`;

const SubIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: -18px;

  span {
    font-size: 0.6rem;
    margin: 0 10px;
  }
`;

const TakeInput = styled.input`
  width: 12rem;
  height: fit-content;
  background: #525252;
  outline: none;
  border: none;
  color: #fefffe;
  text-align: right;
  font-size: 0.9em;
  font-weight: bold;
  background: #0e101e;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;

  // ${({ theme }) => theme.media.mobile`
	// 	justify-content: center;
	// 	flex-direction: row;
	// 	align-items: center;
	// `}
`;

const ContentBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.media.mobile`
		// justify-content: center;
		flex-direction: column;
		align-items: flex-end;
		margin: 10px 0px;

	`}
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.8125rem;
  margin: 20px 5px 0 5px;
  // margin-bottom: 1.5rem;

  img {
    width: 14px;
    margin-right: 6px;
  }

  .title {
    font-weight: 600;
    vertical-align: middle;
    width: fit-content;
    min-width: 190px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .content {
    display: flex;
    justify-content: center;
    flex-direction: column;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  ${({ theme }) => theme.media.mobile`
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10px 5px 0 5px;
		width: 100%;

		.title {
			display: inline-block;
			vertical-align: middle;
			text-align: right;
			min-width: 80px;
			max-width: 110px;
			width: 50%;
			margin: 0;
		}
		.content {
			flex-direction: row;
			justify-content: flex-end;
			width: 50%;
			min-width: 140px;

			span {
				margin-bottom: 0;
			}
		}
	`}
`;

const SubmitBtn = styled.button`
  width: 16rem;
  height: 35px;
  font-weight: bold;
  border-radius: 25px;
  margin-top: 30px;
  color: white;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.background.body};
  border: ${({ theme }) => `1.5px solid ${theme.colors.border.tableRow}`};
  box-shadow: ${({ theme }) => `0.5px 1.5px 0px ${theme.colors.border.primary}`};

  &:hover {
    transition: 0.2s ease-in-out;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => `0.5px 3px 0px ${theme.colors.border.primary}`};
  }

  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${({ theme }) => theme.media.mobile`
		padding: 0.5rem 0;
		font-size: 0.7rem; 
	`}
`;

const MaxBtn = styled(SubmitBtn)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 1.7rem;
  border-radius: 6px;
  margin-right: -4px;
  font-size: 0.75rem;
  margin-top: 0;
`;

export default TakeModal;
