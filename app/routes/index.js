import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        // temp beta...
        closePopup: function() {
            Ember.$('#msg').fadeOut();
        }
    },
});
