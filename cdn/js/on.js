window.on = {};

window.on.contextmenu = ()=>{}
;

window.on.key = {};
window.on.touch = {};

window.on.touch = {
    start: (event,type)=>{
        var target = event.target;
        iii.llips.isnt(target);
        if (1 > 0) {
            console.log("on.touch.start", type);
        }
        var el = target.closest("#building-blocks");
        if (el) {//console.log('touchstart.block',{element,box},box.clientWidth);
        }
    }
    ,
    move: (event,type)=>{
        if (1 > 0) {
            console.log("on.touch.move", type);
        }
        var target = event.target;
        var el = target.closest("#building-blocks");
        if (el && type === "drag") {
            var box = target.closest("box");
            var element = box.cloneNode(true);
            element.style.position = "fixed";
            box.parentNode.previousElementSibling ? null : el.insertAdjacentHTML("beforebegin", element.outerHTML);
            element = el.previousElementSibling;
            element.style.height = box.clientHeight + "px";
            element.style.width = box.clientWidth + "px";
            element.dataset.zIndex = 10;
            var tagName = box.find("text").placeholder;
            var index = 1;

            element.style.left = left = event.changedTouches[0].clientX - element.clientWidth / 2 + "px";
            element.style.top = head = event.changedTouches[0].clientY - element.clientHeight / 2 + "px";

            box.classList.add("dragging");

            var element = el.previousElementSibling;
            var x = event.changedTouches[0].clientX - element.clientWidth / 2;
            var y = event.changedTouches[0].clientY - element.clientHeight / 2;
            element.style.left = left = x + "px";
            element.style.top = head = y + "px";
            element.classList.add("opacity-50pc");

            var win = byId("editor").contentWindow;
            var behind = win.document.elementFromPoint(x, y);
            var box = target.closest("#building-blocks > box");
            var tagName = box.find("text").dataset.before;
            var shell = box.hasAttribute("data-shell");
            var blocks = behind ? behind.closest("blocks") : null;
            var block = blocks ? behind.closest("blocks > :not(ghost)") : null;
            //|| behind.closest('body > .body-header') || behind.closest('body > .body-nav')  || behind.closest('body > .body-section')  || behind.closest('body > .body-footer');
            var ghost = win.byId("ghost");
            ghost ? ghost.remove() : null;
            //console.log('tagName',{blocks,tagName});

            if (shell) {
                if (["header", "navigation", "section", "footer"].includes(tagName)) {
                    console.log("shell: " + tagName);
                }
            } else {
                if (block) {
                    var os = offset(block);
                    var up = true;
                    if (up) {
                        var spacer = document.createElement("ghost");
                        spacer.id = "ghost";
                        spacer.dataset.width = "100%";
                        spacer.dataset.height = "50px";
                        spacer.className = "border-5px-dashed";
                        var index = 1;
                        var tagName = "header";
                        ghost ? ghost.remove() : null;
                        //console.log('touchmove.block',{block},{x,y},os);
                        block ? block.insertAdjacentHTML("beforebegin", spacer.outerHTML) : null;
                    }
                }
            }
        }
    }
    ,
    end: (event,type)=>{
        var target = event.target;
        var el = target.closest("#building-blocks");
        if (el && type === "drag") {
            var win = byId("editor").contentWindow;
            var element = el.previousElementSibling;
            if (element) {
                element.classList.add("dragging");
                element.remove();

                var tagName = element.find("text").getAttribute("placeholder");
                var box = target.closest("box");
                var shell = box.hasAttribute("data-shell");
                var html = box.find("template").innerHTML;
                console.log("touch.end", {
                    shell,
                    tagName,
                    html
                });
            }
        }
        if (1 < 0) {
            console.log("on.touch.end");
        }
    }
};
(window.on["touch"]["dbltap"] = async(event)=>{
    console.log("dbltap", {
        iframe: self === top
    }, event.type);
    var target = event.target;
    var elem = target.closest("[data-dbltap]");
    if (elem) {}
}
),
(window.on["touch"]["drag"] = async(e,el)=>{
    var target = e.target;

    var el = touch.local.drag.elem;
    var x = touch.local.drag.currentX;
    var y = touch.local.drag.currentY;
    //console.log('touch.drag', e, {x, y}, [el]);

    if (el) {
        setTranslate(x, y, el);
    }

    document.body.dataset.touch = "drag";
}
),
(window.on["touch"]["swipe"] = {
    start: ()=>{
        console.log(34, "touch.swipe.start");
    }
    ,
    drag: ()=>{
        console.log(37, "touch.swipe.drag");
    }
    ,
    end: ()=>{
        console.log(40, "touch.swipe.drop");
    }
}),
(window.on["touch"]["press"] = async(event)=>{
    var target = event.target;
    var body = target.closest("body");
    var className = target.className;
    var classList = target.classList;

    var elem = target.closest("[data-press]");
    if (elem) {
        var x = eval(elem.dataset.press);
        typeof x === "function" ? x() : null;
    }

    //iii.llips.is(target);
}
),
(window.on["touch"]["tap"] = async(event)=>{
    //console.log("tap",{iframe:self===top},event.type);
    var target = event.target;
    //console.log('tap',{event,target});

    //EVENTS
    var el = target.closest(".block");
    if (el) {
        $(".block").removeClass("focus");
        $(target.closest(".block")).addClass("focus");
    } else {
        $(".block").removeClass("focus");
    }

    var id = target.closest("[id]");
    if (id) {}

    var el = target.closest("[data-iii]");
    if (el) {
        var type = el.dataset.iii;
        if (type === "llipsis") {
            iii.llips.is(el);
        }
    }

    var el = target.closest("[data-window]");
    if (el) {
        window.open(el.dataset.window, "_blank").focus();
    }

    var elem = target.closest("[data-href]");
    if (elem) {
        //elem.dataset.href.router({cookie:elem.dataset.cookie});
        var href = elem.dataset.href;
        //alert(href);
        var body = target.closest("body");
        if (!body.classList.contains("editor")) {
            body.classList.contains("iframe") ? window.parent.api.message["state"](window.parent.rout.e(href)) : href.router({
                href
            });
        }
    }

    var elem = target.closest("[data-href-parent]");
    if (elem) {
        var href = elem.dataset.hrefParent;
        window.parent.String().router({
            href,
            cookie: elem.dataset.cookie
        });
        self === top ? window.parent.String().router({
            href
        }) : href.router({
            href
        });
    }

    var elem = target.closest("[data-parent-href]");
    if (elem) {
        self === top ? null : elem.dataset.parentHref.router({
            href
        });
    }

    var elem = target.closest("[data-input]");
    if (elem) {
        var input = elem.dataset.input;
        if (input === "submit") {
            var submit = elem.find('input[type="submit"]');
            submit.click();
        }
    }

    var elem = target.closest("[data-modal]");
    if (elem) {
        console.log({
            elem
        });
        var func = elem.dataset.await ? eval(elem.dataset.await) : null;
        var call = typeof callBack === "function" ? callBack() : null;
        var html = elem.dataset.template ? byId(elem.dataset.template).innerHTML : "";
        modal[elem.dataset.modal](html, call).then((ppp)=>{
            console.log({
                ppp
            });
            ppp.onclick = (event)=>{
                event.target.tagName === "ASIDE" ? modal.exit(event.target) : null;
            }
            ;
        }
        );
    }

    var el = target.closest("[data-tab]");
    if (el) {
        var tab = el.dataset.tab;
        if (tab) {
            var tabs = rout.ed.dir(tab);
            var d = 0;
            do {
                var dir = tabs[d];
                if (dir.charAt(0) === "*") {
                    dir = GET[d];
                }
                if (dir.charAt(0) === ":") {
                    dir = dir.substring(1);
                    if (dir === "color") {
                        dir = colors.random();
                    }
                }
                tabs[d] = dir;
                d++;
            } while (d < tabs.length);
            console.log({
                tabs
            });
            if (dir) {
                var href = rout.ed.url(tabs);
                console.log(href, {
                    tabs,
                    tab
                });
                href.router();
            }
        }
        //elem.dataset.tabs = tab.index() + 1;
    }

    var elem = target.closest("[data-tap]");

    if (elem) {
        var x = eval(elem.dataset.tap);
        typeof x === "function" ? x() : null;
    }

    var ev = target.closest("[data-evt]");
    if (ev) {
        //console.log(ev);
        var evt = ev.dataset.evt;
        evt ? (dataset = ev.dataset) : null;
        if (evt === "blur") {
            target.dataset && target.dataset.evt === "blur" ? modal.exit(target) : null;
        }
        if (evt === "toggle") {
            var el;
            if (ev.dataset.elem === "parent") {
                el = ev.parentNode;
            }
            if (ev.dataset.class) {
                $(el).toggleClass(ev.dataset.class);
            }
        }
    }

    var elem = target.closest("[data-file]");
    if (elem) {
        console.log("data-file", elem, elem.find("input"));
        var file = elem.find("input");
        //console.log(file,elem.dataset.input);
        if (file) {
            file.dataset.elem = elem.dataset.file;
            elem.dataset.accept ? (file.accept = elem.dataset.accept) : null;
            elem.dataset.onload ? (file.dataset.onload = elem.dataset.onload) : null;
            console.log("file", file);
            file.click();
        }
    }

    var ev = target.closest("[data-hide]");
    if (ev) {
        if (ev.dataset.hide === "next") {
            byId(ev.dataset.hide).classList.add("hide");
        } else {
            byId(ev.dataset.hide).classList.add("hide");
        }
    }

    var elem = target.closest("[data-select]");
    if (elem) {
        //alert(123);
        var select = target.closest("[data-select]");
        var selected = target.closest("[data-select] > *");
        $(selected).toggleClass(select.dataset.select);
    }

    var elem = target.closest("[data-expand]");
    if (elem) {
        var ind = byId(elem.dataset.expand);
        var chd = target.closest("ul > li");
        $(chd).toggleClass("expand");
        $(chd).siblings().removeClass("expand");
    }

    var elem = target.closest("[data-submit]");
    if (elem) {
        var id = elem.dataset.submit;
        var form = byId(id);
        var submit = form.find('[type="submit"]');
        submit.click();
    }

    var elem = target.closest("[data-toggle]");
    if (elem) {
        var ind = byId(elem.dataset.toggle);
        $(ind).toggleClass(elem.dataset.class);
    }

    var el = target.closest("[data-browse]");
    if (el) {
        if (el.dataset.browse === "back") {
            history.length > 0 ? history.back() : el.dataset.fallback.router();
        }
        if (el.dataset.browse === "hide") {
            event.target.closest("aside").classList.add("hide");
        }
        if (el.dataset.browse === "exit") {
            modal.exit(el);
        }
    }

    var library = target.closest("[data-api]");
    if (library) {
        //console.log({library},library.dataset);
        window[library.dataset.api][library.dataset.method][library.dataset.resource](target);
    }

    var classList = target.classList;
    var className = target.className;
    var elem = target.closest("[data-evt]");
    var evt = elem ? elem.dataset.evt : null;
    if (evt === "steps") {
        const form = target.closest('form');
        const button = target.closest('[data-goto]');
        if (button) {
            var dataset = button.dataset;
            if (dataset.disabled) {
                if (dataset.disabled === "true") {
                    notify.alert(dataset.require, 3);
                } else {
                    step(dataset);
                }
            } else if (dataset.confirm) {
                if (dataset.confirm === "true") {
                    if (confirm(dataset.message)) {
                        step(dataset);
                    }
                } else {
                    step(dataset);
                }
            } else if (dataset.complete) {
                if (dataset.complete === "false") {
                    notify.alert(dataset.require, 3);
                } else {
                    form.find('input[type="submit"]').click();
                }
            } else {
                step(dataset);
            }
        }
        function step(dataset) {
            console.log({
                dataset
            });
            if (dataset.goto) {
                $(event.target.closest('form').all('block[data-step]')).addClass('display-none');
                $(event.target.closest('form').all('block[data-step="' + dataset.goto + '"]')).removeClass('display-none');
                var link = "";
                if (dataset.goto === "two") {
                    const color = 1 > 0 ? "fff" : "000";
                    const domain = event.target.closest('block').find('input').value;
                    link = "/setup/" + domain + '/' + color + "/";
                    link.router();
                }
                if (dataset.goto === "three") {
                    link = "/setup/:get/:get/_/";
                    link.router();
                }
            }
        }
    }
}
);

