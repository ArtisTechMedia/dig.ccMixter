import Ember from 'ember';

export default Ember.Controller.extend({
  queryOptions: Ember.inject.service(),

  queryParams: [ 'offset' ],

  offset: 0,
  
  _lastTotal: -1,
  
  _modelSizeChanged: function(obj,key) {
    if( obj.get(key) !== this._lastTotal ) {
      this.set('offset',0);
      this._lastTotal = obj.get(key);
    }
  }.observes('model.total'),          

  _setupWatcher: function() {
    this.get('queryOptions').on('optionsChanged',this,this._optionsWatcher);
  }.on('init'),

  _optionsWatcher: function() {
    this.set('offset',0);
  },
});
