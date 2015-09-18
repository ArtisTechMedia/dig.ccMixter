/* globals Ember */
import PageableController from './pageable';
import { translationMacro as t } from "ember-i18n";

export default PageableController.extend({
    i18n: Ember.inject.service(),

    title: t('free.title'),
    icon: 'beer',

});
