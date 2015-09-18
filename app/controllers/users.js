import PageableController from './pageable';

export default PageableController.extend({
    skipUserListing: true,
    
    title: function() {
        return this.get('model.artist.name');
    }.property('model'),
    
});