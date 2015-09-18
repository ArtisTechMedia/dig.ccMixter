import Query from '../models/query';
import Uploads from '../models/uploads';
import Tags from '../models/tags';

export default {
    name: 'inject-store',
    initialize: function(container, app) {
        var STORE_MAIN = 'store:main';
        app.register(STORE_MAIN, Query);
        app.inject('route','store', STORE_MAIN);
        app.inject('controller','store', STORE_MAIN);
        
        var STORE_UPLOADS = 'store:uploads';
        app.register(STORE_UPLOADS, Uploads);
        app.inject('route:uploads','store', STORE_UPLOADS);
        app.inject('controller:uploads','store', STORE_UPLOADS);
        
        var STORE_TAGS = 'store:tags';
        app.register(STORE_TAGS, Tags);
    }
};