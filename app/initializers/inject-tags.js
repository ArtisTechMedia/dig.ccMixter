import Tags from '../services/tags';

export default {
  name: 'inject-tags',

  initialize: function(container, app) {

    var registry = app || container;

    var TAGS_SERVICE = 'service:tags';

    registry.register( TAGS_SERVICE, Tags );

    if( registry.injection ) {
      registry.injection('controller', 'tags', TAGS_SERVICE);    
      registry.injection('route', 'tags', TAGS_SERVICE);
    } else {
      registry.inject('controller', 'tags', TAGS_SERVICE);    
      registry.inject('route', 'tags', TAGS_SERVICE);
    }
  }
};