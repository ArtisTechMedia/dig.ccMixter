import Ember from 'ember';

function fakeurl() {
  return 'script';
}
const QueryOptComponent = Ember.Component.extend({
  queryOptions: Ember.inject.service(),
  attributeBindings: [ 'href' ],
  href: 'java' + fakeurl() + '://',
  tagName: 'a',
  
  displayText: function() {
    return this.get('text') || this.get('val');
  }.property('value','text'),
  
  click: function() {
    this.set('queryOptions.' + this.get('opt'), this.get('val') );
  },
  
  optionChanged: function() {
    var optName = this.get('opt');
    var val     = this.get('val');
    var qVal    = this.get( 'queryOptions.' + optName );
    
    Ember.$(this.element).toggleClass('active', qVal === val);
  },
  
  didInsertElement: function() {
    if( this.get('activate') && !Ember.isFastBoot()) {
      this.get('queryOptions').addObserver(this.get('opt'),this,this.optionChanged);
      Ember.run.next(this,this.optionChanged);
    }
  },
});

QueryOptComponent.reopenClass({
  positionalParams: ['opt', 'val', 'text']
});

export default QueryOptComponent;