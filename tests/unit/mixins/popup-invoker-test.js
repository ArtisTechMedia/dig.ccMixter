import Ember from 'ember';
import PopupInvokerMixin from '../../../mixins/popup-invoker';
import { module, test } from 'qunit';

module('Unit | Mixin | popup invoker');

// Replace this with your real tests.
test('it works', function(assert) {
  var PopupInvokerObject = Ember.Object.extend(PopupInvokerMixin);
  var subject = PopupInvokerObject.create();
  assert.ok(subject);
});
