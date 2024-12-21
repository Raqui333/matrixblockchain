module.exports = function validateBlockChain(blockchain) {
  return (_req, res, next) => {
    res.on('finish', () => {
      if (!blockchain.validateBlockChain())
        throw new Error('Blockchain invalid');
    });
    next();
  };
};
