import PageableRoute from './pageable';

export default PageableRoute.extend({

  genreTags: null,
  
  translateDynamicParamsToQuery: function( params ) {
      // we've already translated these below
      return params; 
    },

  model: function(params,transition) {
    this.setTrackerURL(params,transition);
    
    var uploadStore = this.container.lookup('store:uploads');
    var id          = params.upload_id;
    var me          = this;
    var trackTitle  = null;    
    var _tags       = null;
    
    return this.get('tags.remixGenres').then( function(tags)  {
      _tags = tags;
      return uploadStore.info(id);
    }).then( function(upload) {
      trackTitle = upload.get('name');
      var userTags = upload.get('userTags');
      var tags = userTags.intersection(_tags);
      if( !tags.get('length') ) {
        tags = userTags;
      }
      var qparams = {
        tags: tags.toString(),
        type: 'any'
      };
      return me._model(qparams,transition);
    }).then( function( model ) {
      model.trackTitle = trackTitle;
      model.playlist = model.playlist.rejectBy('id',Number(id));
      return model;
    });
  }
});
