import Ember from 'ember';

export default Ember.Route.extend({
    audioPlayer:  Ember.inject.service(),
    queryOptions: Ember.inject.service(),
    
    actions: {
        search: function(text) {
            this.set('queryOptions.searchText', text);
            this.transitionTo('dig');
        },
        doDownloadPopup: function(upload) {            
            this.controllerFor('application').send('doDownloadPopup',upload);
        },
        doLicensePopup: function() {
            Ember.$('#licenseInfoPopup').modal('show');
        },                   
        togglePlay: function(upload) {
            this.get('audioPlayer').togglePlay(upload);
        },
        query: function() {
            this.transitionTo('query' );
        },
    },
});
