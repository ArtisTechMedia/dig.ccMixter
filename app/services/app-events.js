import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  waiting: { },
  
  on: function(name,target,method) {
    this._super(name,target,method);
    if( name in this.waiting ) {
      this.trigger.apply(this,this.waiting[name]);
      delete this.waiting[name];
    }
  },
  
  triggerWhen: function(name,...args) {
    if( this.has(name) ) {
      this.trigger(...arguments);
    } else {
      args.splice(0,0,name);
      this.waiting[name] = args;
    }
  },
  
});
