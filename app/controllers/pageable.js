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
  
  modelIsEmpty: function() {
    var m = this.get('model');
    return !(m && m.total);
  }.property('model'),
  
  notALotHere: function() {
    return !this.get('queryOptions.optionsAreClean') && (this.get('model.total') < 10) && (this.get('model.total') > 0);
  }.property('model.total', 'queryOptions.optionsAreClean')
});
