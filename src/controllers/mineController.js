module.exports = function mineController(blockchain) {
  return (req, res) => {
    const { address } = req.params;

    const { guess_hash } = req.body;

    if (!guess_hash) {
      return res
        .status(418)
        .send({ message: 'Request body mising guess_hash key' });
    }

    const status = blockchain.minePendingTransactions(
      String(guess_hash),
      address
    );

    if (status == -1) return res.status(418).send({ message: 'Wrong guess' });

    return res.status(200).send({
      message: 'Reward sent to your address!',
      address: address,
      amount: blockchain.infoRewardForMining(),
    });
  };
};
