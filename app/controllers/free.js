import PageableController from './pageable';
import QuickText from '../mixins/quickt';

export default PageableController.extend( QuickText, {
  
  icon: 'beer',
  
  title: function() {
    return this.qt( 'free.title' );
  }.property(),
  
});
