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
        QueryOption.create( { name: 'instrumentalOnly',
                              defaultValue: false,
                              queryParam: 'tags',
                              model: 'instrumental,-vocals,-male_vocals,-female_vocals' } ),
        QueryOption.create( { name: 'recent',
                              defaultValue: false,
                              queryParam: 'sinced',
                              model: '3 months ago' } ),
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
    
    For routes that want to populate the options call 'setBatch()' which
    returns a Query API ready hash 
    
*/
export default Ember.Service.extend(Ember.Evented, {

    userEditing: false,
    hidden: { },

    setBatch: function( routeName,  routeValues) {
        var queryParams = { };
        this._tags.clear(); 

        // update the UI but don't trigger
        // events to the internal app
        this._ignoreChange = true;
        this._forEachUpdatingOption(  opt => {           
            if( typeof routeValues[opt.name] !== 'undefined' ) {
                this.set(opt.name,routeValues[opt.name]);
            }
            opt.convertToQueryParam(queryParams,this,this.get(opt.name));
        });        
        this._ignoreChange = false;
            
        return queryParams;
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
        
        if( 'tags' in queryParams && !queryParams.tags ) {
          delete queryParams['tags'];
        }
        return queryParams;
    },
    
    _options: [ ],
    _optionsMeta: Ember.Object.create(),
        
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
    
