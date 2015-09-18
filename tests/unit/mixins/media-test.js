import Ember from 'ember';
import MediaMixin from '../../../mixins/media';
import { module, test } from 'qunit';

module('Unit | Mixin | media');

// Replace this with your real tests.
test('it works', function(assert) {
  var MediaObject = Ember.Object.extend(MediaMixin);
  var subject = MediaObject.create();
  assert.ok(subject);
});
