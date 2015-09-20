import Ember from 'ember';

export default Ember.Helper.extend({
  appEvents: Ember.inject.service(),
  
  compute: function([name], hash) {    
    if( 'trigger' in hash ) {
      var evName = hash['trigger'];
      delete hash['trigger'];
      this.get('appEvents').trigger(evName,hash);
    } else {
      this.get('appEvents').trigger(name);
    }
  }
});