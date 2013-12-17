var Dig = Em.Application.create();
Dig.deferReadiness();

$(document).autoBars(function() {
  Em.TEMPLATES['components/uploads-playlist'] = Em.TEMPLATES['uploads-playlist'];
  Em.TEMPLATES['components/dig-bar'] = Em.TEMPLATES['dig-bar'];
  Dig.advanceReadiness();
});

// ROUTER

Dig.Router.map(function() {
  this.resource('about');
  this.resource('top');
  this.resource('recommended');
  this.resource('free');
  this.resource('new');
  this.resource('uploadsIndex', {path: '/tracks'});
  this.resource('uploads', {path: '/tracks/*args'});
});

// ROUTES

Dig.ApplicationRoute = Em.Route.extend({
  renderTemplate: function() {
    this._super.apply(this, arguments);
    this.render('nowPlaying', {
      into: 'application',
      outlet: 'nowPlaying'
    });
  },
  actions: {
    togglePlay: function() {
      var currentTrack = this.controllerFor('nowPlaying').get('content');
      if (currentTrack) {
        currentTrack.togglePlay();
      }
    },
    playPrevious: function() {
      this.controllerFor('nowPlaying').playPreviousTrack();
    },
    playNext: function() {
      this.controllerFor('nowPlaying').playNextTrack();
    }
  }
});

Dig.UploadsRoute = Em.Route.extend({
  model: function(params) {
    if (params.args) {
      return params.args;
    }
  }
});

Dig.ApiRoute = Em.Route.extend({
  queryParams: '',
  model: function() {
    return this.get('queryParams');
  }
});

Dig.TopRoute = Dig.ApiRoute.extend({
  queryParams: 'sort=rank&limit=10&ord=desc&lic='
});

Dig.RecommendedRoute = Dig.ApiRoute.extend({
  queryParams: 'sort=score&limit=10&ord=desc&lic='
});

Dig.FreeRoute = Dig.ApiRoute.extend({
  queryParams: 'lic=open&sort=rank&limit=10&ord=desc'
});

Dig.NewRoute = Dig.ApiRoute.extend({
  queryParams: 'sort=date&limit=10&ord=desc&lic='
});

Dig.UploadsIndexRoute = Em.Route.extend({
  redirect: function() {this.transitionTo('uploads', '');}
});

// END ROUTES

// CONTROLLERS

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

Dig.Upload = Em.ObjectProxy.extend(Em.Evented, {
  isPlaying: false,

  userQuery: function() {
    var name = this.get('user_name');
    if (name) {
      return 'u='+name;
    }
  }.property('user_name'),

  streamUrl: function() {
    var files = this.get('content.files');
    if (Em.isArray(files)) {
      // TODO: Search list and make sure we try to get a streamable file instead of zip
      return files.get('firstObject.download_url');
    }
  }.property('content.files'),

  /*
  license_logo_url: function() {
    // TODO: Make this work to pull correct images from dig
    return "http://dig.ccmixter.org/images/" + this.get('license_name').dasherize() + '.png';
  }.property('license_name'),
  */

  sound: function(key, value, oldValue) {
    var item = this,
        streamUrl = this.get('streamUrl');
    if (streamUrl) {
      return soundManager.createSound({
        url: streamUrl,
        onplay: function() {
          Em.run(function() {
            item.set('isPlaying', true);
            item.trigger('onPlay');
          });
        },
        onstop: function() {
          Em.run(function() {
            item.set('isPlaying', false);
            item.trigger('onStop');
          });
        },
        onfinish: function() {
          Em.run(function() {
            item.set('isPlaying', false);
            item.trigger('onFinish');
          });
        }
      });
    }
  }.property('streamUrl'),

  stop: function() {
    var sound = this.get('sound');
    if (sound) {
      sound.stop();
    }
  },

  play: function() {
    var sound = this.get('sound');
    if (sound) {
      sound.play();
    }
  },

  togglePlay: function() {
    if (this.get('isPlaying')) {
      this.stop();
    } else {
      this.play();
    }
  },
});

Dig.UploadsItemController = Em.ObjectController.extend({
  needs: 'nowPlaying'.w(),
  nowPlaying: Em.computed.alias('controllers.nowPlaying'),

  contentDidChange: function() {
    var item = this.get('content'),
        nowPlaying = this.get('nowPlaying');
        controller = this,
        nowPlaying;
    if (item && item.on && nowPlaying) {
      item.on('onPlay', function() {
        nowPlaying.setProperties({
          tracks:        item.get('playlist.uploads') || [],
          content:       item,
          currentSound:  item.get('sound')
        });
      });
    }
  }.observes('content').on('init'),

  actions: {
    togglePlay: function() {
      this.get('content').togglePlay();
    }
  }
});

