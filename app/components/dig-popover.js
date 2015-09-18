import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    className: 'hidden',
    hasElement: false,
      
    _modelWatcher: function() {
        // only show a popover on the first page of a query
        // when the user is at ?offset=n they have already
        // seen it
        if( Ember.isFastBoot() || !this.hasElement || this.get('offset') ) {
            return;
        }

        var key = '[data-popover-host="' + this.get('model.id') + '"]';
        var $host = Ember.$(key);
        if( this.get('model') ) {
            key = '[data-popover-content="' + this.get('model.id') + '"]';
            var content = Ember.$(key).html();
            var title = this.get('model.name') + '<button class="close" data-dig-popover-close="x">&times;</button>';
            try {
                $host.data('bs.popover').options.content = content;
                $host.data('bs.popover').options.title = title;
                $host.popover('show');
            } catch(e) {
                var opts = {
                        title: title,
                        placement: this.get('model.placement'),
                        html: true,
                        trigger: 'click',
                        content: content,
                };
                $host.popover(opts).popover('show');
            }

        } else {
            $host.popover('hide');
        }
    }.observes('model'),

    didInsertElement() {
        this.hasElement = true;
        Ember.run.next(this,this._modelWatcher);
    },
    
    
});
