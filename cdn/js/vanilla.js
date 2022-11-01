Array.prototype.remove = function(name) {
    var that = this;
    var vals = Object.values(that);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            this[i].remove();
        }
    } else {
        that[0] ? that[0].remove() : null;
    }
    return that;
}
;
Array.prototype.addClass = function(name) {
    var that = this;
    var vals = Object.values(that);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            this[i].classList.add(name);
        }
    } else {
        that[0] ? that[0].classList.add(name) : null;
    }
    return that;
}
;
Array.prototype.removeClass = function(name) {
    var that = this;
    var vals = Object.values(that);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            this[i].classList.remove(name);
        }
    } else {
        that[0] ? that[0].classList.add(name) : null;
    }
    return that;
}
;
Array.prototype.attr = function(attr, name) {
    var that = this;
    if (that.length > 1) {
        var i = 0;
        do {
            var it = this[i];
            it ? it.setAttribute(attr, name) : null;
            i++;
        } while(i < that.length)
    } else {
        that[0] ? that[0].setAttribute(attr, name) : null;
    }
    return that;
}
Array.prototype.removeAttr = function(name) {
    var that = this;
    if (that.length > 1) {
        for (var i = that.length; i--; ) {
            var it = this[i];
            it ? it.removeAttribute(name) : null;
        }
    } else {
        that[0] ? that[0].removeAttribute(name) : null;
    }
    return that;
}
Array.prototype.html = function(html) {
    var that = this;
    var vals = Object.values(that);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            this[i].innerHTML = "";
        }
    } else {
        that[0] ? that[0].classList.add(name) : null;
    }
    return that;
}
;
Array.prototype.remove = function(name) {
    var that = this;
    if (that.length > 0) {
        for (var i = that.length; i--; ) {
            var it = this[i];
            it.remove();
        }
    }
    return that;
}
;
Array.prototype.removeAttribute = function(name) {
    var that = this;
    if (that.length > 1) {
        for (var i = that.length; i--; ) {
            var it = this[i];
            it ? it.removeAttribute(name) : null;
        }
    } else {
        that[0] ? that[0].removeAttribute(name) : null;
    }
    return that;
}
;
Array.prototype.siblings = function(name) {
    var i = 0
      , elems = []
      , that = this[i];
    elems.forEach.call(that.parentNode.children, function(a, b, c) {
        if (a !== that) {
            elems[i] = a;
            i++;
        }
    });
    return elems;
}
;
Array.prototype.toggleClass = function(name) {
    var that = this;
    if (that.length > 1) {
        for (var i = that.length; i--; ) {
            var it = this[i];
            it.hasClass(name) ? it.classList.remove(name) : it.classList.add(name);
        }
    } else {
        that[0].hasClass(name) ? that[0].classList.remove(name) : that[0].classList.add(name);
    }
    return that;
}
;
Element.prototype.display = function(display) {
    this.ariaHidden = (display === true || display === false) ? display : this.ariaHidden === "true" ? false : true;
    return this;
}
Element.prototype.find = function(elem) {
    return this.querySelector(elem);
}
;
Element.prototype.all = function(elem) {
    return this.querySelectorAll(elem);
}
;
Element.prototype.hasClass = function(n) {
    return new RegExp(' ' + n + ' ').test(' ' + this.className + ' ');
}
;
Element.prototype.index = function() {
    var whl = this;
    [].forEach.call(whl.parentNode.children, (a,b,c)=>(a === whl) ? whl = b : null);
    return whl;
}
;
function objectExists(obj, where) {
    var data = obj;
    var keys = Object.keys(obj);
    var bool = false;
    if (keys.length > 0) {
        var values = Object.values(obj);
        var k = 0;
        do {
            var key = keys[k]
            var value = values[k];
            var hasKey = data.hasOwnProperty(obj);
            var hasVal = data[key].includes(value);
            bool = hasKey && hasVal;
            if (bool === false) {
                k = keys.length;
            }
            k++;
        } while (k < keys.length);
    }
    return bool;
}
String.prototype.contains = function(pattern) {
    var value = false
      , p = 0;
    do {
        value === false ? value = this.toString().includes(pattern[p]) : null;
        p++;
    } while (p < pattern.length);
    return value;
}
String.prototype.stringExists = function(arr) {
    var bool = false;
    var text = this.valueOf();
    if (arr.length > 0) {
        var a = 0;
        do {
            bool = text.indexOf(arr[a]) > -1 ? arr[a] : null;
            bool === null ? null : a = arr.length;
            a++;
        } while (a < arr.length);
    }
    return bool;
}
String.prototype.trim = function(ing, str) {
    if (ing === 0) {
        str = this.toString().replace(/^\/+/g, '');
    } else if (ing === 1) {
        str = this.toString().replace(/\/$/, '');
    } else {
        str = this.toString().replace(/\/$/, '').replace(/^\/+/g, '');
    }
    return str;
}
String.prototype.pend = {
    app: str=>{
        alert("App: " + str);
        return str;
    }
    ,
    pre: str=>{
        alert("Pre: " + str);
        return str;
    }
}
window.all = function(str) {
    return document.querySelectorAll(str);
}
;
window.byId = s=>{
    return document.getElementById(s);
}
window.getBlobURL = (code,type)=>{
    return URL.createObjectURL(new Blob([code],{
        type
    }));
}
window.blob = (code,type)=>{
    return URL.createObjectURL(new Blob([code],{
        type
    }));
}
window.nd = ()=>{
    return new Date;
}
window.s = (ar,a,b)=>{
    return ar === 1 ? a : b;
}
window.$ = e=>{
    var obj = e;
    if (typeof obj === 'object') {
        if (NodeList.prototype.isPrototypeOf(obj)) {
            obj = Array.from(obj);
        } else {
            if (Element.prototype.isPrototypeOf(obj)) {
                obj = [obj];
            } else {
                obj = null;
            }
        }
    } else if (typeof obj === 'string') {
        var body = window.document.body;
        obj = body.querySelectorAll(obj);
        if (obj.length === 0) {
            obj = [];
        } else {
            obj = Array.from(obj);
        }
    } else {
        obj = null;
    }
    return obj;
}
window.tld = ()=>window.location.hostname.split('.')[window.location.hostname.split('.').length - 1];
window.domain = ()=>window.location.hostname.split('.')[window.location.hostname.split('.').length - 2];
window.is = {
    json: str=>{
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    ,
    local: href=>href.contains(['127.0.0.1', 'about:', 'blob:', 'file:', 'localhost', 'tld']),
    mobile: ()=>{
        return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend"in document)
    }
    ,
    touch: ()=>{
        return (('ontouchstart'in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }
    ,
    absoluteURI: str=>{
        return new RegExp('^(?:[a-z]+:)?//','i').test(str)
    }
};
function ajax(url, settings) {
    var dir = window.location.href.split(url);
    if (!RegExp('^(?:[a-z]+:)?//', 'i').test(url)) {
        if (window.globals.domains.domain === "github") {
            url = '/' + document.head.querySelector('[name="application-shortname"]').content + url;
        }
    }
    return new Promise((resolve,reject)=>{
        var req;
        var data = {};
        //console.log(url, settings);
        if (settings) {
            if (settings.dataType) {
                data = {
                    method: settings.dataType,
                    body: (settings.data ? settings.data : null)
                };
                settings.dataType === "OPTIONS" ? data.credentials = 'include' : null;
            } else {
                req = url;
            }
            settings.headers ? data.headers = settings.headers : null;
            settings.signal ? data.signal = signal : null;
        } else {
            req = url;
        }
        fetch(url, data).then(async(response)=>{
            if (!response.ok) {
                return response.text().then(text=>{
                    var statusText = JSON.parse(text);
                    var data = {
                        code: response.status,
                        message: statusText
                    };
                    var text = JSON.stringify(data);
                    throw new Error(text);
                }
                )
            }
            return response.text();
        }
        ).then(response=>{
            const isJSON = is.json(response);
            const data = isJSON ? JSON.parse(response) : response;
            resolve(response);
        }
        ).then(response=>resolve(response)).catch(error=>{
            console.log('vanilla.js ajax.fetch catch', error.message);
            const isJSON = is.json(error.message);
            var message = isJSON ? JSON.parse(error.message) : error.message;
            reject(message);
        }
        );
    }
    );
}
function getFilename(str) {
    return str.trim('/').split('/')[0].split('-').join('.').toLowerCase();
}
function lazyLoad(images, vp) {
    if (images.length > 0) {
        var doc = images[0].ownerDocument;
        var win = doc.defaultView;
        var lazyImages = [].slice.call(images);
        var intObs = "IntersectionObserver"in win && "IntersectionObserverEntry"in win && "intersectionRatio"in win.IntersectionObserverEntry.prototype;
        if (intObs) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        var src = lazyImage.find('[data-src]');
                        src.src = src.dataset.src.replace(':origin', window.location.origin);
                        lazyImage.removeAttribute('[data-src]');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            }
            );
            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage.parentNode);
            });
        }
    }
}
function pad(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}
function count(array) {
    return array.length;
}
function parse_str($str) {
    return JSON.parse('{"' + $str.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
        return key === "" ? value : decodeURIComponent(value)
    })
}
function ucfirst(string) {
    return string.charAt(0).toUpperCase();
}
function replaceTag(el) {
    el.outerHTML = el.outerHTML.replace(/wns/g, "lmn");
}
function offset(el) {
    var win = el.ownerDocument.defaultView;
    var rect = el.getBoundingClientRect()
      , scrollLeft = win.pageXOffset || el.closest('body').scrollLeft
      , scrollTop = win.pageYOffset || el.closest('body').scrollTop;
    data = {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };
    return data
}
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function jsonURL(obj) {
    console.log(obj);
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
}
function URLjson(url) {
    if (!url)
        url = location.search;
    var query = url.contains('?') ? url.split("?")[1] : url;
    var result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}
function getPageURL(body, css, js) {
    return getBlobURL(`<html><head>` + css + js + `</head>` + body + `</html>`, 'text/html');
}
function getPath(links) {
    var link = ``;
    link += (links[f].link.includes('https:') ? `` : (window.location.protocol === "file:" ? `.` : ``));
    link += links[f].link;
    return link;
}
function getRoot(els) {
    var els = $('[data-root]');
    var root = null;
    if (els.length > 0) {
        var arr = [];
        var r = 0;
        do {
            arr.push(els[r].dataset.root);
            r++;
        } while (r < els.length);
        window.paths.arr = arr;
        root = paths.page.stringExists(arr);
    }
    return root;
}
function getPages(win) {
    var els = win.document.body.all('[data-page]');
    var root = null;
    if (els.length > 0) {
        var arr = [];
        var r = 0;
        do {
            arr.push(els[r].dataset.root);
            r++;
        } while (r < els.length);
        window.paths.arr = arr;
        root = paths.page.stringExists(arr);
    }
    return root;
}

window.notify = {
    alert: message => {
        alert(message);
    }
}