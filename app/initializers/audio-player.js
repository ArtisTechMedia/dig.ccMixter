/* global Ember  */

import soundManager from 'soundManager';

export function initialize() { 

  if( !Ember.isFastBoot() ) {
    soundManager.setup({
      url: '/soundmanager/swf/',
      debugMode: false
    });
  }
}

export default {
  name: 'audio-player',
  initialize: initialize
};

