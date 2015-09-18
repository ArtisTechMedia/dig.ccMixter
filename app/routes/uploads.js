import Ember from 'ember';

export default Ember.Route.extend({
    audioPlayer: Ember.inject.service(),

    setupController: function(controller,model) {
        this.get('audioPlayer').bindToNowPlaying(model);
        this._super(...arguments);
    },
        
    model: function(params,transition) {
        this.setTrackerURL(params,transition);
        var me = this;
        return this._super(...arguments).catch(function(){
            me.transitionTo('unknown-upload');
        });
    }
});
