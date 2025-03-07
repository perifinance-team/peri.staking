import BN from 'bn.js';

import { toBN, toWei, fromWei, rightPad, asciiToHex/* , hexToAscii, toAscii */ } from 'web3-utils';

import { BigNumberish, BigNumber } from "ethers";
import { parseEther, formatEther, parseBytes32String, formatUnits } from "ethers/lib/utils";

const UNIT = toWei(new BN('1'), 'ether');

	/**parseBytes32String(metadata)
	*  Translates an amount to our canonical unit. We happen to use 10^18, which means we can
	*  use the built in web3 method for convenience, but if unit ever changes in our contracts
	*  we should be able to update the conversion factor here.
	*  @param amount The amount you want to re-base to UNIT
	*/
const toUnit = amount => toWei(amount.toString(), 'ether');
const fromUnit = amount => fromWei(amount.toString(), 'ether');

const toBigNbr = amount => toBN(amount.toString());
const unitToPreciseUnit = amount => toBN(amount.toString() + '000000000');
const preciseUnitToUnit = amount => toBN(amount.toString().slice(0, -9));
// For 6 decimals
const to3Unit = amount => toBN(amount.toString() + '000000');

const toBytes32 = key => rightPad(asciiToHex(key), 64);
const fromBytes32 = key => parseBytes32String(key);
const toBigInt = (amount: number | bigint | string | BN | BigNumber)  => {
	if (amount === '') { return 0n; }

	const bn = !BN.isBN(amount) 
		? BigNumber.isBigNumber(amount)
			? amount
			: parseEther(amount.toString())
		: BigNumber.from(amount.toString());
	return bn.toBigInt();
};
const fromBigInt = (amount: BigNumberish) => formatEther(amount);
const fromGwei = (amount: BigNumberish) => formatUnits(amount, 'gwei');

export const toBigNumber = (value: BigNumberish):BigNumber => {
    return typeof value === "bigint" ? BigNumber.from(value) : parseEther(String(value));
};

export const fromBigNumber = (value: BigNumberish):string => {
    return formatEther(String(value));
};


/**
	*  Translates an amount to our canonical precise unit. We happen to use 10^27, which means we can
	*  use the built in web3 method for convenience, but if precise unit ever changes in our contracts
	*  we should be able to update the conversion factor here.
	*  @param amount The amount you want to re-base to PRECISE_UNIT
	*/
const PRECISE_UNIT_STRING = '1000000000000000000000000000';
const PRECISE_UNIT = toBN(PRECISE_UNIT_STRING);

const toPreciseUnit = amount => {
	// Code is largely lifted from the guts of web3 toWei here:
	// https://github.com/ethjs/ethjs-unit/blob/master/src/index.js
	let amountString = amount.toString();

	// Is it negative?
	var negative = amountString.substring(0, 1) === '-';
	if (negative) {
		amountString = amountString.substring(1);
	}

	if (amountString === '.') {
		throw new Error(`Error converting number ${amount} to precise unit, invalid value`);
	}

	// Split it into a whole and fractional part
	// eslint-disable-next-line prefer-const
	let [whole, fraction, ...rest] = amountString.split('.');
	if (rest.length > 0) {
		throw new Error(`Error converting number ${amount} to precise unit, too many decimal points`);
	}

	if (!whole) {
		whole = '0';
	}
	if (!fraction) {
		fraction = '0';
	}
	if (fraction.length > PRECISE_UNIT_STRING.length - 1) {
		throw new Error(`Error converting number ${amount} to precise unit, too many decimal places`);
	}

	while (fraction.length < PRECISE_UNIT_STRING.length - 1) {
		fraction += '0';
	}

	whole = new BN(whole);
	fraction = new BN(fraction);
	let result = whole.mul(PRECISE_UNIT).add(fraction);

	if (negative) {
		result = result.mul(new BN('-1'));
	}

	return result;
};

