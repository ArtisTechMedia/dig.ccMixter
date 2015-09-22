/* globals Ember */
import PageableController from './pageable';
import QuickText from '../mixins/quickt';

var iconMap = {
  open: 'beer',
  ccplus: 'usd',
  all: 'music'
};

var titleMap = {
  open: 'free.title',
  ccplus: 'ccplus.title',
  all: 'dig.title'
};
export default PageableController.extend( QuickText, {
  queryOptions: Ember.inject.service(),
  
  icon: function() {
    return iconMap[this.get('queryOptions.licenseScheme')];
  }.property('queryOptions.licenseScheme'),

  title: function() {
    return this.qt( titleMap[this.get('queryOptions.licenseScheme')] );
  }.property('queryOptions.licenseScheme'),
});
