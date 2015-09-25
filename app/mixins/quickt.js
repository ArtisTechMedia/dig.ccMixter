import Ember from 'ember';

export default Ember.Mixin.create({
  i18n: Ember.inject.service(),
  
/**
  This is "temp" hack fix (that is: until the i18n 
  service changes its internals)
  
  The problem: doing any kind of compile seems to
  happen after the render loop finishes and the template
  is already out the door. 
  
  This is fine for browser, but when hitting the server
  (like googlebot) this leaves critical <h1> and <a> tags
  empty and kills SEO.
  
  By looking up texts that don't need compilation directly
  the text is output right away.
  
  If I knew Ember and rendering process better there may 
  be a away around this, but for now...
  
*/
  qt(lookup) {
    var t = this.get('i18n._locale').translations;
    var str = t[lookup];
    if( str.match(/\{\{/) !== null ) {
      Ember.warn('You called qt() with a text that requires compilation: ' + lookup);
      return this.get('i18n').t(lookup);
    }
    return str;
  }

});
