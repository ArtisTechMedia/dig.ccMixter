import Ember from 'ember';

export function isOr([lhs, rhs]) {
  return lhs || rhs;
}


export default Ember.Helper.helper(isOr);
