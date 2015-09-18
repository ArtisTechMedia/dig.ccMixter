/* globals Ember */
import PageableController from './pageable';
import { translationMacro as t } from "ember-i18n";

export default PageableController.extend({
    i18n: Ember.inject.service(),
    tags: '',
    
    titleBinding: 'tags',
    subTitle: t('tags.subTitle'),
    icon: 'tags'
});
