let cnt = 0;

export default class StoreStore {
  constructor() {
    this._data = {};
  }

  addStory(kind, name, fn) {
    if (!this._data[kind]) {
      this._data[kind] = {
        kind,
        index: cnt++,
        stories: {},
      };
    }

    this._data[kind].stories[name] = {
      name,
      index: cnt++,
      fn,
    };
  }

  getStoryKinds() {
    return Object.keys(this._data)
      .map(key => this._data[key])
      .sort((info1, info2) => (info1.index - info2.index))
      .map(info => info.kind);
  }

  getStories(kind) {
    if (!this._data[kind]) {
      return [];
    }

    return Object.keys(this._data[kind].stories)
      .map(name => this._data[kind].stories[name])
      .sort((info1, info2) => (info1.index - info2.index))
      .map(info => info.name);
  }

  getStory(kind, name) {
    const storiesKind = this._data[kind];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[name];
    if (!storyInfo) {
      return null;
    }

    return storyInfo.fn;
  }

  removeStoryKind(kind) {
    delete this._data[kind];
  }

  hasStoryKind(kind) {
    return Boolean(this._data[kind]);
  }

  hasStory(kind, name) {
    return Boolean(this.getStory(kind, name));
  }

  dumpStoryBook() {
    const data = this.getStoryKinds()
      .map(kind => ({ kind, stories: this.getStories(kind) }));

    return data;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._data[kind]);
  }
}
