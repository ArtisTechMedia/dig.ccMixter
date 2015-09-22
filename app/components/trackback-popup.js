/* globals Ember */
import ModalCommon from './modal-common';

export default ModalCommon.extend({
  appEvents: Ember.inject.service(),
  
  modalName: 'trackback',
  
  didInsertElement: function() {
    this.get('appEvents').trigger('browser.script.run','responsive-iframes');
  },
  
});
