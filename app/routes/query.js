import PageableRoute from './pageable';

export default PageableRoute.extend({

    routeQueryOptions: {
        genre: '*',
        instrumentalOnly: false,
        digDeep: false,
    },
    
    setupController: function() {
        this.controllerFor('application').send('showOptions');
        this._super(...arguments);
    },
    
});
