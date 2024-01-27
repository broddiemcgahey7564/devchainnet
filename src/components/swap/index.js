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

// UTILS
import UTILS from '../../utils/index.js';

// STYLES
import style from './style.module.css';

// CLIENT SIDE
class Swap extends React.Component {
  constructor(props) {
    // TODO: make axios instance with 0x api key for DevChain developers & display that line for docs configuration

    super(props);
    this.state = {
      // Common
      loading: false,

      // Wallet params
      wallet_accounts: [],

      settings_open: false,
      settings_slippage: '0.1',
      settings_deadline: '',

      // pay token params
      pay_value: '',
      pay_value_timeout: 0,
      pay_address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      pay_img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png',
      pay_symbol: 'SHIB',
      pay_name: 'Shiba Inu',
      pay_decimals: 18,
      pay_balance: '0.1',
      pay_selector_open: false,
      pay_tokens: [
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
          symbol: 'UNI',
          name: 'Uniswap',
          address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png',
          symbol: 'SHIB',
          name: 'Shiba Inu',
          address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png',
          symbol: 'LDO',
          name: 'Lido DAO',
          address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11156.png',
          symbol: 'ETHDYDX',
          name: 'dYdX',
          address: '0x92d6c1e31e14520e676a687f0a93788b716beff5',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
          symbol: 'USDT',
          name: 'Tether USDt',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png',
          symbol: 'FET',
          name: 'Fetch.ai',
          address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
        },
      ],
      pay_search_value: '',
      pay_search_timeout: 0,

      // receive token params
      receive_value: '',
      receive_value_timeout: 0,
      receive_address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      receive_img:
        'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
      receive_symbol: 'UNI',
      receive_name: 'Uniswap',
      receive_decimals: 18,
      receive_balance: '',
      receive_selector_open: false,
      receive_tokens: [
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
          symbol: 'UNI',
          name: 'Uniswap',
          address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png',
          symbol: 'SHIB',
          name: 'Shiba Inu',
          address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png',
          symbol: 'LDO',
          name: 'Lido DAO',
          address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11156.png',
          symbol: 'ETHDYDX',
          name: 'dYdX',
          address: '0x92d6c1e31e14520e676a687f0a93788b716beff5',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
          symbol: 'USDT',
          name: 'Tether USDt',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        },
        {
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png',
          symbol: 'FET',
          name: 'Fetch.ai',
          address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
        },
      ],
      receive_search_value: '',
      receive_search_timeout: 0,

      // Swap button states
      button_text: 'Connect Wallet',
      button_state: 0,
      button_disabled: false,

