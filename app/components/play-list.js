import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        togglePlay: function(upload) {
            this.sendAction('togglePlay',upload);
        },
        doDownloadPopup: function(upload) {
            this.sendAction('doDownloadPopup',upload);
        },
    }
});
