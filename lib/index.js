var fs = require('fs-extra');
var _ = require('underscore');
var cheerio = require('cheerio');

var ATTRS = {
    BLOCK: 'bem-block',
    ELEMENT: 'bem-element',
    MODIFIER: 'bem-modifier'
};

var utils = {
    trim: function(str){
        if( !str ) { return ''; }
        var whiteSpace = '\s';
        return str.replace(new RegExp('^' + whiteSpace + '+|' + whiteSpace + '+$', 'g'), '');
    },
    normalizeAttr: function(value, opts){
        var attr = utils.trim(value);
        if( !attr && opts.multi ){ return []; }
        if( !attr && !opts.multi ){ return ''; }

        opts = opts || {};

        if( !opts.multi ){
            return attr.split(' ')[0];
        }
        return attr.split(' ');
    },
    updateClassAttr: function($el, classes){
        if( classes.length > 0 ){
            var strClasses = classes.join(' ');

            if( !$el.attribs.class ){
                $el.attribs.class = strClasses;
            }else{
                $el.attribs.class += ' ' + strClasses;
            }
        }
    },
    createClassName: function(params){
        params = params || {};

        if( !params.block ){
            console.log('Error: A block has to be defined.');
            return;
        }

        var className = '';
        var CONFIG = {
            ELEMENT_SEPARATOR: '__',
            MODIFIER_SEPARATOR: '--'
        };

        className = params.block;

        if( params.element ){
            className += CONFIG.ELEMENT_SEPARATOR + params.element;
        }

        if( params.modifier ){
            className += CONFIG.MODIFIER_SEPARATOR + params.modifier;
        }

        return className;
    }
};

function parse(htmlContent, dest){
    var $ = cheerio.load(htmlContent);
    var blocks = $('['+ATTRS.BLOCK+']');

    _.each(blocks, function(block){
        var blockName = utils.normalizeAttr(block.attribs[ATTRS.BLOCK], {multi: false});
        var blockModifiers = utils.normalizeAttr(block.attribs[ATTRS.MODIFIER], {multi: true});
        var blockClasses = [];

        blockClasses.push( utils.createClassName({block: blockName}) );
        
        if( blockModifiers.length > 0 ){
            _.each(blockModifiers, function(modifier){
                blockClasses.push( utils.createClassName({
                    block: blockName,
                    modifier: modifier
                }) );
            });
        }

        utils.updateClassAttr(block, blockClasses);

        delete block.attribs[ATTRS.BLOCK];
        delete block.attribs[ATTRS.MODIFIER];

        var elements = $(block).find('['+ATTRS.ELEMENT+']');

        _.each(elements, function(element){
            var elementName = utils.normalizeAttr(element.attribs[ATTRS.ELEMENT], {multi: false});
            var elementModifiers = utils.normalizeAttr(element.attribs[ATTRS.MODIFIER], {multi: true});
            var elementClasses = [];

            elementClasses.push( utils.createClassName({
                block: blockName,
                element: elementName
            }) );
            
            if( elementModifiers.length > 0 ){
                 _.each(elementModifiers, function(modifier){
                    elementClasses.push( utils.createClassName({
                        block: blockName,
                        element: elementName,
                        modifier: modifier
                    }) );
                });
            }

            utils.updateClassAttr(element, elementClasses);

            delete element.attribs[ATTRS.ELEMENT];
            delete element.attribs[ATTRS.MODIFIER];
        });
    });

    return $.html();
}

module.exports = {
    parse: parse
};