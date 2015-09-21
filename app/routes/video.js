import PageableRoute from './pageable';

export default PageableRoute.extend({

    routeQueryOptions: {
        instrumentalOnly: true,
   },

    routeQueryParams: {
        tags: 'soundtrack,ambient,music_for_film',
        type: 'any'        
    },
    
});
