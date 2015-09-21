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
    var id = params.upload_id;
    var me = this;
    var trackTitle = null;
    
    function gotUpload(upload) {
      trackTitle = upload.get('name');
      var userTags = upload.get('userTags');
      var tags = userTags.intersection(me.get('genreTags'));
      if( !tags.get('length') ) {
        tags = userTags;
      }
      var qparams = {
        tags: tags.toString(),
        type: 'any'
      };
      return me._model(qparams,transition);
    }
    
    function gotRecords(model) {
      model.trackTitle = trackTitle;
      model.playlist = model.playlist.rejectBy('id',Number(id));
      return model;
    }
    
    function gotGenres( genres ) {
      me.set( 'genreTags', genres );
      return uploadStore.find('upload', id);
    }
    
    var promise;
    
    if( this.get('genreTags') ) {
      promise = uploadStore.find('upload', id)
        .then( gotUpload )
        .then( gotRecords );    
    } else {    
      var ts = this.container.lookup('store:tags');
      promise = ts.query( { category: 'genre' } )
        .then( gotGenres )
        .then( gotUpload )
        .then( gotRecords ); 
    }
    
    return promise;
  }
});
