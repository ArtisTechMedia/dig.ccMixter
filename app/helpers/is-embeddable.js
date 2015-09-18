import Ember from 'ember';

export function isEmbeddable([text]) {
    if( text ) {
        text = text.string || text;
        return (typeof(text) === 'string') && text.match(/^</) !== null;
    }
}

export default Ember.Helper.helper(isEmbeddable);
