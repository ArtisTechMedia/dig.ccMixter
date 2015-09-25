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
  
  _query: function(qString,isSingleton) {
  
    var url = this.queryHost + qString;

    function browserSuccess(r) {
        if( isSingleton ) {
          r = r[0];
        }
        return r;
    }

    function browserError(r) {
      if( r.responseText && r.responseText.match(/^<pre>/) ) {
        //something went south at ccMixter and there's a mysql error.
        Ember.debug(r.responseText);
        return isSingleton ? 0 : [ ];
      }  
    }
     
    function serverSucess( json ) {
        var arr = eval(json);
        if( isSingleton ) {
          arr = arr[0];
        }
        return arr;
    }   
    
    function serverError( /* r */ ) {
        // kind of doesn't matter what happened here
        // just don't crash the server
        return isSingleton ? 0 : [ ];
    }
    
    var args = {
        url: url,
        method: 'GET',
        dataType: 'json'
      };      
    
    var ajax = this.get('ajax');
    if( ajax ) { // we are in FastBoot       
      return ajax( url, 'GET', {} ).then( serverSucess, serverError );
    } else {
      return Ember.RSVP.resolve(Ember.$.ajax(args)).then( browserSuccess, browserError );
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