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
      var loaded = this.get('media.bytesLoaded'),
          total = this.get('media.bytesTotal'),
          percent = 100 * (loaded / total);
          
      return new Ember.Handlebars.SafeString('width: ' + percent + '%;');
    } catch(e) {
      console.error('loadingStyle', e.stack);
    }
  }.property('media.bytesTotal', 'media.bytesLoaded'),

  positionStyle: function() {
    try {
      var position = this.get('media.position'),
          duration = this.get('media.duration'),
          percent = 100 * (position / duration);
      return new Ember.Handlebars.SafeString('width: ' + percent + '%;');
    } catch(e) {
      console.error('loadingStyle', e.stack);
    }
  }.property('media.position', 'media.duration')
});
