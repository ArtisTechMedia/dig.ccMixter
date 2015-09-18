import Ember from 'ember';
import TagUtils from '../lib/tags';

var QueryOption = Ember.Object.extend({

    // the name to use in the template
    name: '',          
    
    // the actual value to use if other than the value 
    // e.g. recent is a boolean, but the model is
    //      what is passed to 'sinced' like '3 months ago'
    model: undefined,  
    
    // system default
    defaultValue: '',
    
    // automatically update the outgoing corresponding
    // Query API value - if you handle this elsewhere
    // like searchText then set this to false
    updatesParams: true,
    
    // Use the value in the option even if the user
    // has closed the options UI. 
    alwaysHonor: false,
    
    // The corresponding Query API parameter to use
    // when generating 
    queryParam: '',

    // serialize this option to a valid Query API param
    convertToQueryParam: function(qparams,service,value) { 
        if( this.queryParam && value ) {
            value = this.model || value; 
            if( this.queryParam === 'tags' ) {
                qparams.tags = service._tags.add( value ).toString();
            } else {
                    qparams[this.queryParam] = value;
            }
        }
    }
});

var optionsMeta = [
        QueryOption.create( { name: 'searchText' ,
                              updatesParams: false } ),
        QueryOption.create( { name: 'licenseScheme',
                              defaultValue: 'all',
                              queryParam: 'lic' }),
        QueryOption.create( { name: 'limit',
                              alwaysHonor: true,
                              defaultValue: 10,
                              queryParam: 'limit' }),
        QueryOption.create( { name: 'genre',                            
                              defaultValue: '*',
                              queryParam: 'tags' }),
        QueryOption.create( { name: 'extraTags',                            
                              defaultValue: '*',
                              queryParam: 'tags' }),
        QueryOption.create( { name: 'digDeep',                            
                              defaultValue: true,
                              queryParam: '' }),
        QueryOption.create( { name: 'instrumentalOnly',
                              defaultValue: false,
                              queryParam: 'tags',
                              model: 'instrumental,-vocals,-male_vocals,-female_vocals' } ),
        QueryOption.create( { name: 'recent',
                              defaultValue: false,
                              queryParam: 'sinced',
                              model: '3 months ago' } ),
        QueryOption.create( { name: 'matchAnyTags',
                              defaultValue: false,
                              queryParam: 'type',
                              model: 'any' } ),
    ]; 
    
/**
    Templates are bound to variables on this service:
    
        ````{{input type="checkbox" value=queryOptions.recent ...
        
    When the user changes one, this service updates the queryParams
    property (which is Query API ready) and fires a 'optionsChanged' event 
    with the name and new value:
    
        optChanged: function(optName,newValue) {
            ...
        }.on('queryParams.optionsChanged'),
    
    For routes that want to own the options call 'setBatch()' which
    returns a Query API ready hash 
    
*/
export default Ember.Service.extend(Ember.Evented, {

    userEditing: false,
    hidden: { },

    /**
        This method is a little swiss-army-knife-ish.
        
        Call from route:model to:
        
            - alert the system what query options this route
              wants to own and therefore hide from the user
              
            - get back a Query API hash of options
            
        Also:
            - Triggers a 'optionBarChange' event with
              a hash of what to hide and what to show.
              
        In Addition:
            - bwahahahaha
            - I'm so proud
        
    */
    setBatch: function(routeName,  routeValues) {

        var props = Ember.merge({},routeValues);
        
        var honor = (routeName === this._prevRouteName);
        var hidden = { };
        
        this._forEachUpdatingOption(  opt => { 
            var hide = true;
            if( typeof(props[opt.name]) === 'undefined' ) {
                props[opt.name] = this._setHonorable(opt,honor);
                hide = false;
            }
            hidden[opt.name] = hide;
        });        

        var optionsBarHasChanged = false;
        for( var k in hidden ) {
            if( this.get('hidden.' + k) !== hidden[k] ) {
                optionsBarHasChanged = true;
                break;
            }
        }
        if( optionsBarHasChanged ) {
            this.trigger('optionBarChanged',hidden);
        }
        
        this._prevRouteName = routeName;
            
        return this.convertToQueryParams(props);
    },

    convertToQueryParams: function(routeValues) {
        var queryParams = { };
        this._tags.clear(); 
        
        this._forEachUpdatingOption( opt => {
            var value = routeValues[opt.name];
            if( typeof value !== 'undefined' ) {
                opt.convertToQueryParam(queryParams,this,value);
            }
        });
        
        return queryParams;
    },
    
    _options: [ ],
    _optionsMeta: Ember.Object.create(),
    _prevRouteName: '',
        
    _tags: TagUtils.create(),

    _setupOptions: function() {    
        optionsMeta.forEach( optMeta => {
            var name = optMeta.get('name');
            this._options.push(name);
            this._optionsMeta.set(name,optMeta);
            this.set(name, optMeta.get('defaultValue'));
            if( optMeta.updatesParams ) {
                this.addObserver(name,this,this._optionChanged);
            }
        });
    }.on('init'),
    
    _setHonorable: function(opt, allowValue) {
        var value = opt.get('defaultValue');
        if( !(allowValue || opt.alwaysHonor) && (this.get(opt.name) !== value) ) {
            this._ignoreChange = true;
            this.set(opt.name, value);
            this._ignoreChange = false;
        }
        return this.get(opt.name);
    },
    
    _optionChanged: function(me,key,value) {
        if( !this._ignoreChange ) {
            this.trigger('optionsChanged',key,value);
        }
    },

    _ignoreChange: false,
        
    _forEachUpdatingOption: function( callback ) {            
        this._options.forEach( oName => {
            if( this._optionsMeta[oName].updatesParams ) {
                callback.call(this,this._optionsMeta[oName]);
            }
        });
    },
    
});
    
