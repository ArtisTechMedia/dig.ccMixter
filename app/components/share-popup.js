import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  
  shareSubject: t("share.subject"),
  shareBody: t("share.body"),
  
  uploadLink: function() {
    return 'http://dig.ccmixter.org/files/' +
          this.get('upload.artist.id') +
          '/' + this.get('upload.id');
  }.property('upload'),
  
  fbLink: function() {
    return 'http://www.facebook.com/share.php?u=' + 
          this.get('uploadLink') + '&t=' + this.get('upload.name');
  }.property('upload'),
  
  twitterLink: function() {
    return 'http://twitter.com/home?status=' +
           this.get('upload.name') + ' ' +
           this.get('uploadLink') + '&t=' + this.get('upload.name');
  }.property('upload'),
  
  mailLink: function() {
    return 'mailto://?subject=' + this.get('shareSubject') +
          '&body=' + this.get('shareBody') +
          this.get('uploadLink');
  }.property('upload'),
});
