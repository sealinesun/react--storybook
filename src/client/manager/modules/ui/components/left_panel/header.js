import React from 'react';
import { baseFonts } from '../theme';

const wrapperStyle = {
  background: '#F7F7F7',
  marginBottom: 10,
};

const headingStyle = {
  ...baseFonts,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: '12px',
  fontWeight: 'bolder',
  color: '#828282',
  border: '1px solid #C1C1C1',
  textAlign: 'center',
  borderRadius: '2px',
  padding: '5px',
  cursor: 'pointer',
  margin: 0,
  float: 'none',
  overflow: 'hidden',
};

const shortcutIconStyle = {
  textTransform: 'uppercase',
  letterSpacing: '3.5px',
  fontSize: 12,
  fontWeight: 'bolder',
  color: 'rgb(130, 130, 130)',
  border: '1px solid rgb(193, 193, 193)',
  textAlign: 'center',
  borderRadius: 2,
  padding: 5,
  cursor: 'pointer',
  margin: 0,
  display: 'inlineBlock',
  paddingLeft: 8,
  float: 'right',
  marginLeft: 5,
  backgroundColor: 'inherit',
  outline: 0,
};

const linkStyle = {
  textDecoration: 'none',
};

const Header = ({ openShortcutsHelp }) => (
  <div style={wrapperStyle}>
    <button style={shortcutIconStyle} onClick={openShortcutsHelp}>&#8984;</button>
    <a style={linkStyle} href="https://github.com/kadirahq/react-storybook" target="_blank">
      <h3 style={headingStyle}>React Storybook</h3>
    </a>
  </div>
);

Header.propTypes = {
  openShortcutsHelp: React.PropTypes.func,
};

export default Header;
