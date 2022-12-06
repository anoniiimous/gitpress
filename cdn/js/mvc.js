window.mvc ? null : (window.mvc = {});

window.mvc.m ? null : (window.mvc.m = model = {
    error: {
        image: e=>{
            console.log('model.error.image', e);
            e.remove();
        }
    }
});

window.mvc.v ? null : (window.mvc.v = view = function(route) {
    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        controller.nav.close();

        $(dom.body.all('aside')).remove()

        if (root) {

            const roots = ["dashboard", "templates"];
            if (roots.indexOf(root) === -1) {
                if (get.length > 1) {
                    const owner = root;
                    const repo = "blog.cms." + get[1];
                    const path = "/site.webmanifest";
                    const params = {
                        owner,
                        repo,
                        path
                    }
                    const settings = {}
                    github.repos.contents(params, settings).then(data=>{
                        const content = data.content;
                        const raw = atob(content);
                        const json = JSON.parse(raw);
                        console.log(49, {
                            data,
                            json
                        });
                        const vp = dom.body.find('[data-page="/*/*/"]');
                        //vp.find('[placeholder="Site"]').textContent = json.name;
                        controller.blog.render(byId('iframe-user-blog'), json);
                    }
                    ).catch(async(error)=>{
                        console.log("43.error", {
                            error
                        });
                    }
                    );
                }
            }
            if (root === "dashboard") {
                if (get.length > 1) {
                    const title = get[1];
                    dom.body.find('main > nav [placeholder]').textContent = title;
                    if (get.length > 2) {
                        if (get[2] === "files") {
                            if (get.length > 3) {
                                if (get[3] === "file") {}
                            }
                            var feed = byId('feed-dashboard-files');
                            if (feed.innerHTML === "" || get.length < 4) {
                                const user = await github.user.get();
                                const name = get[4] + '.html';
                                var params = {
                                    owner: user.login,
                                    path: "/cdn/files",
                                    repo: "blog.cms." + get[1]
                                };
                                var settings = {};
                                var vp = dom.body.find('pages[data-pages="/dashboard/*/files/"]');
                                //alert("Attempting to fetch files");
                                github.repos.contents(params, settings).then(data=>{
                                    //alert("Files fetched successfully");
                                    if (data) {
                                        console.log(84, {
                                            data
                                        });
                                        feed.innerHTML = "";
                                        if (data.length > 0) {
                                            vp.all('card')[1].find('box').classList.remove('display-none');
                                            var d = 0;
                                            do {
                                                var row = data[d];
                                                var box = byId('template-dashboard-files').content.firstElementChild.cloneNode(true);
                                                var name = row.name;
                                                var arr = name.split('.');
                                                var ext = arr[arr.length - 1];
                                                var icon = "file";
                                                ["jpg", "jpeg", "png", "svg", "webp"].includes(ext) ? icon = "image" : null;
                                                ["mp3"].includes(ext) ? icon = "music" : null;
                                                ["mp4", "wav"].includes(ext) ? icon = "video" : null;
                                                ["doc", "docx", "pdf", "txt"].includes(ext) ? icon = "file-document" : null;
                                                box.dataset.sha = row.sha;
                                                box.find('ico n').className = "gg-" + icon;
                                                box.find('text').dataset.href = "/dashboard/" + get[1] + "/files/file/" + row.name;
                                                box.find('text span').textContent = row.name;
                                                box.all('text')[1].textContent = formatBytes(row.size);
                                                var html = box.outerHTML;
                                                feed.insertAdjacentHTML('beforeend', html);
                                                d++;
                                            } while (d < data.length)
                                        } else {
                                            vp.all('card')[1].find('box').classList.add('display-none');
                                        }
                                    }
                                }
                                ).catch(async(error)=>{
                                    //alert("Failed to fetch files");
                                    console.log("43.error", {
                                        error
                                    });
                                    if (error.code === 404) {
                                        //alert("Setup Project");
                                        resolve(route);
                                    }
                                }
                                );
                            }

                        }
                        if (get[2] == "posts") {
                            if (get.length > 3) {
                                if (get.length > 4) {
                                    const user = await github.user.get();
                                    const name = get[4] + '.html';
                                    var params = {
                                        owner: user.login,
                                        path: "/cdn/posts/" + name,
                                        repo: "blog.cms." + get[1]
                                    };
                                    var settings = {};
                                    var vp = dom.body.find('pages[data-pages="/dashboard/*/posts/post/"]');
                                    vp.find('header input[type="text"]').value = "";
                                    vp.find('header textarea').value = "";
                                    vp.find('card textarea').value = "";
                                    github.repos.contents(params, settings).then(data=>{
                                        console.log(50, {
                                            data
                                        });
                                        if (data) {
                                            const filename = data.name;
                                            const content = atob(data.content);
                                            const doc = new DOMParser().parseFromString(content, "text/html");
                                            console.log(89, {
                                                content,
                                                doc
                                            });
                                            vp.find('form').dataset.filename = filename;
                                            vp.find('header input[type="text"]').value = doc.head.find("title").textContent;
                                            vp.find('header textarea').value = doc.head.find("meta[name='description']").content;
                                            vp.find('card textarea').value = doc.body.find('article').textContent;

                                            const gist = doc.head.find('meta[name="gist"]').content;
                                            if (gist) {
                                                vp.find('form > footer').all('button')[0].dataset.gist = gist;
                                            }
                                        }
                                    }
                                    ).catch(async(error)=>{
                                        console.log("43.error", {
                                            error
                                        });
                                        if (error.code === 404) {
                                            //alert("Setup Project");
                                            resolve(route);
                                        }
                                    }
                                    );

                                } else {}
                                resolve(route);
                            } else {
                                const user = await github.user.get();
                                console.log({
                                    user
                                }, user.login);
                                var params = {
                                    owner: user.login,
                                    path: "/cdn/posts",
                                    repo: "blog.cms." + get[1]
                                };
                                var settings = {};
                                controller.posts.read(get[1]);
                            }
                        } else if (get[2] === "setup") {
                            var vp = dom.body.find('[data-pages="/setup/"]');
                            if (get.length > 1) {} else {
                                //alert(vp.outerHTML);
                                vp.all('block[data-step]')[0].find('[data-goto="two"]').classList.add('opacity-50pct');
                                vp.all('block[data-step]')[0].find('[data-goto="two"]').dataset.disabled = "true";
                                vp.all('block[data-step]')[0].find('input[type="text"]').value = "";
                                $(vp.all('form > header box flex')[0]).attr("data-height", "50px");
                                $(vp.all('form > header box flex')[0]).attr("data-width", "50px");
                                $(vp.all('block[data-step]')).addClass('display-none');
                                $(vp.all('block[data-step]')[0]).removeClass('display-none');
                            }
                            resolve(route);
                        }
                    }

                    const user = await github.user.get();
                    var params = {
                        owner: user.login,
                        path: "/site.webmanifest",
                        repo: "blog.cms." + get[1]
                    };
                    var settings = {};
                    github.repos.contents(params, settings).then(data=>{
                        const content = data.content;
                        const raw = atob(content);
                        const json = JSON.parse(raw);
                        console.log(43, {
                            data,
                            json
                        });
                        dom.body.find('main > nav').find('[placeholder="Project Name"]').textContent = json.name;
                    }
                    ).catch(async(error)=>{
                        console.log("43.error", {
                            error
                        });
                        if (error.code === 404) {
                            //alert("Setup Project");
                            const html = await ajax('/cdn/html/page/page.setup.html');
                            modal.page(html);
                            resolve(route);
                        }
                    }
                    );
                } else {
                    if (auth.user()) {
                        const settings = {};
                        console.log(settings);
                        const user = await github.user.get();
                        console.log({
                            user
                        }, user.login);
                        github.search.repositories("q=blog.cms+user%3A" + user.login).then(data=>{
                            data = data.filter(item=>item.name.includes('blog.cms'));
                            console.log({
                                data
                            });
                            const feed = byId('feed-dashboard');
                            feed.innerHTML = "";
                            if (data.length > 0) {
                                const template = byId('template-feed-dashboard').content.firstElementChild.cloneNode(true);
                                var x = 0;
                                do {
                                    const row = data[x];
                                    const shortname = row.name.split('.')[2];
                                    template.find('text').dataset.href = "/dashboard/" + shortname;
                                    template.find('text').dataset.owner = row.owner.login;
                                    template.find('text').dataset.repo = row.name;
                                    template.find('text').innerHTML = shortname
                                    feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                    x++;
                                } while (x < data.length);
                            }
                        }
                        );
                    }
                }
                resolve(route);
            } else if (root === "directory") {
                if (auth.user()) {
                    const settings = {};
                    console.log(settings);
                    const user = await github.user.get();
                    console.log({
                        user
                    }, user.login);
                    github.search.repositories("q=blog").then(data=>{
                        //data = data.filter(item=>item.name.includes('blog.cms'));
                        console.log(282, {
                            data
                        });
                        const feed = byId('feed-directory');
                        feed.innerHTML = "";
                        if (data.length > 0) {
                            const template = byId('template-feed-directory').content.firstElementChild.cloneNode(true);
                            var x = 0;
                            do {
                                const row = data[x];
                                const shortname = row.name;
                                template.find('picture').dataset.href = "/" + row.owner.login + "/" + shortname + "/";
                                template.find('text').dataset.href = "/dashboard/" + shortname;
                                template.find('text').dataset.owner = row.owner.login;
                                template.find('text').dataset.repo = row.name;
                                template.find('text').innerHTML = shortname;
                                //.split('.')[2];
                                feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                x++;
                            } while (x < data.length);
                        }
                    }
                    );
                }
                resolve(route)
            } else if (root === "templates") {
                resolve(route)
            } else {
                resolve(route);
            }

        } else {

            resolve(route);

        }
    }
    );
}
);

