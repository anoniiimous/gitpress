var host = window.location.host;
var protocol = window.location.protocol;
var domains = host.split('.');
var subdomain = domains[domains.length - 3];
var domain = domains[domains.length - 2];
var tld = domains[domains.length - 1];
if (domain === "github" && tld === "tld") {
    host = "dompad." + domain + '.' + tld;
}
if (domain === "dompad" && tld === "io") {
    host = "dompad.io";
}
if (domain === "pages" && tld === "dev") {
    host = "dompad.pages.dev";
}
if (window.self !== window.top) {
    host = window.parent.location.host;
    protocol = window.parent.location.protocol;
}

var scripts = [{
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/github.js"
}, {
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/mvc.js"
}, {
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/modal.js"
}, {
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/on.js"
}, {
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/router.js"
}, {
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/touch.js"
}, {
    async: '',
    src: protocol + "//" + host + "/" + "raw/asset/js/vanilla.js"
}, {
    async: '',
    src: "raw/style/framework.js"
}, {
    async: '',
    src: "https://js.stripe.com/v3/"
}, {
    defer: '',
    src: "index.js"
}];
if (scripts.length > 0) {
    var s = 0;
    do {
        var row = scripts[s];
        var script = document.createElement('script');
        row.hasOwnProperty('async') ? script.setAttribute('async', row.async) : null;
        row.hasOwnProperty('defer') ? script.setAttribute('defer', row.defer) : null;
        script.src = row.src;
        document.head.appendChild(script);
        s++;
    } while (s < scripts.length);
}

var links = [{
    href: "index.css"
}, {
    href: "raw/style/theme.css"
}, {
    href: "https://cdn.jsdelivr.net/npm/css.gg/icons/all.css"
}];
if (tld === "tld") {
    links.push({
        href: window.location.protocol + "//" + host + "/raw/asset/css/editor.css"
    });
}
if (links.length > 0) {
    var l = 0;
    do {
        var row = links[l];
        var link = document.createElement('link');
        link.href = row.href;
        link.rel = "stylesheet";
        document.head.appendChild(link);
        l++;
    } while (l < links.length);
}
