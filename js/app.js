var Dig = Em.Application.create();
Dig.deferReadiness();

$(document).autoBars(function() {
  Dig.advanceReadiness();
});

// ROUTER

Dig.Router.map(function() {
  this.resource('about');
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

Dig.ApiRoute = Em.Route.extend({
  baseUrl: "http://ccmixter.org/api/query?f=json&",
  model: function(params) {
    var url = this.get('baseUrl');
    if (params.args) {
      url += params.args;
    }
    return Ember.RSVP.resolve($.ajax({url: url, dataType: 'json'}).then(function(response) {
      response.args = params.args;
      return response;
    }));
  },
  serialize: function(model) {
    if (model) {
      if (typeof(model) === 'string') {
        return {args: model};
      }
      return {args: model.args};
    }
    return {args: ''};
  }
});

Dig.UploadsRoute = Dig.ApiRoute.extend({
  baseUrl: "http://ccmixter.org/api/query?f=json&limit=15&datasource=uploads&",
});

Dig.UploadsIndexRoute = Em.Route.extend({
  redirect: function() {this.transitionTo('uploads', '');}
});

// END ROUTES

// CONTROLLERS

Dig.ApiController = Em.ArrayController.extend({
  itemController: 'apiItem',

  newArgs: function() {
    return this.get('content.args') || '';
  }.property('content'),
});
Dig.ApiItemController = Em.ObjectController.extend();

Dig.UploadsController = Dig.ApiController.extend({
  itemController: 'uploadsItem'
});

Dig.UploadsItemController = Dig.ApiItemController.extend(Em.Evented, {
  needs: 'nowPlaying'.w(),
  nowPlaying: Em.computed.alias('controllers.nowPlaying'),

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
            item.set('nowPlaying.content', item);
            item.set('nowPlaying.currentSound', item.get('sound'));
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

  actions: {
    togglePlay: function() {
      this.togglePlay();
    }
  }
});

Dig.NowPlayingController = Em.ObjectController.extend({
  needs: 'uploads'.w(),
  tracks: Em.computed.alias('controllers.uploads'),

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

soundManager.setup({
  url: 'soundmanagerv297a-20131201/swf/',
  debugMode: false
});
