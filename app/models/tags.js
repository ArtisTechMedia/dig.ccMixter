/* globals Ember */
import Query from './query';
import TagUtils from '../lib/tags';
import serialize from '../serializers/query';

export default Query.extend({

  // return a TagUtils object
  forCategory: function(category,pairWith) {
    var q = {   
      f: 'json', 
      category: category,
      pair: pairWith,
      sort: 'name',
      ord: 'asc',
      dataview: 'tags_with_cat'
    };
    return this.get('_adapter').query(q).then( r =>  TagUtils.create( { source: r.mapBy( 'tags_tag' ) } ));
  },
  
  // return an array of Tag models
  category: function(category,pairWith,minCount) {
    var q = {   
      f: 'json', 
      category: category,
      pair: pairWith,
      sort: 'name',
      ord: 'asc',
      min: minCount,
      dataview: 'tags'
    };
    return this.get('_adapter').query(q).then( serialize('tag') );
  },
  
  // returns a hash with each category name as a property
  // who's value is an array of Tag models
  categories: function(categoryNames,pairWith,minCount) {
    var results = { };
    categoryNames.forEach( k => { results[k] = this.category( k, pairWith, minCount ); } );
    return Ember.RSVP.hash(results);
  },
  
  searchTags: function(params) {
    params.dataview = 'tags';
    params.f = 'json';
    return this.get('adapter').then( serialize( 'tag' ) );
  },
});
