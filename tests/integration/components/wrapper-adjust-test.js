import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('wrapper-adjust', 'Integration | Component | wrapper adjust', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wrapper-adjust}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#wrapper-adjust}}
      template block text
    {{/wrapper-adjust}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
