import PageableRoute from './pageable';

export default PageableRoute.extend({

    routeQueryOptions: {
        genre: '*'
    },
 
    tags: '',
    
    setupController(controller) {
        controller.set('tags', this.get('tags').tagize(true));
        this._super(...arguments);
    },
    
    translateDynamicParamsToQuery: function( params ) { 
        var tags = params.tags.tagize() ;
        this.set( 'tags', tags );
        return { tags: tags };
    },
});
