import Ember from 'ember';

export default Ember.Component.extend({

    downloadSize: function() {
        // don't use alias() because of overhead
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
        doLicensePopup: function() {        
            Ember.$('#downloadPopup').modal('hide');
            Ember.$('#licenseInfoPopup').modal('show');
        },        
    }
});
