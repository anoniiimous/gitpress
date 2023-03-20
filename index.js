window.onload = ()=>{
    window.dom = {
        body: document.body,
        boot: document.getElementById("boot")
    };

    window.global = window.globals;
    dom.body.dataset.load = "ing";

    init();
}

is.iframe ? null : window.onpopstate = (event)=>{
    if (event.state) {
        console.log(event.state);
        var state = is.local(window.location.protocol) ? event.state.replace(/^#+/, '') : event.state;
        event.state.length > 0 ? event.state.router() : null;
    } else {
        if (document.location) {//console.log({place});
        }
    }
    //console.log(event, "location: " + document.location + ", state: " + JSON.stringify(state));
}

async function init() {
    console.log("Initializing...", {
        iframe: is.iframe,
        head: window.document.head.outerHTML
    });
    //eruda.init();

    window.loaded = is.iframe;

    //SHELL
    var html = ``;
    if (window.self === window.top) {
        html = await ajax('/raw/style/template.html');
        console.log(35, {
            html,
            location
        });
        html.length > 0 ? dom.body.find('boot').insertAdjacentHTML('afterend', html) : null;
    } else {
        const user = await github.user.get();
        const owner = user.login;
        const repo = window.parent.route.GOT[1];
        const branch = 'main';
        const path = '/raw/style/template.html';
        const resource = '/' + owner + '/' + repo + '/' + branch + path;
        try {
            console.log(44, {
                owner,
                path,
                repo
            }, resource);
            html = await github.raw.git(resource);
            var doc = new DOMParser().parseFromString(html, 'text/html');

            var header = doc.body.find('body > header');
            if (header) {
                dom.body.find('body > header').replaceWith(header);
            }

            try {
                var pages = await github.raw.git('/' + owner + '/' + repo + '/' + branch + "/raw/pages/pages.json");
                console.log(66, {
                    pages
                });
                if (pages && pages.length > 0) {
                    var main = dom.body.find('main');
                    var p = 0;
                    do {
                        var row = pages[p];
                        var tagName = 'page' + (row.pages ? 's' : '');
                        var sel = tagName + '[data-page="' + row.page + '"]';
                        el = doc.createElement(tagName);
                        el.dataset.fetch = "raw/pages" + row.slug + row.page;
                        el.dataset.page = row.slug;
                        if (row.main) {
                            main.find('template').insertAdjacentHTML('beforebegin', el.outerHTML);
                        } else {
                            main.insertAdjacentHTML('beforebegin', el.outerHTML);                            
                        }
                        p++;
                    } while (p < pages.length);
                }
            } catch (e) {
                console.log(72, e);
            }

            var footer = doc.body.find('body > footer');
            if (footer) {
                dom.body.find('body > footer').replaceWith(footer);
            }

            console.log(48, {
                doc,
                html
            }, {
                header,
                footer
            });
        } catch (e) {
            if (e.code === 404) {
                modal.alert(e.code + ": " + e.message);
            }
        }
        console.log(43, "index.js init", {
            branch,
            html,
            owner,
            path,
            repo
        });
    }
    const fetching = dom.body.all(':not(page):not(pages)[data-fetch]');
    if (fetching.length > 0) {
        var f = 0;
        do {
            if (fetching[f].innerHTML === "") {
                fetching[f].innerHTML = await ajax(fetching[f].dataset.fetch);
            }
            f++;
        } while (fetching.length < 0);
    }

    //EVENTS
    touch.ing = false;
    touch.events = {
        dbltap: on.touch.dbltap,
        drag: on.touch.drag,
        press: on.touch.press,
        tap: on.touch.tap
    };
    dom.body.dataset.theme = "meridiem";
    dom.body.addEventListener("click", function(e) {
        if (window.touch.ing === false) {
            on.touch.tap(e);
            //console.log(e.type,window.touch.ing);
        } else {
            window.touch.ing = false;
            //console.log(e.type,window.touch.ing);
        }
    });
    dom.body.addEventListener("touchstart", function(e) {
        window.touch.ing = true;
        touch.handler(event);
        //console.log(e.type);
    }, {
        passive: true
    });
    dom.body.addEventListener("touchmove", touch.handler, {
        passive: true
    });
    dom.body.addEventListener("touchcancel", touch.handler, false);
    dom.body.addEventListener("touchend", function(e) {
        //window.touch.ing = false;
        touch.handler(event);
        //console.log(e.type);
    });

    is.iframe ? document.addEventListener("keyup", function(e) {
        if (e.key === "Escape") {
            if (window.parent.route.page === "/dashboard/*/build/preview/") {
                window.parent.dom.body.find('[data-href="/dashboard/:get/build/"]').click()
            }
        }
    }) : document.addEventListener("keyup", function(e) {
        if (e.key === "Escape") {
            if (route.page === "/dashboard/*/build/preview/") {
                '/dashboard/:get/build/'.router();
            }
        }
    });

    console.log('iframe', is.iframe);
    is.iframe ? null : window.addEventListener("message", (e)=>{
        var event = e.data[0]
        var data = e.data[1];
        if (is.iframe === false) {
            if (event === "router") {
                var page = route.page;
                var path = route.path;
                var slug = data;

                if (rout.es() === "/dashboard/*/build/er") {
                    var rte1 = rout.ed.dir(path).splice(0, 4);
                    var rte2 = rout.ed.dir(slug);
                    var rte0 = rte1.concat(rte2);
                    var href = rout.ed.url(rte0);
                }

                if (href) {
                    console.log(window.location, is.iframe, {
                        path,
                        slug,
                        href
                    }, {
                        rte0,
                        rte1,
                        rte2
                    });
                    href.router();
                }
            }
        }
    }
    )

    window.addEventListener("resize", window.on.resize)

    //DATABASE
    var cache = window.cache = {
        feed: {
            dashboard: {
                index: true
            }
        },
        repository: null
    };
    if (localStorage.githubAccessToken) {
        try {
            window.owner = await github.user.get();
            if (owner) {
                try {
                    cache.repository = await github.repos.get({
                        owner: owner.login,
                        repo: "db.dompad.io"
                    })
                } catch (e) {
                    try {
                        cache.repository = await github.repos.create({
                            data: JSON.stringify({
                                name: "db.dompad.io",
                                private: true
                            })
                        });
                    } catch (e) {
                        modal.alert({
                            body: "There was an error creating the cache.",
                            submit: "OK",
                            title: "Database Error"
                        })
                    }
                }
            }
        } catch (e) {}
    }

    //ROUTE
    var go = false;
    window.boot.router().then(go = true);

    console.log("...Initialized", {boot});
}
