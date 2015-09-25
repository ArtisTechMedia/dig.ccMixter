import Ember from 'ember';

export default Ember.Component.extend({
  media: null,
  classNames: ['playback-scrubber','pull-left'],

  click: function() {
    return false;
  },
  mouseDown: function() {
    this.set('isMouseDown', true);
  },

  mouseUp: function(evt) {
    this.set('isMouseDown', false);
    var ratio = evt.offsetX / this.$().width();
    this.get('media').setPositionPercentage(ratio*100);
  },

  mouseMove: function(evt) {
    if (this.get('isMouseDown')) {
      var ratio = evt.offsetX / this.$().width();
      this.get('media').setPositionPercentage(ratio*100);
    }
  },

  loadingStyle: function() {
    try {
      var loaded = this.get('media.bytesLoaded');      
      if( loaded < 0  ) {
        return 0;
      }
      return 100 * (loaded /  this.get('media.bytesTotal'));
    } catch(e) {
      console.error('loadingStyle', e.stack);
    }
  }.property('media.bytesTotal', 'media.bytesLoaded'),

  positionStyle: function() {
    try {
      var position = this.get('media.position');
      if( position < 0 ) {
        return 0;
      }
      return 100 * (position / this.get('media.duration'));
    } catch(e) {
      console.error('loadingStyle', e.stack);
    }
  }.property('media.position', 'media.duration')
});
