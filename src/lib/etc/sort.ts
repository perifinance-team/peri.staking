export function createCompareFn<T extends Object>(
	property: keyof T,
	sort_order: "asc" | "desc"
  ) {
	const compareFn = (a: T, b: T) => {
	  const val1 = a[property];
	  const val2 = b[property];
	  const order = sort_order !== "desc" ? 1 : -1;
	  const orderBigint = sort_order !== "desc" ? 1n : -1n;
	  
	  switch (typeof val1) {
		case "number": {
		  const valb = val2 as number;
		  const result = val1 - valb;
		  return result * order;
		}
		case "bigint": {
			const valb = val2 as bigint;
			const result = (val1 - valb) / 10n ** 9n;
			return Number(result * orderBigint);
		  }
		case "string": {
		  const valb = val2 as string;
		  const result = val1.localeCompare(valb);
		  return result * order;
		}
		// add other cases like boolean, etc.
		default:
		  return 0;
	  }
	};
	return compareFn;
  }