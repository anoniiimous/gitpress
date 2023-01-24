String.prototype.router = async function(params) {
    var uri = this.toString();

    var url = new URL(uri,location.origin);
    var tabs = await rout.ed.vars(rout.ed.dir(url.hash ? url.hash.split('#')[1] : uri));
    var goto = rout.ed.url(tabs);
    var route = window.paths = window.route = rout.e(url.hash ? url.hash.split('#')[1] : goto + url.search + url.hash);
    //console.log(8, uri, url, route, getRoot());

    var pages = dom.body.find('pages[data-pages="' + getRoot() + '"]');
    var page = dom.body.find('page[data-page="' + route.page + '"]');
    var vp = page ? page : pages;

    if (pages) {
        if (pages.innerHTML === "" && pages.dataset.fetch) {//pages.innerHTML = await ajax(pages.dataset.fetch);
        }
    }

    const fetching3 = dom.body.all('[data-fetch][data-pages="' + getRoot() + '"]:empty');
    if (fetching3.length > 0) {
        var ff = 0;
        do {
            if (fetching3[ff].innerHTML === "") {
                fetching3[ff].innerHTML = await ajax(fetching3[ff].dataset.fetch);
            }
            ff++;
        } while (ff < fetching3.length);
    }

    if (vp) {
        if (vp.innerHTML === "" && vp.dataset.fetch) {
            vp.innerHTML = await ajax(vp.dataset.fetch);
        }
        const fetching2 = vp.all('[data-fetch]');
        if (fetching2.length > 0) {
            var ff = 0;
            do {
                if (fetching2[ff].innerHTML === "") {
                    fetching2[ff].innerHTML = await ajax(fetching2[ff].dataset.fetch);
                }
                f++;
            } while (fetching2.length < 0);
        }

    }

    const fetching = dom.body.all('[data-fetch][data-pages="' + getRoot() + '"]');
    if (fetching.length > 0) {
        var f = 0;
        do {
            //console.log(fetching[f]);
            if (fetching[f].innerHTML === "") {
                fetching[f].innerHTML = await ajax(fetching[f].dataset.fetch);
            }
            f++;
        } while (fetching.length < 0);
    }

    const fetching4 = dom.body.all('[data-fetch]:not(page[data-page]):not(pages[data-pages])');
    if (fetching4.length > 0) {
        var f = 0;
        do {
            //console.log(fetching[f]);
            if (fetching4[f].innerHTML === "") {
                fetching4[f].innerHTML = await ajax(fetching4[f].dataset.fetch);
            }
            f++;
        } while (fetching4.length < 0);
    }

    var go = async function(resolve, reject) {
        //console.log('String.prototype.router', route);
        if (route) {
            var pop = params ? params.pop : null;

            route = window.view ? await view(route).then(rout.ed.bang(route)) : await rout.ed.bang(route);

            var path = route.path;
            window.GET = rout.ed.dir(path);

            lazyLoad(dom.body.all('[data-src]'), vp);

            if (!pop && !["blob:"].includes(window.location.protocol)) {

                const hash = window.hub ? "/#" : "";
                const link = hash + (route.hash.length > 0 ? route.hash.split('#')[1] : route.path) + route.search;
                1 < 0 ? console.log(66, {
                    hub,
                    hash,
                    link,
                    route
                }) : null;
                document.body.dataset.path = route.path;
                history.pushState(link, '', link);
            }

            resolve(route);
        } else {
            const e = {
                code: 400
            };
            reject(e);
        }
    };
    return new Promise(async(resolve,reject)=>go(resolve, reject));
}

window.rout = {};

window.rout.e = state=>{
    var arr1 = [];
    var arr2 = rout.ed.dir(state.split('#')[0].split('?')[0]);
    var page = '/';
    var path = rout.ed.url(arr2);
    const GOT = rout.ed.dir(path);
    const root = GOT[0];
    const hash = state.split('#').length > 1 ? "#" + state.split('#')[1] : "";
    const search = state.split('?').length > 1 ? "?" + state.split('?')[1].split('#')[0] : "";

    if (GOT.length > 0) {
        var n = 0;
        do {
            var m = GOT[n];
            var bool = window.rout.ing(state, GOT, n);
            arr1[n] = bool ? "*" : m;
            n++;
        } while (n < GOT.length);
        page = rout.ed.url(arr1);
    }

    const data = {
        GOT,
        hash,
        page,
        path,
        root,
        search
    };
    return data;
}

