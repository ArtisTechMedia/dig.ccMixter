/* globals Ember */

import ModalCommon from './modal-common';

export default ModalCommon.extend({
  modalName: 'download',
  
  downloadSize: function() {
    var fi = this.get('upload.fileInfo');
    return fi ? fi.file_filesize.replace(/\(|\)/g, '') : '';
  }.property('upload'),

  plainSelected: true,
  
  actions: {
    selectFormat: function(format) {
      this.set('plainSelected', format==='plain');
    },
    copyToClip: function() {
      window.prompt('Control (or Cmd) + C to copy', Ember.$('#attributionText')[0].value );
    },
    popup: function(name) {    
      // sure there's a better way
      var appr = this.container.lookup('route:application');
      appr.send('popup', name, {upload: this.get('upload')});
    },    
  },

});
