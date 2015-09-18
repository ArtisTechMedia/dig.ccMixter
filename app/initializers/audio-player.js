/* global FastBoot  */

import soundManager from 'soundManager';

export function initialize() { 

    if( typeof FastBoot === 'undefined' ) {
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

