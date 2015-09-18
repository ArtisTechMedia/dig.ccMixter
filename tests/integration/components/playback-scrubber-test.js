import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('playback-scrubber', 'Integration | Component | playback scrubber', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{playback-scrubber}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#playback-scrubber}}
      template block text
    {{/playback-scrubber}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
