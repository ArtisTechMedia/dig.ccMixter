/* globals Ember */
import PageableController from './pageable';
import { translationMacro as t } from "ember-i18n";

export default PageableController.extend({
  i18n: Ember.inject.service(),

  _titleWithStr: t( 'dig.titleWithStr' ),
  _title: t('dig.title'),
    
  title: function() {
    return this.get('queryOptions.searchText') || this.get('_title');
  }.property('queryOptions.searchText'),
  
  subTitle: function() {
    if( this.get('queryOptions.searchText') ) {
      return this.get('_titleWithStr');
    }
  }.property('queryOptions.searchText'),
  
  icon: function() {
    return this.get('queryOptions.searchText') ? 'search' : 'music';
  }.property('queryOptions.searchText'),
  
  hasDidYouMean: function() {
    return !!this.get('model.didYouMean').findBy('items.length');
  }.property('model.didYouMean.@each.items'),
});
