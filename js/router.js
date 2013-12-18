var Dig = Em.Application.create();
Dig.deferReadiness();

Dig.Router.map(function() {
  this.resource('about');
  this.resource('hot');
  this.resource('top');
  this.resource('recommended');
  this.resource('free');
  this.resource('new');
  this.resource('user', {path: '/user/:username'});
  this.resource('tags', {path: '/tags/:tags'});
  this.resource('uploadsIndex', {path: '/dig'});
  this.resource('uploads', {path: '/dig/*args'});
});

Dig.ApiRoute = Em.Route.extend({
  queryParams: '',
  model: function() {
    return this.get('queryParams');
  }
});

Dig.UserRoute = Em.Route.extend({
  model: function(params) {
    return params.username;
  }
});

Dig.TagsRoute = Em.Route.extend({
  model: function(params) {
    return (params.tags || '').replace(/ /, ',');
  }
});

Dig.HotRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=1 week ago&sort=rank&limit=10&ord=desc&lic='
});

Dig.TopRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&limit=10&ord=desc&lic='
});

Dig.RecommendedRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=score&limit=10&ord=desc&lic='
});

Dig.FreeRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&lic=open&sort=rank&limit=10&ord=desc'
});

Dig.NewRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=date&limit=10&ord=desc&lic='
});

Dig.UploadsRoute = Em.Route.extend({
  model: function(params) {
    if (params.args) {
      return params.args;
    }
  }
});

Dig.UploadsIndexRoute = Em.Route.extend({
  redirect: function() {this.transitionTo('uploads', '');}
});

Dig.ApplicationRoute = Em.Route.extend({
  renderTemplate: function() {
    this._super.apply(this, arguments);
    this.render('nowPlaying', {
      into: 'application',
      outlet: 'nowPlaying'
    });
  },
  actions: {
    togglePlay: function() {
      var currentTrack = this.controllerFor('nowPlaying').get('content');
      if (currentTrack) {
        currentTrack.togglePlay();
      }
    },
    playPrevious: function() {
      this.controllerFor('nowPlaying').playPreviousTrack();
    },
    playNext: function() {
      this.controllerFor('nowPlaying').playNextTrack();
    },
    dig: function(queryParams) {
      this.transitionTo('uploads', queryParams);
    }
  }
});

