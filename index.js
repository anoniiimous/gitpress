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
    console.log("Initializing...");

    //SHELL
    var html = ``;
    if (is.iframe) {
        const user = await github.user.get();
        const owner = user.login;
        const repo = window.parent.route.GOT[1];
        const branch = 'main';
        const file = 'raw/style/template.html';
        const path = '/' + owner + '/' + repo + '/' + branch + '/' + file;
        console.log("index.js init", {
            branch,
            file,
            html,
            owner,
            path,
            repo
        });
        try {
            html = atob((await github.raw.path(path)).content);
        } catch (e) {
            if (e.code === 404) {
                html = await ajax('/raw/html/template/template.iframe.shell.html');
            } else {
                modal.alert(e.code + ": " + e.message);
            }
        }
    } else {
        html = await ajax('/raw/html/template/template.shell.html');
    }
    html.length > 0 ? dom.body.find('boot').insertAdjacentHTML('afterend', html) : null;

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

    window.addEventListener("message", (e)=>{
        var event = e.data[0]
        var data = e.data[1];
        if (is.iframe === false) {
            if (event === "router") {
                var page = route.page;
                var path = route.path;
                var slug = data;

                if (getRoot() === "/dashboard/*/build/er/") {
                    var rte1 = rout.ed.dir(path).splice(0, 4);
                    var rte2 = rout.ed.dir(slug);
                    var rte0 = rte1.concat(rte2);
                    var href = rout.ed.url(rte0);
                }

                //console.log({path, slug, href}, {rte0, rte1, rte2});
                href.router();
            }
        }
    }
    )

    //ROUTE
    var go = false;
    window.boot.router().then(go = true);

    console.log("...Initialized");
}
