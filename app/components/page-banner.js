import Ember from 'ember';

export default Ember.Component.extend({

  _triedAlready: false,
    
  _presentBanner: function() {
    var $e = Ember.$(this.element);
    $e.addClass('page-banner').slideDown("slow");
  },
  
  didInsertElement: function() {
    if( !this._triedAlready ) {
      this._triedAlready = true;
      var store = this.container.lookup('store:topics');
      return store.find('topic','banner')
        .then( t => {
          if( t.get('text') ) {
            if( !Ember.isFastBoot() ) {
              var $e = Ember.$(this.element);
              $e.hide();
            }
            this.set('bannerText',t.get('text'));
            if( !Ember.isFastBoot() ) {
              Ember.run.later(this,this._presentBanner,500);
            }
          }
      });
    }
  },

});
