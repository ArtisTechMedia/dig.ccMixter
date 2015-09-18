/* globals Ember */
import models from './models';

export default Ember.Object.extend({
  _adapter: function() {
    return this.container.lookup('adapter:query');
  }.property(),
  
  find: function(name,id) {
    Ember.debug('Looking for adapter: ' + name);
    if( name === 'user' ) {
      return this.findUser(id);
    } else {
      return this.findUpload(id);
    }
  },
  
  fundUpload: function(id) {
    return this.get('_adapter').find(name,id);
  },
  
  findUser: function(id) {
    var qparams = {
      u: id,
      dataview: 'user_basic',
      f: 'json'
    };
    return this.get('_adapter').queryOne(qparams).then( models('user') );
  },

  query: function(params) {
    return this.get('_adapter').query(params);
  },

  count: function(qparams) {
    var countParams = Ember.merge({},qparams);
    countParams.f = 'count';
    return this.get('_adapter').queryOne(countParams);
  },

  playlist: function(params) {
    return this.query(params).then( models('upload') );
  },
});
