import PageableRoute from './pageable';

export default PageableRoute.extend({

  routeQueryOptions: {
    licenseScheme: 'ccplus',
  },
    
  onOptionsChanged: function(opt,value) {
    if( opt === 'licenseScheme' && value !== 'ccplus' ) {
      if( value === 'all' ) {
        value = 'query';
      }
      this.transitionTo(value);
    } else {
      this._super(...arguments);
    }
  },
    
});
