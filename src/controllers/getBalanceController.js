module.exports = function getBalance(blockchain) {
  return (req, res) => {
    const { address } = req.params;

    const wallet_balance = blockchain.getBalanceFromAddress(address);

    return res.status(200).send({
      address: address,
      balance: wallet_balance,
    });
  };
};
