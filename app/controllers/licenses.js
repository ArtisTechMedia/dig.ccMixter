import Ember from 'ember';
import QuickText from '../mixins/quickt';

export default Ember.Controller.extend( QuickText, {

  icon: 'creative-commons',
  
  title: function() {
    return this.qt('licenses.title');
  }.property(),
      
});
