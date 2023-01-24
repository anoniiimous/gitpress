window.onload = ()=>{
    window.dom = {
        body: document.body,
        boot: document.getElementById("boot"),
        nav: document.body.querySelector('nav')
    };

    window.global = window.globals;
    dom.body.dataset.load = "ing";

    init();
}

async function init() {
    console.log("Initializing", is.iframe, is);

    //TOUCH
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

    document.addEventListener("keyup", function(e) {
        if (e.key === "Escape") {
            if (window.parent.route.page === "/dashboard/*/build/preview/") {
                window.parent.dom.body.find('[data-href="/dashboard/:get/build/"]').click()
            }
        }
    });
    
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

    //ROUTE
    var pathname = window.parent.location.pathname;
    var dir = rout.ed.dir(pathname);
    dir.splice(0,4);
    var uri = rout.ed.url(dir);
    uri.router();

    console.log("iframe.index.js Initialized", {
        body: window.document.body,
        dir,
        html,
        uri
    });
}
