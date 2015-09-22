import Ember from 'ember';
import QuicktMixin from '../../../mixins/quickt';
import { module, test } from 'qunit';

module('Unit | Mixin | quickt');

// Replace this with your real tests.
test('it works', function(assert) {
  var QuicktObject = Ember.Object.extend(QuicktMixin);
  var subject = QuicktObject.create();
  assert.ok(subject);
});
