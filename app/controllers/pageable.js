import Ember from 'ember';

export default Ember.Controller.extend({

    queryParams: [ 'offset' ],
    queryOptions: Ember.inject.service(),
    offset: 0,
    
    _lastTotal: -1,
    
    _modelSizeChanged: function(obj,key) {
        if( obj.get(key) !== this._lastTotal ) {
            this.set('offset',0);
            this._lastTotal = obj.get(key);
        }
    }.observes('model.total'),                  

    printableOffset: function() {
        return Number(this.get('offset')) + 1;
    }.property('offset'),
    
    showPrev: function() {
        return this.get('offset') > 0;        
    }.property('offset'),
        
    showNext: function() {
        return  this.get('offset') + this.get('queryOptions.limit') < this.get('model.total');
    }.property('offset', 'model.total' /*, 'queryOptions.limit' */ ),
    
    prevValue: function() {
        var val = this.get('offset') - this.get('queryOptions.limit');
        if(  val < 0 ) {
            val = 0;
        }
        return val;
    }.property('offset', 'model' /*,'queryOptions.limit' */),
    
    nextValue: function() {
        return this.get('offset') + this.get('queryOptions.limit');
    }.property('offset', 'model' /* ,'queryOptions.limit' */),

    lastValue: function() {
        var off = this.get('offset');
        var count = this.get('model.playlist.length');
        var limit = this.get('queryOptions.limit');
        return off + ( count < limit ? count : limit);
    }.property('model'),
    
    lastPage: function() {
        var total = this.get('model.total');
        var off = this.get('offset');
        var limit = this.get('queryOptions.limit');
        if( total - limit > off ) { 
            return total - limit;
        }
        return false;
    }.property('model'),
    
    showLast: Ember.computed.alias('lastPage'),
    
});
