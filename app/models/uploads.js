/* globals Ember */
import Query from './query';
import models from './models';

export default Query.extend({
    find: function(name,id) {

        var queries = {
            listing: this.info(id),
            remixes: this.remixes(id),
            trackbacks: this.trackbacks(id),
            sources: this.sources(id)
        };
        
        var upload = null;

        return Ember.RSVP.hash(queries)
            .then( record => {
                upload = record.listing;
                upload.setProperties({
                    sources: record.sources,
                    remixes: record.remixes,
                    trackbacks: record.trackbacks,
                });
                return this.findUser(upload.get('artist.id'));
            }).then( function(user) {
                upload.set('artist',user);
                return upload;
            });
    },
    
    trackbacks: function(forId) {
        var trackbacksQ = {
            trackbacksof: forId,
            f: 'json',
            dataview: 'trackbacks',
            limit: 25 // TODO: get this from ENV or anywhere else!!
        };
        return this.get('_adapter').query(trackbacksQ).then( models('trackback') );
    },
    
    remixes: function(forId) {
        var remixesQ = {
            remixes: forId,
            f: 'json',
            dataview: 'links_u'
        };
        return this.get('_adapter').query(remixesQ).then( models('remix') );
    },
    
    sources: function(forId) {
        var sourcesQ = {
            sources: forId,
            f: 'json',
            dataview: 'links_u',
            datasource: 'uploads'
        };
        return this.get('_adapter').query(sourcesQ).then( models('source') );
    },
    
    info: function(id) {
        var uploadQ = {
            ids: id,
            f: 'json',
            dataview: 'default'
        };        
        return this.get('_adapter').queryOne(uploadQ).then( models('detail') );
    },
  
});