window.mvc.c ? null : (window.mvc.c = controller = {

    blog: {

        render: (iframe,json)=>{

            const theme = json["theme_color"];

            const doc = iframe.contentWindow.document;
            doc.body.style.backgroundColor = theme;

            const owner = GET[0];
            const repo = "blog.cms." + GET[1];
            const path = "/index.html";
            const params = {
                owner,
                repo,
                path
            }
            const settings = {}

            github.repos.contents(params, settings).then(data=>{
                const content = data.content;
                const raw = atob(content);
                console.log(282, {
                    data,
                    json
                });

                const doc = new DOMParser().parseFromString(raw, 'text/html');
                const body = doc.body;
                console.log({
                    doc,
                    body,
                    raw
                });

                const vp = dom.body.find('[data-page="/*/*/"]');
                vp.find('[placeholder="Site"]').textContent = json.name;
                iframe.contentWindow.document.body.innerHTML = body.innerHTML;
            }
            ).catch(async(error)=>{
                console.log("43.error", {
                    error
                });
            }
            );

        }

    },

    files: {

        cancel: ()=>{
            dom.body.find('[data-page="/dashboard/*/files/file/"]').innerHTML = "";
            ("/dashboard/:get/files/").router();
        }
        ,

        delete: (target)=>{
            const box = target.closest('box');
            const sha = box.dataset.sha;
            alert(sha);
        }
        ,

        deselect: target=>{
            const metadata = target.closest('box');
            const select = metadata.previousElementSibling;
            const actions = metadata.nextElementSibling;
            const label = select.find('[data-file]');
            metadata.classList.add('display-none');
            select.classList.remove('display-none');
            actions.classList.add('display-none');
            label.insertAdjacentHTML('beforebegin', label.outerHTML);
            label.remove();
        }
        ,

        file: ()=>{
            dom.body.find('[data-page="/dashboard/*/files/file/"]').innerHTML = "";
            ("/dashboard/:get/files/file/").router();
        }
        ,

        select: (event)=>{
            const input = event.target;
            const label = input.closest('[data-file]');
            const select = input.closest('box');
            const load = select.find('load');
            const metadata = input.closest('box').nextElementSibling;
            const actions = metadata.nextElementSibling;
            const file = input.files[0];
            const name = file.name;
            const arr = name.split(".");
            const ext = arr[arr.length - 1];
            var format = ext;
            ext === "htm" ? format = "html" : null;
            ext === "jpeg" ? format = "jpg" : null;
            console.log(format);
            const a = async(result)=>{

                const user = await github.user.get();

                var params = {};
                params.owner = user.login;
                params.path = "/cdn/files/" + file.name;
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

                const aa = (e)=>{
                    //('/dashboard/' + GET[1] + '/files/').router();
                    select.classList.add('display-none');
                    metadata.classList.remove('display-none');
                    metadata.find('text').textContent = name;
                    actions.classList.remove('display-none');
                    load.classList.add('display-none');
                    load.find('er').removeAttribute('style');
                }

                const bb = (e)=>{
                    //('/dashboard/' + GET[1] + '/files/').router();
                    //select.classList.add('display-none');
                    //metadata.classList.remove('display-none');
                    //metadata.find('text').textContent = name;
                    //actions.classList.remove('display-none');
                    load.classList.add('display-none');
                    load.find('er').removeAttribute('style');
                }

                github.repos.contents(params, settings).then(aa).catch(bb);

            }
            on.change.file(event).then(a);
        }
        ,

        selecting: e=>{
            const input = e.nodeElement;
            const load = input.closest('box').find('load');
            const loader = load.find('er');
            var percentLoaded = Math.round((e.loaded / e.total) * 100);
            load.classList.remove('display-none');
            loader.style.width = percentLoaded + "%";
        }
        ,

        upload: async(event)=>{

            const user = await github.user.get();

            var params = {};
            params.owner = user.login;
            params.path = "/cdn/files/" + file.name;
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

            const aa = (e)=>{
                ('/dashboard/' + GET[1] + '/files/').router();
            }

            github.repos.contents(params, settings).then(aa);

        }

    },

    menu: {

        close: ()=>{

            const nav = dom.body.find('body > nav');
            nav.dataset["960pxTransform"] = "translateX(-100%)";
            nav.firstElementChild.classList.add('display-none');

        }
        ,

        open: ()=>{

            const nav = dom.body.find('body > nav');
            nav.dataset["960pxTransform"] = "0";
            nav.firstElementChild.classList.remove('display-none');

        }

    },

    nav: {

        close: ()=>{

            const nav = document.body.find('body > main > nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main > pages');

            nav.dataset["960pxTransform"] = "translateX(-100%)";
            blocks.dataset["960pxTransform"] = "0";

        }
        ,

        toggle: (target)=>{

            const nav = document.body.find('body > main > nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main > pages');

            if (transform === "translateX(-100%)") {
                nav.dataset["960pxTransform"] = "translateX(0)";
                blocks.dataset["960pxTransform"] = "translateX(280px)";
            } else {
                nav.dataset["960pxTransform"] = "translateX(-100%)";
                blocks.dataset["960pxTransform"] = "0";
            }

        }
        ,

    },

    posts: {

        delete: async(target)=>{
            console.log(target);

            const user = await github.user.get();
            const a = ()=>{
                target.closest('card').remove();
            }
            const b = (error)=>{
                console.log({
                    error
                });
            }

            params = {
                repo: 'blog.cms.' + GET[1],
                owner: user.login,
                path: '/cdn/cache/posts.json'
            }
            settings = {}
            const get = await github.repos.contents(params, settings);
            var content = JSON.parse(atob(get.content));
            var filter = content.filter(row=>row.id !== parseInt(target.closest('card').dataset.id))
            console.log(364, {
                content,
                filter,
                get
            });

            params = {
                repo: 'blog.cms.' + GET[1],
                owner: user.login,
                path: '/cdn/cache/posts.json',
                sha: get.sha
            }
            settings = {
                data: JSON.stringify({
                    content: btoa(JSON.stringify(filter, null, 4)),
                    message: "Update Posts Table",
                    sha: get.sha
                }),
                dataType: "PUT"
            }
            github.repos.contents(params, settings).then(a).catch(b);

            var params = {
                gist: target.closest('card').dataset.gist,
                repo: 'blog.cms.' + GET[1],
                owner: user.login,
                path: 'cdn/posts/' + target.closest('card').dataset.filename + '.html',
                sha: target.closest('card').dataset.sha
            }
            var settings = {
                data: JSON.stringify({
                    message: 'Delete ' + params.path,
                    sha: params.sha
                }),
                dataType: "DELETE"
            }
            github.repos.contents(params, settings).catch(b);

            params = {
                gist: params.gist
            }
            settings = {
                dataType: "DELETE"
            }
            github.gists.delete(params, settings).catch(b);
        }
        ,

        read: async(shortname)=>{

            const user = await github.user.get();
            const owner = user.login;
            const repo = "blog.cms." + shortname;
            const path = "/cdn/cache/posts.json";
            const params = {
                owner,
                repo,
                path
            }
            const settings = {}

            github.repos.contents(params, settings).then(data=>{
                const content = data.content;
                const raw = atob(content);
                const json = JSON.parse(raw);
                console.log(282, {
                    data,
                    raw,
                    json
                });

                var vp = dom.body.find('page[data-page="/dashboard/*/posts/"]');
                if (json.length > 0) {
                    const feed = byId('feed-dashboard-posts');
                    feed.innerHTML = "";
                    vp.all('card')[1].find('box').classList.remove('display-none');
                    var x = 0;
                    do {
                        const row = json[x];
                        const template = byId('template-dashboard-posts');
                        const card = template.content.firstElementChild.cloneNode(true);
                        const title = row.title;
                        row.gist ? card.dataset.gist = row.gist : null;
                        row.sha ? card.dataset.sha = row.sha : null;
                        card.dataset.filename = row.filename.split('.')[0];
                        card.dataset.id = row.id;
                        card.firstElementChild.find('text').dataset.href = "/dashboard/:get/posts/post/" + row.filename.split('.')[0] + '/';
                        card.firstElementChild.find('text').textContent = title;
                        feed.insertAdjacentHTML('beforeend', card.outerHTML)
                        x++;
                    } while (x < json.length);
                } else {
                    vp.all('card')[1].find('box').classList.add('display-none');
                }
            }
            ).catch(async(error)=>{
                console.log("43.error", {
                    error
                });
            }
            );

        }

    },

    setup: {

        category: (target)=>{
            const box = target.closest('box');
            if (box) {
                $(box.parentNode.all('box')).removeClass('color-ff3b30');
                box.classList.add('color-ff3b30');
                box.closest('block').find('footer [data-complete]').dataset.complete = true;
            }
        }

    },

    sign: {

        in: async(event,f)=>{

            event.preventDefault();
            if (localStorage.githubAccessToken) {
                var href = (auth.user() ? '/users/' + auth.user().uid + "/" : '/my/');
                var popup = await modal.popup(nav.outerHTML);
                popup.className = "absolute-full bg-black-1-2 fixed";
                popup.dataset.tap = "event.target.tagName === 'ASIDE' ? modal.exit(event.target) : null";
                popup.dataset.zIndex = 7;
                console.log({
                    nav
                });
            } else {
                var provider = new firebase.auth.GithubAuthProvider();
                provider.addScope('gist');
                provider.addScope('repo');
                provider.addScope('delete_repo');

                firebase.auth().signInWithRedirect(provider);
            }
        }

    }

});
