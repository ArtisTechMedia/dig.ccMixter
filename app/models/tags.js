/* globals Ember */
import Query from './query';
import TagUtils from '../lib/tags';
import models from './models';
/**

  TODO - clean this up!!!!
  
  For single category pass in:
    params = { category: 'genre' }
    
  This returns an instance of TagUtils with bare tags.
  
  If you want more detail set:
    params = { category: 'genre', details: true }
    
  This will return an array of Tag models.
  
  For multiple categories :
  
    params = { categories: [ 'genre', 'mood' ] };
    
  This returns a hash :
  
    {
      genre: ...
      mood:  ...
    }
  The actual values in the hash depends on the 'details' option
*/
export default Query.extend({
  query: function(params) {
    var adapter = this.get('_adapter');
    if( params.category ) {
      var q = {   
        f: 'json', 
        category: params.category,
        pair: 'remix',
        sort: 'name',
        ord: 'ASC',
        min: 10
      };
      if( params.details ) {
        q.dataview = 'tags';
        return adapter.query(q).then( models('tag') );
      } else {
        q.dataview ='tags_with_cat';
        return adapter.query(q)
          .then( function(results) {
            return TagUtils.create( { source: results.mapBy( 'tags_tag' ) } );
          });
      }
    } else if( params.categories ) {
      var results = { };
      params.categories.forEach( k => results[k] = this.query( { category: k, details: params.details } ) );
      return Ember.RSVP.hash(results);
    }    
  },
});
