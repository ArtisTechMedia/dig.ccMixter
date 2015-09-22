import Ember from 'ember';

export default Ember.Component.extend({
  appEvents: Ember.inject.service(),
  
  didInsertElement: function() {
    if( !Ember.isFastBoot() ) {
      this.get('appEvents').on( 'browser.script.run',    this, this.runScript );
      this.get('appEvents').on( 'browser.script.detach', this, this.detachScript );
      Ember.run.scheduleOnce('afterRender', this, () => {
        this.fixWindow();
        this.hookOptionsButton();
      });
    }
  },

  runScript: function(name,hash) {
    this[name.camelize()](hash);
  },

  detachScript: function(name,hash) {
    this[('detach-'+name).camelize()](hash);
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
  
  // not used but fun to write:
  monitorDropdowns: function() {
    Ember.$('[data-toggle="dropdown"] + ul li').click(function() {    
      var text = Ember.$(this).data('dropdown-hint') || Ember.$(this).find('a').text();
      Ember.$(this).closest('div').find('a strong').text(text);
    });
  },
  
  hookOptionsButton: function() {
    Ember.$('.query-options-toggle').click( function() {
      var $bar = Ember.$('#qop');
      if( $bar.is(':visible') ) {
        $bar.slideUp(300);
      } else {
        $bar.slideDown(300);
      }      
    });
  },
  
  scrollWatcher: function(context) {
    var isAlreadyInstalled = false;
    var $elements = Ember.$('[data-keep-above],[data-keep-below]',context);

    $elements.each( function() { // no => here
      var $e = Ember.$(this);
      var data = $e.data();
      ['keep-between-a','keep-between-b'].forEach( k => {
        if( k in data ) {
          $e.data(k)(); // run it!
          isAlreadyInstalled = true;
        }
      });
      return !isAlreadyInstalled;
    });  
    
    if( isAlreadyInstalled ) {
      return;
    }
    
    $elements.each( function() { // no =>
      var $e = Ember.$(this);
      var data = $e.data();
      if( 'keepAbove' in data ) {
        setupBump( $e, Ember.$(data.keepAbove), true );
      }
      if( 'keepBelow' in data ) {
        setupBump( $e, Ember.$(data.keepBelow), false );
      }
    });  
    
    function setupBump($e,$bumper,isKeepAbove) {
    
      if( !$e.is(':visible') ) {
        return;
      }
      
      var eHeight      = $e.outerHeight() + 3;      
      var propName     = 'keep-between-' + (isKeepAbove ? 'a' : 'b');
      
      $e.data( propName, function() {
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
      });
      
      Ember.$(window).scroll( $e.data(propName) );

      $e.data(propName)();
    }
    
  },
  
  detachScrollWatcher: function(context) {  
    Ember.$('[data-keep-above],[data-keep-below]',context).each( function() { // no =>
      var $e = Ember.$(this);
      ['a', 'b'].forEach( k => {
        var f = 'keep-between-'+k;
        if( $e.data(f) ) {
          Ember.$(window).off('scroll',$e.data(f));
          $e.data(f,null);
        }
      });
    });
  },
  
  
  responsiveIframes: function () {
    var $ = Ember.$;
    if( $('iframe').length ) {
      $('iframe').each( function() {
          $(this).css( { overflow: 'hidden', width: '100%', 'max-height': '300px' } );
        });
      }
  }  
});
