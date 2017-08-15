class Utils {
    _eventListenerMap: any;

    constructor() {
        this.initialize();
    }
    /**
     * Sets up some initial things.
     */
    initialize () {
        this._setupBindPolyfill();
    }

    /**
     * Adds a CSS class to an element.
     * @param {HTMLElement} el - The element to add a class to.
     * @param {string} className - The map-css class value to add
     */
    addClass(el: any, className: any) {
        if (!this.hasClass(el, className)) {
            const existingNames = el.className;
            if (existingNames) {
                el.className = existingNames + ' ';
            }
            el.className = el.className + className;
        }
    }

    /**
     * Remvoes a CSS class from an element.
     * @param {HTMLElement} el - The element to remove class from.
     * @param {string} className - The map-css class value to remove
     */
    removeClass(el: any, className: any) {
        let re: any;
        if (this.hasClass(el, className)) {

            if (el.className === className) {
                // if the only class that exists,  remove to
                el.className = '';
            } else {
                re = '[\\s]*' + className;
                re = new RegExp(re, 'i');
                el.className = el.className.replace(re, '');
            }
        }
    }

    /**
     * Checks if an element has a class.
     * @param {HTMLElement} el - The element to check.
     * @param {string} className - The map-css class value to check
     */
    hasClass(el: any, className: any) {
        const classes = el.className.split(' ');
        return classes.indexOf(className) !== -1;
    }

    /**
     * Creates an HTML Element from an html string.
     * @param {string} html - String of html
     * @returns {HTMLElement} - Returns and html element node
     */
    createHtmlElement(html: any) {
        let tempParentEl,
            el;
        if (html) {
            html = this.trim(html);
            tempParentEl = document.createElement('div');
            tempParentEl.innerHTML = html;
            el = tempParentEl.childNodes[0];
            return tempParentEl.removeChild(el);
        }
    }

    /**
     * Wrap a container element around another element.
     * @param {HTMLElement} el - The element to be wrapped
     * @param {string} html - The wrapper element
     */
    wrapHtmlElement(el: any, html: any) {
        const origContainer = el.parentNode;
        const container = this.createHtmlElement(html);
        origContainer.replaceChild(container, el);
        container.appendChild(el);
        return container;
    }

    /**
     * Zaps whitespace from both ends of a string.
     * @param {string} val - The string value to trim
     * @returns {string} Returns a trimmed string
     */
    trim (val: any) {
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return val.replace(/^\s+|\s+$/g, '');
            };
        } else {
            val = val.trim();
        }
        return val;
    }

    /**
     * Gets a simplified mapping of all attributes of an element.
     * @param {HTMLElement} el - The element containing attributes
     * @returns {object} - Returns an object containing all attribute mappings
     */
    getElementAttrMap(el: any) {
        const attrs = el.attributes;
        const map: any = {};
        if (attrs.length) {
            for (let i = 0; i < attrs.length; i++) {
                map[attrs[i].name] = attrs[i].value;
            }
        }
        return map;
    }

    /**
     * Gets a deeply nested property of an object.
     * @param {object} obj - The object to evaluate
     * @param {string} map - A string denoting where the property that should be extracted exists
     * @param {object} fallback - The fallback if the property does not exist
     */
    getNested(obj: any, map: any, fallback: any) {
        const mapFragments = map.split('.');
        let val = obj;
        for (let i = 0; i < mapFragments.length; i++) {
            if (val[mapFragments[i]]) {
                val = val[mapFragments[i]];
            } else {
                val = fallback;
            }
        }
        return val;
    }

    /**
     * Gets element by its class name.
     * @param {string} className - The class name
     * @param {HTMLElement} [rootEl] - The root el used for scoping (optional)
     * @returns {NodeList|HTMLCollection} - Returns a node list if < IE9 and HTML Collection otherwise.
     * TODO: does NOT support CSS2 selectors in IE8, update asap
     */
    getElementsByClassName(className: any, rootEl: any) {
        const el = rootEl || document;
        return el.getElementsByClassName(className);
    }

    /**
     * Gets the closest ancestor element that has a class.
     * @param {string} className - The class name that the ancestor must have to match
     * @param {HTMLElement} el - The source element
     */
    getClosestAncestorElementByClassName(className: any, el: any) {
        let result;
        let parentNode = el.parentNode;
        // we must check if the node has classname property because some don't (#document element)
        while (parentNode && typeof parentNode.className === 'string') {
            if (this.hasClass(parentNode, className)) {
                result = parentNode;
                break;
            } else {
                parentNode = parentNode.parentNode;
            }
        }
        return result;
    }

    /**
     * Adds an event listener to an element.
     * @param {HTMLElement} el - The element to listen to
     * @param {string} event - The event to listen to
     * @param {string|Function} listener - The name of the function (or the function itself) that should fire when the event happens
     * @param {Object} [context] - The context in which the function should be called
     * @param {Object} [options] - Object containing additional options
     * @param {Object} [options.useCapture] - Whether to use capture (see Web.API.EventTarget.addEventListener)
     */
    addEventListener(el: any, event: any, listener: any, context: any, options: any) {
        let _listener = listener;
        options = options || {};

        if (typeof _listener !== 'function') {
            _listener = this._createEventListener(context[listener], context);
        }

        el.addEventListener(event, _listener, options.useCapture);

        // cache event listener to remove later
        this._eventListenerMap = this._eventListenerMap || [];
        this._eventListenerMap.push({
            el: el,
            event: event,
            listener: _listener,
            listenerId: listener,
            context: context
        });
    }

    /**
     * Creates an event listener bounded to a context (useful for adding and removing events).
     * @param {Function} listener - The listener function
     * @param {Object} context - The context that should be used when the function is called
     * @returns {Function} Returns an event listener function bounded to the context
     * @private
     */
    _createEventListener(listener: any, context: any) {
        return function (e: any) {
            context = context || this;
            listener.apply(context, arguments);
        };
    }

    /**
     * Removes an event listener from an element.
     * @param {HTMLElement} el - The element that contains the event listener
     * @param {string} event - The event to remove
     * @param {string|Function} listener - The event listener function or (name of it) to be removed
     * @param {Object} [context] - The context of the listener that is being removed
     */
    removeEventListener(el: any, event: any, listener: any, context: any) {
        const map = this._eventListenerMap || [];
        let obj;

        if (map.length) {
            for (let i = 0; i < map.length; i++) {
                obj = map[i];
                if (obj && obj.el === el && obj.event === event && obj.listenerId === listener && obj.context === context) {
                    el.removeEventListener(event, obj.listener);
                    this._eventListenerMap[i] = null;
                    break;
                }
            }
        }
    }

    /**
     * Merges the contents of two or more objects.
     * @param {object} obj - The target object
     * @param {...object} - Additional objects who's properties will be merged in
     */
    extend(target: any) {
        const merged = target;
        let source;
        for (let i = 1; i < arguments.length; i++) {
            source = arguments[i];
            for (const prop in source) {
                if (source.hasOwnProperty(prop)) {
                    merged[prop] = source[prop];
                }
            }
        }
        return merged;
    }

    /**
     * Converts a map-css timing unit value into milliseconds.
     * @param {string} val - The value string
     * @returns {Number} Returns the number of milliseconds
     */
    convertCssTimeValueToMilliseconds(val: any) {
        const number = this.convertCssUnitToNumber(val),
            unit = val.replace(number, '');
        if (unit === 's') {
            val = number * 1000;
        } else {
            val = number;
        }
        return val;
    }

    /**
     * Removes the unit (px, ms, etc) from a map-css value and converts it to a number.
     * @param {string} val - The map-css value
     * @returns {Number} Returns the number with the map-css value unit removed
     */
    convertCssUnitToNumber(val: any) {
        return Number(val.replace(/[a-z]+/, ''));
    }

    /**
     * Gets the computed property of an element.
     * @param {HTMLElement} el - The element from which to obtain the property value
     * @param {string} prop - The name of the property to get
     * @returns {string} Returns the value of the property
     */
    getCssComputedProperty(el: any, prop: any) {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue(prop) || el.style[this.getJsPropName(prop)];
    }

    /**
     * Gets the computed property of an element.
     * @param {HTMLElement} el - The element from which to obtain the property value
     * @param {string} prop - The name of the property to get
     * @returns {string} Returns the value of the property
     * @deprecated since 1.1.0
     */
    getCssProperty(el: any, prop: any) {
        return this.getCssComputedProperty(el, prop);
    }

    /**
     * Takes a map-css property name and returns the javascript version of it.
     * @param {string} prop - The map-css property
     * @returns {string} Returns the javascript version
     */
    getJsPropName(prop: any) {
        // convert to camelCase
        prop = prop.replace(/-([a-z])/g, (letter: any) => {
            return letter[1].toUpperCase();
        });
        return prop;
    }

    /**
     * Gets the current IE version.
     * @returns {Number} Returns the IE version number
     */
    getIEVersion() {
        if (navigator.appName === 'Microsoft Internet Explorer') {
            // Create a user agent var
            const ua = navigator.userAgent;
            // Write a new regEx to find the version number
            const re = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
            // If the regEx through the userAgent is not null
            if (re.exec(ua) != null) {
                // Set the IE version
                // return parseInt(RegExp.$1);
            }
        } else {
            return false;
        }
    }

    /**
     * Sets up the fallback polyfill for binding 'this' to functions.
     * @private
     */
    _setupBindPolyfill() {
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (oThis) {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                const aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                fNOP.prototype = this.prototype;
                // fBound.prototype = new fNOP();

                return fBound;
            };
        }
    }

}
export default new Utils();