$(document).autoBars(function() {
  Em.TEMPLATES['components/uploads-playlist'] = Em.TEMPLATES['uploads-playlist'];
  Em.TEMPLATES['components/tags-selector'] = Em.TEMPLATES['tags-selector'];
  Em.TEMPLATES['components/dig-bar'] = Em.TEMPLATES['dig-bar'];
  Em.TEMPLATES['user/index'] = Em.TEMPLATES['userIndex'];
  Em.TEMPLATES['user/profile'] = Em.TEMPLATES['userProfile'];
  Em.run(Dig, Dig.advanceReadiness);
});

window.onbeforeunload = function(e) {
  // This lookup makes me feel dirty.
  var nowPlaying = Dig.__container__.lookup('controller:nowPlaying');
  if (nowPlaying.get('isPlaying')) {
    return "Still Playing:\n\n\n" + nowPlaying.get('title') + ' by ' + nowPlaying.get('user_name');
  }
};

Dig.UploadsItemController = Em.ObjectController.extend(MediaPlayer.TrackControllerMixin, Dig.ControllerMixin, {
  needs: 'nowPlaying'.w(),
  nowPlaying: Em.computed.alias('controllers.nowPlaying'),
  playlist: Em.computed.alias('parentController.playlist'),

  fileLinkParams: function() {
    return this.get('user_name') + '/' + this.get('upload_id');
    return '/' + this.get('user_name') + '/' + this.get('upload_id');
  }.property('user_name', 'upload_id')
});

Dig.TagsSelectorItemController = Em.ObjectController.extend({
  name: Em.computed.alias('tags_tag'),
  bar:  Em.computed.alias('parentController.bar'),

  isActive: function(key, value) {
    var tags = this.get('bar.tags') || [],
        bar = this.get('bar'),
        params = this.get('bar.params'),
        name = this.get('name') || '';
    if (arguments.length > 1) {
      if (value) {
        tags.addObject(name);
      } else {
        tags.removeObject(name);
      }
      Em.set(params, 'tags', tags.join(','));
      return value;
    }
    return tags.contains(name);
  }.property('bar.tags', 'bar.tags.@each', 'name')
});

Dig.RemixPeerItemController = Em.ObjectController.extend({
  upload_id: function() {
    return this.get('content.upload_id') || this.get('content.pool_item_id');
  }.property('content.upload_id', 'content.pool_item_id'),

  user_name: function() {
    var url = this.get('artist_page_url');
    return url.split('/').pop();
  }.property('artist_page_url')
});

Dig.FileController = Em.ObjectController.extend(MediaPlayer.TrackControllerMixin, Dig.ControllerMixin, {
  reviews: [],

  displayUrl: function() {
    return (this.get('file_page_url') || '').replace('http://', '');
  }.property('file_page_url'),

  playlist: function() {
    return [this.get('content')];
  }.property('content'),

  track: function() {
    var content = this.get('content');
    if (content) {
      return CCC.UploadsCache.upload(content);
    }
  }.property('content'),
  media: Em.computed.alias('track.media'),
  isPlaying: Em.computed.alias('media.isPlaying')
});

Dig.UserIndexController = Em.Controller.extend(Dig.ControllerMixin, {
  baseQueryParams: 'sinced=&sort=rank&limit=10&ord=desc&lic=&u=',

  queryParams: function() {
    return this.get('baseQueryParams') + this.get('model');
  }.property('baseQueryParams', 'model')
});

Dig.TagsController = Dig.UserIndexController.extend(Dig.ControllerMixin, {
  baseQueryParams: 'sort=rank&limit=10&ord=desc&lic=&tags='
});

Dig.NowPlayingController = MediaPlayer.NowPlayingController.extend(
  Dig.ControllerMixin, Dig.UploadsItemControllerMixin
);