window.on.focus = {};
window.on.focus.in = {};
window.on.focus.in.card = {
    holder: (event)=>{
        const target = event.target;
        var key = event.key;
        var value = event.target.value;
        var firstname = ''
          , lastname = '';

        var parts = event.target.value.trim().split(' ');
        firstname = parts.length > 2 ? parts[0] : parts[0];
        lastname = parts.length > 1 ? parts[parts.length - 1] : null;

        const text = target.parentNode.previousElementSibling;

        target.className = "padding-x-20px";
        text.className = "background-color-fff color-bbb height-18px line-height-18px padding-x-20px position-absolute";
        text.dataset.transform = "translate3d(0,-50%,0)";

        if (lastname || value.length === 0) {
            target.classList.remove('color-ff3b30')
            text.classList.add('color-bbb')
            text.classList.remove('color-ff3b30')
        } else {
            target.classList.add('color-ff3b30')
            text.classList.remove('color-bbb')
            text.classList.add('color-ff3b30')
        }
    }
};
window.on.focus.in.search = (target)=>{
    const result = target.closest('card').nextElementSibling;
    result.classList.remove('display-none');
    byId('cancel-results').classList.remove('display-none');
    byId('exit-search').classList.add('-tablet-display-none');
    const keywords = byId('keywords').value;
    var goto = window.location.pathname + ('?keywords') + (keywords.length > 0 ? '=' + keywords : '') + (window.location.hash ? '#' + window.location.hash : '');
    searchResults(keywords);
    history.pushState(goto, '', goto);
}
window.on.focus.out = {};
window.on.focus.out.card = {
    holder: ()=>{
        const target = event.target;
        var key = event.key;
        var value = event.target.value;
        var firstname = ''
          , lastname = '';

        var parts = event.target.value.trim().split(' ');
        firstname = parts.length > 2 ? parts[0] : parts[0];
        lastname = parts.length > 1 ? parts[parts.length - 1] : null;

        const text = target.parentNode.previousElementSibling;

        if (lastname || value.length === 0) {
            target.classList.remove('color-ff3b30')
            text.classList.add('color-bbb')
            text.classList.remove('color-ff3b30')
        } else {
            target.classList.add('color-ff3b30')
            text.classList.remove('color-bbb')
            text.classList.add('color-ff3b30')
        }

        if (value.length === 0) {
            target.className = "opacity-0";
            text.className = "color-bbb padding-x-20px";
            text.removeAttribute('data-transform');

        }
    }
};

