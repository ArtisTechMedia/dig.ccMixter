import Ember from 'ember';

export default Ember.Component.extend({
  link: '',
  email: '',
  yourName: '',
  name: '',
  artist: '',
  embed: '',
  
  types: [ 'video', 'podcast', 'album', 'soundcloud', 'website'],
  type: 'video',
  upload: 0,
  
  postData: function() {
    return {
      trackback_link: this.get('link'),
      trackback_email: this.get('email'),
      trackback_your_name: this.get('youName'),
      trackback_name: this.get('name'),
      trackback_artist: this.get('artist'),
      trackback_media: this.get('embed')      
    };
  }.property( 'link', 'yourName', 'name', 'artist', 'embed' ),

  message: '',
  messageType: '',
  
  showEmbed: function() {
    return this.get('type') === 'video';
  }.property('type'),
  
  validate: function() {
    return this.email.length && this.link.length;
  },
  
  actions: {
    post: function() {
        this.set('showValidationMessage',false);
        if( !this.validate() ) {
          this.set('showValidationMessage','tbForm.missingFields');
          return;
        }
        var type = this.get('type');
        if( type === 'soundcloud' ) {
          type = 'website';
        }
        var host = 'http://ccmixter.org';
        var url = host + '/track/' + type + '/' + this.get('upload.id');
        var args = {
            url: url,
            method: 'POST',
            data: this.get('postData'),
            dataType: 'text',
          };
        this.setProperties( {
            messageType: 'info',
            message: 'tbForm.submitting',
            icon: true
          });
        return Ember.RSVP.resolve(Ember.$.ajax(args))
          .then( r => { 
            if( r === 'ok' ) {
              this.setProperties( {
                  messageType: 'success',
                  message: 'tbForm.success',
                  icon: false
                });
            } else {
              this.setProperties( {
                  messageType: 'danger',
                  message: 'tbForm.wups',
                  icon: false
                });
            }
            return r === 'ok';
          });
    },
    typeChange: function() {
      var i = this.$('#mtype')[0].selectedIndex;
      this.set( 'type', this.get('types')[i] );
    },
    
    cancel: function() {
      return true;
    }
  },
});
