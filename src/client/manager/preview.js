import React, { Component } from 'react';

const iframeStyle = {
  width: '100%',
  height: '100%',
  border: 0,
  margin: 0,
  padding: 0,
};

class Preview extends Component {
  /* eslint-disable class-methods-use-this */
  shouldComponentUpdate() {
    // When the manager is re-rendered, due to changes in the layout (going full screen / changing
    // addon panel to right) Preview section will update. If its re-rendered the whole html page
    // inside the html is re-rendered making the story to re-mount.
    // We dont have to re-render this component for any reason since changes are communicated to
    // story using the channel and necessary changes are done by it.
    return false;
  }
  /* eslint-enable class-methods-use-this */

  render() {
    return (
      <iframe
        id="storybook-preview-iframe"
        style={iframeStyle}
        src={this.props.url}
      />
    );
  }
}

Preview.propTypes = {
  url: React.PropTypes.string,
};

export default Preview;
