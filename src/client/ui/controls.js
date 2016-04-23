import React from 'react';
import FuzzySearch from './FuzzySearch';

const options = {
  keys: ['story', 'kind'],
};

export default class StorybookControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
    };
    this.formatStoryForSearch = this.formatStoryForSearch.bind(this);
    this.fireOnStory = this.fireOnStory.bind(this);
    this.fireOnKind = this.fireOnKind.bind(this);
  }

  getKindNames() {
    const { storyStore } = this.props;
    if (!storyStore) {
      return [];
    }
    const kindNames = storyStore.map(({ kind }) => kind);

    const filterdKindNames = kindNames.filter(kind => {
      const { selectedKind } = this.props;
      const { filterText } = this.state;

      if (kind === selectedKind) {
        // Always keep the selected kind name
        return true;
      }

      return kind.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
    });

    return filterdKindNames;
  }

  getStories(kind) {
    const { storyStore } = this.props;
    const storiesInfo = storyStore.find(item => item.kind === kind);

    if (!storiesInfo) {
      return [];
    }
    return storiesInfo.stories;
  }

  fireOnKind(kind, story) {
    const { onKind } = this.props;
    if (onKind) onKind(kind, story);
  }

  fireOnStory(story) {
    const { onStory } = this.props;
    if (onStory) onStory(story);
  }

  filterStoryList(filterText) {
    this.setState({ filterText });
  }

  clearFilterText() {
    this.setState({ filterText: '' });
  }

  formatStoryForSearch() {
    const { storyStore } = this.props;
    if (!storyStore) {
      return [];
    }
    let formattedStories = [];

    storyStore.forEach((kindData) => {
      const stories = kindData.stories.map((story) => {
        return {
          story,
          kind: kindData.kind,
        };
      });
      formattedStories = formattedStories.concat(stories);
    });
    return formattedStories;
  }

  renderStory(story) {
    const { selectedStory } = this.props;
    const storyStyle = {
      fontSize: 13,
      padding: '8px 0px 8px 10px',
      cursor: 'pointer',
    };

    if (story === selectedStory) {
      storyStyle.fontWeight = 'bold';
    }
    return (
      <div
        key={story}
        style={storyStyle}
        onClick={this.fireOnStory.bind(this, story)}
      >
        {story}
      </div>
    );
  }

  renderKind(kind) {
    const kindStyle = {
      fontSize: 15,
      padding: '10px 0px',
      cursor: 'pointer',
      borderBottom: '1px solid #EEE',
    };

    const { selectedKind } = this.props;
    if (kind === selectedKind) {
      const stories = this.getStories(selectedKind);
      kindStyle.fontWeight = 'bold';
      return (
        <div key={kind}>
          <div
            style={kindStyle}
            onClick={this.fireOnKind.bind(this, kind, null)}
          >
            {kind}
          </div>
          <div>
            {stories.map(this.renderStory.bind(this))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={kind}
        style={kindStyle}
        onClick={this.fireOnKind.bind(this, kind, null)}
      >
        {kind}
      </div>
    );
  }

  render() {
    const kindNames = this.getKindNames();
    const mainStyle = {
      fontFamily: `
        -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
        "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
      `,
      color: '#444',
    };

    const h1WrapStyle = {
      background: '#F7F7F7',
      paddingBottom: '20px',
      position: 'absolute',
      top: '20px',
      right: '10px',
      left: '20px',
    };

    const h1Style = {
      textTransform: 'uppercase',
      letterSpacing: '3.5px',
      fontSize: '12px',
      fontWeight: 'bolder',
      color: '#828282',
      border: '1px solid #C1C1C1',
      textAlign: 'center',
      borderRadius: '2px',
      padding: '5px',
      cursor: 'default',
      margin: 0,
    };

    const listStyle = {
      overflowY: 'auto',
      position: 'absolute',
      top: '60px',
      right: '10px',
      bottom: 0,
      left: '20px',
    };

    return (
      <div style={mainStyle}>
        <div style={h1WrapStyle}>
          <h3 style={h1Style}>React Storybook</h3>
        </div>

        <FuzzySearch
          list={this.formatStoryForSearch()}
          options={options}
          width={430}
          onSelect={this.fireOnKind}
          placeholder="Search by Story or Kind"
        />

        <div style={listStyle}>
          {kindNames.map(this.renderKind.bind(this))}
        </div>
      </div>
    );
  }
}

StorybookControls.propTypes = {
  storyStore: React.PropTypes.array,
  selectedKind: React.PropTypes.string,
  selectedStory: React.PropTypes.string,
  onKind: React.PropTypes.func,
  onStory: React.PropTypes.func,
};