const fromPreciseUnit = amount => {
	// Code is largely lifted from the guts of web3 fromWei here:
	// https://github.com/ethjs/ethjs-unit/blob/master/src/index.js
	const negative = amount.lt(new BN('0'));

	if (negative) {
		amount = amount.mul(new BN('-1'));
	}

	let fraction = amount.mod(PRECISE_UNIT).toString();

	while (fraction.length < PRECISE_UNIT_STRING.length - 1) {
		fraction = `0${fraction}`;
	}

	// Chop zeros off the end if there are extras.
	fraction = fraction.replace(/0+$/, '');

	const whole = amount.div(PRECISE_UNIT).toString();
	let value = `${whole}${fraction === '' ? '' : `.${fraction}`}`;

	if (negative) {
		value = `-${value}`;
	}

	return value;
};

/*
	* Multiplies x and y interpreting them as fixed point decimal numbers.
	*/
const multiplyDecimal = (x, y, unit = UNIT) => {
	const xBN = BN.isBN(x) ? x : new BN(x);
	const yBN = BN.isBN(y) ? y : new BN(y);
	return BigInt(xBN.mul(yBN).div(unit).toString());
};

/*
	* Divides x and y interpreting them as fixed point decimal numbers.
	*/
const divideDecimal = (x, y, unit = UNIT) => {
	const xBN = BN.isBN(x) ? x : new BN(x);
	const yBN = BN.isBN(y) ? y : new BN(y);
	return /* yBN.isZero() ? 0n :  */BigInt(xBN.mul(unit).div(yBN).toString());
};

/*
	* Multiplies x and y interpreting them as fixed point decimal numbers,
	* with rounding.
	*/
const multiplyDecimalRound = (x, y) => {
	let result = x.mul(y).div(toUnit(0.1));
	if (result.mod(toBN(10)).gte(toBN(5))) {
		result = result.add(toBN(10));
	}
	return result.div(toBN(10));
};

/*
	* Multiplies x and y interpreting them as fixed point decimal numbers,
	* with rounding.
	*/
const multiplyDecimalRoundPrecise = (x, y) => {
	let result = x.mul(y).div(toPreciseUnit(0.1));
	if (result.mod(toBN(10)).gte(toBN(5))) {
		result = result.add(toBN(10));
	}
	return result.div(toBN(10));
};

/*
	* Divides x and y interpreting them as fixed point decimal numbers,
	* with rounding.
	*/
const divideDecimalRound = (x, y) => {
	let result = x.mul(toUnit(10)).div(y);
	if (result.mod(toBN(10)).gte(toBN(5))) {
		result = result.add(toBN(10));
	}
	return result.div(toBN(10));
};

/*
	* Divides x and y interpreting them as fixed point decimal numbers,
	* with rounding.
	*/
const divideDecimalRoundPrecise = (x, y) => {
	let result = x.mul(toPreciseUnit(10)).div(y);
	if (result.mod(toBN(10)).gte(toBN(5))) {
		result = result.add(toBN(10));
	}
	return result.div(toBN(10));
};

/*
	* Exponentiation by squares of x^n, interpreting them as fixed point decimal numbers.
	*/
const powerToDecimal = (x, n, unit = UNIT) => {
	let xBN = BN.isBN(x) ? x : new BN(x);
	let temp = unit;
	while (n > 0) {
		if (n % 2 !== 0) {
			temp = temp.mul(xBN).div(unit);
		}
		xBN = xBN.mul(xBN).div(unit);
		n = n / 2;
		n = parseInt(n.toString());
	}
	return temp;
};

export {
		multiplyDecimal,
		divideDecimal,
		multiplyDecimalRound,
		divideDecimalRound,
		multiplyDecimalRoundPrecise,
		divideDecimalRoundPrecise,
		powerToDecimal,

		to3Unit,
		toBigNbr,
		toUnit,
		fromUnit,
		toBigInt,
		fromBigInt,
		fromGwei,

		toBytes32,
		fromBytes32,

		toPreciseUnit,
		fromPreciseUnit,
		unitToPreciseUnit,
		preciseUnitToUnit,
	};
