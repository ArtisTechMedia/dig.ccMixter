import Ember from 'ember';
import LicenseUtils from '../lib/licenses';
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend({
    i18n: Ember.inject.service(),

    icon: 'creative-commons',
    
    _title: t('licenses.title'),
    _byDesc: t('licenses.by'), 
    _byncDesc: t('licenses.by-nc'), 
    _ccplusDesc: t('licenses.ccplus'), 
    _example: t('licenses.example'), 
    _linkToLic: t('licenses.linkToLic'), 

    title: Ember.computed.alias('_title'),
    
    licenseInfo: function() {
        return {
                byLogoURL:   LicenseUtils.logoURLFromAbbr('by-3','big'),
                byncLogoURL: LicenseUtils.logoURLFromAbbr('by-nc-3','big'),
                ccplusLogoURL: LicenseUtils.logoURLFromAbbr('ccplus'),
                ccplusURL: 'http://tunetrack.net/license/ccmixter.org/files/djlang59/37792',
                byURL: 'http://creativecommons.org/licenses/by/3.0/',
                byncURL: 'http://creativecommons.org/licenses/by-nc/3.0/',
                title: this.get('_title'),
                byDesc: this.get('_byDesc'), 
                byncDesc: this.get('_byncDesc'), 
                ccplusDesc: this.get('_ccplusDesc'), 
                example: this.get('_example'), 
                linkToLic: this.get('_linkToLic'), 
            };
        }.property()
        
});
