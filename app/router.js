import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    metrics: Ember.inject.service(),
    
    willTransition() {
        this._super(...arguments);
        var appc = this.container.lookup('controller:application');
        if( appc ) {
            appc.set('loading',true);            
        }
    },
    
    didTransition() {
        this._super(...arguments);
        var appc = this.container.lookup('controller:application');
        if( appc ) {
            appc.set('loading',false);            
        }
        if( !Ember.isFastBoot() ) {
            this._trackPage();
        }
    },

    _trackPage() {
        Ember.run.scheduleOnce('afterRender', this, () => {
            var url = this.get('trackerURL');
            var appc = this.container.lookup('controller:application');
            if( url && appc ) {
                var page = 'http://dig.ccmixter.org' + url;
                var title = appc.get('pageTitle');
                this.get('metrics').trackPage( 'GoogleAnalytics', { page, title } );            
            }
        });
    }
});

Ember.Route.reopen({

    _entering: true,
    
    beforeModel: function() {
      this._super(...arguments);
      if( this._entering ) {
        this.setupRoute();        
        this._entering = false;
      }
    },
    
    deactivate: function() {
      this._entering = true;
    },
    
    /**
      setupRoute is called when this route is
      being transitioned into from another
      route AOT a refresh or queryParam change
      etc.
    */
    setupRoute: function() {
    },
    
    setTrackerURL: function(model,transition) {
        var rn = this.routeName;
        var url;
        if( Object.keys(transition.state.params[rn]).length ) {
            url = this.router.generate([rn],model);
        } else {
            url = this.router.generate([rn]);
        }
        this.router.set('trackerURL', url);
    },
    
});


Router.map(function() {
  this.route('uploads', { path: '/files/:user/:upload_id' } );
  this.route('users', { path: '/people/:user_id' });
  this.route('query');/* dig deep */
  this.route('dig');/* text search */
  this.route('video');
  this.route('games');
  this.route('morelike', { path: '/morelike/:upload_id' } );
  this.route('licenses');
  this.route('nowplaying');
  this.route('unknown-upload');
  this.route('tags', { path: '/tags/:tags' } );
  this.route('edpicks');
  this.route('free');
  this.route('ccplus');
});

export default Router;
