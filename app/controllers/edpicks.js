import PageableController from './pageable';
import QuickText from '../mixins/quickt';

export default PageableController.extend( QuickText, {

  icon: 'thumbs-o-up',
  
  title: function() {
    return this.qt('edpicks.title');
  }.property(),
    
});