      fee: '',
    };

    // contstants
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

    // functions
    this.axios_ins = axios.create({
      baseURL: this.props.baseURL,
      headers: { '0x-api-key': this.props.apiKey },
    });

    this.on_click_settings = this.on_click_settings.bind(this);
    this.on_change_pay_value = this.on_change_pay_value.bind(this);
    this.on_change_pay_search = this.on_change_pay_search.bind(this);
    this.on_click_pay_selector = this.on_click_pay_selector.bind(this);

    this.on_change_receive_value = this.on_change_receive_value.bind(this);
    this.on_change_receive_search = this.on_change_receive_search.bind(this);
    this.on_click_receive_selector = this.on_click_receive_selector.bind(this);

    this.on_click_button = this.on_click_button.bind(this);

    // references
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

    let sell_amount = Number(value);

    if (!sell_amount) {
      // if input is clean then reset everything: pay and receive input, pay_value_timeout timeout
      clearTimeout(this.state.pay_value_timeout);

      this.setState({
        ...this.state,
        //common
        loading: false,

        // pay
        pay_value: '',
        pay_value_timeout: 0,

        // receive
        receive_value: '',

        // button
        button_disabled: true,
        button_text: 'Enter an amount',
      });

      return;
    }

    for (let i = 0; i < this.state.pay_decimals; i++) {
      sell_amount = sell_amount * 10;
    }

    console.log(sell_amount);

    sell_amount = BigInt(sell_amount).toString();

    clearTimeout(this.state.pay_value_timeout);
    const pay_value_timeout = setTimeout(async () => {
      let url =
        this.props.baseURL +
        '/price?buyToken=' +
        this.state.receive_address +
        '&sellToken=' +
        this.state.pay_address +
        '&sellAmount=' +
        sell_amount +
        '&excludedSources=Kyber';

      if (this.state.wallet_accounts[0]) {
        //url = url + '&takerAddress=' + this.state.wallet_accounts[0];
      }

      const res = await this.axios_ins.get(url);

      // disable loading for UI

      let button_text = 'Swap';
      if (!this.state.wallet_accounts[0]) {
        button_text = 'Connect wallet';
      }

      this.setState({
        ...this.state,
        //common
        loading: false,

        // button
        button_text: button_text,
      });

      console.log(res.data);
    }, 600);

    // update pay value input and loading
    this.setState({
      ...this.state,
      //common
      loading: true,

      // pay token
      pay_value: value,
      pay_value_timeout: pay_value_timeout,

      // button
      button_disabled: false,
      button_text: 'Fetching...',
    });
  }

  on_change_pay_search(e) {
    const value = e.target.value;

    clearInterval(this.state.pay_search_timeout);

    const timeout = setTimeout(async () => {
      // TODO: seach name or address on 0x API

      console.log('Api call...', value);
    }, 1000);

    this.setState({
      ...this.state,
      pay_search_timeout: timeout,
      pay_search_value: value,
    });
  }

  on_click_pay_selector(current) {
    UTILS.web3_get_token_decimals(current.address, this.ABI_ERC20).then(
      (decimals) => {
        if (!decimals) {
          // TODO: error no ethereum object

          alert('Cannnot find decimals of token');
          /**
           *           this.context.set_state({
            ...this.context.state,
            ui_toasts: [
              ...this.context.state.ui_toasts,
              {
                message: 'Cannot find decimal',
                type: 'error',
                date: new Date(),
              },
            ],
          });
           * 
           */

          return;
        }

        console.log(decimals);

        this.setState({
          ...this.state,
          pay_decimals: Number(decimals),
        });
      }
    );

    // get selected tokens price

    //this.axios_ins.get('/price');

    this.setState({
      ...this.state,
      pay_value: '',
      pay_address: current.address,
      pay_img: current.img,
      pay_symbol: current.symbol,
      pay_name: current.name,
      pay_selector_open: false,

      receive_value: '',
    });
  }

  on_click_receive_selector(current) {
    UTILS.web3_get_token_decimals(current.address, this.ABI_ERC20).then(
      (decimals) => {
        if (!decimals) {
          // TODO: error no ethereum object

          alert('Cannnot find decimals of token');

          /* Our own toaster is an another native component of DevChain
           * 
           *           this.context.set_state({
            ...this.context.state,
            ui_toasts: [
              ...this.context.state.ui_toasts,
              {
                message: 'Cannot find decimal',
                type: 'error',
                date: new Date(),
              },
            ],
          });
           */

          return;
        }

        console.log(decimals);

        this.setState({
          ...this.state,
          receive_decimals: Number(decimals),
        });
      }
    );

    this.setState({
      ...this.state,
      pay_value: '',
      receive_value: '',
      receive_address: current.address,
      receive_img: current.img,
      receive_symbol: current.symbol,
      receive_name: current.name,
      receive_selector_open: false,
    });
  }

  on_change_receive_value(e) {
    const value = e.target.value;

    if (isNaN(Number(value))) {
      return;
    }

    this.setState({
      ...this.state,
      receive_value: value,
    });
  }

  on_change_receive_search(e) {
    const value = e.target.value;

    clearInterval(this.state.pay_search_timeout);

    const timeout = setTimeout(async () => {
      // TODO: seach name or address on 0x API

      console.log('Api call...', value);
    }, 1000);

    this.setState({
      ...this.state,
      receive_search_timeout: timeout,
      receive_search_value: value,
    });
  }

  async on_click_button(e) {
    let accounts = [];

    switch (this.state.button_state) {
      case 0: // 0 = wallet connection state
        this.setState({
          ...this.state,
          loading: true,
        });

        accounts = await UTILS.web3_wallet_connect();

        if (!accounts) {
          alert('Please install a web3 wallet');

          /**
           * 
           *           this.context.set_state({
            ...this.context.state,
            ui_toasts: [
              ...this.context.state.ui_toasts,
              {
                message: 'Please install a web3 wallet',
                type: 'error',
                date: new Date(),
              },
            ],
          });

          return;
           */

          return;
        }

        let button_text = 'Enter an amount';
        let button_disabled = true;

        if (this.state.pay_value) {
          button_text = 'Swap';
          button_disabled = false;
        }

        this.setState({
          ...this.state,
          // common
          loading: false,

          // wallet
          wallet_accounts: accounts,

          // button
          button_text: button_text,
          button_state: 1,
          button_disabled: button_disabled,
        });

        break;
    }
  }

  componentDidMount() {
    const swap = this.ref_swap.current;

    if (this.props.parentSize) {
      const parent_rect = swap.parentNode.getBoundingClientRect();

      let parent_padding = getComputedStyle(swap.parentNode).padding;
      parent_padding = Number(parent_padding.replace('px', ''));

      swap.style.width = parent_rect.width - parent_padding * 2 + 'px';
      swap.style.hegiht = parent_rect.height + 'px';
    }
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div ref={this.ref_swap} className={cn(style['swap'])}>
        <div className={cn(style['swap-header'])}>
          <h2>Swap</h2>

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
                          style['swap-body-inputarea-body-dropdown-item-left']
                        )}
                      >
                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-left-name'
                            ]
                          )}
                        >
                          {current.name}
                        </div>

                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-left-symbol'
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
                ~$0.00
              </div>

              <div
                className={cn(style['swap-body-inputarea-info-token balance'])}
              >
                0.00 {this.state.pay_symbol} (Balance)
              </div>
            </div>
          </div>

          <div className={cn(style['swap-body-exchange'])}>
            <div
              onClick={(e) => {
                // TODO: swap tokens data
              }}
              className={cn(style['swap-body-exchange-icon'])}
            >
              <Icon_swap />
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
                        src={current.img} // TODO: remove coingecko prop logoURI with img
                        className={cn(
                          style['swap-body-inputarea-body-dropdown-item-img']
                        )}
                      />

                      <div
                        className={cn(
                          style['swap-body-inputarea-body-dropdown-item-left']
                        )}
                      >
                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-left-name'
                            ]
                          )}
                        >
                          {current.name}
                        </div>

                        <div
                          className={cn(
                            style[
                              'swap-body-inputarea-body-dropdown-item-left-symbol'
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
                ~$0.00
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
        </div>
      </div>
    );
  }
}

export default Swap;
