var MediaPlayer = Em.Namespace.create();
MediaPlayer.Media = Em.Object.extend(Em.Evented, {
  isPlaying:  false,
  artist:     '',
  album:      '',
  title:      '',
  site:       null,
  release:    null,
  imageUrl:   '',
  mp3Url:     '',

  sound: function(key, value, oldValue) {
    var item = this,
        streamUrl = this.get('mp3Url');
    if (streamUrl) {
      return soundManager.createSound({
        id:  streamUrl,
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
  }.property('mp3Url'),

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
  }
});

MediaPlayer.TrackControllerMixin = Em.Mixin.create({
  needs: 'nowPlaying'.w(),
  nowPlaying: Em.computed.alias('controllers.nowPlaying'),

  playlist: null,

  mediaDidChange: function() {
    var item = this.get('media'),
        nowPlaying = this.get('nowPlaying'),
        controller = this,
        playlist = this.get('playlist') || [item],
        nowPlaying, sound;
    if (item && item.on && nowPlaying) {
      item.on('onPlay', function() {
        Em.run(function() {
          sound = item.get('sound');
          nowPlaying.setProperties({
            tracks:        playlist,
            content:       item,
            currentSound:  sound
          });
        });
      });

      item.on('whiledownloading', function() {
        Em.run(function() {
          nowPlaying.setProperties({
            bytesLoaded: sound.bytesLoaded,
            bytesTotal: sound.bytesTotal
          });
        });
      });

      item.on('whileplaying', function() {
        Em.run(function() {
          nowPlaying.setProperties({
            position: sound.position,
            duration: sound.duration
          });
        });
      });
    }
  }.observes('content').on('init'),

  actions: {
    togglePlay: function() {
      var media = this.get('media');
      if (media) {
        media.togglePlay();
      }
    },
    play: function() {
      var media = this.get('media');
      if (media) {
        media.play();
      }
    },
    stop: function() {
      var media = this.get('media');
      if (media) {
        media.stop();
      }
    }
  }
});

MediaPlayer.computedPercentage = function(partial, total) {
  return function() {
    var partialVal = this.get(partial),
        totalVal = this.get(total);
    if (totalVal) {
      return (partialVal / totalVal) * 100;
    }
    return 0;
  }.property(partial, total);
};

MediaPlayer.NowPlayingController = Em.ObjectController.extend({
  tracks: [],

  currentSound: null,

  shouldLoadFirstItem:  false,
  shouldContinuousPlay: true,

  blankValue: -1,
  position: Em.computed.defaultTo('blankValue').property('currentSound'),
  duration: Em.computed.defaultTo('blankValue').property('currentSound'),
  bytesLoaded: Em.computed.defaultTo('blankValue').property('currentSound'),
  bytesTotal: Em.computed.defaultTo('blankValue').property('currentSound'),
  positionPercentage: MediaPlayer.computedPercentage('position', 'duration'),
  loadedPercentage: MediaPlayer.computedPercentage('bytesLoaded', 'bytesTotal'),

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

MediaPlayer.RouteMixin = Em.Mixin.create({
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

soundManager.onload = function() {
  $(document.body).addClass('sm2-load-success');
};
soundManager.onerror = function() {
  if (soundManager.canPlayMIME('audio/mpeg')) {
    // HTML5 Support
    soundManager.onload();
  } else {
    $(document.body).addClass('sm2-load-failure');
  }
};
