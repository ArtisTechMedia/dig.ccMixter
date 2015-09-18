import Ember from 'ember';

import soundManager from 'soundManager';

function computedPercentage(partial, total) {
  return function() {
    var partialVal = this.get(partial),
        totalVal = this.get(total);
    if (totalVal) {
      return (partialVal / totalVal) * 100;
    }
    return 0;
  }.property(partial, total);
}

var Media = Ember.Object.extend(Ember.Evented, {

  isPlaying:  false,
  isPaused: false,
  position: -1,
  duration: -1,
  bytesLoaded: -1,
  bytesTotal: -1,
  positionPercentage: computedPercentage('position', 'duration'),
  loadedPercentage: computedPercentage('bytesLoaded', 'bytesTotal'),
    
  sound: function() {
    var url = this.get('url');
    if( !url ) {
        return;
    }
    var me = this;
    var sound = soundManager.createSound({
        id:  url,
        url: url,
        onplay: function() {
            Ember.run(function() {
                me.set('isPlaying', true);
                me.trigger('onPlay',me);
            });
        },
        onstop: function() {
            Ember.run(function() {
                me.set('isPlaying', false);
                me.trigger('onStop',me);
            });
        },
        onpause: function() {
            Ember.run(function() {
                me.set('isPaused', true);
                me.trigger('onPause',me);
            });
        },
        onresume: function() {
            Ember.run(function() {
                me.set('isPaused', false);
                me.trigger('onResume',me);
            });
        },
        onfinish: function() {
            Ember.run(function() {
                me.set('isPlaying', false);
                me.trigger('onFinish',me);
            });
        },
        whileloading: function() {
                Ember.run.debounce(this.setPlaybackProperties.bind(this), 50);
            },
        whileplaying: function() {
                Ember.run.debounce(this.setPlaybackProperties.bind(this), 50);
            }
        });
        
    sound.setPlaybackProperties = function() {
        me.setProperties({
            bytesLoaded: this.bytesLoaded,
            bytesTotal: this.bytesTotal,
            position: this.position,
            duration: this.duration
            });
        };
        
    return sound;
    
  }.property('url'),

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
  
  togglePause: function() {
    var sound = this.get('sound');
    if( sound ) {
        sound.togglePause();
    }
  },
  
  setPosition: function(position) {
    return this.get('sound').setPosition(position);
  },

  setPositionPercentage: function(percentage) {
    var duration = this.get('duration');
    return this.setPosition(duration * (percentage / 100));
  },

});

export default Ember.Service.extend({
    /**
        nowPlaying is an instance of Media - wrapper for underlying implementation
        of sound player.
        
        If whatever you pass to the play() method has a 'mediaTags' hash of bindings
        then those bindings with show up on the nowPlaying object.
    */
    nowPlaying: null,
    
    /**
        playlist is an array of models. the .media property may not be
        present on these items.
    */
    playlist: null,
    
    play: function(playable) {
        this._delegate(playable,'play');
    },

    stop: function(playable) {
        this._delegate(playable,'stop');
    },
        
    togglePlay: function(playable) {
        this._delegate(playable,'togglePlay');
    },

    togglePause: function(playable) {
        this._delegate(playable,'togglePause');
    },

    playNext: function() {
        this._advance(1);
    },

    playPrevious: function() {
        this._advance(-1);
    },

    hasNext: function() {
        var index = this.get('_nowPlayingIndex');
        return index > -1 && index < this.get('playlist.length') - 1;
    }.property('_nowPlayingIndex'),
    
    hasPrev: function() {
        return this.get('_nowPlayingIndex') > 0;
    }.property('_nowPlayingIndex'),
    
    bindToNowPlaying: function(model) {
        var np = this.get('nowPlaying');
        if( np && model) {
            if( !Ember.isArray(model) ) {
                model = [ model ];
            }
            model = model.findBy('mediaURL',this.get('nowPlaying.url'));
            if( model ) {
                model.set('media', np );
            }
        }
    },            

    _delegate: function(playable,method) {
        var media = this._media(playable) || this.get('nowPlaying');
        if( media ) {
            media[method]();
        }
    },
    
    _updatePlaylist: function() {
        if( this.get('nowPlaying') && this.get('playlist') ) {
            if( !this.get('playlist').findBy('mediaURL',this.get('nowPlaying.url') ) ) {
                // user hit 'play' on a song not in this playlist
                // nuke it
                this.set('playlist',null);
            }
        }
    }.observes('nowPlaying'),
    
    _advance: function(dir) {
        this.play( this.get('playlist')[this.get('_nowPlayingIndex') + (1*dir)] );
    },
    
    _nowPlayingIndex: function() {
        var index = -1;
        var pl = this.get('playlist');
        if( pl && this.get('nowPlaying') ) {
            index = pl.indexOf( pl.findBy('mediaURL',this.get('nowPlaying.url')) );
        }
        return index;
    }.property('playlist','nowPlaying'),
    
    _onPlay: function(media) {
        var np = this.get('nowPlaying');
        if( np && np !== media ) {
            np.stop();
        }
        this.set('nowPlaying',media);
        media.one('onFinish',this, this._onFinish);
    },
    
    _onFinish: function(media) {
        media.stop();
        if( this.get('hasNext') ) {
            this.playNext();
        }
    },

    _mediaCache: function() {
        return {};
    }.property(),

    _media: function(playable) {
        if( !playable ) {
            return;
        }
        if( playable instanceof Media ) {
            return playable;
        }
        var media = playable.get('media');
        if( !media ) {
            Ember.assert('Object '+playable+' is not playable without a "mediaURL" property', playable.get('mediaURL'));
            var url = playable.get('mediaURL');
            var cache = this.get('_mediaCache');
            if (cache[url]) {
                media = cache[url];
            } else {    
                var args = Ember.merge( { url: url },  playable.get('mediaTags') );
                media = Media.create(args);
                media.on('onPlay',this,this._onPlay);
                cache[url] = media;
            }
            playable.set('media',media);
        }
        return media;
    }
});