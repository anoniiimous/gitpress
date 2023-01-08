window.on = {};

window.on.change = {

    file: (event,s)=>{

        return new Promise((resolve,reject)=>{

            var target = event.target;
            var dataset = target.dataset;
            var FR = new FileReader();

            var files = target.files;
            console.log({
                files
            }, {
                s,
                event,
                target,
                dataset
            });
            if (files && files.length > 0) {
                if (files.length === 1) {
                    var reader = FR;
                    var file = files[0];
                    var s = {};
                    var x = null;
                    if (dataset.onload) {
                        x = eval(dataset.onload);
                        if (typeof x === 'function') {
                            s.onload = x();
                        }
                    }
                    if (dataset.onprogress) {
                        //x = eval(dataset.onprogress);
                        reader.onprogress = e=>onProgress(e, dataset.onprogress);
                        console.log(35, {
                            dataset,
                            x
                        }, typeof x === 'function');
                        if (typeof x === 'function') {
                            s.onprogress = x();
                            console.log(39, {
                                s
                            });
                        } else {
                            s.onprogress = x;
                            console.log(42, {
                                x,
                                s
                            });
                        }
                    }
                    reader.readAsDataURL(file);
                    if (s) {
                        console.log(47, {
                            s
                        });
                        reader.onload = onLoad;
                        s.onloadstart ? reader.onloadstart = s.onloadstart : null;
                        s.onprogress ? reader.onprogress = s.onprogress : null;
                        s.onabort ? reader.onabort = s.onabort : null;
                        s.onerror ? reader.onerror = s.onerror : null;
                    } else {
                        reader.onload = onLoad;
                    }
                    function onLoad() {
                        s.onload ? s.onload : null;
                        resolve(reader.result);
                        target.insertAdjacentHTML('afterend', target.cloneNode().outerHTML);
                        target.remove();
                    }
                    function onProgress(e, f) {
                        if (e.lengthComputable) {
                            e.nodeElement = target;
                            f ? eval(f)(e) : null;
                        }
                    }
                }
            }

        }
        );

    }
    ,

};

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
window.on.key.up.auto = {
    size: (target)=>{
        target.style.height = 0;
        target.style.height = (target.scrollHeight) + "px";
    }
};

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
    about: (target) => {
        on.key.up.auto.size(target);
        var path = rout.ed.dir(location.pathname);
        path[4] = btoa(target.value);
        var href = rout.ed.url(path);
        history.replaceState({}, 'Title', href);
    },
    app: event=>{
        var target = event.target;
        var keyCode = event.keyCode;
        var logo = byId("preview-logo");
        const button = target.closest('block').all('footer box')[1];
        console.log
        if (target.value === "") {
            //logo.firstElementChild.dataset.char = "A";
            //logo.dataset.after = "App Title";
            button.dataset.disabled = "true";
            button.classList.add('opacity-50pct');
        } else {
            //logo.firstElementChild.dataset.char = target.value.charAt(0);
            //logo.dataset.after = target.value;
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
            const shortname = form.all('input[type="text"]')[0].value;
            const name = 'blog.cms.' + shortname;
            const template = 'default';
            console.log({
                form,
                input: form.all('input[type="text"]')
            });
            if (name) {
                var data = JSON.stringify({
                    name
                });
                const dataType = "POST";
                const settings = {
                    data,
                    dataType
                };
                console.log(settings, shortname);
                github.repos.generate(settings).then(async(data)=>{
                    console.log('repos.generate', {
                        data,
                        shortname
                    });
                    ('/dashboard/' + shortname + '/').router();
                }
                )
            }
        }
    },
    dashboard: {
        file: async(event)=>{
            event.preventDefault();

            const form = event.target;
            const user = await github.user.get();

            var params = {};
            params.owner = user.login;
            params.path = "/c/files/" + form.all('box')[1].find('text').textContent;
            params.repo = 'blog.cms.' + GET[1]

            var settings = {};
            settings.data = JSON.stringify({
                content: btoa(result),
                message: "Create " + file.name
            }),
            settings.dataType = "PUT";

            console.log({
                params,
                settings
            });

            const a = (e)=>{
                ('/dashboard/' + GET[1] + '/files/').router();
            }

            //github.repos.contents(params, settings).then(a);
        }
        ,
        page: (event)=>{
            event.preventDefault();
        }
        ,
        post: async(event)=>{
            event.preventDefault();
            console.log(704, {
                event
            });

            /*VARS*/
            const form = event.target;
            const ext = 'html';
            const title = form.find('header [type="text"]').value;
            var description = form.find('header textarea').value;
            var filename = title.toLowerCase().replaceAll(' ', '-').replaceAll(',', '').replaceAll("'", '').replaceAll('&', 'and') + '.' + ext;
            const body = form.find('card textarea').value;
            const user = await github.user.get();
            const html = await ajax("/raw/html/template/template.post.html");
            const doc = new DOMParser().parseFromString(html, "text/html");
            doc.head.find('title').textContent = title;
            doc.head.find('meta[name="description"]').content = description;
            doc.body.find('article').innerHTML = body;
            console.log(719, {
                doc
            });
            var content = doc.head.outerHTML + doc.body.outerHTML;

            if (event.submitter.innerText === "Save Draft") {

                /*GIST*/
                if (confirm("Are you sure you want to save this draft?")) {
                    var files = {};
                    files[filename] = {
                        content
                    };
                    var gist = form.all("button")[0].dataset.gist;
                    if (gist) {
                        alert("Updating Gist");
                        d = await github.gists.update({
                            gist
                        }, {
                            data: JSON.stringify({
                                "description": description,
                                "public": false,
                                files
                            }),
                            dataType: "PATCH"
                        });
                        const created = d.created_at;
                        description = d.description;
                        gist = d.id;
                        console.log(735, {
                            d,
                            data
                        });
                    } else {
                        files[filename] = {
                            content: doc.head.outerHTML + doc.body.outerHTML
                        };
                        d = await github.gists.create({
                            data: JSON.stringify({
                                "description": description,
                                "public": false,
                                files
                            }),
                            dataType: "POST"
                        });
                        const created = d.created_at;
                        description = d.description;
                        gist = d.id;
                        console.log(735, {
                            d,
                            data
                        });
                    }

                    /*CACHE*/
                    const params = {
                        owner: user.login,
                        repo: "blog.cms." + GET[1],
                        path: "/raw/cache/posts.json"
                    };
                    const posts = await github.repos.contents(params, {});
                    content = atob(posts.content);
                    var rows = JSON.parse(content);
                    const row = rows.filter(row=>row.filename === filename);
                    console.log(777, {
                        row
                    });
                    if (row.length > 0) {
                        const index = rows.indexOf(row);
                        row[0].gist = gist;
                        const update = rows;
                        update[index] = row;
                    } else {
                        length = rows.length;
                        if (length > 0) {
                            var latest = rows[0];
                            var id = latest.id + 1;
                        } else {
                            var latest = rows[0];
                            var id = 1;
                        }
                        update = {
                            filename,
                            gist,
                            "id": id,
                            title
                        }
                        rows.unshift(update);
                    }
                    console.log(773, {
                        gist,
                        rows,
                        row,
                        update
                    });

                    params.sha = posts.sha;
                    settings = {
                        data: JSON.stringify({
                            content: btoa(JSON.stringify(rows, null, 4)),
                            message: "Update Posts Table",
                            sha: posts.sha
                        }),
                        dataType: "PUT"
                    }
                    console.log(801, {
                        params,
                        settings
                    });

                    github.repos.contents(params, settings).then(put=>{
                        console.log(791, {
                            put
                        });
                        //("/dashboard/:get/posts/").router();
                    }
                    );

                }

            }

            if (event.submitter.innerText === "Publish") {

                /*FILE*/
                if (confirm("Are you sure you want to publish this post?")) {
                    var data = await github.repos.contents({
                        owner: user.login,
                        repo: "blog.cms." + GET[1],
                        path: "/raw/posts/" + filename
                    }, {
                        data: JSON.stringify({
                            content: btoa(content),
                            message: "Create Post"
                        }),
                        dataType: "PUT"
                    });
                    filename = data.content.name;
                    const sha = data.content.sha;

                    /*GIST*/
                    var files = {};
                    files[filename] = {
                        content
                    };
                    d = await github.gists.create({
                        data: JSON.stringify({
                            "description": "Example of a gist",
                            "public": false,
                            files
                        }),
                        dataType: "POST"
                    });
                    const created = d.created_at;
                    description = d.description;
                    gist = d.id;
                    console.log(755, {
                        d,
                        data
                    });

                    /*CACHE*/
                    const params = {
                        owner: user.login,
                        repo: "blog.cms." + GET[1],
                        path: "/raw/cache/posts.json"
                    };
                    const posts = await github.repos.contents(params, {});
                    content = atob(posts.content);
                    const rows = JSON.parse(content);

                    const length = rows.length;
                    if (length > 0) {
                        var latest = rows[0];
                        var id = latest.id + 1;
                    } else {
                        var latest = rows[0];
                        var id = 1;
                    }

                    const row = {
                        filename,
                        gist,
                        id,
                        sha,
                        title
                    }
                    rows.unshift(row);

                    params.sha = posts.sha;

                    settings = {
                        data: JSON.stringify({
                            content: btoa(JSON.stringify(rows, null, 4)),
                            message: "Update Posts Table",
                            sha: posts.sha
                        }),
                        dataType: "PUT"
                    }
                    console.log(801, {
                        params,
                        settings
                    });

                    github.repos.contents(params, settings).then(put=>{
                        console.log(791, {
                            put
                        });
                        ("/dashboard/:get/posts/").router();
                    }
                    );
                }

            }
        }
        ,
        project: (event)=>{
            event.preventDefault();
        }
        ,
        webmanifest: async(event)=>{
            event.preventDefault();
            const form = event.target;
            const steps = form.all('block > column');
            const title = steps[0].find('[type="text"]').value;
            const color = steps[1].find('#color-data-hex').all('text')[1].textContent.split('#')[1];
            const about = steps[2].find('textarea').textContent;
            alert("webmanifest: " + title + " : " + color + " : " + about);
            
            const user = await github.user.get();
            var owner = user.login;
            var repo = GET[1];
            var path = "/site.webmanifest";
            var params = {
                owner,
                repo,
                path
            }
            var raw = JSON.stringify({
                name,
                "theme_color": color
            }, null, 2);
            var content = btoa(raw);
            var message = "Create Webmanifest";
            const data = JSON.stringify({
                content,
                message
            });
            const dataType = "PUT";
            const settings = {
                data,
                dataType
            };
            console.log({
                params,
                settings
            });
            github.repos.contents(params, settings).then((window.location.pathname + window.location.hash).router())
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
            const shortname = form.all('input')[0].value;
            const name = 'blog.cms.' + shortname;
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
                    console.log('repos.generate', {
                        data
                    });
                    const html = byId('template-setup-complete').content.firstElementChild;
                    html.all('box')[3].dataset.href = "/dashboard/" + shortname;
                    modal.page(html.outerHTML, null, 'backdrop-filter-blur-10px position-fixed width-100pct');
                }
                )
            }
        }
    },
};
