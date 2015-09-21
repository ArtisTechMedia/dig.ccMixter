import Ember from 'ember';
import TagUtils from '../lib/tags';

export default Ember.Route.extend({
  audioPlayer: Ember.inject.service(),
  queryOptions: Ember.inject.service(),
  
  queryParams: {
    offset: { refreshModel: true },
  },

  routeQueryOptions: { },
  routeQueryParams: undefined,

  _setupWatcher: function() {
    this.get('queryOptions').on('optionsChanged',this,this._optionsWatcher);
  }.on('init'),
  
  _optionsWatcher: function(optName) {
    // This is broken for sub-routes
    if( this.router.currentRouteName === this.routeName ) {
      this.onOptionsChanged(optName,this.get('queryOptions.' + optName));
    }
  },
  
  onOptionsChanged: function(optName) {
    if( optName !== 'searchText' ) {
      this.refresh();
    }
  },

  safeMergeParameters: function(...paramHashes) {
    var target = {};
    Ember.merge(target,paramHashes[0]);

    for( var i = 1; i < paramHashes.length; i++ ) {
      var obj = paramHashes[i];
      for( var k in obj ) {
        var val = obj[k];
        if( typeof(val) !== 'undefined' ) {
          if( k === 'tags' || k === 'reqtags' || k === 'oneof' ) {          
            target[k] = TagUtils.combine(target[k],val);
          } else {
            target[k] = val;
          }
        }
      }
    }
    return target;
  },
    
  actions: {
    togglePlay: function() {
      this.get('audioPlayer').set('playlist',this.currentModel.playlist);
      return true;
    },
    
    doDownloadPopup: function(upload) {
      var store = this.container.lookup('store:uploads');
      store.info(upload.get('id'))
        .then( details => {
          this.controllerFor('application').send('doDownloadPopup',details);
        });
    },
  },
    
  setupController: function(controller,model) {
    Ember.assert('The model passed to setupController is not the playlist:' + model,model.playlist);
    this.get('audioPlayer').bindToNowPlaying(model.playlist);
    this._super(...arguments);
  },

  sysDefaultQueryArgs: function() {
    return {  
      tags: '', 
      dataview: 'links_by',
      limit: 10,
      sort: 'rank',
      ord: 'desc',
      oneof: 'remix,extended_mix',
      f: 'json',
      _cache_bust: (new Date()).getTime(),           
    };
  }.property(),
  
  translateDynamicParamsToQuery: function( /* params */ ) { },

  model: function(params,transition) {  
    return this._model(params,transition);
  },

  // _super is broken for async calls (was fixed, borked again, etc.)
  // use this call from .then() functions in derivations
  _model: function(params,transition) {  
    this.setTrackerURL(params,transition);

    // app defaults
    var sysDefaults = this.get('sysDefaultQueryArgs');
            
    // Route specific additions
    var routeParams = this.get('routeQueryParams');

    // query settings from UI (limit, genre, etc) 
    var userOptions = this.get('queryOptions').setBatch( this.routeName, 
                               this.get('routeQueryOptions') );

    // Ember's dynamic url parts (/:user_id)
    var dynParams = this.translateDynamicParamsToQuery(params);

    // query parameters (?foo=bar&offset=20) 
    var urlParams = transition.queryParams;

    var qparams = this.safeMergeParameters(sysDefaults,routeParams,userOptions,dynParams,urlParams);
    
    var retModel = {
      playlist: this.store.playlist(qparams),
      total:  this.store.count(qparams)
    };
    
    return Ember.RSVP.hash(retModel);
  },
  
});
