// MODULES
import React from 'react';
import Web3 from 'web3';
import axios from 'axios';
import cn from 'classnames';

// COMPONENTS
import Icon_settings from '../icons/settings.js';
import Icon_arrow_down from '../icons/arrow_down.js';
import Icon_swap from '../icons/swap.js';
import Icon_search from '../icons/search.js';

// CONTEXT (global state React.createContext)
//import { Context } from '../../context';

// CONFIG
import config from '../../config';

// UTILS
import UTILS, { fhandle, web3_wallet_connect } from '../../utils/index.js';

// STYLES
import style from './style.module.css';
import './style.css';

// CLIENT SIDE
class Swap extends React.Component {
  //static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      // Common
      loading: true,
      error: '', // detailed explanation of the current error

      // Wallet params
      wallet_accounts: [],
      wallet_chain_id: 1, // default 1 (ETH Mainnet)

      settings_open: false,
      settings_slippage: 0,
      settings_deadline: '',

      // pay token params
      pay_value: '',
      pay_value_timeout: 0,
      pay_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      pay_img: '/images/ethereum.png',
      pay_symbol: 'ETH',
      pay_name: 'Ethereum',
      pay_decimals: 18,
      pay_chain_id: 1,
      pay_price: 0.0,
      pay_balance: 0,
      pay_selector_open: false,
      pay_tokens: [],
      pay_search_value: '',
      pay_search_timeout: 0,

      // receive token params
      receive_value: '',
      receive_value_timeout: 0,
      receive_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      receive_img: '/images/tether.png',
      receive_symbol: 'USDT',
      receive_name: 'Tether',
      receive_decimals: 6,
      receive_chain_id: 1,
      receive_price: 0.0,
      receive_balance: 0,
      receive_selector_open: false,
      receive_tokens: [],
      receive_search_value: '',
      receive_search_timeout: 0,

