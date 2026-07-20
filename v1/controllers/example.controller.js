const getExample = (req, res) => {
  res.json({
    message: 'Hello from v1 API!',
    version: 'v1'
  });
};

module.exports = {
  getExample
};
