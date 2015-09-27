/* globals Ember */
import serialize from '../serializers/query';

export default Ember.Object.extend({
  _adapter: function() {
    return this.container.lookup('adapter:query');
  }.property(),
  
  query: function(params) {
    return this.get('_adapter').query(params);
  },
  
  queryOne: function(params) {
    return this.get('_adapter').queryOne(params);
  },
  
  find: function(name,id) {
    if( name === 'user' ) {
      return this.findUser(id);
    }
  },
  
  findUser: function(id) {
    var qparams = {
      u: id,
      dataview: 'user_basic',
      f: 'json'
    };
    return this.get('_adapter').queryOne(qparams).then( serialize('user') );
  },

  searchUsers: function(params) {
    params.dataview ='user_basic';
    params.f = 'json';
    return this.get('_adapter').query(params).then( serialize( 'userBasic' ) );
  },
  
  count: function(qparams) {
    var countParams = Ember.merge({},qparams);
    countParams.f = 'count';
    delete countParams['limit'];
    delete countParams['digrank'];
    delete countParams['sort'];
    delete countParams['ord'];
    return this.get('_adapter').queryOne(countParams);
  },

  playlist: function(params) {
    params.dataview = 'links_by';
    params.f = 'json';
    return this.query(params).then( serialize('upload') );
  },
});
