import Ember from 'ember';

export function mp(params/*, hash*/) {
  return params && Ember.isArray(params) ? params.join('.') : undefined;
}

export default Ember.Helper.helper(mp);
