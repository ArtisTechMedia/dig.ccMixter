import PageableRoute from './pageable';


export default PageableRoute.extend({

    routeQueryOptions: {
        genre: '*',
        instrumentalOnly: true,
        matchAnyTags: true,
   },

    routeQueryParams: {
        tags: 'experimental, ambient, electronica'
    },
    
});
