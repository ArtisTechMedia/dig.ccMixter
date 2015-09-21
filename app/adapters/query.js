import Ember from 'ember';

function _makeQ(qparams) {
  var q = '';
  for( var p in qparams ) {
    if( q !== '' ) { q += '&'; }
    if( qparams[q] !== '' ) { q += p + '=' + qparams[p]; }
  }
  return q;
}

export default Ember.Object.extend( {
  queryHost: 'http://ccmixter.org/api/query?',
  

  _serverAjax: function() {
      var ajax = this.container.lookup('ajax:node');
      return ajax;
  },
  
  _query: function(qString,isSingleton) {
    var url = this.queryHost + qString;

    if ( Ember.isFastBoot() ) {    
      var ajax = this._serverAjax();
      
      return ajax( url, 'GET', {} ).then( function( json ) {
            var arr = eval(json);
            if( isSingleton ) {
              arr = arr[0];
            }
            return arr;
          } );
    } else {
      var args = {
          url: url,
          method: 'GET',
          dataType: 'json'
        };
      return Ember.RSVP.resolve(Ember.$.ajax(args))
        .then( function(r) { 
          if( isSingleton ) {
            r = r[0];
          }
          return r;
        });
    }
  },

  query: function(params) {
    return this._query(_makeQ(params),false);
  },
  
  queryOne: function(params) {
    return this._query(_makeQ(params),true);
  },
  
  // this is not very functional and assumes the caller
  // knows how to format the params for the proper 
  // datasource (uploads, topics, user, etc.)
  find: function(name,params) {
    return this.query(_makeQ(params));
  }
});