window.on.key = {};
window.on.key.down = {};
window.on.key.down.card = {
    holder: (target)=>{
        const text = target.parentNode.previousElementSibling;
        text.className = "background-color-fff color-bbb height-18px line-height-18px padding-x-20px position-absolute";
        text.dataset.transform = "translate3d(0,-50%,0)";
    }
};
window.on.key.down.setup = {
    app: (event)=>{
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    }
}

window.on.key.up = {};
window.on.key.up.card = {
    holder: event=>{
        const target = event.target;
        var key = event.key;
        var value = event.target.value;
        var firstname = ''
          , lastname = '';

        var parts = event.target.value.trim().split(' ');
        firstname = parts.length > 2 ? parts[0] : parts[0];
        lastname = parts.length > 1 ? parts[parts.length - 1] : null;

        const text = target.parentNode.previousElementSibling;
        if (lastname) {
            target.classList.remove('color-ff3b30');
            text.classList.add('color-bbb')
            text.classList.remove('color-ff3b30')
        } else {
            target.classList.add('color-ff3b30');
            text.classList.remove('color-bbb')
            text.classList.add('color-ff3b30')
        }

        //byId('preview-card').find('.card-holder :first-child').textContent = firstname;
        //byId('preview-card').find('.card-holder :last-child').textContent = lastname;
    }
};
window.on.key.up.setup = {
    app: event=>{
        var target = event.target;
        var keyCode = event.keyCode;
        var logo = byId("preview-logo");
        const button = target.closest('block').find('[data-goto="two"]');
        if (target.value === "") {
            logo.firstElementChild.dataset.char = "A";
            logo.dataset.after = "App Title";
            button.dataset.disabled = "true";
            button.classList.add('opacity-50pct');
        } else {
            logo.firstElementChild.dataset.char = target.value.charAt(0);
            logo.dataset.after = target.value;
            button.dataset.disabled = "false";
            button.classList.remove('opacity-50pct');
        }
        if (keyCode === 13) {
            button.click();
        }
    }
}

