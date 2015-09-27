import PageableRoute from './pageable';

function queryParamProperty() {
  return function() {
    return {
      tags: this.controller.get('tagQueryString'),
      type: this.controller.get('matchAnyTags') ? 'any' : 'all',
    };
  }.property('controller.matchAnyTags','controller.tagQueryString');
}

export default PageableRoute.extend({
  
  templateName: 'query',
  
  setupController: function() {
    this._super(...arguments);
    this.set('routeQueryParams', queryParamProperty() );
    this.addObserver('controller.matchAnyTags',this,this.refresh);
    this.addObserver('controller.tagQueryString',this,this.refresh);
    this.get('routeQueryParams'); // observers won't take until you do this.
  }
  
});
