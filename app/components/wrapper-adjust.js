import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, 'fixWindow');
    },
    fixWindow: function() {
        if( Ember.isFastBoot() ) {
            return;
        }
        function adjustFooter() {
            Ember.$('#wrap').css( { 'min-height': window.innerHeight - Ember.$('.footer').outerHeight(true) } );
        }
        Ember.$(window).resize( function() {
            adjustFooter();
        });
        Ember.run.next(this,adjustFooter);
    }
});
