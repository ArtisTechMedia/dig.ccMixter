import Ember from 'ember';
/**
    Manipulate tags with ccHost policies in mind

    tag              := ascii alphanumeric and underscore
    tag string       := tags is separated by commas possibly with commas at the
                         start and end of string   
    tag parameter    := can be any one of: 
                            tag string
                            array
                            instance of TagUtils

    Class ensure unique (unordered) values.

    All (most?) parameters are flexible enough to accept strings, arrays or 
    instances of TagUtils. HOWEVER note that all methods assume that the 
    instance running the method vs.the parameter(s) passed in use the exact
    same rules for invalid, ignoring tags and separator.
    
    If you need to combine or operate with two different set of rules then
    only use instances of TagUtils and then assume that the instance running
    the methods owns the final outcome.
    
    Creation options are:
        - source     initial tags
        - ignore:    a RegExp of tags to ignore. By default the tag 'all' 
        - invalid:   a RegExp of characters that are not allowed in tags. By 
                     default [^a-zA-Z0-9_]
        - separator: for when splitting incoming strings and building
                     serialized strings. Default is comma ','
                      
    Examples:     
    
        var tags1 = TagUtils.create( { source: 'foo,bar' } );
        
        var tags2 = TagUtils.create( { source: [ 'fee', 'fie' ] } );
        
        var tags3 = TagUtils.create( { source: tags2 } );
        
        tags2.add(tags1);  // fee,fie,foo,bar
        tags2.toggle( ['fie','foo'], false ); // fee,bar
        tags3.remove('fee'); // fie
        
        
        var tags = TagUtils.combine(tags1, 'hip_hop,remix'); // 'foo,bar,hip_hop,remix'
*/
var TagUtils = Ember.Object.extend({

    _tagsArray: [ ],
    ignore: /^(\*|all)$/,
    invalid: /[^-a-zA-Z0-9_]/,
    separator: ',',
    
    init: function() {
        this._super(...arguments);
        var src = this.get('source');
        var arr = [ ];
        if( src ) {
            arr = this.toArray(src);
        }
        this.set( '_tagsArray', arr );
    },


    add: function(tag) {
            var ignore = this.get('ignore');
            var invalid = this.get('invalid');
            var arr = this.get('_tagsArray');
            function safeAddTag(tag) {
                tag += ''; // stringize
                if( tag && 
                    tag.match(ignore) === null &&
                    tag.match(invalid) === null && 
                    !arr.contains(tag) ) 
                {
                    arr.pushObject(tag);
                }
            }
            
            this.toArray(tag).forEach( safeAddTag );
            return this;
        },
        
    remove: function(tag) {
            var arr = this.get('_tagsArray');
            function safeRemove(tag) {
                if( arr.contains(tag) ) {
                    arr.removeObject(tag);
                }
            }
            this.toArray(tag).forEach( safeRemove );
            return this;
        },    
        
    replace: function(replaceThisSource,withThisSource) {
            if( replaceThisSource && (replaceThisSource !== withThisSource) ) {
                this.remove(replaceThisSource);
            }
            this.add(withThisSource);
            return this;
        },
        
    removeAll: function() {
            this.set('_tagsArray',[ ]);
            return this;
        },
        
    clear: function() {
            return this.removeAll();
        },
        
    toggle: function(tag,flag) {
            if( flag ) {
                this.add(tag);
            } else {
                this.remove(tag);
            }
            return this;
        },
        
    contains: function(tag) {      
        var srcArr = this.get('_tagsArray');
        return this.toArray(tag).find( function(tag) {
                return srcArr.contains(tag);
            });
        },
        
    intersection: function(other) {
        function getIntersect(arr1, arr2) {
            var r = [], o = {}, l = arr2.length, i, v;
            for (i = 0; i < l; i++) {
                    o[arr2[i]] = true;
                }
            l = arr1.length;
            for (i = 0; i < l; i++) {
                v = arr1[i];
                if (v in o) {
                    r.push(v);
                }
            }
            return r;
        }    
        var opts = this.get('options');
        opts.source = getIntersect(this.get('_tagsArray').slice(),this.toArray(other));
        return TagUtils.create(opts);
    },

    options: function(){
        return {
            ignore: this.get('ignore'),
            invalid: this.get('invalid'),
            separator: this.get('separator')
        };
    }.property('ignore','invalid','separator'),
        
    length: function() {
        return this.get('_tagsArray').length;
    }.property('_tagsArray'),
    
    toString: function() {
            var tagArr = this.get('_tagsArray');
            if( tagArr.length > 0 ) {
                return tagArr.join(this.get('separator'));
            }
            return '';
        },

    forEach: function(callback,context) {
        this.get('_tagsArray').forEach(callback,context || this);
        return this;
    },
        
    map: function(callback,context) {
        return this.get('_tagsArray').map(callback,context || this);
    },
    
    toArray: function(source) {
            if( !source ) {
                return [ ];
            }
            var arr = null;
            if( typeof(source) === 'string' ) {
                if( source.match(this.get('ignore')) ) {
                    return [ ];
                }
                // still not 100% because '-'
                var r = new RegExp(this.get('separator'),'g');
                arr = source.replace(r,' ').w();
            } else if( Ember.isArray(source) ) {
                arr = source.slice();                
            } else if( source && source.hasOwnProperty('_tagsArray') ) {
                arr = source.get('_tagsArray').slice();                
            } else {
                arr = [ ];
            }
            return arr;
    },
        
});

TagUtils.reopenClass({

    combine: function(tags1,tags2,opts) {
            if( !tags1 ) {
                return tags2;
            }
            if( tags2 ) {
                opts = Ember.merge( { source: tags1 }, opts || { } );
                return TagUtils.create(opts).add(tags2).toString();
            }
            return tags1;
        },

    contains: function(source,tag,opts) {
        opts = Ember.merge( { source: source }, opts || { } );
        return TagUtils.create(opts).contains(tag);
    },        
    
    toArray: function(source,opts) {
        opts = Ember.merge( { source: source }, opts || { } );
        return TagUtils.create( opts ).get('_tagsArray');
    },
    
    forEach: function(source,callback,context,opts) {
        opts = Ember.merge( { source: source }, opts || { } );
        return TagUtils.create( opts ).forEach(callback,context);
    }
});

String.prototype.tagize = function(pretty) {
    var tu = TagUtils.create( { source: this } );
    var str = tu.toString();
    if( pretty ) {
        var rx = new RegExp(tu.separator,'g');
        str = str.replace(rx,tu.separator + ' ');
    }
    return str;
};


export default TagUtils;