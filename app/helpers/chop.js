import Ember from 'ember';

export function chop([text,count]) {

    if( text ) {
        text = text.string || text;
        if( text.length > count ) {
            return text.substr(0,count) + '...';
        }
    }
    return text;
}

export default Ember.Helper.helper(chop);
