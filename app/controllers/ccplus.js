import PageableController from './pageable';
import QuickText from '../mixins/quickt';

export default PageableController.extend( QuickText, {
  
  icon: 'usd',
  
  title: function() {
    return this.qt( 'ccplus.title' );
  }.property(),
  
});