window.on["submit"] = {
    create: {
        project: event=>{
            event.preventDefault();
            const form = event.target;
            const name = form.all('input')[1].value;
            if (name) {
                const data = JSON.stringify({
                    name
                });
                const dataType = "POST";
                const settings = {
                    data,
                    dataType
                };
                console.log(settings);
                github.user.repos(settings).then(()=>{
                    modal.page(byId(dataset.complete).content.firstElementChild.outerHTML, null, 'backdrop-filter-blur-10px position-fixed width-100pct');
                }
                )
            }
        }
    },
    dashboard: {
        files: (event)=>{
            event.preventDefault();
        }
        ,
        page: (event)=>{
            event.preventDefault();
        }
        ,
        project: (event)=>{
            event.preventDefault();
        }
    },
    my: {
        login: async(event)=>{
            event.preventDefault();
            console.log(event.target);
            var target = event.target;
            var username = event.target.find('[type="email"]').value;
            var password = event.target.find('[type="password"]').value;
            auth.login.user(username, password).then(()=>{
                if (dom.body.dataset.page === "/") {
                    "/".router();
                }
            }
            ).catch(()=>{
                alert("Authentication Failed");
            }
            );
        }
    },
    setup: {
        form: event=>{
            event.preventDefault();
            const form = event.target;
            const name = 'blog.anoniiimous.' + form.all('input')[0].value;
            const template = 'default';
            if (name) {
                var data = JSON.stringify({
                    name
                });
                const dataType = "POST";
                const settings = {
                    data,
                    dataType
                };
                console.log(settings);
                github.repos.generate(settings).then(async(data)=>{
                    console.log('repos.generate', {data});
                    var owner = "anoniiimous";
                    var repo = template;
                    var path = "/index.html";
                    var params = {
                        owner,
                        repo,
                        path
                    }
                    var data = JSON.stringify({});
                    const settings = {
                        data
                    };
                    github.repos.contents(params,settings).then(async(data)=>{
                        alert("Project created" + data.name);
                        const html = byId('template-setup-complete').content.firstElementChild;
                        html.all('box')[3].dataset.href = "/dashboard/" + data.name;
                        modal.page(html.outerHTML, null, 'backdrop-filter-blur-10px position-fixed width-100pct');
                    }
                    );
                }
                )
            }
        }
    },
};
