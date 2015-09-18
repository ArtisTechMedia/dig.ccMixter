/* globals Ember */
import PageableController from './pageable';
import { translationMacro as t } from "ember-i18n";

export default PageableController.extend({
  i18n: Ember.inject.service(),
  
  subTitle: t( 'morelike.title'), 
  
  title: function() {
    return this.get('model.trackTitle');
  }.property('model'),

  icon: 'exchange',
});
