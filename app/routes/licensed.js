import PageableRoute from './pageable';

export default PageableRoute.extend({

  hiddenOptions: { 
    licenseScheme: true,
  },
  
  // this can happen when user 'resets'
  onOptionsChanged: function(optName) {
    if( optName !== 'licenseScheme' ) {
      this.refresh();
    }
  },
  
});
