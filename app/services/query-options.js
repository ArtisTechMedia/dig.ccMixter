import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  /**
    these options will participate in queryParams
    and will trigger queryParams.optionsChanged
    events
  */
  _updating: null,
  
  /**
    used internally to avoid noisy eventing
  */
  _ignoreChange: false,
    
  /*
    Allows a route to setup initial values
    when entering the route. This will update
    the UI but not send events out
  */
  applyRouteOptions: function(routeValues) {
    this._ignoreChange = true;
    this.setProperties(routeValues);
    this._ignoreChange = false;
  },

  /**
    what it says on the tin
  */  
  applyDefaults: function() {
    var properties = { };
    var updating = this._updating;
    
    for( var k in updating ) {
        properties[k] = updating[k].defaultValue;
    }

    this.setProperties(properties);  
  },
  
  installOptions: function( updating ) {

    function optionsAreClean() {
        var updating = this._updating;
        for( var k in updating ) {
          if(this.get(k) !== updating[k].defaultValue) {
            return false;
          }
        }
        return true;
      }    
    
    function queryParams() {
        var qp = { };
        var updating = this._updating;
    
        for( var k in updating ) {
            var meta = updating[k];
            var value = this.get(k);
            if( meta.model ) {
              if( value ) {
                qp[meta.queryParam] = meta.model;
              }
            } else {
              qp[meta.queryParam] = value;
            }
        }
        
        return qp;
      }
      
    function optionsChanged(me,key) {
      if( !this._ignoreChange ) {
        this.trigger('optionsChanged',key,this.get(key));
      }
    }
    
    function _a(...args) {
      return Object.keys(updating).concat(args);
    }    
    
    this._updating = updating;      
    
    var names = Object.keys(updating);
    
    this.applyDefaults();

    names.forEach( k => { this.addObserver(k,this,optionsChanged); } );

    this.set('optionsAreClean', Ember.computed.apply(null,_a(optionsAreClean)));
    this.set('queryParams',     Ember.computed.apply(null,_a(queryParams)));
  },  
  

  
});
  