Dig.NowPlayingController = Em.ObjectController.extend({
  tracks: [],

  currentSound: null,

  shouldLoadFirstItem:  false,
  shouldContinuousPlay: true,

  trackIndex: function() {
    var track = this.get('content'),
        tracks = this.get('tracks');
    if (track && Em.isArray(tracks)) {
      return tracks.indexOf(track);
    }
    return -1;
  }.property('tracks.@each', 'content'),

  nextTrack: function() {
    var tracks = this.get('tracks'),
        trackIndex = this.get('trackIndex') + 1;
    if (!tracks.get('length')) {return;}
    if (trackIndex >= tracks.get('length')) {
      trackIndex = 0;
    }
    return tracks.objectAt(trackIndex);
  }.property('trackIndex', 'tracks.@each'),

  previousTrack: function() {
    var tracks = this.get('tracks'),
        trackIndex = this.get('trackIndex') - 1;
    if (!tracks.get('length')) {return;}
    if (trackIndex < 0) {
      trackIndex = tracks.get('length') - 1;
    }
    return tracks.objectAt(trackIndex);
  }.property('trackIndex', 'tracks.@each'),

  playNextTrack: function() {
    var next = this.get('nextTrack');
    if (next) {next.play();}
  },

  playPreviousTrack: function() {
    var previous = this.get('previousTrack');
    if (previous) {previous.play();}
  },

  didFinishTrack: function() {
    if (this.get('shouldContinuousPlay')) {
      this.playNextTrack();
    }
  },

  trackWillChange: function() {
    var track = this.get('content');
    if (track) {
      track.off('onFinish', this, this.didFinishTrack);
      track.stop();
    }
  }.observesBefore('content'),

  soundWillChange: function() {
    var sound = this.get('currentSound');
    if (sound) {
      sound.stop();
    }
  }.observesBefore('currentSound'),

  trackDidChange: function() {
    var track = this.get('content');
    if (track) {
      track.on('onFinish', this, this.didFinishTrack);
    }
  }.observes('content'),

  setInitialItem: function() {
    if (this.get('shouldLoadFirstItem')) {
      var content = this.get('content'),
          tracks = this.get('tracks');
      if (!content && tracks.get('length')) {
        this.set('content', tracks.objectAt(0));
      }
    }
  }.observes('content', 'tracks.@each').on('init')
});

// END CONTROLLERS

// COMPONENTS

Dig.UploadsPlaylistComponent = Em.Component.extend({
  tagName: 'ul',
  classNames: 'api uploads media-list'.w(),
  baseUrl: "http://ccmixter.org/api/query?f=json&datasource=uploads&",
  queryParams:  '',
  isLoaded:     false,
  _uploads: [],

  uploads: function() {
    var component = this;
    return this.get('_uploads').map(function(upload) {
      upload.playlist = component;
      return Dig.UploadsCache.upload(upload);
    });
  }.property('_uploads'),

  uploadsPromise: function(params) {
    var queryParams = this.get('queryParams'),
        url = this.get('baseUrl');
    url += queryParams;
    return Ember.RSVP.resolve($.ajax({url: url, dataType: 'json'}).then(function(response) {
      response.args = queryParams;
      return response;
    }));
  }.property('queryParams'),

  uploadsPromiseDidChange: function() {
    var component = this,
        promise = this.get('uploadsPromise');
    if (promise && promise.then) {
      this.set('isLoaded', false);
      promise.then(function(uploads) {
        component.setProperties({
          _uploads:  uploads,
          isLoaded:  true
        });
      });
    }
  }.observes('uploadsPromise').on('init')
});

Dig.DigBarComponent = Em.Component.extend({
  tagName: 'section',
  classNames: 'dig-bar'.w(),
  queryParams: '',

  showAdvanced: false,

  resultsOptions: [
    '10',
    '15',
    '25',
    '50'
  ],

  sortOptions: [
    'rank',
    'score',
    'date'
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
    'desc',
    'asc'
  ],

  newQueryParams: function() {
    return URI.buildQuery(this.get('params'));
  }.property('params', 'edited'),

  params: function() {
    return URI('?' + this.get('queryParams')).query(true);
  }.property('queryParams'),

  change: function() {
    this.notifyPropertyChange('edited');
  },

  newQueryParamsDidChange: function() {
    this.set('queryParams', this.get('newQueryParams'));
  }.observes('newQueryParams'),

  actions: {
    toggleAdvanced: function() {
      this.toggleProperty('showAdvanced');
    }
  }
});

// END CONTROLLERS

soundManager.setup({
  url: 'soundmanagerv297a-20131201/swf/',
  debugMode: false
});
