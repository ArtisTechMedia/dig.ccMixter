import Ember from 'ember';
import QuickText from '../mixins/quickt';

export default Ember.Helper.extend( QuickText, {  
  compute: function([lookup]) {  
    return this.qt(lookup);  
  }
});