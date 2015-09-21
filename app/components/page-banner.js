import Ember from 'ember';

export default Ember.Component.extend({

  _triedAlready: false,
    
  _presentBanner: function() {
    Ember.$(this.get('element')).find('div').slideDown(300);
  },
  
  didInsertElement: function() {
    if( !this._triedAlready ) {
      this._triedAlready = true;
      var store = this.container.lookup('store:topics');
      return store.find('topic','banner')
        .then( t => {
          if( t.get('text') ) {
            this.set('bannerText',t.get('text'));
            if( !Ember.isFastBoot() ) {
              Ember.run.later(this,this._presentBanner,1700);
            }
          }
      });
    }
  },

});
