// MODULES
import React from 'react';
import cn from 'classnames';

// STYLES
import style from './style.module.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <header className={cn(style['header'])}>header</header>;
  }
}

export default Header;
