import PageableRoute from './pageable';

export default PageableRoute.extend({

    routeQueryOptions: {
        genre: '*',
        instrumentalOnly: true,
        matchAnyTags: false,
    },

    
});