window.rout.ed = {};
window.rout.ed.bang = async(route)=>{
    var pages = dom.body.find('pages[data-pages="' + getRoot() + '"]');
    var page = dom.body.find('page[data-page="' + route.page + '"]');
    var vp = page ? page : pages;

    $('[data-hide]').attr("data-active", true);
    $(':not(pages)[data-pages]').removeAttr("data-active");
    $(':not(page)[data-page]').removeAttr("data-active");
    $('[data-path]').removeAttr("data-active");

    if (vp && vp.closest('main')) {
        $('pages[data-pages]').removeAttr("data-active");
        $('page[data-page]').removeAttr("data-active");
    } else {
        $('body > page[data-page]').removeAttr("data-active");
        $('body > pages[data-pages]').removeAttr("data-active");
        $('body > :not(main) page[data-page]').removeAttr("data-active");
        $('body > :not(main) pages[data-pages]').removeAttr("data-active");
    }

    $('[data-hide="' + route.page + '"]').attr("data-active", false);
    $('[data-page="' + route.page + '"]').attr("data-active", true);
    $('[data-path="' + route.path + '"]').attr("data-active", true);

    $('page[data-page="' + route.page + '"]').attr("data-uri", route.path);

    //dom.body.find('[data-page="' + route.page + '"]').setAttribute("data-active", true);

    var rs = $('[data-pages]');
    if (rs.length > 0) {
        var i = 0;
        do {
            route.page.includes(rs[i].dataset.pages) ? rs[i].dataset.active = true : null;
            i++;
        } while (i < rs.length)
    }
    return route;
}
window.rout.ed.close = ()=>{
    var active = document.body.find('main [data-active="true"][data-fetch]');
    const goto = (active ? active.dataset.uri : '/');
    //alert(goto);
    goto.router();
}
window.rout.ed.dir = function(url, num, g=[]) {
    if (url) {
        var split = url.split("/");
        var it = (a,i)=>{
            i < split.length - 0 ? g[i] = a : null;
        }
        ;
        split.forEach(it);
        g[0] === "" ? g.shift() : null;
        g[g.length - 1] === "" ? g.pop() : null;
    }
    return g;
}
window.rout.ed.url = function(dir) {
    if (dir.length > 0) {
        var end = dir[dir.length - 1];
        href = dir.length === 0 ? "/" : "/" + dir.join("/") + (end.includes("?") ? "" : "/");
    } else {
        href = "/";
    }
    return href;
}
window.rout.ed.vars = async function(tabs) {
    var d = 0
      , e = 0;
    do {
        var dir = tabs[d];
        if (dir && dir.length > 0) {
            if (dir.charAt(0) === "*") {
                dir = GOT[d];
            }
            if (dir.charAt(0) === ":") {
                dir = dir.substring(1);
                if (!isNaN(dir)) {
                    var drc = rout.ed.dir(dom.body.dataset.path);
                    console.log({
                        dir,
                        is: d >= parseInt(dir),
                        drcd: drc[d]
                    });
                    if (drc[e - 1] && d >= parseInt(dir)) {
                        //alert('dir'+dir);
                        e === 0 && d > 0 ? e = d + 1 : e;
                        dir = drc[e];
                        //d = d  1;
                        e++;
                    } else {
                        dir = null;
                        tabs.splice(d, 1);
                        d = tabs.length;
                        //alert(1);
                    }
                }
                if (dir === "get") {
                    var drc = rout.ed.dir(dom.body.dataset.path);
                    if (drc[d]) {
                        dir = drc[d];
                        //alert(drc[d]);
                    } else {
                        dir = null;
                        tabs.splice(d, 1);
                        d = tabs.length;
                        //alert(1);
                    }
                }
            }
            if (dir) {
                tabs[d] = dir.toString().split(":")[0];
            } else {
                tabs[d] = null;
            }
        }
        d++;
    } while (d < tabs.length);
    tabs = tabs.filter(function(el) {
        return el != null;
    });
    //console.log({tabs});
    return tabs;
}

window.rout.ing = (href,GOT,n)=>{
    return false;
}
