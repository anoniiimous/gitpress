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

    //SHELL
    var html = ``;
    if (is.iframe) {
        const user = await github.user.get();
        const owner = user.login;
        const repo = window.parent.GET[1];
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
    dir.splice(0,3);
    var uri = rout.ed.url(dir);
    //uri.router();

    console.log("Initialized", {
        body: window.document.body,
        dir,
        html,
        uri
    });
}
