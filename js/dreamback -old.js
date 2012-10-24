// 何世孟 heshimeng1987@qq.com
(function (window, undefined) {

    var dream = function (elements) {
            return new dreamback(elements || []);
        },
        document = window.document,
        push = Array.prototype.push,
        slice = Array.prototype.slice;

    function dreamback(elements) {
        this.length = 0; // for ie6,7
        push.apply(this, dream.selector(elements)); //result this == elements 
    };
    //实例方法
    dreamback.prototype = {
        each: function (fn, args) {
            return dream.each(this, fn, args);
        },
        getStyle: function (name) {
            return dream.getStyle(this[0], name);
        },
        setStyle: function (style, value) {
            dream.setStyle(this, style, value);
            return this;
        },
        css: function (style, value) {
            if (arguments.length === 1 && typeof style == 'string') {
                return this.getStyle(style);
            } else {
                return this.setStyle(style, value);
            }
        },
        size: function () {
            return dream.size(this);
        },
        children: function () {
            return new dreamback(dream.children(this[0]));
        },
        parent: function () {
            return new dreamback(dream.parent(this[0]));
        },
        siblings: function () {
            return new dreamback(dream.siblings(this[0]));
        },
        eq: function (index) {
            return new dreamback(this[index]);
        },
        find: function(name){
            return new dreamback(dream.find(name,this[0]));
        },
        addClass: function (className) {
            dream.addClass(this, className);
            return this;
        },
        removeClass: function (className) {
            dream.removeClass(this, className);
            return this;
        },
        remove: function () {
            dream.remove(this);
            return this;
        },
        empty: function () {
            dream.empty(this);
            return this;
        },
        append: function (elem) {
            dream.append(this, elem);
            return this;
        },
        attr: function (name, value) {
            return dream.attr(this, name, value);
        },
        removeAttr: function (name) {
            dream.removeAttr(this, name);
            return this;
        },
        insertHTML: function (html, position) {
            dream.insertHTML(this, html, position);
            return this;
        },
        addEvent: function (type, fn) {
            return this.each(function () {
                dream.addEvent(this, type, fn);
            });
        },
        removeEvent: function (type, fn) {
            return this.each(function () {
                dream.removeEvent(this, type, fn);
            });
        },
        animate: function (style, duration, callBack, tween) {
            return this.each(function () {
                var start = {},
                    alter = {},
                    elem = this;
                dream.each(style, function (key) {
                    start[key] = parseFloat(dream.getStyle(elem, key));
                    alter[key] = this[key] - start[key];
                });
                this.animateTimer && this.animateTimer();
                this.animateTimer = dream.animate(this, start, alter, duration, callBack, tween);
            });
        },
        stop: function () {
            return this.each(function () {
                this.animateTimer && this.animateTimer();
            })
        },
        getElemViewPosition: function () {
            return dream.getElemViewPosition(this[0]);
        },
        getElemPosition: function () {
            return dream.getElemPosition(this[0]);
        }
    };
    /**
     *   静态方法
     */
    dream.extend = function (source) {
        for (var property in source) {
            var copy = source[property];
            if (dream === copy) continue;
            if (typeof copy === "object") {
                dream[property] = arguments.callee(dream[property] || {}, copy); //arguments.callee正被执行的 Function 对象
            } else {
                dream[property] = copy;
            }
        }
    };

    dream.extend({
        each: function (obj, fn, args) {
            if (args) {
                if (obj.length == undefined) {
                    for (var i in obj)
                    fn.apply(obj, args);
                } else {
                    for (var i = 0, ol = obj.length; i < ol; i++) {
                        if (fn.apply(obj, args) === false) break;
                    }
                }
            } else {
                if (obj.length == undefined) {
                    for (var i in obj)
                    fn.call(obj, i, obj);
                } else {
                    for (var i = 0, ol = obj.length, val = obj[0]; i < ol && fn.call(val, i, val) !== false; val = obj[++i]) {}
                }
            }
            return obj;
        },
        camelize: function (s) {
            return s.replace(/-([a-z])/ig, function (all, letter) {
                return letter.toUpperCase();
            });
        },
        getId: function (elem) {
            return document.getElementById(elem);
        },
        getTag: function (name, elem) {
            return (elem || document).getElementsByTagName(name);
        },
        getByClass: function (className, context) {
            context = context || document;
            if (context.getElementsByClassName) {
                return context.getElementsByClassName(className);
            }
            var nodes = context.getElementsByTagName('*'),
                ret = [],
                i = 0,
                len = nodes.length;
            for (; i < len; i++) {
                if (dream.hasClass(nodes[i], className)) ret.push(nodes[i]);
            }
            return ret;
        },
        find: function(name,target){
            if (name.indexOf('#') > -1) {
                return this.getId(name);
            }else if(name.indexOf('.') > -1){
                return this.getByClass(name,target);
            }else{
                return this.getTag(name,target);
            }
        },
        children: function (elem) {
            for (var children = [], child = elem.firstChild; child; child = child.nextSibling) {
                if (child.nodeType == 1) {
                    children.push(child);
                }
            }
            return children;
        },
        parent: function (elem) {
            //parentElement在IE下准确，parentNode在ie下可能不准确
            return elem.parentElement || elem.parentNode || null;
        },
        siblings: function (elem) {
            var curElement = elem,
                siblings = [],
                children = this.children(this.parent(curElement));
            this.each(children, function () {
                if (this !== curElement) {
                    siblings.push(this);
                }
            });
            return siblings;
        },
        selector: function (selectors) {
            var result = [],
                that = this;
            if (!selectors) return result;

            if (typeof selectors == 'string') {
                selectors = selectors.replace(/\s+/g, ' ').split(' ');
                dream.each(selectors, function (i) {
                    if (this.indexOf('#') > -1) {
                        result.push(that.getId(this.replace('#', '')));
                    } else if (this.indexOf('.') > -1) {
                        result = that.toArray(that.getByClass(this.replace('.', '')));
                    } else {
                        result = that.toArray(that.getTag(this, i ? result[0] : document));
                    }
                });
            } else {
                result = result.concat(this.toArray(selectors));
            }
            return result;
        },
        hasClass: function (node, className) {
            return node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        },
        getStyle: document.defaultView ?
        function (elem, name) {
            var style = document.defaultView.getComputedStyle(elem, null);
            return name in style ? style[name] : style.getPropertyValue(name);
        } : function (elem, name) {
            var style = elem.style,
                curStyle = elem.currentStyle;
            //透明度 from youa
            if (name == "opacity") {
                if (/alpha\(opacity=(.*)\)/i.test(curStyle.filter)) {
                    var opacity = parseFloat(RegExp.$1);
                    return opacity ? opacity / 100 : 0;
                }
                return 1;
            }
            if (name == "float") {
                name = "styleFloat";
            }
            var ret = curStyle[name] || curStyle[dream.camelize(name)];
            //单位转换 from jqury
            if (!/^-?\d+(?:px)?$/i.test(ret) && /^\-?\d/.test(ret)) {
                var left = style.left,
                    rtStyle = elem.runtimeStyle,
                    rsLeft = rtStyle.left;

                rtStyle.left = curStyle.left;
                style.left = ret || 0;
                ret = style.pixelLeft + "px";

                style.left = left;
                rtStyle.left = rsLeft;
            }
            return ret;
        },
        setStyle: function (elems, style, value) {
            elems = (elems.length == undefined) ? [elems] : elems;
            if (typeof style == "string") {
                var s = style;
                style = {};
                style[s] = value;
            }
            dream.each(elems, function () {
                var elem = this;
                dream.each(style, function (name) {
                    var value = style[name],
                        ie = dream.browser.ie;
                    if (name == 'opacity' && ie) {
                        elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace(/alpha\([^)]*\)/, "") + " alpha(opacity=" + (value * 100 | 0) + ")";
                    } else if (name == 'float') {
                        elem.style[ie ? 'styleFloat' : 'cssFloat'] = value;
                    } else {
                        elem.style[dream.camelize(name)] = value;
                    }
                });
            });
        },
        addClass: function (elems, className) {
            elems = (elems.length == undefined) ? [elems] : elems;
            this.each(elems, function () {
                var classArray = ('string' == typeof className) ? [className] : className,
                    result = this.className,
                    classMatch = " " + result + " ",
                    i = 0,
                    l = classArray.length;
                for (; i < l; i++) {
                    if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
                        result += (result ? ' ' : '') + classArray[i];
                    }
                }
                this.className = result;
            });
        },
        removeClass: function (elems, className) {
            elems = (elems.length == undefined) ? [elems] : elems;
            this.each(elems, function () {
                var names = this.className.split(/\s+/),
                    i = 0,
                    len = names.length;
                for (; i < len; i++) {
                    if (names[i] == className) delete names[i];
                }
                this.className = names.join(" ");
            });
        },
        remove: function (elems) {
            elems = (elems.length == undefined) ? [elems] : elems;
            this.each(elems, function () {
                this.parentNode.removeChild(this);
            });
        },
        empty: function (elems) {
            elems = (elems.length == undefined) ? [elems] : elems;
            this.each(elems, function () {
                while (this.firstChild) {
                    this.removeChild(this.firstChild);
                }
            });
        },
        append: function (elems, elem) {
            elems = (elems.length == undefined) ? [elems] : elems;
            this.each(elems, function () {
                this.appendChild(dream.checkElem(elem));
            });
        },
        // before: function (elems,before, elem) {
        //     this.each(elems,function () {
        //         if (elem == null) {
        //             elem = before;
        //             before = this;
        //             this = before.parentNode;
        //             this.insertBefore(dream.checkElem(elem), before);
        //         }
        //     });
        // },   
        attr: function (elems, name, value) {
            var _elems = elems;
            elems = (elems.length == undefined) ? [elems] : elems;
            name = {
                'for': 'htmlFor',
                'class': 'className'
            }[name] || name;
            if (value != null) {
                this.each(elems, function () {
                    this[name] = value;
                    if (this.setAttribute) {
                        this.setAttribute(name, value);
                    }
                });
                return _elems;
            } else {
                elem = elems[0];
                return elem[name] || elem.getAttribute(name) || '';
            }
        },
        removeAttr: function (elems, attrNames) {
            attrNames = attrNames.constructor == String ? [attrNames] : attrNames;
            this.each(elems, function () {
                var k = attrNames.length;
                if (k) while (k--) {
                    var attr = attrNames[k];
                    attr = {
                        'for': 'htmlFor',
                        'class': 'className'
                    }[attr] || attr;
                    //for ie className
                    if (attr == 'className') {
                        this[attr] = '';
                    }
                    this.removeAttribute(attr);
                }
            });
        },
        insertHTML: function (elems, html, position) {
            elems = (elems.length == undefined) ? [elems] : elems;
            position = position || 'beforeEnd';
            this.each(elems, function () {
                var range, begin;
                if (this.insertAdjacentHTML && !dream.browser.opera) {
                    this.insertAdjacentHTML(position, html);
                } else {
                    range = this.ownerDocument.createRange();
                    position = position.toUpperCase();
                    if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                        range.selectNodeContents(this);
                        range.collapse(position == 'AFTERBEGIN');
                    } else {
                        begin = position == 'BEFOREBEGIN';
                        range[begin ? 'setStartBefore' : 'setEndAfter'](this);
                        range.collapse(begin);
                    }
                    range.insertNode(range.createContextualFragment(html));
                }
            });
        },
        size: function (elements) {
            return elements.length;
        },
        isArray: function (source) {
            return '[object Array]' == Object.prototype.toString.call(source);
        },
        toArray: function (obj) {
            if (dream.isArray(obj) || obj.nodeType == 1 || obj.nodeType == 9) {
                return obj;
            }
            //nodeList, IE 下调用 [].slice.call(nodeList) 会报错
            if (obj.item) {
                var l = obj.length,
                    array = [];
                while (l--)
                array[l] = obj[l];
                return array;
            }
            return slice.call(obj, 0);
        },
        checkElem: function (elem) {
            return elem && elem.constructor == String ? document.createTextNode(elem) : elem;
        },
		create: function(elem){
			 return document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', elem) : document.createElement(elem);
			},
        animate: function (elem, start, alter, duration, callBack, tween) {
            var curTime = 0,
                timeout = null;
            tween = tween || dream.Tween;
            callBack = callBack ||
            function () {};
            duration = duration - (duration % 10);

            function frame() {
                if (curTime < duration) {
                    curTime += 10;
                    dream.each(start, function (key) {
                        var value = tween(curTime, start[key], alter[key], duration);
                        if (key == 'opacity') {
                            dream.setStyle(elem, 'opacity', value);
                        } else {
                            dream.setStyle(elem, key, value + 'px');
                        }
                    });
                    timeout = setTimeout(frame, 10);
                } else {
                    callBack();
                }
            };
            frame();
            return function () {
                clearTimeout(timeout);
            };
        },
        Tween: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        getElemViewPosition: function (elem) {
            if (document.documentElement.getBoundingClientRect) {
                var elemBCR = elem.getBoundingClientRect();
                return {
                    top: elemBCR.top,
                    right: elemBCR.right,
                    bottom: elemBCR.bottom,
                    left: elemBCR.left
                }
            }
        },
        getScrollPosition: function () {
            return {
                top: document.documentElement.scrollTop || document.body.scrollTop,
                left: document.documentElement.scrollLeft || document.body.scrollLeft
            }
        },
        getElemPosition: function (elem) {
            return {
                top: dream.getElemViewPosition(elem).top + dream.getScrollPosition().top,
                left: dream.getElemViewPosition(elem).left + dream.getScrollPosition().left
            };
        },
        getPageSize: function () {
            var d = document,
                D = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
            scrW = Math.max(D.scrollWidth, D.clientWidth);
            scrH = Math.max(D.scrollHeight, D.clientHeight);
            return {
                width: scrW,
                height: scrH
            };
        }
    });

    dream.addEvent = function (element, type, handler) {
        // assign each event handler a unique ID
        if (!handler.$$guid) handler.$$guid = dream.addEvent.guid++;
        // create a hash table of event types for the element
        if (!element.events) element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            // store the existing event handler (if there is one)
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        element["on" + type] = dream.handleEvent;
    };
    // a counter used to create unique IDs
    dream.addEvent.guid = 1;

    dream.removeEvent = function (element, type, handler) {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    };

    dream.handleEvent = function (event) {
        // grab the event object (IE uses a global event object)
        event = event || window.event;
        // get a reference to the hash table of event handlers
        var handlers = this.events[event.type];
        // execute each event handler
        for (var i in handlers) {
            this.$$handleEvent = handlers[i];
            this.$$handleEvent(event);
        }
    };

    dream.stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBublbe = true;
        }
    };

    dream.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    dream.browser = (function (ua) {
        var b = {
            msie: /msie/.test(ua) && !/opera/.test(ua),
            opera: /opera/.test(ua),
            safari: /webkit/.test(ua) && !/chrome/.test(ua),
            firefox: /firefox/.test(ua),
            chrome: /chrome/.test(ua)
        };
        var vMark = "";
        for (var i in b) {
            if (b[i]) {
                vMark = "safari" == i ? "version" : i;
                break;
            }
        }
        b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";

        b.ie = b.msie;
        b.ie6 = b.msie && parseInt(b.version, 10) == 6;
        b.ie7 = b.msie && parseInt(b.version, 10) == 7;
        b.ie8 = b.msie && parseInt(b.version, 10) == 8;
        return b;
    })(window.navigator.userAgent.toLowerCase());


    function ajax(options) {
        this.url = options.url;
        this.method = options.method || 'get';
        this.responseType = options.responseType || 'text';
        this.success = options.success ||
        function () {};
        this.waiting = options.waiting ||
        function () {};
        this.stopWaiting = options.stopWaiting ||
        function () {};
        this.cache = options.cache || false;
        this.data = this.params(options.data);
        this.XHR = this.createXHR();
        this.init();
    };
    ajax.prototype = {
        init: function () {
            if (/get/i.test(this.method)) {
                this.url += "?" + this.data;
            }
            if (!this.cache) {
                if (this.url.indexOf("?") < 0) this.url += "?";
                this.url += "&" + (+new Date());
            }
            this.XHR.open(this.method, this.url, true);
            var _this = this; //for IE6
            this.XHR.onreadystatechange = function () {
                if (_this.XHR.readyState === 4 && _this.XHR.status === 200) {
                    _this.stopWaiting();
                    if (/xml/i.test(_this.responseType)) {
                        _this.success(_this.XHR.responseXML);
                    } else if (/json/i.test(_this.responseType)) /* || /text/i.test(_this.responseType))*/
                    {
                        _this.success(eval('(' + _this.XHR.responseText + ')'));
                    } else {
                        _this.success(_this.XHR.responseText);
                    }
                } else {
                    _this.waiting();
                }
            };
            if (/post/i.test(this.method)) {
                this.XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                this.XHR.send(this.data);
            } else {
                this.XHR.send();
            }
        },
        createXHR: function () {
            return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); //IE6
        },
        params: function (o) {
            if (!o) return '';
            var a = [];
            dream.each(o, function (k) {
                a.push(k + '=' + encodeURIComponent(this[k]));
            });
            return a.join("&");
        }
    };
    dream.ajax = function (options) {
        return new ajax(options);
    };
    dream.getJson = function (options) {
        options.responseType = 'json';
        return new ajax(options);
    };

    window["dream"] = dream;

    if (dream.browser.ie6) {
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch (e) {}
    };

})(window);