      // Swap button states
      button_text: 'Connect wallet',
      button_disabled: false,
      button_state: 0, // swap state, 0 => wallet not connected, 1 => swap
    };

    ////////////////////////
    // CONSTANTS
    ////////////////////////
    this.ABI_ERC20 = [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_from',
            type: 'address',
          },
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ];
    this.ABI_BEP20 = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        constant: true,
        inputs: [
          {
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getOwner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    this.CHAINS = {
      // there are more supported chains in 0x.org, soon we will implement all the chains.
      1: {
        url_param: 'ethereum',
        usdt_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        usdt_decimals: 6,
      },
      56: {
        url_param: 'bsc',
        usdt_address: '0x55d398326f99059ff775485246999027b3197955',
        usdt_decimals: 18,
      },
      137: {
        url_param: 'polygon',
        usdt_address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        usdt_decimals: 6,
      },
      42161: {
        url_param: 'arbitrum',
        usdt_address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        usdt_decimals: 6,
      },
      43114: {
        url_param: 'avalanche',
        usdt_address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        usdt_decimals: 6,
      },
      11155111: {
        // Sepolia Testnet
        url_param: 'sepolia',
        usdt_address: '0x7169d38820dfd117c3fa1f22a697dba58d90ba06',
        usdt_decimals: 6,
      },
    };

    ////////////////////////
    // Functions
    ////////////////////////
    this.on_click_settings = this.on_click_settings.bind(this);

    this.on_change_pay_value = this.on_change_pay_value.bind(this);
    this.on_change_pay_search = this.on_change_pay_search.bind(this);
    this.on_click_pay_selector = this.on_click_pay_selector.bind(this);

    this.on_replace_tokens = this.on_replace_tokens.bind(this);

    this.on_change_receive_value = this.on_change_receive_value.bind(this);
    this.on_change_receive_search = this.on_change_receive_search.bind(this);
    this.on_click_receive_selector = this.on_click_receive_selector.bind(this);

    this.on_click_button = this.on_click_button.bind(this);

    this.listen_wallet = this.listen_wallet.bind(this);

    this.init = this.init.bind(this);

    ////////////////////////
    // References
    ////////////////////////
    this.ref_swap = React.createRef();
  }

  on_click_settings() {
    this.setState({
      ...this.state,
      settings_open: !this.state.settings_open,
      pay_selector_open: false,
      receive_selector_open: false,
    });
  }

  on_change_pay_value(e) {
    const value = e.target.value;

    if (isNaN(Number(value))) {
      return;
    }

    // if input is clean or 0 then reset everything: pay and receive input, pay_value_timeout timeout
    if (value === '' || Number(value) === 0) {
      // TODO: button_text is still 'Enter an amount' when wallet is not connected, user has to type something to connect wallet
      clearTimeout(this.state.pay_value_timeout);

      this.setState({
        ...this.state,
        //common
        loading: false,

        // pay
        pay_value: value,
        pay_value_timeout: 0,

        // receive
        receive_value: '',

        // button
        button_disabled: true,
        button_text: 'Enter an amount',
      });

      return;
    }

    clearTimeout(this.state.pay_value_timeout);

    const pay_value_timeout = setTimeout(() => {
      let sell_amount = Number(value);
      for (let i = 0; i < this.state.pay_decimals; i++) {
        sell_amount = sell_amount * 10;
      }

      // BigInt throws non float value error
      if (sell_amount % 1 !== 0) {
        sell_amount = parseInt(sell_amount);
      }

      sell_amount = BigInt(sell_amount).toString();

      const chain = this.CHAINS[this.state.wallet_chain_id].url_param;
      const url_query = `?buyToken=${this.state.receive_address}&sellToken=${this.state.pay_address}&sellAmount=${sell_amount}&chain=${chain}`;

      if (this.state.wallet_accounts[0]) {
        //url_query = url_query + '&takerAddress=' + this.state.wallet_accounts[0];
      }

      // quote 0x.org  endpoint
      const url = this.props.baseURL + '/quote' + url_query;

      axios
        .get(url)
        .then(async (res) => {
          console.log(res.data);

          let buy_amount = Number(res.data.buyAmount);
          for (let i = 0; i < this.state.receive_decimals; i++) {
            buy_amount *= 0.1;
          }

          console.log(buy_amount);

          const new_state = {
            ...this.state,

            //common
            loading: false,
            error: '', // successfull quote from 0x means no liquidity errors as it includes both tokens

            // pay token

            // receive token
            receive_value: fhandle(buy_amount, 5),

            // button
            button_text: 'Swap',
            button_disabled: false,
          };

          if (!window.ethereum) {
            new_state.button_text = 'Install Web3 Wallet';
            new_state.button_disabled = true;

            this.setState(new_state);

            return;
          }

          if (!this.state.wallet_accounts[0]) {
            new_state.button_text = 'Connect wallet';
            new_state.button_disabled = false;

            this.setState(new_state);

            return;
          }

          const web3 = new Web3(window.ethereum);
          const chain_id = await web3.eth.getChainId();

          if (!this.CHAINS[Number(chain_id)]) {
            new_state.button_text = 'Unsupported chain';
            new_state.button_disabled = true;

            this.setState(new_state);

            return;
          }

          this.setState(new_state);
        })
        .catch((err) => {
          this.setState({
            ...this.state,

            // common
            loading: false,
            error:
              "One of the tokens don't have enough asset on the network to make trade. This is common for very long-tail tokens.",

            // pay token

            // button
            button_text: 'Insufficient liquidity!',
            button_disabled: true,
          });
        });
    }, 300);

    // update pay value input and loading
    this.setState({
      ...this.state,

      //common
      loading: true,
      error: '',

      // pay token
      pay_value: value,
      pay_value_timeout: pay_value_timeout,

      // receive token
      receive_value: '',

      // button
      button_text: 'Fetching...',
      button_disabled: false,
    });
  }

  on_change_pay_search(e) {
    const value = e.target.value;

    clearInterval(this.state.pay_search_timeout);

    const timeout = setTimeout(async () => {
      const chain_name = this.CHAINS[this.state.wallet_chain_id].url_param;
      const url =
        config.url_api + '/v1/tokens/' + chain_name + '?search=' + value;

      const res = await axios.get(url);

      this.setState({
        ...this.state,
        // common
        loading: false,

        // pay tokens
        pay_tokens: res.data,
      });
    }, 500); // TODO: make a global wait time for delayed api calls interval

    this.setState({
      ...this.state,
      // common
      loading: true,

      // pay token
      pay_search_timeout: timeout,
      pay_search_value: value,
    });
  }

  on_click_pay_selector(current) {
    // TODO: check if current chain id is supported

    // USDT info on selected chain
    const usdt_address = this.CHAINS[this.state.wallet_chain_id].usdt_address;
    const usdt_decimals = this.CHAINS[this.state.wallet_chain_id].usdt_decimals;

    let sell_amount = '1'; // sell amount is static to get the price of selected token
    for (let i = 0; i < usdt_decimals; i++) {
      sell_amount += '0';
    }

    const chain = this.CHAINS[this.state.wallet_chain_id].url_param;

    // price url query
    const url_query = `?buyToken=${current.address}&sellToken=${usdt_address}&sellAmount=${sell_amount}&chain=${chain}`;

    // final 0x.org url price
    const url_price = this.props.baseURL + '/price' + url_query;

    // get selected tokens price async
    axios
      .get(url_price)
      .then(async (res) => {
        let price = Number(res.data.buyAmount);
        for (let i = 0; i < current.decimals; i++) {
          price = Number(price * 0.1);
        }

        price = 1.0 / price;

        const new_state = {
          ...this.state,

          // common
          loading: false,
          error: '',

          // pay token
          pay_price: Number(price),

          // button
          button_text: 'Enter an amount',
          button_disabled: true,
        };

        if (!window.ethereum) {
          new_state.button_text = 'Install Web3 Wallet';
          new_state.button_disabled = true;

          this.setState(new_state);

          return;
        }

        if (!this.state.wallet_accounts[0]) {
          new_state.button_text = 'Connect wallet';
          new_state.button_disabled = false;

          this.setState(new_state);

          return;
        }

        const web3 = new Web3(window.ethereum);
        const chain_id = await web3.eth.getChainId();

        if (!this.CHAINS[Number(chain_id)]) {
          new_state.button_text = 'Unsupported chain';
          new_state.button_disabled = true;

          this.setState(new_state);

          return;
        }

        this.setState(new_state);
      })
      .catch((err) => {
        // if usdt addresses are same, just go on by setting loading false,
        if (usdt_address.toLowerCase() === current.address.toLowerCase()) {
          this.setState({
            ...this.state,

            // common
            loading: false,

            // pay token
            pay_price: 1.0,

            // button
            //button_disabled: false,
          });

          return;
        }

        this.setState({
          ...this.state,

          // common
          loading: false,
          error:
            "One of the tokens don't have enough asset on the network to make trade. This is common for very long-tail tokens.",

          // pay token
          pay_price: 0.0,

          // button

          button_text: 'Insufficient liquidity!',
          button_disabled: true,
        });
      });

    // TODO!: get quote from both tokens to see if either of them has insufficient liquidity.

    if (current.address === this.state.receive_address) {
      this.setState({
        ...this.state,

        // common
        loading: true,
        error: '',

        // pay token
        pay_value: '',
        pay_address: current.address,
        pay_img: current.img,
        pay_symbol: current.symbol,
        pay_name: current.name,
        pay_decimals: current.decimals,
        pay_chain_id: current.chain_id,
        pay_price: 0.0,
        pay_balance: 0.0,
        pay_selector_open: false,
        pay_search_value: '',

        // receive token
        receive_value: '',
        receive_address: this.state.pay_address,
        receive_img: this.state.pay_img,
        receive_symbol: this.state.pay_symbol,
        receive_name: this.state.pay_name,
        receive_decimals: this.state.pay_decimals,
        receive_chain_id: this.state.pay_chain_id,
        receive_price: this.state.pay_price,
        receive_balance: this.state.pay_balance,
      });

      return;
    }

    this.setState({
      ...this.state,

      // common
      loading: true,
      error: '',

      // pay token
      pay_value: '',
      pay_address: current.address,
      pay_img: current.img,
      pay_symbol: current.symbol,
      pay_name: current.name,
      pay_decimals: current.decimals,
      pay_chain_id: current.chain_id,
      pay_price: 0.0,
      pay_balance: 0.0,
      pay_selector_open: false,
      pay_search_value: '',

      // receive token
      receive_value: '',
    });
  }

  on_change_receive_value(e) {
    const value = e.target.value;

    // only numbers
    if (isNaN(Number(value))) {
      return;
    }

    // if input is clean or 0 then reset everything: pay and receive input, pay_value_timeout timeout
    if (value === '' || Number(value) === 0) {
      clearTimeout(this.state.receive_value_timeout);

      this.setState({
        ...this.state,
        //common
        loading: false,

        // pay
        receive_value: value,
        receive_value_timeout: 0,

        // receive
        pay_value: '',

        // button
        button_text: 'Enter an amount',
        button_disabled: true,
      });

      return;
    }

    clearTimeout(this.state.receive_value_timeout);

    const receive_value_timeout = setTimeout(() => {
      let buy_amount = Number(value);
      for (let i = 0; i < this.state.receive_decimals; i++) {
        buy_amount = buy_amount * 10;
      }

      if (buy_amount % 1 !== 0) {
        buy_amount = parseInt(buy_amount);
      }

      buy_amount = BigInt(buy_amount).toString();

      const chain = this.CHAINS[this.state.wallet_chain_id].url_param;
      const url_query = `?buyToken=${this.state.receive_address}&sellToken=${this.state.pay_address}&buyAmount=${buy_amount}&chain=${chain}`;

      if (this.state.wallet_accounts[0]) {
        //url_query = url_query + '&takerAddress=' + this.state.wallet_accounts[0];
      }

      // Make a quote request to 0x.org
      const url = this.props.baseURL + '/quote' + url_query;

      axios
        .get(url)
        .then(async (res) => {
          console.log(res.data);

          // disable loading for UI

          let sell_amount = Number(res.data.sellAmount);
          for (let i = 0; i < this.state.pay_decimals; i++) {
            sell_amount *= 0.1;
          }

          const new_state = {
            ...this.state,

            //common
            loading: false,
            error: '', // successfull quote from 0x means no liquidity errors as it includes both tokens

            // pay token
            pay_value: fhandle(sell_amount, 5),

            // receive token

            // button
            button_text: 'Swap',
            button_disabled: false,
          };

          if (!window.ethereum) {
            new_state.button_text = 'Install Web3 Wallet';
            new_state.button_disabled = true;

            this.setState(new_state);

            return;
          }

          if (!this.state.wallet_accounts[0]) {
            new_state.button_text = 'Connect wallet';
            new_state.button_disabled = false;

            this.setState(new_state);

            return;
          }

          const web3 = new Web3(window.ethereum);
          const chain_id = await web3.eth.getChainId();

          if (!this.CHAINS[Number(chain_id)]) {
            new_state.button_text = 'Unsupported chain';
            new_state.button_disabled = true;

            this.setState(new_state);

            return;
          }

          this.setState(new_state);
        })
        .catch((err) => {
          this.setState({
            ...this.state,

            // common
            loading: false,
            error:
              "One of the tokens don't have enough asset on the network to make the trade. This is common for very long-tail tokens.",

            // button
            button_text: 'Insufficient liquidity!',
            button_disabled: true,
          });
        });
    }, 300);

    // update pay value input and loading
    this.setState({
      ...this.state,

      //common
      loading: true,
      error: '',

      // pay token
      pay_value: '',

      // receive token
      receive_value: value,
      receive_value_timeout: receive_value_timeout,

      // button
      button_disabled: false,
      button_text: 'Fetching...',
    });
  }

  on_change_receive_search(e) {
    const value = e.target.value;

    clearInterval(this.state.receive_search_timeout);

    const timeout = setTimeout(async () => {
      const chain_name = this.CHAINS[this.state.wallet_chain_id].url_param;
      const url =
        config.url_api + '/v1/tokens/' + chain_name + '?search=' + value;

      const res = await axios.get(url);

      this.setState({
        ...this.state,
        // common
        loading: false,

        // pay tokens
        receive_tokens: res.data,
      });
    }, 700); // TODO: make a global wait time for delayed api calls interval

    this.setState({
      ...this.state,
      // common
      loading: true,

      // pay token
      receive_search_timeout: timeout,
      receive_search_value: value,
    });
  }

  on_click_receive_selector(current) {
    // USDT info on selected chain
    const usdt_address = this.CHAINS[this.state.wallet_chain_id].usdt_address;
    const usdt_decimals = this.CHAINS[this.state.wallet_chain_id].usdt_decimals;

    let sell_amount = '1'; // sell amount is static to get the price of selected token
    for (let i = 0; i < usdt_decimals; i++) {
      sell_amount += '0';
    }

    const chain = this.CHAINS[this.state.wallet_chain_id].url_param;

    const url_query = `?buyToken=${current.address}&sellToken=${usdt_address}&sellAmount=${sell_amount}&chain=${chain}`;

    // final 0x.org url price
    const url_price = this.props.baseURL + '/price' + url_query;

    // Get selected tokens price data with 0x.org service async
    axios
      .get(url_price)
      .then(async (res) => {
        let price = Number(res.data.buyAmount);
        for (let i = 0; i < current.decimals; i++) {
          price = price * 0.1;
        }

        price = 1.0 / price;

        const new_state = {
          ...this.state,

          // common
          loading: false,
          error: '',

          // pay token
          receive_price: Number(price),

          // button
          button_text: 'Enter an amount',
          button_disabled: true,
        };

        if (!window.ethereum) {
          new_state.button_text = 'Install Web3 Wallet';
          new_state.button_disabled = true;

          this.setState(new_state);

          return;
        }

        if (!this.state.wallet_accounts[0]) {
          new_state.button_text = 'Connect wallet';
          new_state.button_disabled = false;

          this.setState(new_state);

          return;
        }

        const web3 = new Web3(window.ethereum);
        const chain_id = await web3.eth.getChainId();

        if (!this.CHAINS[Number(chain_id)]) {
          new_state.button_text = 'Unsupported chain';
          new_state.button_disabled = true;

          this.setState(new_state);

          return;
        }

        this.setState(new_state);
      })
      .catch((err) => {
        // if usdt addresses are same, just go on by setting loading false,
        if (usdt_address.toLowerCase() === current.address.toLowerCase()) {
          this.setState({
            ...this.state,

            // common
            loading: false,

            // pay token
            receive_price: 1.0,

            // button
            //button_disabled: false,
          });

          return;
        }

        this.setState({
          ...this.state,

          // common
          loading: false,
          error:
            "One of the tokens don't have enough asset on the network to make trade. This is common for very long-tail tokens.",

          // pay token
          receive_price: 0,

          // button
          button_text: 'Insufficient liquidity!',
          button_disabled: true,
        });
      });

    if (current.address === this.state.pay_address) {
      this.setState({
        ...this.state,

        // common
        loading: true,
        error: '',

        // pay token
        pay_value: '',
        pay_address: this.state.receive_address,
        pay_img: this.state.receive_img,
        pay_symbol: this.state.receive_symbol,
        pay_name: this.state.receive_name,
        pay_decimals: this.state.receive_decimals,
        pay_chain_id: this.state.receive_chain_id,
        pay_price: this.state.receive_price,
        pay_balance: this.state.receive_balance,

        // receive token
        receive_value: '',
        receive_address: current.address,
        receive_img: current.img,
        receive_symbol: current.symbol,
        receive_name: current.name,
        receive_decimals: current.decimals,
        receive_chain_id: current.chain_id,
        receive_price: 0.0,
        receive_balance: 0.0,
        receive_selector_open: false,
        receive_search_value: '',
      });

      return;
    }

    this.setState({
      ...this.state,

      // common
      loading: true,
      error: '',

      // pay token
      pay_value: '',

      // receive token
      receive_value: '',
      receive_address: current.address,
      receive_img: current.img,
      receive_symbol: current.symbol,
      receive_name: current.name,
      receive_decimals: current.decimals,
      receive_chain_id: current.chain_id,
      receive_price: 0.0,
      receive_balance: 0.0,
      receive_selector_open: false,
      receive_search_value: '',
    });
  }

  on_replace_tokens(e) {
    e.preventDefault();

    if (this.state.loading) {
      return;
    }

    const new_state = {
      ...this.state,

      // common
      loading: true,
      error: '',

      // pay token params
      pay_value: this.state.receive_value,
      pay_value_timeout: 0,
      pay_address: this.state.receive_address,
      pay_img: this.state.receive_img,
      pay_symbol: this.state.receive_symbol,
      pay_name: this.state.receive_name,
      pay_decimals: this.state.receive_decimals,
      pay_price: this.state.receive_price,
      pay_balance: this.state.receive_balance,
      pay_chain_id: this.state.receive_chain_id,
      pay_selector_open: false,

      // receive token params
      receive_value: this.state.pay_value,
      receive_value_timeout: 0,
      receive_address: this.state.pay_address,
      receive_img: this.state.pay_img,
      receive_symbol: this.state.pay_symbol,
      receive_name: this.state.pay_name,
      receive_decimals: this.state.pay_decimals,
      receive_price: this.state.pay_price,
      receive_balance: this.state.pay_balance,
      receive_chain_id: this.state.pay_chain_id,
      receive_selector_open: false,
    };

    let sell_amount = Number(this.state.receive_value);
    let buy_amount = Number(this.state.pay_value);

    const chain = this.CHAINS[this.state.wallet_chain_id].url_param;

    // buyToken & sellToken is reversed
    let url_query = `?buyToken=${this.state.pay_address}&sellToken=${this.state.receive_address}&chain=${chain}`;

    if (this.state.receive_value) {
      for (let i = 0; i < this.state.receive_decimals; i++) {
        sell_amount = sell_amount * 10;
      }

      if (sell_amount % 1 !== 0) {
        sell_amount = parseInt(sell_amount);
      }

      sell_amount = BigInt(sell_amount).toString();

      url_query += '&sellAmount=' + sell_amount;
    } else if (this.state.pay_value) {
      for (let i = 0; i < this.state.pay_decimals; i++) {
        buy_amount = buy_amount * 10;
      }

      if (buy_amount % 1 !== 0) {
        buy_amount = parseInt(buy_amount);
      }

      buy_amount = BigInt(buy_amount).toString();

      url_query += '&buyAmount=' + buy_amount;
    } else if (!sell_amount && !buy_amount) {
      new_state.loading = false;
      this.setState(new_state);
      return;
    }

    const url = this.props.baseURL + '/quote' + url_query;

    axios
      .get(url)
      .then((res) => {
        const new_state = {
          ...this.state,

          // common
          loading: false,
          error: '',
        };

        let res_sell_amount = Number(res.data.sellAmount);
        let res_buy_amount = Number(res.data.buyAmount);

        for (let i = 0; i < this.state.pay_decimals; i++) {
          res_sell_amount = res_sell_amount * 0.1;
        }

        for (let i = 0; i < this.state.receive_decimals; i++) {
          res_buy_amount = res_buy_amount * 0.1;
        }

        // TODO: handle fixed value, e.g. if value greater than 0 reduce fixed value
        new_state.pay_value = fhandle(res_sell_amount, 5);
        new_state.receive_value = fhandle(res_buy_amount, 5);

        this.setState(new_state);
      })
      .catch((err) => {
        // TODO: handle insufficient liq for token swap

        this.setState({
          ...this.state,

          // common
          loading: false,
          error:
            "One of the tokens don't have enough asset on the network to make trade. This is common for very long-tail tokens.",

          // button
          button_text: 'Insufficient liquidity',
          button_disabled: true,
        });
      });

    this.setState(new_state);
  }

  async on_click_button(e) {
    e.preventDefault();

    if (this.state.button_disabled || this.state.loading) {
      return;
    }

    if (!window.ethereum) {
      this.setState({
        ...this.state,

        // error
        loading: false,
        error: '',

        // button
        button_text: 'Install Web3 Wallet!',
        button_disabled: true,
      });

      return;
    }

    let accounts = [];

    if (this.state.button_state === 0) {
      this.setState({
        ...this.state,

        // common
        loading: true,

        // button
        button_text: 'Connecting...',
      });

      accounts = await web3_wallet_connect();

      if (!accounts) {
        this.setState({
          ...this.state,

          // common
          loading: false,

          // button
          button_text: 'No web3 wallet',
          button_disable: true,
        });

        return;
      }

      const web3 = new Web3(window.ethereum);
      const chain_id = await web3.eth.getChainId();

      if (!this.CHAINS[Number(chain_id)]) {
        this.setState({
          ...this.state,

          // common
          loading: false,
          error: '',

          // wallet
          wallet_accounts: accounts,
          // dont insert unsupported chain id into the wallet state

          // button
          button_text: 'Unsupported chain',
          button_disabled: true,
        });

        //alert('Unsupported chain please switch to other chain');

        return;
      }

      let button_text = 'Enter an amount';
      let button_disabled = true;
      if (this.state.pay_value && this.state.receive_value) {
        // TODO: might change if value not so sure
        button_text = 'Swap';
        button_disabled = false;
      }

      const chain = this.CHAINS[Number(chain_id)].url_param;
      const url_tokens = config.url_api + `/v1/tokens/${chain}`;
      const res_tokens = await axios.get(url_tokens);

      // if connecting to the same chain like default eth 1
      if (Number(chain_id) === this.state.wallet_chain_id) {
        this.setState({
          ...this.state,
          // common
          loading: false,

          // wallet
          wallet_accounts: accounts,
          wallet_chain_id: Number(chain_id),

          // pay token
          pay_tokens: res_tokens.data,

          // receive token
          receive_tokens: res_tokens.data,

          // button
          button_text: button_text,
          button_state: 1,
          button_disabled: button_disabled,
        });

        return;
      }

      // if connecting to different chain
      const pay_token = res_tokens.data[0];
      const receive_token = res_tokens.data[1];

      this.setState({
        ...this.state,

        // common
        loading: false,

        // wallet
        wallet_accounts: accounts,
        wallet_chain_id: Number(chain_id),

        // pay token
        pay_value: '',
        pay_address: pay_token.address,
        pay_img: pay_token.img,
        pay_symbol: pay_token.symbol,
        pay_name: pay_token.name,
        pay_decimals: pay_token.decimals,
        pay_chain_id: pay_token.chain_id,
        pay_tokens: res_tokens.data,

        // receive token
        receive_value: '',
        receive_address: receive_token.address,
        receive_img: receive_token.img,
        receive_symbol: receive_token.symbol,
        receive_name: receive_token.name,
        receive_decimals: receive_token.decimals,
        receive_chain_id: receive_token.chain_id,
        receive_tokens: res_tokens.data,

        // button
        button_text: 'Enter an amount',
        button_state: 1,
        button_disabled: true,
      });
    }

    if (this.state.button_state === 1) {
      // console.log('Swapping...');
    }
  }

  listen_wallet() {
    if (!window.ethereum) {
      // alert('No web3 wallet on browser!');
      return;
    }

    const web3 = new Web3(window.ethereum);

    web3.provider.on('message', () => {
      // ...
    });

    web3.provider.on('connect', () => {
      // ...
    });

    web3.provider.on('disconnect', () => {
      // ...
    });

    // Accounts changed
    web3.provider.on('accountsChanged', async () => {
      // ...

      const accounts = await web3.eth.getAccounts();

      if (!accounts[0]) {
        this.setState({
          ...this.state,

          // wallet
          wallet_accounts: accounts,
          wallet_chain_id: 1,

          // button
          button_text: 'Connect Wallet',
          button_disabled: false,
          button_state: 0,
        });

        return;
      }

      this.setState({
        ...this.state,

        // wallet
        wallet_accounts: accounts,
      });
    });

    // Chain changed
    web3.provider.on('chainChanged', async () => {
      // ...

      this.setState({
        ...this.state,

        // common
        loading: true,
        error: '',

        // button
        button_text: 'Chain Switch...',
        button_disabled: true,
      });

      const accounts = await web3.eth.getAccounts();
      const chain_id = await web3.eth.getChainId();

      if (!this.CHAINS[Number(chain_id)]) {
        this.setState({
          ...this.state,

          // common
          loading: false,

          // button
          button_text: 'Unsupported Chain',
          button_disabled: true,
        });

        return;
      }

      // new chain
      const chain = this.CHAINS[Number(chain_id)].url_param;

      const url_tokens = config.url_api + `/v1/tokens/${chain}`;
      const res_tokens = await axios.get(url_tokens);

      const pay_token = res_tokens.data[0];
      const receive_token = res_tokens.data[1];

      // USDT info on selected chain
      const usdt_address = this.CHAINS[Number(chain_id)].usdt_address;
      const usdt_decimals = this.CHAINS[Number(chain_id)].usdt_decimals;

      let sell_amount = '1'; // sell amount is static to get the price of selected token
      for (let i = 0; i < usdt_decimals; i++) {
        sell_amount += '0';
      }

      const url_query_pay = `?buyToken=${pay_token.address}&sellToken=${usdt_address}&sellAmount=${sell_amount}&chain=${chain}`;
      const url_price_pay = this.props.baseURL + '/price' + url_query_pay;

      const url_query_receive = `?buyToken=${receive_token.address}&sellToken=${usdt_address}&sellAmount=${sell_amount}&chain=${chain}`;
      const url_price_receive =
        this.props.baseURL + '/price' + url_query_receive;

      // final 0x.org url price for both pay and receive token asynchronously
      axios
        .get(url_price_pay)
        .then(async (res) => {
          let price = Number(res.data.buyAmount);
          for (let i = 0; i < pay_token.decimals; i++) {
            price = Number(price * 0.1);
          }

          price = 1.0 / price;

          const new_state = {
            ...this.state,

            // common
            loading: false,
            error: '',

            // pay token
            pay_price: Number(price),

            // button
            button_text: 'Enter an amount',
            button_disabled: true,
          };

          if (!this.state.wallet_accounts[0]) {
            new_state.button_text = 'Connect Wallet';
            new_state.button_disabled = false;
            this.setState(new_state);

            return;
          }

          this.setState(new_state);
        })
        .catch((err) => {
          // if usdt addresses are same, just go on by setting loading false,
          if (usdt_address.toLowerCase() === pay_token.address.toLowerCase()) {
            this.setState({
              ...this.state,

              // common
              loading: false,

              // pay token
              pay_price: 1.0,

              // button
              //button_disabled: false,
            });

            return;
          }

          this.setState({
            ...this.state,

            // common
            loading: false,
            error:
              "One of the tokens don't have enough asset on the network to make trade. This is common for very long-tail tokens.",

            // pay token
            pay_price: 0.0,

            // button

            button_text: 'Insufficient liquidity!',
            button_disabled: true,
          });
        });

      axios
        .get(url_price_receive)
        .then(async (res) => {
          let price = Number(res.data.buyAmount);
          for (let i = 0; i < receive_token.decimals; i++) {
            price = Number(price * 0.1);
          }

          price = 1.0 / price;

          const new_state = {
            ...this.state,

            // common
            loading: false,
            error: '',

            // pay token
            receive_price: Number(price),

            // button
            button_text: 'Enter an amount',
            button_disabled: true,
          };

          if (!this.state.wallet_accounts[0]) {
            new_state.button_text = 'Connect Wallet';
            new_state.button_disabled = false;
            this.setState(new_state);

            return;
          }

          this.setState(new_state);
        })
        .catch((err) => {
          // if usdt addresses are same, just go on by setting loading false,
          if (
            usdt_address.toLowerCase() === receive_token.address.toLowerCase()
          ) {
            this.setState({
              ...this.state,

              // common
              loading: false,

              // pay token
              receive_price: 1.0,

              // button
              //button_disabled: false,
            });

            return;
          }

          this.setState({
            ...this.state,

            // common
            loading: false,
            error:
              "One of the tokens don't have enough asset on the network to make the trade. This is common for very long-tail tokens.",

            // pay token
            receive_price: 0.0,

            // button

            button_text: 'Insufficient liquidity!',
            button_disabled: true,
          });
        });

      this.setState({
        ...this.state,

        // common
        loading: true,
        error: '',

        // wallet
        wallet_chain_id: Number(chain_id),

        // pay token
        pay_value: '',
        pay_address: pay_token.address,
        pay_img: pay_token.img,
        pay_symbol: pay_token.symbol,
        pay_name: pay_token.name,
        pay_decimals: pay_token.decimals,
        pay_chain_id: pay_token.chain_id,
        pay_price: 0,
        pay_tokens: res_tokens.data,

        // receive token
        receive_value: '',
        receive_address: receive_token.address,
        receive_img: receive_token.img,
        receive_symbol: receive_token.symbol,
        receive_name: receive_token.name,
        receive_decimals: receive_token.decimals,
        receive_chain_id: receive_token.chain_id,
        receive_price: 0,
        receive_tokens: res_tokens.data,

        // button
        //button_text: button_text,
        //button_disabled: button_disabled,
      });
    });
  }

  init() {
    // style resizing
    const swap = this.ref_swap.current;
    if (this.props.parentWidth) {
      const parent_rect = swap.parentNode.getBoundingClientRect();

      let parent_padding = getComputedStyle(swap.parentNode).padding;
      parent_padding = Number(parent_padding.replace('px', ''));

      swap.style.width = parent_rect.width - parent_padding * 2 + 'px';
      // swap.style.hegiht = parent_rect.height + 'px';
    }

    // web3 wallet listen bindings
    this.listen_wallet();

    // to get prices of default tokens in state
    this.on_click_pay_selector({
      address: this.state.pay_address,
      img: this.state.pay_img,
      symbol: this.state.pay_symbol,
      name: this.state.pay_name,
      decimals: this.state.pay_decimals,
      chain_id: this.state.pay_chain_id,
    });

    this.on_click_receive_selector({
      address: this.state.receive_address,
      img: this.state.receive_img,
      symbol: this.state.receive_symbol,
      name: this.state.receive_name,
      decimals: this.state.receive_decimals,
      chain_id: this.state.receive_chain_id,
    });

    // place initial tokens from coingecko
    const chain = this.CHAINS[this.state.wallet_chain_id].url_param;
    const url_tokens = config.url_api + `/v1/tokens/${chain}`;
    axios
      .get(url_tokens)
      .then((res) => {
        this.setState({
          ...this.state,

          // pay token
          pay_tokens: res.data,

          // receive token
          receive_tokens: res.data,
        });
      })
      .catch((err) => {});
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div ref={this.ref_swap} className={cn(style['swap'], 'swap')}>
        <div className={cn(style['swap-header'])}>
          <h2>{this.props.title}</h2>
          {
            //({this.CHAINS[this.state.wallet_chain_id].url_param})
          }

          <div
            onClick={this.on_click_settings}
            className={cn(style['swap-header-settings'])}
          >
            <Icon_settings />
          </div>
        </div>

        <div className={cn(style['swap-body'])}>
          {this.state.settings_open ? (
            <div className={cn(style['swap-body-settings'])}>settings</div>
          ) : null}

          <div className={cn(style['swap-body-inputarea'])}>
            <label className={cn(style['swap-body-inputarea-label'])}>
              Pay
            </label>

            <div className={cn(style['swap-body-inputarea-body'])}>
              <input
                value={this.state.pay_value}
                onChange={(e) => this.on_change_pay_value(e)}
                type="text"
                placeholder="0"
              />

              <div
                className={cn(style['swap-body-inputarea-body-tokenselector'])}
                onClick={(e) => {
                  this.setState({
                    ...this.state,
                    pay_selector_open: !this.state.pay_selector_open,
                    receive_selector_open: false,
                  });
                }}
              >
                <img
                  src={this.state.pay_img}
                  className={cn(
                    style['swap-body-inputarea-body-tokenselector-img']
                  )}
                />

                <div
                  className={cn(
                    style['swap-body-inputarea-body-tokenselector-symbol']
                  )}
                >
                  {this.state.pay_symbol}
                </div>

                <div
                  className={cn(
                    style['swap-body-inputarea-body-tokenselector-icon']
                  )}
                >
                  <Icon_arrow_down />
                </div>
              </div>

              <div
                className={cn(
                  style['swap-body-inputarea-body-dropdown'],
                  this.state.pay_selector_open
                    ? style['swap-body-inputarea-body-dropdownactive']
                    : null
                )}
              >
                <div
                  className={cn(
                    style['swap-body-inputarea-body-dropdown-searcharea']
                  )}
                >
                  <div
                    className={cn(
                      style['swap-body-inputarea-body-dropdown-searcharea-ctr']
                    )}
                  >
                    <div
                      className={cn(
                        style[
                          'swap-body-inputarea-body-dropdown-searcharea-ctr-icon'
                        ]
                      )}
                    >
                      <Icon_search />
                    </div>

                    <input
                      value={this.state.pay_search_value}
                      onChange={(e) => this.on_change_pay_search(e)}
                      className={cn(
                        style[
                          'swap-body-inputarea-body-dropdown-searcharea-ctr-input'
                        ]
                      )}
                      placeholder="Search name or paste address..."
                    />
                  </div>
                </div>

                {this.state.pay_tokens.map((current, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => this.on_click_pay_selector(current)}
                      className={cn(
                        style['swap-body-inputarea-body-dropdown-item']
                      )}
                    >
                      <img
                        src={current.img}
                        className={cn(
                          style['swap-body-inputarea-body-dropdown-item-img']
                        )}
                      />

                      <div
                        className={cn(
                          style['swap-body-inputarea-body-dropdown-item-right']
                        )}
                      >
                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-right-name'
                            ]
                          )}
                        >
                          {current.name}
                        </div>

                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-right-symbol'
                            ]
                          )}
                        >
                          {current.symbol}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={cn(style['swap-body-inputarea-info'])}>
              <div className={cn(style['swap-body-inputarea-info-usd'])}>
                {this.state.pay_value
                  ? '~$' + fhandle(this.state.pay_price * this.state.pay_value)
                  : null}
              </div>

              <div
                className={cn(style['swap-body-inputarea-info-token balance'])}
              >
                0.00 {this.state.pay_symbol} (Balance)
              </div>
            </div>
          </div>

          <div className={cn(style['swap-body-replace'])}>
            <div
              onClick={(e) => this.on_replace_tokens(e)}
              className={cn(style['swap-body-replace-iconctr'])}
            >
              <Icon_swap
                className={cn(style['swap-body-replace-iconctr-icon'])}
              />
            </div>
          </div>

          <div className={cn(style['swap-body-inputarea'])}>
            <label className={cn(style['swap-body-inputarea-label'])}>
              Receive
            </label>

            <div className={cn(style['swap-body-inputarea-body'])}>
              <input
                value={this.state.receive_value}
                onChange={(e) => this.on_change_receive_value(e)}
                type="text"
                placeholder="0"
              />

              <div
                className={cn(style['swap-body-inputarea-body-tokenselector'])}
                onClick={(e) => {
                  this.setState({
                    ...this.state,
                    receive_selector_open: !this.state.receive_selector_open,
                    pay_selector_open: false,
                  });
                }}
              >
                <img
                  src={this.state.receive_img}
                  className={cn(
                    style['swap-body-inputarea-body-tokenselector-img']
                  )}
                />

                <div
                  className={cn(
                    style['swap-body-inputarea-body-tokenselector-symbol']
                  )}
                >
                  {this.state.receive_symbol}
                </div>

                <div
                  className={cn(
                    style['swap-body-inputarea-body-tokenselector-icon']
                  )}
                >
                  <Icon_arrow_down />
                </div>
              </div>

              <div
                className={cn(
                  style['swap-body-inputarea-body-dropdown'],
                  this.state.receive_selector_open
                    ? style['swap-body-inputarea-body-dropdownactive']
                    : null
                )}
              >
                <div
                  className={cn(
                    style['swap-body-inputarea-body-dropdown-searcharea']
                  )}
                >
                  <div
                    className={cn(
                      style['swap-body-inputarea-body-dropdown-searcharea-ctr']
                    )}
                  >
                    <div
                      className={cn(
                        style[
                          'swap-body-inputarea-body-dropdown-searcharea-ctr-icon'
                        ]
                      )}
                    >
                      <Icon_search />
                    </div>

                    <input
                      value={this.state.receive_search_value}
                      onChange={(e) => this.on_change_receive_search(e)}
                      className={cn(
                        style[
                          'swap-body-inputarea-body-dropdown-searcharea-ctr-input'
                        ]
                      )}
                      placeholder="Search name or paste address..."
                    />
                  </div>
                </div>

                {this.state.receive_tokens.map((current, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => this.on_click_receive_selector(current)}
                      className={cn(
                        style['swap-body-inputarea-body-dropdown-item']
                      )}
                    >
                      <img
                        src={current.img}
                        className={cn(
                          style['swap-body-inputarea-body-dropdown-item-img']
                        )}
                      />

                      <div
                        className={cn(
                          style['swap-body-inputarea-body-dropdown-item-right']
                        )}
                      >
                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-right-name'
                            ]
                          )}
                        >
                          {current.name}
                        </div>

                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-right-symbol'
                            ]
                          )}
                        >
                          {current.symbol}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={cn(style['swap-body-inputarea-info'])}>
              <div className={cn(style['swap-body-inputarea-info-usd'])}>
                {this.state.receive_value
                  ? '~$' +
                    fhandle(this.state.receive_price * this.state.receive_value)
                  : null}
              </div>

              <div
                className={cn(style['swap-body-inputarea-info-token balance'])}
              >
                0.00 {this.state.receive_symbol} (Balance)
              </div>
            </div>
          </div>

          <button
            onClick={(e) => this.on_click_button(e)}
            className={cn(
              style['swap-body-button'],
              this.state.loading ? style['swap-body-buttondisabled'] : null,
              this.state.button_disabled
                ? style['swap-body-buttondisabled']
                : null
            )}
          >
            {this.state.button_text}
          </button>

          {this.state.error ? (
            <div className={cn(style['swap-body-error'])}>
              {this.state.error}
            </div>
          ) : (
            <div className={cn(style['swap-body-details'])}>
              <div className={cn(style['swap-body-details-item'])}>
                <div className={cn(style['swap-body-details-item-key'])}>
                  Transaction fee:
                </div>

                <div className={cn(style['swap-body-details-item-value'])}>
                  1.2 FTM + 0.0001 ETH ($1.22)
                </div>
              </div>

              <div className={cn(style['swap-body-details-item'])}>
                <div className={cn(style['swap-body-details-item-key'])}>
                  Slippage:
                </div>

                <div className={cn(style['swap-body-details-item-value'])}>
                  1%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Component parameters
Swap.defaultProps = {
  title: 'Swap',
  parentWidth: false,
  baseURL: 'https://api.devchain.net/v1/swap',
};

export default Swap;
