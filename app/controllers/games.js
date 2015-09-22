/* globals Ember */
import PageableController from './pageable';
import QuickText from '../mixins/quickt';

export default PageableController.extend( QuickText, {
  queryOptions: Ember.inject.service(),

  icon: 'gamepad',
  
  title: function() {
    return this.qt('games.title') + (this.get('queryOptions.instrumentalOnly') ? ' (' + this.qt('instrumental') + ')' : '');
  }.property('queryOptions.instrumentalOnly'),
    
});
