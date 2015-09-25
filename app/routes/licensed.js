import PageableRoute from './pageable';

export default PageableRoute.extend({

  hiddenOptions: { 
    licenseScheme: true,
  },

  translateDynamicParamsToQuery: function( /* params */ ) {
    return { lic: this.licenseScheme };
  },

});
