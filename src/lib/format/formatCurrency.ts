// import { formatEther } from 'ethers'
import { fromBigInt } from "lib/etc/utils";
export const formatCurrency = (value, decimals = 2) => {
  if (!value) return "0";
  // const regexp = new RegExp(`(\\d+\\.)+\\d{0,${decimals}}`, 'g');
  const cutDecimals = Number(fromBigInt(value)).toLocaleString("en", {
    maximumFractionDigits: decimals,
  });
  return cutDecimals ? cutDecimals : value.toLocaleString();
};
