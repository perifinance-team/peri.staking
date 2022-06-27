export const getTimeStamp = async (address, Liquidations) => {
  return await Liquidations.getLiquidationDeadlineForAccount(address).then(
    (data) => data
  );
};
