import Ember from 'ember';

export default Ember.Component.extend({
  appEvents: Ember.inject.service(),
  
  printableOffset: function() {
    return Number(this.get('offset')) + 1;
  }.property('offset'),
  
  showPrev: function() {
    return this.get('offset') > 0;    
  }.property('offset'),
    
  showNext: function() {
    return  this.get('offset') + this.get('limit') < this.get('total');
  }.property('offset', 'limit','total'),
  
  prevValue: function() {
    var val = this.get('offset') - this.get('limit');
    if(  val < 0 ) {
      val = 0;
    }
    return val;
  }.property('offset','limit'),
  
  nextValue: function() {
    return this.get('offset') + this.get('limit');
  }.property('offset','limit'),

  lastValue: function() {
    var off = this.get('offset');
    var count = this.get('length');
    var limit = this.get('limit');
    return off + ( count < limit ? count : limit);
  }.property('offset','length','limit'),
  
  lastPage: function() {
    var total = this.get('total');
    var off = this.get('offset');
    var limit = this.get('limit');
    if( total - limit > off ) { 
      return total - limit;
    }
    return false;
  }.property('total','offset','limit'),
  
  showLast: Ember.computed.alias('lastPage'),
  
  didInsertElement: function() {
    this.get('appEvents').triggerWhen('browser.script.run','scroll-watcher',this.get('element'));
  },
  
  willDestroyElement: function() {
    this.get('appEvents').trigger('browser.script.detach','scroll-watcher',this.get('element'));
  },
});
