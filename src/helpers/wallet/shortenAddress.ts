export const shortenAddress = address => {
    if (!address) return null;
    return address.slice(0, 6) + '...' + address.slice(-4, address.length);
};