import Swap from './components/swap/index.js';
import Graph from './components/graph/index.js';

// UTILS
import utils from './utils/index.js';

export { Swap, Graph, utils };

export default {
  Swap,
  Graph,
  utils,
};

// TODO: parse index.css and split components module styles into different css files so user can import seperatly for performance reasons.

// TODO: Inject each css file into its own component in componentDidMount with   const style = document.createElement('style'); style.textContent = styleString; document.head.append(style);

// TODO: fix axios.default bug fix
