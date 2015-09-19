import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function() {
    if( !Ember.isFastBoot() ) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.fixWindow();
        this.scrollWatcher();
      });
    }
  },

  watchForAudioPlayer: function() {
    if( this.get('playerShowing') ) {
      Ember.$('.footer').addClass('footer-pad');
    }
  }.observes('playerShowing'),
  
  fixWindow: function() {
    function adjustFooter() {
      Ember.$('#wrap').css( { 'min-height': window.innerHeight - Ember.$('.footer').outerHeight(true) } );
    }
    Ember.$(window).resize( function() {
      adjustFooter();
    });
    Ember.run.next(this,adjustFooter);
  },
  
  // how much does this belong somewhere else?
  scrollWatcher: function() {
    function setupBump($e,$bumper,isKeepAbove) {
      var eHeight      = $e.outerHeight() + 3;
      var propName     = 'keep-between-' + (isKeepAbove ? 'a' : 'b');
      
      $e[propName] = function() {
        // we have to do this stuff in the event handler
        // because DOM
        var bumperHeight = $bumper.outerHeight() + 3;
        var bumperTop    = $bumper.offset().top;
        var top       = Number($e.css('top').replace(/[^-\d\.]/g, ''));
        var bumperPos = bumperTop - Ember.$(window).scrollTop();
        
        if( isKeepAbove ) {
          if( top + eHeight > bumperPos) {
            $e.css( { top: (bumperPos-eHeight) + 'px' } );
          }
        } else { 
          if( top < bumperPos + bumperHeight ) {
            $e.css( { top: (bumperPos + bumperHeight) + 'px' } );
          }
        }
      };
      
      Ember.$(window).scroll( $e[propName] );

      $e[propName]();
    }
    
    Ember.$('[data-keep-above],[data-keep-below]').each( function() {
      var $e = Ember.$(this);
      var data = $e.data();
      if( 'keepAbove' in data ) {
        setupBump( $e, Ember.$(data.keepAbove), true );
      }
      if( 'keepBelow' in data ) {
        setupBump( $e, Ember.$(data.keepBelow), false );
      }
    });
    
  },
  
});
