/* global Ember */
import PageableRoute from './pageable';

export default PageableRoute.extend({

  templateName: 'dig',
  
  routeQueryParams: function() {
      return { 
           searchp: this.get('queryOptions.searchText'),
           search_type: 'all',
          };
    }.property('queryOptions.searchText'),

  _watcher: function() {
    if( this.router.currentRouteName === 'dig' ) {
      this.refresh();
    }
  }.observes('queryOptions.searchText'),
  
  didYouMean: function() {

    var text = this.get('queryOptions.searchText');
    if( !text ) {
      return [ ];
    }
    
    var tagStore = this.container.lookup('store:tags');
    
    var didYouMean = { 
      artists: this.store.searchUsers({
                  limit: 40,
                  remixmin: 1,
                  searchp: text
                }),
      genres: tagStore.searchTags({
                  min: 5,
                  ids: text.w().join('_')
                })
      };    
    
    return Ember.RSVP.hash(didYouMean).then( result => 
        [ 
          {
            name: 'dig.genre',
            route: 'tags',
            icon: 'tag',
            items: result.genres,
          },
          {
            name: 'dig.artists',
            route: 'users',
            icon: 'user',
            items: result.artists
          }        
        ]
      );
  },

  model: function(params, transition) {
    this.setTrackerURL(params,transition);
    
    var q = {
      main: this._model(params,transition),
      didYouMean: this.didYouMean()
    };
    
    return Ember.RSVP.hash(q).then( r => {
      r.main.didYouMean = r.didYouMean;
      return r.main;
    });
  },  
});
