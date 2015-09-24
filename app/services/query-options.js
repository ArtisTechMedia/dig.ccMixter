import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  /**
    these options will participate in queryParams
    and will trigger queryParams.optionsChanged
    events
  */
  _options: null,
  
  /**
    used internally to avoid noisy eventing
  */
  _ignoreChange: false,

  /**
    Temporarily disable any option in this hash
  */    
  hiddenOptions: Ember.Object.create(),
      
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
    var options = this._options;
    
    for( var k in options ) {
        properties[k] = options[k].defaultValue;
    }

    this.setProperties(properties);  
  },
  
  installOptions: function( options ) {

    function optionsAreClean() {
        var options = this._options;
        var hidden  = this.get('hiddenOptions');
        for( var k in options ) {
          if( !(k in hidden) ) {
            if(this.get(k) !== options[k].defaultValue) {
              return false;
            }
          }
        }
        return true;
      }    
    
    function queryParams() {
        var qp = { };
        var options = this._options;
    
        for( var k in options ) {
            var meta = options[k];
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
      return Object.keys(options).concat(args);
    }    
    
    this._options = options;      
    
    var names = Object.keys(options);
    
    this.applyDefaults();

    names.forEach( k => { this.addObserver(k,this,optionsChanged); } );

    this.set('optionsAreClean', Ember.computed.apply(null,_a('hiddenOptions', optionsAreClean)));
    this.set('queryParams',     Ember.computed.apply(null,_a(queryParams)));
  },  
  

  
});
  
