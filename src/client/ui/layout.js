import React from 'react';

class Layout extends React.Component {
  componentWillMount() {
    this.updateHeight();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateHeight.bind(this));
  }

  updateHeight() {
    const { documentElement, body } = document;
    let height = documentElement.clientHeight || body.clientHeight;
    height -= 20;
    this.setState({ height });
  }

  render() {
    const { controls, preview, actionLogger } = this.props;
    const { height } = this.state;

    const rootStyles = {
      height,
      padding: 8,
      backgroundColor: '#F7F7F7',
    };
    const controlsStyle = {
      width: 240,
      float: 'left',
      height: '100%',
      overflowY: 'auto',
    };

    const actionStyle = {
      height: 150,
      marginLeft: 250,
    };

    const previewStyle = {
      height: height - actionStyle.height - 25,
      marginLeft: 250,
      border: '1px solid #ECECEC',
      borderRadius: 4,
      padding: 5,
      backgroundColor: '#FFF',
    };

    return (
      <div style={rootStyles}>
        <div style={controlsStyle}>
          {controls}
        </div>
        <div style={previewStyle}>
          {preview}
        </div>
        <div style={actionStyle}>
          {actionLogger}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  controls: React.PropTypes.element.isRequired,
  preview: React.PropTypes.element.isRequired,
  actionLogger: React.PropTypes.element.isRequired,
};

export default Layout;
