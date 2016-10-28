/* global location */
/* eslint class-methods-use-this: 0 */

import qs from 'qs';
import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import createChannel from '@kadira/storybook-channel-postmsg';
import Preview from './preview';

// addons.setPreview(() => (<div>KKR</div>));

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.channel = createChannel();
    addons.setChannel(this.channel);

    // Set the default preview if not provided from an addon.
    if (!addons.getPreview()) {
      addons.setPreview((k, s) => this._getDefaultPreview(k, s));
    }
  }

  _getDefaultPreview(selectedKind, selectedStory) {
    const queryParams = {
      selectedKind,
      selectedStory,
    };

    const queryString = qs.stringify(queryParams);
    const url = `iframe.html?${queryString}`;
    return (
      <Preview url={url} />
    );
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(selectedKind, selectedStory) {
    const previewBuilder = addons.getPreview();
    return previewBuilder(selectedKind, selectedStory);
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.channel.emit('setCurrentStory', { kind, story });
    });
    this.channel.on('setStories', (data) => {
      api.setStories(data.stories);
    });
    this.channel.on('selectStory', (data) => {
      api.selectStory(data.kind, data.story);
    });
    this.channel.on('applyShortcut', (data) => {
      api.handleShortcut(data.event);
    });
    addons.loadAddons(api);
  }
}
