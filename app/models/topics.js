import Query from './query';
import models from './models';

var nameMap = {
  banner: 223608
};
export default Query.extend({
  find: function(name,id) {
    if( typeof id === 'string' ) {
      id = nameMap[id];
    }
    var args = {
      f: 'json',
      dataview: 'topics',
      ids: id
    };
    return this.get('_adapter').queryOne(args)
      .then( models('topic') );
  },

});
