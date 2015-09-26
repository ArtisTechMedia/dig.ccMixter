/* globals Ember */
import TagUtils from '../lib/tags';
import LicenseUtils from '../lib/licenses';

/**
  Module exists to normalize the wild & crazy results from the query API.
  
  For all models there are some consistent naming (if not always present - sigh):
  
  use .name for printable name
  use .id for Ember model identifying

  This is why for Tag the .id and .name both map to tags_tag
  
  use 'url' for pages that point to ccMixter
  (Except Trackback - the url property points at the original website.)
  
  So all models that represent uploads/media (Upload, Remix, Trackback) have the
  same properties. 
  
  Access properties related to the artist through the artist object on the upload:
  
     upload.name     -> upload_name
     upload.url      -> file_page_url
     upload.artist.name  -> user_real_name
     upload.artist.url   -> artist_page_url
     upload.artist.id  -> user_name
  
  for UploadDetail there is additionally remixes, sources and trackbacks (added 
  in the store)
  
    upload.remixes[0].name
    upload.remixes[0].artist.name
    
    upload.trackbacks[0].name
  
  The audio player will add a .media object that needs to have a .name, .artist.name and 
  .artist.id for the player to display. These are added below in a callback from 
  the player.
  
*/

var Model = Ember.Object.extend({
});

var UploadBasic = Model.extend( {
  nameBinding: 'upload_name',
  urlBinding:  'file_page_url',
  idBinding: 'upload_id',
  
  _artistProperties: function() {
    return {
        upload: this,
        name: 'upload.user_real_name',
      };
  },
  
  _setupArtist: function() {
    this.set( 'artist', reBind( this._artistProperties() ) );
  }.on('init'),
  
});

var Remix  = UploadBasic.extend();
var Source = UploadBasic.extend();

var Trackback = Model.extend( {
  name: function() {
    var name = this.get('pool_item_name') + '';
    if( name.match(/^watch\?/) !== null ) {
      name = 'You Tube Video';
    }
    return name;
  }.property('pool_item_name'),
  
  urlBinding: 'pool_item_url',
  
  embedBinding: 'pool_item_extra.embed',
  typeBinding: 'pool_item_extra.ttype',
  
  _setupArtist: function() {
    this.set('artist', reBind({
      trackback: this,
      name: 'trackback.pool_item_artist'
    }));
  }.on('init'),
});

export var Upload = UploadBasic.extend({

  idBinding: 'upload_id',

  fileInfo: function() {
    var files = this.get('files');
    for( var i = 0; i < files.length; i++ ) {
      if( files[i].file_format_info['media-type'] === "audio" ) {
        return files[i];
      }
    }
  }.property('files'),

  mediaURL: function() {
    return this.get('fplay_url') || this.get('download_url') || this.get('fileInfo.download_url');
  }.property('files'),
  
  mediaTags: function() {
    return {
      name: this.get('name'),
      id: this.get('id'),
      artist: {
          name: this.get('artist.name'),
          id: this.get('artist.id'),
        },
    };
  }.property('files'),
  
  _artistProperties: function() {
    return Ember.merge( this._super(), { id: 'upload.user_name' } );
  },
  
});

var UserBasic = Model.extend( {
  nameBinding: 'user_real_name',
  idBinding: 'user_name',
});

var User = UserBasic.extend( {
  avatarURLBinding: 'user_avatar_url',

  url: function() {
    return this.get('artist_page_url') + '/profile';
  }.property('artist_page_url'),
  
  homepage: function() {
    if( this.get('user_homepage') === this.get('artist_page_url') ) {
      return null;
    }
    return this.get('user_homepage');
  }.property('user_homepage','artist_page_url'),
});

var Detail = Upload.extend( {

  tags: function() {
    return TagUtils.create( { source: this.get('upload_tags') } );
  }.property('upload_tags'),
  
  userTags: function() {
    return TagUtils.create( { source: this.get('upload_extra.usertags') } );
  }.property('upload_extra'),
  
  hasTag: function(tag) {
    return this.get('tags').contains(tag);
  },

  featuring: function() {
    var feat = this.get('upload_extra.featuring');
    if( !feat && this.get('sources') ) {
      var unique = [ ];
      // hello O(n)
      this.get('sources').forEach( f => {
        var name = f.get('artist.name');
        if( !unique.contains(name) ) {
          unique.push(name);
        }
      });
      feat = unique.join(', ');
    }  
    return feat;
  }.property('upload_extra.featuring','remixes'),
  
  // License stuff 
  
  licenseNameBinding: 'license_name',
  licenseURLBinding: 'license_url',
  
  isCCPlus: function() {
    return this.hasTag('ccplus');
  }.property('upload_tags'),

  isOpen: function() {
    return this.hasTag('attribution,cczero');
  }.property('upload_tags'),
  
  licenseLogoURL: function() {
    return LicenseUtils.logoURLFromName( this.get('license_name') );
  }.property('license_name'),
  
  licenseYear: function() {
    return this.get('year') || (this.get('upload_date') || this.get('upload_date_format')).match(/(19|20)[0-9]{2}/)[0];
  }.property(),
  
  purchaseLicenseURL: function() {
    if( this.get('isCCPlus') ) {
      var baseURL = 'http://tunetrack.net/license/';
      return baseURL + this.get('file_page_url').replace('http://', '');
    }
  }.property('file_page_url','isCCPlus'),

  purchaseLogoURL: function() {
    if( this.get('isCCPlus') ) {
      return LicenseUtils.logoURLFromAbbr( 'ccplus' );
    }
  }.property('isCCPlus'),
  
  _artistProperties: function() {
    return Ember.merge( this._super(), { avatarURL: 'upload.user_avatar_url' } );
  },
});

var Tag = Model.extend( {
  idBinding: 'tags_tag',
  nameBinding: 'tags_tag',
  countBinding: 'tags_count'
});

var Topic = Model.extend({
  publishedBinding: 'topic_date',
  idBinding: 'topic_id',
  nameBinding: 'topic_name',
  rawBinding: 'topic_text',
  htmlBinding: 'topic_text_html',
  textBinding: 'topic_text_plain',
});

function reBind(props)
{
  var model = Model.create();
  for( var k in props ) {
    if( typeof props[k] === 'string' ) {
      model.set(k, Ember.computed.alias(props[k]));
    } else {
      model.set(k,props[k]);
    }
  }
  return model;
}


function _serialize(param,model) {
  if( Ember.isArray(param) ) {
    return param.map( o => model.create(o) );
  }
  return model.create(param);
}

var models = {
  remix: Remix,
  trackback: Trackback,
  detail: Detail,
  upload: Upload,
  user: User,
  tag: Tag,
  userBasic: UserBasic,
  source: Source,
  topic: Topic
};

/**
  serialize omnibus function can be called in two ways:
  
  serialize( 'modelname' )
  
    - this returns a function that takes a single argument 
      (perfect for .then() !) that will serialize the incoming
      result(s) in the model specified. If the incoming
      result is an array, each result will be serialized 
      in place.
      
  serialize( objectToSerialize, 'modelname' ) 
  
    - This will perform the serialization immediately
      on the first parameter. If that object is an
      array, it will serialize each item in place
      and return the array.
      
**/
export default function serialize(param,model) {
  if( typeof(model) === 'undefined' ) {
    return result => _serialize(result,models[param]);
  }
  return _serialize(param,models[model]);
}

