var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2878955-3']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


var Dig = Em.Application.create();
Dig.deferReadiness();

Dig.Router.map(function() {
  this.resource('about');
  this.resource('hot');
  this.resource('top');
  this.resource('recommended');
  this.resource('editorialPicks');
  this.resource('licenseReady', {path: '/ccplus'});
  this.resource('free');
  this.resource('new');
  this.resource('pells');
  this.resource('samples');
  this.resource('freeMusicForYoutube', {path: '/free-music-for-youtube'});
  this.resource('freeMusicToRemix', {path: '/free-music-to-remix'});
  this.resource('safeForCommercialLicensing', {path: '/safe-for-commercial-licensing'});
  this.resource('fileUser', {path: '/files/:username'}, function() {
    this.resource('file', {path: '/:file_id'});
  });
  this.resource('user', {path: '/people/:username'}, function() {
    this.route('profile');
  });
  this.resource('tags', {path: '/tags/:tags'});
  this.resource('userRedirect', {path: '/user/:username'});
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

Dig.UserProfileRoute = Em.Route.extend({
  model: function(params) {
    return Em.RSVP.resolve($.ajax({
      url: "http://ccmixter.org/api/query?f=rss&t=user_profile&f=json&user=" + this.modelFor('user'),
      dataType: 'json'
    })).then(function(result) {
      console.log('result', result[0]);
      return result[0];
    });
  }
});

Dig.UserRedirectRoute = Em.Route.extend({
  redirect: function(model) {
    console.log('model', model);
    this.transitionTo('user', model.username);
  }
});

Dig.TagsRoute = Em.Route.extend({
  model: function(params) {
    return (params.tags || '').replace(/ /, ',');
  }
});

Dig.FileRoute = Em.Route.extend({
  model: function(params) {
    var id = params.file_id;
    return $.ajax({
      url: "http://ccmixter.org/api/query?f=json&datasource=uploads&dataview=upload_page&ids=" + id,
      dataType: 'json'
    }).then(function(result) {
      //console.log(result[0]);
      return result[0];
    });
  },

  afterModel: function(model) {
    if (!model) {
      this.transitionTo('index');
    }
    return Em.RSVP.resolve($.ajax({
      url: 'http://ccmixter.org/api/query?datasource=topics&type=review&dataview=rss_20_topics&f=json&upload=' + model.upload_id,
      dataType: 'json'
    })).then(function(reviews) {
      //console.log('reviews', reviews);
      this.controllerFor('file').set('reviews', reviews);
    }.bind(this));
  },

  serialize: function(model) {
    if (model) {
      return {file_id: model.upload_id};
    }
  }
});

Dig.AboutRoute = Em.Route.extend({
  activate: function() {
    this._super();
    window.scrollTo(0,0);
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
  queryParams: 'stype=all&sinced=&lic=open&sort=rank&limit=10&ord=desc&tags=remix'
});

Dig.FreeMusicForYoutubeRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&tags=instrumental&limit=10&ord=desc&lic='
});

Dig.FreeMusicToRemixRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&tags=samples&limit=10&ord=desc&lic='
});

Dig.SafeForCommercialLicensingRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&tags=ccplus&limit=10&ord=desc&lic='
});

Dig.NewRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=date&limit=10&ord=desc&lic='
});

Dig.EditorialPicksRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=date&limit=10&ord=desc&lic=&tags=editorial_pick'
});

Dig.LicenseReadyRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&limit=10&ord=desc&lic=&tags=ccplus'
});

Dig.PellsRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&limit=10&ord=desc&lic=&search_type=any&tags=acapella+acappella&type=any'
});

Dig.SamplesRoute = Dig.ApiRoute.extend({
  queryParams: 'stype=all&sinced=&sort=rank&limit=10&ord=desc&lic=&tags=samples'
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
    },
    didTransition: function(){
      var router = this.router;
      Ember.run.once(function(){
        // Track this pageview with Google analytics
        _gaq.push(['_trackPageview', router.get('url')]);
      });
    },
    recommend: function(id) {
      CCC.recommendId(id);
    }
  }
});
