import Ember from 'ember';

var remixCategoryNames = ['genre', 'instr', 'mood'];
var minRemixesForTags = 10;

export default Ember.Service.extend({

  _waiting: 0,
  
  // for template - returns an actual value, eventually
  remixCategories: function(k,v) {
    if (arguments.length > 1) {
      return v;
    }    
    if( !this._waiting ) {
      this._waiting = true;
      this.store.categories( remixCategoryNames, 'remix', minRemixesForTags )
        .then( t => this.set(k,t)  );
      }
    return 0;
  }.property(),
  
  remixCategoryNames: function() {
    return remixCategoryNames;
  }.property(),
  
  // for route:model() - returns a promise`                                              
  remixGenres:  function(k,v) {
    if (arguments.length > 1) {
      return Ember.RSVP.resolve(v);
    }
    return this.store.forCategory('genre','remix');
  }.property(),

});
