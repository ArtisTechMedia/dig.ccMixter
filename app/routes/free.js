import PageableRoute from './pageable';

export default PageableRoute.extend({

  routeQueryOptions: {
    licenseScheme: 'open',
  },

  onOptionsChanged: function(opt,value) {
    if( opt === 'licenseScheme' && value !== 'open' ) {
      if( value === 'all' ) {
        value = 'query';
      }
      this.transitionTo(value);
    } else {
      this._super(...arguments);
    }
  },
    
});
