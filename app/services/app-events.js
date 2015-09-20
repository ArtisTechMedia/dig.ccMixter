import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  waiting: { },
  
  on: function(name,target,method) {
    this._super(name,target,method);
    var args;
    if( name in this.waiting ) {
      args = [name].concat(this.waiting[name]);
      this.trigger.apply(this,args);
      delete this.waiting[name];
    }
  },

  /**
      same as trigger but if no one is 
      listening now, it will be triggered
      the next time someone signs up
  */  
  triggerWhen: function(name,...args) {
    if( this.has(name) ) {
      this.trigger(...arguments);
    } else {
      this.waiting[name] = args;
    }
  },
  
});
