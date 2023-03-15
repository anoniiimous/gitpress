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

Array.prototype.has = function(that) {
    return that.every(v=>this.includes(v));
}

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
        } while (i < that.length)
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
    var that = [];
    var vals = Object.values(this);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            var val = vals[i];
            if (typeof html === 'string') {
                that[i] = this[i].innerHTML = html;
            } else {
                that[i] = this[i].innerHTML;
            }
        }
    }
    return that;
}
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

Element.prototype.textual = function() {
    var n = 0
      , a = [];
    var html = "";
    var els = this.all('*');
    if (els.length > 0) {
        do {
            var el = els[n];
            var tagName = el.tagName.toLowerCase();
            if(['div', 'hr', 'iframe', 'p', 'picture', 'video'].includes(tagName) && !el.find('div, p, picture, video')) {
                a.push(el);
                html += el.outerHTML;
            } else {
                el = null;
            }
            n++;
        } while (n < els.length - 1)
    }
    //console.log(a);
    return html;
}

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
Array.prototype.text = function(html) {
    var that = [];
    var vals = Object.values(this);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            var val = vals[i]
            if (html && html.length > 0) {
                that[i] = this[i].textContent = html;
            } else {
                that[i] = this[i].textContent;
            }
        }
    }
    return that;
}
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

Element.prototype.display = function(display) {
    this.ariaHidden = (display === true || display === false) ? display : this.ariaHidden === "true" ? false : true;
    return this;
}
Element.prototype.find = function(elem) {
    return this.querySelector(elem);
}

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
String.prototype.capitalize = function() {
    const str = this.valueOf();
    return (str.charAt(0).toUpperCase() + str.slice(1));
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
window.beautify = {
    html: function(html) {
        var tab = '\t';
        var result = '';
        var indent = '';

        html.split(/>\s*</).forEach(function(element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }

            result += indent + '<' + element + '>\r\n';

            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
                indent += tab;
            }
        });

        return result.substring(1, result.length - 3);
    }
}
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
    iframe: (window.self !== window.top),
    ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(window.location.host.split(':')[0]),
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
        if (window.hub) {
            url = base.href + url;
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
            settings.cache ? data.cache = settings.cache : null;
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

function truth(obj) {
    for (var o in obj)
        if (!obj[o])
            return false;

    return true;
}

function download(file) {
    var download = file.download;
    var href = file.href;
    var a = document.createElement("a");
    a.href = href;
    a.download = download;
    a.click();
}
function formatBytes(bytes, decimals=2) {
    if (!+bytes)
        return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function getMime(ext) {
    var extToMimes = {
        'htm': 'text/html',
        'html': 'text/html',
        'jpg': 'image/jpg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'svg': 'image/svg+xml'
    }
    if (extToMimes.hasOwnProperty(ext)) {
        return extToMimes[ext];
    }
    return false;
}
function lazyLoad(images, vp) {
    if (images.length > 0) {
        var doc = images[0].ownerDocument;
        var win = doc.defaultView;
        var lazyImages = [].slice.call(images);
        var intObs = "IntersectionObserver"in win && "IntersectionObserverEntry"in win && "intersectionRatio"in win.IntersectionObserverEntry.prototype;
        if (intObs) {
            let lazyImageObserver = new IntersectionObserver(async function(entries, observer) {
                entries.forEach(async function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        var img = lazyImage.find('[data-src]');
                        var src = img.dataset.src;
                        var href = src;
                        if (is.iframe) {
                            if (!src.includes("://")) {
                                var user = await github.user.get();
                                var c = await github.repos.contents({
                                    owner: user.login,
                                    path: "/" + src,
                                    repo: win.parent.GET[1]
                                }, {});
                                var b = await github.database.blobs({
                                    owner: user.login,
                                    repo: win.parent.GET[1],
                                    sha: c.sha
                                });
                                console.log(390, {
                                    b,
                                    c
                                });
                                var b64 = b.content;

                                var arr = c.name.split('.');
                                const ext = arr[arr.length - 1];
                                var mime = getMime(ext);

                                var href = "data:" + mime + ";base64," + b64;
                                console.log(391, {
                                    href
                                });
                            }
                        }
                        lazyImage.removeAttribute('[data-src]');
                        lazyImageObserver.unobserve(lazyImage);
                        img.src = href;
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
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function getPath(links) {
    var link = ``;
    link += (links[f].link.includes('https:') ? `` : (window.location.protocol === "file:" ? `.` : ``));
    link += links[f].link;
    return link;
}

window.colors = {

    contrast: color=>{

        var r, g, b, hsp;

        if (color.match(/^rgb/)) {
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            r = color[1];
            g = color[2];
            b = color[3];
        } else {
            color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }

        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

        if (hsp > 127.5) {
            return 'black';
        } else {
            return 'white';
        }

    }
    ,

    random: ()=>{
        return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    }

}

window.nodb = {
    check: {
        value: (json,obj,row)=>{
            var hasMatch = false;
            var name = obj.name;
            var value = obj.value;

            for (var index = 0; index < json.length; ++index) {

                var a = json[index];

                if (a[name] == value) {
                    hasMatch = index;
                    break;
                }
            }

            if (hasMatch) {
                json[index] = row;
            } else {
                json.push(row);
            }
            console.log(541, json);

            return json
        }
    }
}
