// Sizzle engine here. Removed for readability

var Utils = (function () {
    function Utils() {
    }
    Utils.isString = function (value) {
        return typeof value === 'string';
    };
    Utils.isNumber = function (value) {
        return typeof value === 'number';
    };
    Utils.isObject = function (obj) {
        return typeof obj === 'object';
    };
    Utils.isArray = function (array) {
        return array instanceof Array;
    };
    Utils.isFunction = function (obj) {
        return typeof obj === 'function';
    };
    Utils.hasOwn = function (prop, obj) {
        return obj.hasOwnProperty(prop);
    };
    Utils.each = function (array, callback) {
        if (!Utils.isArray(array) || !Utils.isFunction(callback)) {
            return null;
        }
        if (Array.prototype.forEach) {
            Array.prototype.forEach.call(array, callback);
        }
        else {
            var index = -1, length = array.length;
            while (++index < length) {
                callback.call(array, array[index], index, array);
            }
        }
    };
    /**
     *
     * @param {object} element the domElement
     * @param {string} property the property whose value is required. Should be valid CSS property
     */
    Utils.getStyle = function (element, property) {
        if (element.currentStyle) {
            return element.currentStyle[property];
        }
        else {
            return window.getComputedStyle(element, null).getPropertyValue(property);
        }
    };
    /**
     *
     * @param {HTMLElement} ele
     * @param {object} properties css properties to set
     */
    Utils.css = function (ele, properties) {
        if (!ele) {
            return null;
        }
        // Propperties should be object
        if (properties && !Utils.isObject(properties)) {
            return null;
        }
        if (properties && Utils.isString(properties)) {
            return Utils.getStyle(ele, properties);
        }
        var property;
        for (property in properties) {
            if (Utils.hasOwn(property, properties)) {
                ele.style[property] = properties[property];
            }
        }
    };
    return Utils;
}());
var Dom = (function () {
    function Dom(selector, context) {
        this.init(selector, context);
    }
    /**
     *
     * @param {string} selector  the selector form the dom tagName, className or id or any css Selector
     * @param {object} context
     */
    Dom.prototype.init = function (selector, context) {
        if (!Utils.isString(selector)) {
            return 0;
        }
        switch (selector) {
            case 'window':
                this.element = window;
                break;
            case 'document':
                this.element = window.document;
                break;
            default:
                var element = Sizzle(selector, context);
                this.length = element.length;
                this.element = this.length > 1 ? element : element[0];
                break;
        }
    };
    /**
     * @returns the first element from the collection if any
     */
    Dom.prototype.getFirst = function () {
        return this.length > 1 ? this.element[0] : this.element;
    };
    /**
     * @returns the top and left position of the dom element
     */
    Dom.prototype.position = function () {
        var element = this.getFirst();
        if (!element) {
            return null;
        }
        if (!element.getClientRects().length) {
            return {
                top: 0,
                left: 0
            };
        }
        var rect = element.getBoundingClientRect();
        var win = element.ownerDocument.defaultView;
        return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
        };
    };
    /**
     *
     * @param {number}value  to set the width of first element of collection
     */
    Dom.prototype.width = function (value) {
        var ele = this.getFirst();
        if (value && Utils.isNumber(value)) {
            Utils.css(ele, { width: value + 'px' });
            return this;
        }
        return parseFloat(Utils.getStyle(ele, 'width')) + parseFloat(Utils.getStyle(ele, 'padding-left')) + parseFloat(Utils.getStyle(ele, 'padding-right'));
    };
    /**
     *
     * @param {string}value same as width
     */
    Dom.prototype.height = function (value) {
        var ele = this.getFirst();
        if (value && Utils.isNumber(value)) {
            Utils.css(ele, { height: value + 'px' });
            return this;
        }
        return parseFloat(Utils.getStyle(ele, 'height')) + parseFloat(Utils.getStyle(ele, 'padding-top')) + parseFloat(Utils.getStyle(ele, 'padding-bottom'));
    };
    /**
     * @returns every dom element selected
     */
    Dom.prototype.each = function (callback) {
        Utils.each(this.element, callback);
    };
    /**
     *
     * @param {object|string} properties if string gets the css property else sets the css properties given in key-value pair
     */
    Dom.prototype.css = function (properties) {
        if (properties && Utils.isString(properties)) {
            switch (properties) {
                case 'width':
                    return this.width() + 'px';
                case 'height':
                    return this.height() + 'px';
                default:
                    return Utils.getStyle(this.getFirst(), properties);
            }
        }
        var _loop_1 = function (property) {
            if (this_1.length > 1) {
                this_1.each(function (ele) {
                    ele.style[property] = properties[property];
                });
            }
            else {
                this_1.element.style[property] = properties[property];
            }
        };
        var this_1 = this;
        for (var property in properties) {
            _loop_1(property);
        }
        return this;
    };
    Dom.prototype.log = function () {
        console.log(this);
    };
    return Dom;
}());
var dom = function (selector, context) {
    return new Dom(selector, context);
};
