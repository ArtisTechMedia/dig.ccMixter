import Ember from 'ember';

export default Ember.Component.extend({

  _fetchBanner: function() {
    var store = this.container.lookup('store:topics');
    return store.find('topic','banner')
      .then( t => {
        if( t.get('text') ) {
          this.set('bannerText',t.get('text'));
        }
    });
  }.on('init')
});
