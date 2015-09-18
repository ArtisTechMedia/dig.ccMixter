import Ember from 'ember';


/* 
not here 
by-nc-nd-3.png
by-nc-nd.png
by-nd-3.png
by-nd.png
pd.png
sampling.png
*/
// 

var logoURLBase = "https://licensebuttons.net/l/";

var logoSize = {
    small: '80x15',
    big: '88x31'
};

var  licNameMap = {
    'attribution-(3.0)': 'by-3',
    'attribution-noncommercial--(3.0)': 'by-nc-3',
    'attribution-noncommercial-share-alike--(3.0)': 'by-nc-sa-3',
    'attribution-noncommercial-share-alike': 'by-nc-sa',
    'attribution-noncommercial': 'by-nc',
    'attribution-share-alike--(3.0)': 'by-sa-3',
    'attribution-share-alike': 'by-sa',
    'attribution': 'by',
    'cc0-(cc-zero)': 'zero',
    'noncommercial-sampling-plus': 'nc-sampling+',
    'sampling-plus': 'sampling+',
};

var LicenseUtils = Ember.Object.extend({
});

LicenseUtils.reopenClass({

    logoURLFromName: function(name, size) {
        return LicenseUtils.logoURLFromAbbr( licNameMap[ name.dasherize() ], size );
    },
    
    logoURLFromAbbr: function( abbr, size ) {
        if( abbr === 'ccplus' ) {
            return '/dig-images/cc-plus-tunetrack.png';
        }
        var version = abbr.match(/-3/) ? '3.0' : '1.0';
        size = logoSize[ size || 'big' ];        
        return logoURLBase + abbr.replace(/-3/,'') + '/' + version + '/' + size + '.png';
    }
});

export default LicenseUtils;

