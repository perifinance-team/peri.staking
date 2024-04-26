import { multiplyDecimal, divideDecimal } from "../etc/utils";

export const getStakableAmt = (
  tokenIR: bigint,
  otherIR: bigint,
  tokenEA: bigint,
  otherEA: bigint,
  totalEA: bigint,
  periIR: bigint,
  maxTR: bigint
) => {
  // get target token's stakable amount  getExternalTokenQuota() = Tmax
  // X = [ ( Tmax - Tp ) * V - { ( Tt - Tp ) * Vt + ( To - Tp ) * Vo } ] / ( Tt - Tmax )
  // addableAmt = ( Tt - Tp ) * Vt : always Tt > Tp
  let temp = tokenIR - periIR;
  let addableAmt = multiplyDecimal(temp, tokenEA);

  // addableAmt = addableAmt + ( To - Tp ) * Vo : always To > Tp
  temp = multiplyDecimal(otherIR > 0 ? otherIR - periIR : 0, otherEA);
  addableAmt = addableAmt + temp;

  // temp = ( Tmax - Tp ) * V : always Tmax > Tp
  temp = maxTR - periIR;
  temp = multiplyDecimal(temp, totalEA);

  // if target token's EA > target token's SA, return (old exTRatio, 0)
  if (temp < addableAmt) {
    return 0;
  }

  // addableAmt = ( Tmax - Tp ) * V - addableAmt
  addableAmt = temp - addableAmt;

  // addableAmt = addableAmt / ( Tt - Tmax )
  temp = tokenIR - maxTR;
  addableAmt = temp !== 0n ? divideDecimal(addableAmt, temp) : 0n;
  return addableAmt;
};

export const getDebtNAddableAmt = async (
  tokens: any,
  exchangeRates: any,
  debtBalance: bigint,
  stableEA: bigint,
  goldEA: bigint,
  stableIR: bigint,
  goldIR: bigint,
  maxTR: bigint,
  stables: Array<string>
) => {
  const periIR = tokens["PERI"].IR;
  const periDebt = debtBalance - tokens["DEBT"].exDebt;
  const periSA = periDebt > 0 ? divideDecimal(periDebt, periIR) : 0n;
  const totalSA = periSA + stableEA + goldEA;

  // console.log("tokens", tokens);

  Object.keys(tokens).forEach((token) => {
    // console.log("token", token);
    if (!["DEBT", "PERI", "pUSD", "LP"].includes(token)) {
      let tokenIR: bigint, otherIR: bigint, tokenEA: bigint, otherEA: bigint;
      if (stables.includes(token)) {
        tokenIR = stableIR;
        otherIR = goldIR;
        tokenEA = stableEA;
        otherEA = goldEA;
      } else {
        tokenIR = goldIR;
        otherIR = stableIR;
        tokenEA = goldEA;
        otherEA = stableEA;
      }

      tokens[token].stakeable = getStakableAmt(
        tokenIR,
        otherIR,
        tokenEA,
        otherEA,
        totalSA,
        periIR,
        maxTR
      );

      // console.log(token, "stakeable", tokens[token].stakeable, "totalSA", totalSA, "tokenEA", tokenEA, "otherEA", otherEA);
      tokens[token].stakeable =
        exchangeRates[token] > 0n
          ? divideDecimal(tokens[token].stakeable, exchangeRates[token])
          : 0n;
      // console.log(token, "stakeable", tokens[token].stakeable, "transferable", tokens[token].transferable);
      tokens[token].stakeable =
        tokens[token].stakeable > tokens[token].transferable
          ? tokens[token].transferable
          : tokens[token].stakeable;
    }
  });
};
