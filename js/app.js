$(document).autoBars(function() {
  Em.TEMPLATES['components/uploads-playlist'] = Em.TEMPLATES['uploads-playlist'];
  Em.TEMPLATES['components/tags-selector'] = Em.TEMPLATES['tags-selector'];
  Em.TEMPLATES['components/dig-bar'] = Em.TEMPLATES['dig-bar'];
  Em.run(Dig, Dig.advanceReadiness);
});

window.onbeforeunload = function(e) {
  // This lookup makes me feel dirty.
  var nowPlaying = Dig.__container__.lookup('controller:nowPlaying');
  if (nowPlaying.get('isPlaying')) {
    return "Still Playing:\n\n\n" + nowPlaying.get('title') + ' by ' + nowPlaying.get('user_name');
  }
};

$.ajax("http://ccmixter.org/whoami.php", {
  method: "GET",
  dataType: "JSON",
  xhrFields: {withCredentials: true}}
).then(function(response) {
  Em.run(function() {
    var username = response.username;
    if (username) {
      Em.set(Dig, 'username', username);
    }
    $.ajax(
      "http://ccmixter.org/api/query?f=json&datasource=uploads&sort=rank&limit=90000&reccby=" + username,
      {dataType: 'json'}
    ).then(function(results) {
      Em.set(Dig, 'recommends', results.getEach('upload_id'));
    });
  });
});

Dig.ApiCache = {};

Dig.UploadsCache = {};

Dig.UploadsCache.forUrl = function(url) {
  if (Dig.UploadsCache[url]) {
    return Dig.UploadsCache[url];
  }
  var upload = Dig.Upload.create();
  Dig.UploadsCache[url] = upload;
  return upload;
};

Dig.UploadsCache.upload = function(upload) {
  var obj = Dig.UploadsCache.forUrl(upload.file_page_url);
  obj.set('content', upload);
  return obj;
};

Dig.Upload = Em.ObjectProxy.extend({
  title: Em.computed.alias('upload_name'),

  isPlaying: Em.computed.alias('media.isPlaying'),

  streamUrl: function() {
    var files = this.get('content.files');
    if (Em.isArray(files)) {
      // TODO: Search list and make sure we try to get a streamable file instead of zip
      return files.get('firstObject.download_url');
    }
  }.property('content.files'),

  license_logo_url: function() {
    // TODO: Make this work to pull correct images from dig
    return "images/" + this.get('license_name').dasherize() + '.png';
  }.property('license_name'),

  media: function() {
    return MediaPlayer.Media.create({
      track:            this,
      artistBinding:    'track.user_name',
      titleBinding:     'track.upload_name',
      mp3UrlBinding:    'track.streamUrl'
    });
  }.property('streamUrl')
});

Dig.ControllerMixin = Em.Mixin.create({
  needs: 'application',
  loggedIn: Em.computed.alias('controllers.application.username'),
  myRecommends: Em.computed.alias('controllers.application.myRecommends'),
});

Dig.ApplicationController = Em.Controller.extend({
  username: function() {
    return Em.get(Dig, 'username');
  }.property('Dig.username'),
  myRecommends: function() {
    return Em.get(Dig, 'recommends');
  }.property('Dig.recommends')
});

Dig.UploadsItemControllerMixin = Em.Mixin.create({
  isRecommended: function() {
    return (this.get('myRecommends') || []).contains(this.get('upload_id'));
  }.property('myRecommends.@each', 'upload_id'),

  isOwnUpload: function() {
    return (this.get('user_name') === this.get('loggedIn'));
  }.property('loggedIn', 'user_name')
});

Dig.UploadsItemController = Em.ObjectController.extend(MediaPlayer.TrackControllerMixin, Dig.ControllerMixin, Dig.UploadsItemControllerMixin, {
  needs: 'nowPlaying'.w(),
  nowPlaying: Em.computed.alias('controllers.nowPlaying'),
  playlist: Em.computed.alias('parentController.playlist')
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

Dig.UserController = Em.Controller.extend(Dig.ControllerMixin, {
  baseQueryParams: 'sinced=&sort=rank&limit=10&ord=desc&lic=&u=',

  queryParams: function() {
    return this.get('baseQueryParams') + this.get('model');
  }.property('baseQueryParams', 'model')
});

Dig.TagsController = Dig.UserController.extend(Dig.ControllerMixin, {
  baseQueryParams: 'sort=rank&limit=10&ord=desc&lic=&tags='
});

Dig.NowPlayingController = MediaPlayer.NowPlayingController.extend(
  Dig.ControllerMixin, Dig.UploadsItemControllerMixin
);

Dig.ApiComponentMixin = Em.Mixin.create({
  baseUrl:      "http://ccmixter.org/api/query?f=json&",
  queryParams:  '',
  isLoaded:     false,
  apiData:      [],

  params: function() {
    return URI('?' + this.get('queryParams')).query(true);
  }.property('queryParams'),

  apiPromise: function(params) {
    var queryParams = this.get('queryParams'),
        url = this.get('baseUrl'),
        offset = this.get('offset');
    url += queryParams + '&offset=' + offset;
    var data = Dig.ApiCache[url];
    if (data) {return Ember.RSVP.resolve(data);}
    return Ember.RSVP.resolve($.ajax({url: url, dataType: 'json'}).then(function(response) {
      response.args = queryParams;
      Dig.ApiCache[url] = response;
      return response;
    }));
  }.property('queryParams', 'offset'),

  apiPromiseDidChange: function() {
    var component = this,
        promise = this.get('apiPromise');
    if (promise && promise.then) {
      this.set('isLoaded', false);
      promise.then(function(data) {
        component.setProperties({
          apiData:  data,
          isLoaded:  true
        });
      });
    }
  }.observes('apiPromise').on('init'),
});

Dig.UploadsPlaylistComponent = Em.Component.extend(Dig.ApiComponentMixin, {
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
      return Dig.UploadsCache.upload(upload);
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

Dig.TagsSelectorComponent = Em.Component.extend(Dig.ApiComponentMixin, {
  baseUrl: "http://ccmixter.org/api/query?f=json&dataview=tags&sort=name&ord=asc&",

  allTags: Em.computed.alias('apiData')
});

soundManager.setup({
  url: 'soundmanagerv297a-20131201/swf/',
  debugMode: false
});
