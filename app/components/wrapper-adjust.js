import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    if( !Ember.isFastBoot() ) {
      Ember.run.scheduleOnce('afterRender', this, 'fixWindow');
    }
  },
  fixWindow: function() {
    function adjustFooter() {
      Ember.$('#wrap').css( { 'min-height': window.innerHeight - Ember.$('.footer').outerHeight(true) } );
    }
    Ember.$(window).resize( function() {
      adjustFooter();
    });
    Ember.run.next(this,adjustFooter);
  }
});