Dig.UploadsPlaylistComponent = Em.Component.extend(CCC.ApiComponentMixin, {
  tagName: 'ul',
  classNames: 'api uploads media-list'.w(),
  baseUrl: "http://ccmixter.org/api/query?f=json&datasource=uploads&",

  offset: 0,

  recommend: 'recommend',

  playlist: Em.computed.mapBy('uploads', 'media'),

  uploads: function() {
    var component = this;
    return this.get('apiData').map(function(upload) {
      upload.playlist = component;
      return CCC.UploadsCache.upload(upload);
    });
  }.property('apiData'),

  hasPreviousPage: function() {
    return this.get('offset') > 0;
  }.property('offset'),

  hasNextPage: function() {
    return true;
  }.property('offset'),

  actions: {
    recommend: function(id) {
      this.sendAction('recommend', id);
    },
    nextPage: function() {
      var limit = parseInt(this.get('params.limit')) || 10,
          offset = this.get('offset');
      offset += limit;
      this.set('offset', offset);
    },
    previousPage: function() {
      var limit = parseInt(this.get('params.limit')) || 10,
          offset = this.get('offset');
      offset -= limit;
      if (offset < 0) {
        offset = 0;
      }
      this.set('offset', offset);
    }
  }
});

Dig.DigBarComponent = Em.Component.extend({
  tagName: 'section',
  classNames: 'dig-bar'.w(),
  queryParams: 'stype=all&sinced=&sort=rank&order=desc&lic=&tags=',

  showAdvanced: false,

  action: 'dig',

  resultsOptions: [
    '10',
    '15',
    '25',
    '50'
  ],

  sincedOptions: [
    {
      label: 'Forever',
      value: ''
    }, {
      label: 'Yesterday',
      value: 'Yesterday'
    }, {
      label: '1 week ago',
      value: '1 week ago'
    }, {
      label: '2 weeks ago',
      value: '2 weeks ago'
    }, {
      label: '3 months ago',
      value: '3 months ago'
    }
  ],

  sortOptions: [
    {
      label: 'Popularity',
      value: 'rank'
    }, {
      label: 'Recommends',
      value: 'score'
    }, {
      label: 'Date',
      value: 'date'
    }
  ],

  licOptions: [
    {
      label: 'All Licenses',
      value: ''
    }, {
      label: 'Free for Commercial Use',
      value: 'open'
    }
  ],

  ordOptions: [
    {
      label: 'Descending',
      value: 'desc'
    }, {
      label: 'Ascending',
      value: 'asc'
    }
  ],

  stypeOptions: [
    {
      label: 'Any word',
      value: 'any'
    }, {
      label: 'All words',
      value: 'all'
    }, {
      label: 'Exact phrase',
      value: 'match'
    }
  ],

  newQueryParams: function() {
    return URI.buildQuery(this.get('params'));
  }.property('params', 'edited'),

  params: function() {
    return URI('?' + this.get('queryParams')).query(true);
  }.property('queryParams'),

  change: function() {
    this.sendAction('action', URI.buildQuery(this.get('params')));
  },

  newQueryParamsDidChange: function() {
    this.set('queryParams', this.get('newQueryParams'));
  }.observes('newQueryParams'),

  tags: function() {
    return (this.get('params.tags') || '').split(',').map(function(tag) {
      return (tag || '').trim();
    }).filter(function(tag) {return !!tag;});
  }.property('params.tags'),

  actions: {
    dig: function() {
      this.sendAction('action', URI.buildQuery(this.get('params')));
    },
    toggleAdvanced: function() {
      this.toggleProperty('showAdvanced');
    },

    clearTags: function() {
      this.set('params.tags', '');
      this.change();
    },

    clearTag: function(tag) {
      var tags = this.get('tags') || [];
      if (tag) {tag = tag.toString();}
      tags.removeObject(tag);
      this.set('params.tags', tags.join(','));
      this.change();
    }
  }
});

Dig.TagsSelectorComponent = Em.Component.extend(CCC.ApiComponentMixin, {
  baseUrl: "http://ccmixter.org/api/query?f=json&dataview=tags&sort=name&ord=asc&",

  allTags: Em.computed.alias('apiData')
});

Dig.PlaybackScrubberComponent = MediaPlayer.PlaybackScrubberComponent.extend();

soundManager.setup({
  url: 'soundmanagerv297a-20131201/swf/',
  debugMode: false
});

Dig.FileView = Em.View.extend({
  didInsertElement: function() {
    Em.run.scheduleOnce('afterRender', this, function() {
      this.$('.left-column').scrollToFixed({marginTop: 64});
    });
  }
});
