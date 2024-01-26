// COMPONENTS
const Swap = require('./components/swap');
const Graph = require('./components/graph');

// UTILS
const utils = require('./utils/index');

module.exports = {
  Swap,
  Graph,
  utils,
};

module.exports.default = {
  Swap,
  Graph,
  utils,
};

module.exports.Swap = Swap;
module.exports.Graph = Graph;
module.exports.utils = utils;
