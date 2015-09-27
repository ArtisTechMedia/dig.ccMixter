import Query from './query';
import serialize from '../serializers/query';

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
    return this.queryOne(args)
      .then( serialize('topic') );
  },

});
