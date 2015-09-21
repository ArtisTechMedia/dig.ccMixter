/* globals Ember */
import PageableRoute from './pageable';

export default PageableRoute.extend({
  
  routeQueryParams: {
    tags: '',
    type: 'all',
  },
  
  _refreshParams: function() {
    var c = this.controllerFor('query');
    this.set('routeQueryParams.type', c.get('matchAnyTags') ? 'any' : 'all' );
    this.set('routeQueryParams.tags', c.get('tagQueryString') );
  },
  
  _doRefresh: function() {
    this._refreshParams();
    this.refresh();
  },
    
  _init: function() {
    Ember.run.next(this,function() {
      var c = this.controllerFor('query');
      c.addObserver('matchAnyTags',this,this._doRefresh);
      c.addObserver('tagQueryString', this,this._doRefresh);
      this._refreshParams();
    });
  }.on('init'),
  
  setupController: function() {
      this.controllerFor('application').send('showOptions');
      this._super(...arguments);
  },
    
});
