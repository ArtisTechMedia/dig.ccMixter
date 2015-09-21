/* global Ember */
import PageableRoute from './pageable';
import models from '../models/models';

export default PageableRoute.extend({

  routeQueryOptions: {
    matchAnyTags: false,
  },
  
  routeQueryParams: function() {
      return { 
           searchp: this.get('queryOptions.searchText'),
           search_type: 'all',
           dataview: 'links_by'
          };
    }.property('queryOptions.searchText'),

  _watcher: function() {
    this.refresh();
  }.observes('queryOptions.searchText'),
  
  didYouMean: function() {

    var text = this.get('queryOptions.searchText');
    if( !text ) {
      return [ ];
    }
    var didYouMean = { 
      artists: this.store.query({
                  dataview: 'user_basic',
                  limit: 40,
                  minrx: 1,
                  f: 'json',
                  searchp: text
                }),
      genres: this.store.query({
                  dataview: 'tags',
                  f: 'json',
                  min: 5,
                  ids: text.w().join('_')
                })
      };    
    
    return Ember.RSVP.hash(didYouMean).then( result => {
         return [ 
          {
            name: 'dig.genre',
            route: 'tags',
            icon: 'tag',
            items: models( result.genres, 'tag' )
          },
          {
            name: 'dig.artists',
            route: 'users',
            icon: 'user',
            items: models( result.artists, 'userBasic'  )
          }        
        ];
      });
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
