import PageableRoute from './pageable';

export default PageableRoute.extend({

  hiddenOptions: { 
    licenseScheme: true,
  },
  
  onOptionsChanged: function(optName) {
    // this can happen when user 'resets'
    if( optName === 'licenseScheme' ) {
      this.applyRouteOptions();
    }
    this._super(...arguments);
  },
  
});
