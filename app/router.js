import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    metrics: Ember.inject.service(),
    appEvents: Ember.inject.service(),
    
    willTransition(from, to, transition) {
        this._super(...arguments);
        var appc = this.container.lookup('controller:application');
        if( appc ) {
            appc.set('loading',true);            
        }
        if( !(from.length === to.length && from[from.length-1].name === to[from.length-1].name) ) {
          this.get('appEvents').trigger('routeChanged',transition.targetName);
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
  this.route('free');
  this.route('video');
  this.route('ccplus');
  this.route('games');
  this.route('morelike', { path: '/morelike/:upload_id' } );
  this.route('licenses');
  this.route('nowplaying');
  this.route('unknown-upload');
  this.route('tags', { path: '/tags/:tags' } );
  this.route('edpicks');
});

export default Router;
