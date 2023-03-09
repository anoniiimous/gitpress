String.prototype.router = async function(params) {
    var uri = this.toString();

    var url = new URL(uri,location.origin);
    var tabs = await rout.ed.vars(rout.ed.dir(url.hash ? url.hash.split('#')[1] : uri));
    var goto = rout.ed.url(tabs);
    var route = window.paths = window.route = rout.e(url.hash ? url.hash.split('#')[1] : goto + url.search + url.hash);
    //console.log(8, uri, route);

    var pages = dom.body.find('pages[data-page="' + rout.es() + '"]');
    var page = dom.body.find('page[data-page="' + route.page + '"]');
    var vp = page ? page : pages;
    0 > 1 ? console.log(13, {
        page,
        pages,
        route,
        vp
    }) : null;
    if (page) {
        if (is.iframe) {
            var path = "/" + window.parent.owner.login + "/" + window.parent.GET[1] + "/main/" + vp.dataset.fetch;
            var pg = atob((await github.raw.path(path)).content);
        } else {
            var path = vp.dataset.fetch;
            var pg = await ajax(path);
        }
        if (page.innerHTML === "") {
            page.innerHTML = pg
            //await ajax(page.dataset.fetch);
        }
    }

    const fetching3 = dom.body.all('[data-fetch][data-page="' + rout.es() + '"]:empty');
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
            if (is.iframe) {
                var path = "/" + window.parent + "/" + window.parent.GET[1] + "/main/" + vp.dataset.fetch;
                var pg = atob((await github.raw.path(path)).content);
            } else {
                var path = vp.dataset.fetch;
                var pg = await ajax(path);
            }
            vp.innerHTML = pg;
            console.log("router.js 33", path, vp, vp.dataset.fetch);
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

    const fetching = dom.body.all('[data-fetch][data-page="' + rout.es() + '"]');
    if (fetching.length > 0) {
        var f = 0;
        do {
            if (fetching[f].innerHTML === "") {
                fetching[f].innerHTML = await ajax(fetching[f].dataset.fetch);
            }
            f++;
        } while (fetching.length < 0);
    }

    const fetching4 = dom.body.all('[data-fetch]:not(page[data-page]):not(pages[data-page])');
    if (fetching4.length > 0) {
        var f = 0;
        do {
            //console.log(fetching[f]);
            if (fetching4[f].innerHTML === "") {
                fetching4[f].innerHTML = await ajax(fetching4[f].dataset.fetch);
                fetching4[f].dataset.active = true;
            }
            f++;
        } while (fetching4.length < 0);
    }

    var go = async function(resolve, reject) {
        //console.log('String.prototype.router', route);
        if (route) {
            var pop = params ? params.pop : null;

            await rout.ed.bang(route);
            window.view ? await view(route) : null;
            //route = window.view ? await view(route).then(rout.ed.bang(route)) : await rout.ed.bang(route);

            var path = route.path;
            window.GET = rout.ed.dir(path);

            lazyLoad(dom.body.all('[data-src]'), vp);

            if (!pop && !["blob:"].includes(window.location.protocol)) {

                const hash = window.hub ? "/#" : "";
                const link = hash + (route.hash.length > 0 ? route.hash.split('#')[1] : route.path) + route.search;
                0 > 1 ? console.log(66, {
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
            page = window.rout.ing(state, GOT, n);
            //console.log(148, n, state, page);
            if (page)
                break;
            n++;
        } while (n < GOT.length);
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
    var pages = dom.body.find('[data-page="' + rout.es() + '"]');
    var page = dom.body.find('page[data-page="' + route.page + '"]');
    var vp = page ? page : pages;

    $('[data-hide]').attr("data-active", true);
    $('pages').removeAttr("data-active");
    //$(':not(pages)[data-pages]').removeAttr("data-active");
    $(':not(page):not(pages)[data-page]').removeAttr("data-active");
    $('[data-path]').removeAttr("data-active");

    if (vp && vp.closest('main')) {
        $('pages[data-page]').removeAttr("data-active");
        $('page[data-page]').removeAttr("data-active");
    } else {
        $('body > page[data-page]').removeAttr("data-active");
        $('body > pages[data-page]').removeAttr("data-active");
        $('body > :not(main) page[data-page]').removeAttr("data-active");
        $('body > :not(main) pages[data-page]').removeAttr("data-active");
    }

    $('[data-hide="' + route.page + '"]').attr("data-active", false);
    $('[data-page="' + route.page + '"]').attr("data-active", true);
    $('[data-path="' + route.path + '"]').attr("data-active", true);

    $('page[data-page="' + route.page + '"]').attr("data-uri", route.path);

    //dom.body.find('[data-page="' + route.page + '"]').setAttribute("data-active", true);

    var rs = $('pages[data-page]');
    if (rs.length > 0) {
        var i = 0;
        do {
            var check = rs[i].closest('[data-fetch]') && rs[i].closest('[data-fetch]') === rs[i];
            if (route.page && route.page.includes(rs[i].dataset.page)) {
                rs[i].dataset.active = true;

                var roots = rs[i].all('[data-page]');
                if (rout.ed.dir(rs[i].dataset.page).length === rout.ed.dir(route.page).length && roots.length > 0) {
                    var p = null;
                    var r = 0;
                    //console.log(roots);
                    do {
                        var root = roots[r];
                        var page = root.dataset.page;
                        var dir = rout.ed.dir(page)
                        var dirs = rout.ed.dir(route.path);
                        var bools = [];
                        //console.log(page);
                        var is = 0;
                        var same = dir.forEach(function(d, i, e) {
                            var ei = e[i];
                            var slug = dirs[i];
                            var bool = [slug, '*'].includes(ei);
                            if (dir.length <= dirs.length) {
                                bools.push(bool);
                                0 > 1 ? console.log(312, bool, rout.ed.url(e), ei, slug, {
                                    d,
                                    i,
                                    e
                                }) : null;
                            }
                            is++;
                        });
                        if (bools.length > 0 && truth(bools)) {
                            //console.log(truth(bools), bools, page);
                            p = page;
                        }
                        r++;
                    } while (r < roots.length);
                    var ps = $(rs[i].all('[data-page="' + p + '"]'));
                    ps.attr("data-active", true);
                }
            }
            i++;
        } while (i < rs.length)
    }

    return route;
}
window.rout.ed.close = ()=>{
    var active = document.body.find('main [data-active="true"][data-fetch]');
    const goto = (active ? active.dataset.uri : '/');
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
        href = dir.length === 0 ? "/" : "/" + dir.join("/") + (end.includes("?") ? "" : "");
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

window.rout.ed.history = [];

window.rout.es = function getRoot(els) {
    var els = $('pages[data-page]');
    var root = null;
    if (els.length > 0) {
        var arr = [];
        var r = 0;
        do {
            arr.push(els[r].dataset.page);
            r++;
        } while (r < els.length);
        arr.sort();
        arr.reverse();
        window.paths.arr = arr;
        root = paths.page.stringExists(arr);
        //root = arr.includes(paths.page) ? paths.page : null;
        //console.log({page:paths.page,arr,root});
    }
    return root;
}

window.rout.ing = (href,GOT,n)=>{
    var ed = null;
    var pages = $(dom.body.all('page[data-page], pages[data-page]')).sort(function(a, b) {
        return a.dataset.page.localeCompare(b.dataset.page);
    })
    var routes = pages.forEach(function(el) {
        var page = el.dataset.page;
        var dir = rout.ed.dir(href);
        var is = 0;
        var bools = [];
        var dirs = rout.ed.dir(page);
        var same = dirs.forEach(function(d, i, e) {
            var ei = e[i];
            var slug = dir[i];
            var bool = [slug, '*'].includes(ei);
            bools.push(bool);
            0 > 1 ? console.log(312, bool, rout.ed.url(e), ei, slug, {
                d,
                i,
                e
            }) : null;
            is++;
        });
        check = is <= dir.length && truth(bools);
        //check ? console.log(page, bools, {is, dir}) : null;
        if (check) {
            0 > 1 ? console.log(318, check, {
                bools,
                dir
            }, {
                is,
                page
            }) : null;
            ed = page;
            //return check;
        }
    });
    //console.log(338, ed);
    return ed;
}
