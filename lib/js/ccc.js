var CCC = Em.Namespace.create();

CCC.ApiCache = {};

CCC.UploadsCache = {};

CCC.recommendId = function(id) {
  var url = "http://ccmixter.org/rate/" + id + "/5?rmacro=recommends";
  $.ajax(url, {
    method: "POST", xhrFields: {withCredentials: true}
  }).then(function() {
    Em.get(CCC, 'recommends').pushObject(id);
  });
};

CCC.UploadsCache.forUrl = function(url) {
  if (CCC.UploadsCache[url]) {
    return CCC.UploadsCache[url];
  }
  var upload = CCC.Upload.create();
  CCC.UploadsCache[url] = upload;
  return upload;
};

CCC.UploadsCache.upload = function(upload) {
  var obj = CCC.UploadsCache.forUrl(upload.file_page_url);
  obj.set('content', upload);
  return obj;
};

CCC.ControllerMixin = Em.Mixin.create({
  needs: 'application',
  loggedIn: function() {return Em.get(CCC, 'username');}.property('CCC.username'),
  myRecommends: function() {return Em.get(CCC, 'recommends');}.property('CCC.recommends')
});

CCC.Upload = Em.ObjectProxy.extend({
  title: Em.computed.alias('upload_name'),

  isPlaying: Em.computed.alias('media.isPlaying'),

  streamUrl: function() {
    var files = this.get('content.files');
    if (Em.isArray(files)) {
      // TODO: Search list and make sure we try to get a streamable file instead of zip
      return files.get('firstObject.download_url');
    }
  }.property('content.files'),

  license_logo_url: function() {
    // TODO: Make this work to pull correct images from CCC
    return "images/" + this.get('license_name').dasherize() + '.png';
  }.property('license_name'),

  media: function() {
    return MediaPlayer.Media.create({
      track:            this,
      artistBinding:    'track.user_name',
      titleBinding:     'track.upload_name',
      mp3UrlBinding:    'track.streamUrl'
    });
  }.property('streamUrl'),

  isRecommended: function() {
    return (Em.get(CCC, 'recommends') || []).contains(this.get('upload_id'));
  }.property('CCC.recommends.@each', 'upload_id'),

  isOwnUpload: function() {
    return (this.get('user_name') === Em.get(CCC, 'username'));
  }.property('CCC.username', 'user_name')
});

CCC.ApiComponentMixin = Em.Mixin.create({
  baseUrl:      "http://ccmixter.org/api/query?f=json&",
  queryParams:  '',
  isLoaded:     false,
  apiData:      [],

  params: function() {
    return URI('?' + this.get('queryParams')).query(true);
  }.property('queryParams'),

  apiPromise: function(params) {
    var queryParams = this.get('queryParams'),
        url = this.get('baseUrl'),
        offset = this.get('offset');
    url += queryParams + '&offset=' + offset;
    var data = CCC.ApiCache[url];
    if (data) {return Ember.RSVP.resolve(data);}
    return Ember.RSVP.resolve($.ajax({url: url, dataType: 'json'}).then(function(response) {
      response.args = queryParams;
      CCC.ApiCache[url] = response;
      return response;
    }));
  }.property('queryParams', 'offset'),

  apiPromiseDidChange: function() {
    var component = this,
        promise = this.get('apiPromise');
    if (promise && promise.then) {
      this.set('isLoaded', false);
      promise.then(function(data) {
        component.setProperties({
          apiData:  data,
          isLoaded:  true
        });
      });
    }
  }.observes('apiPromise').on('init')
});

$.ajax("http://ccmixter.org/whoami.php", {
  method: "GET",
  dataType: "JSON",
  xhrFields: {withCredentials: true}}
).then(function(response) {
  Em.run(function() {
    var username = response.username;
    if (username) {
      Em.set(CCC, 'username', username);
    }
    $.ajax(
      "http://ccmixter.org/api/query?f=json&datasource=uploads&sort=rank&limit=90000&reccby=" + username,
      {dataType: 'json'}
    ).then(function(results) {
      Em.set(CCC, 'recommends', results.getEach('upload_id'));
    });
  });
});
