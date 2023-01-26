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
        var search = route.search;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        if (search) {
            var params = Object.fromEntries(new URLSearchParams(search));
            var keys = Object.keys(params);
            if (keys.length > 0) {
                if (keys.includes("code")) {
                    await github.oauth.authorize(params);
                    route.search = "";
                }
            }
        }

        var token = localStorage.githubAccessToken;
        if (token) {
            dom.body.dataset.uid = token;
        }

        $(dom.body.all('aside')).remove()

        if (root) {

            const roots = ["dashboard", "design", "developer", "marketplace", "new"];
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
                controller.nav.close();
                if (get.length > 1) {
                    const user = await github.user.get();
                    var project = dom.body.find('main nav').find('[placeholder="Project Name"]');
                    if (1 > 0) {
                        try {
                            var icon = await github.raw.path("/" + user.login + "/" + get[1] + "/main/icon.svg");
                            project.previousElementSibling.find('img').src = "data:image/svg+xml;base64," + icon.content;
                        } catch (e) {}
                    } else {
                        var svg = await github.raw.file("/" + user.login + "/" + get[1] + "/main/icon.svg")
                        var icon = "data:image/svg+xml;base64," + btoa(svg);
                        project.previousElementSibling.find('img').src = icon;
                    }

                    if (get.length > 2) {
                        if (get[2] === "build") {
                            var vp = dom.body.find('pages[data-pages="/dashboard/*/build/"]');
                            var iframe = vp.find('iframe');

                            if (!iframe.contentWindow.document.body.querySelector('boot')) {
                                await mvc.c.build.boot(iframe);
                            }

                            if (get[3]) {
                                if (get[3] === "er") {
                                    controller.build.editor(iframe);
                                } else if (get[3] === "preview") {
                                    controller.build.preview(iframe);
                                } else {
                                    controller.build.else(iframe);
                                }
                            } else {
                                controller.build.index(iframe);
                            }

                            //alert(iframe.contentWindow.document.body.outerHTML);
                            resolve(route);
                        }
                        if (get[2] === "files") {
                            if (get.length > 3) {
                                if (get[3] === "file") {}
                            }
                            var feed = byId('feed-dashboard-files');
                            if (feed.innerHTML === "" || get.length < 4) {
                                const name = get[4] + '.html';
                                var params = {
                                    owner: user.login,
                                    path: "/raw/files",
                                    repo: get[1]
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
                                var vp = dom.body.find('pages[data-pages="/dashboard/*/posts/post/"]');
                                vp.find('header input[type="text"]').value = "";
                                vp.find('header textarea').value = "";
                                vp.find('card textarea').value = "";
                                if (get.length > 4) {
                                    const user = await github.user.get();
                                    const name = get[4] + '.html';
                                    var params = {
                                        owner: user.login,
                                        path: "/raw/posts/" + name,
                                        repo: "blog.cms." + get[1]
                                    };
                                    var settings = {};
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
                                    path: "/raw/posts",
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
                        } else if (get[2] === "style" || get[2] === "theme") {
                            var params = {
                                owner: "dompad",
                                path: "/",
                                repo: "preview"
                            };
                            var settings = {};
                            var a = async(data)=>{
                                data = data.filter(row=>row.type === "dir")
                                console.log(319, {
                                    data
                                });
                                const feed = byId('feed-dashboard-blog-theme');
                                if (feed.all('card').length === 0 && data.length > 0) {
                                    const template = byId('template-dashboard-blog-theme').content.firstElementChild.cloneNode(true);
                                    var x = 0;
                                    do {
                                        const row = data[x];
                                        //const name = rout.ed.dir(row.path)[0];
                                        const name = row.name;
                                        var repository = row['_links'].html.split('/');
                                        //var user = repository[0];
                                        //var repo = repository[1];
                                        //template.dataset["full_name"] = row.repository["full_name"];
                                        template.find('ico').dataset.href = "/" + root + "/" + name + "/editor/";
                                        //mtemplate.find('text').dataset.href = "/templates/" + name + "/";
                                        template.find('text').textContent = name;
                                        //template.find('picture').dataset.href = "/" + root + "/" + name + "/preview/";
                                        template.find('picture').dataset.src = "/preview/" + name + "/index.jpg";
                                        feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                        x++;
                                    } while (x < data.length);
                                }
                            }
                            const query = 'q="key": "design-28894391" filename:site.webmanifest user:dompad';
                            //github.search.code(query).then(a);
                            github.repos.contents(params, settings).then(a);
                        }
                    }

                    //alert(window.database.dashboard.hasOwnProperty(get[1]));
                    if (window.database.dashboard.hasOwnProperty(get[1]) === false) {
                        //const user = await github.user.get();
                        var params = {
                            owner: user.login,
                            path: "/site.webmanifest",
                            repo: get[1]
                        };
                        var settings = {
                            cache: "reload"
                        };
                        console.log("database", {
                            params,
                            settings
                        });
                        github.repos.contents(params, settings).then(async(data)=>{
                            if (data) {
                                var content = data.content;
                                var raw = atob(content);
                                var json = JSON.parse(raw);
                                console.log(261, {
                                    content,
                                    data,
                                    json,
                                    raw
                                });
                                var description = json.description;
                                var icons = json.icons;
                                var name = json.name;
                                var short_name = json.short_name;

                                window.database.dashboard[short_name] = json;
                                if (description && icons && name) {
                                    dom.body.find('main nav').find('[placeholder="Project Name"]').textContent = name;
                                } else {
                                    const html = await ajax('/raw/html/template/template.setup.html');
                                    var ppp = await modal.page(html);
                                    var form = ppp.find('form');

                                    //GET index.html
                                    try {
                                        var data = await github.repos.contents({
                                            owner: user.login,
                                            repo: GET[1],
                                            path: "/index.html"
                                        }, {
                                            cache: "reload"
                                        });
                                        var raw = data.content;
                                        var sha = data.sha;
                                        var content = atob(raw);
                                        var doc = new DOMParser().parseFromString(content, "text/html");
                                        var title = doc.head.find('title').textContent.length > 0 ? doc.head.find('title').textContent : null;
                                        console.log(807, {
                                            content,
                                            data,
                                            doc,
                                            raw,
                                            sha
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    //GET icon.svg
                                    try {
                                        var data = await github.repos.contents({
                                            owner: user.login,
                                            repo: GET[1],
                                            path: "/icon.svg"
                                        }, {
                                            cache: "reload"
                                        });
                                        var raw = data.content;
                                        var sha = data.sha;
                                        //var brand = raw ? "data:image/svg;base64," + raw : null;
                                        var brand = raw ? atob(raw) : null;
                                        console.log(307, {
                                            content: atob(raw),
                                            data,
                                            raw,
                                            sha
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    //GET site.webmanifest
                                    try {
                                        var data = await github.repos.contents({
                                            owner: user.login,
                                            repo: GET[1],
                                            path: "/site.webmanifest"
                                        }, {
                                            cache: "reload"
                                        });
                                        var raw = atob(data.content);
                                        var sha = data.sha;
                                        var json = JSON.parse(raw);
                                        var about = null;
                                        console.log(319, {
                                            data,
                                            json,
                                            raw,
                                            sha
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    //GET data
                                    console.log(316, {
                                        title,
                                        brand,
                                        about
                                    });

                                    form.classList.remove("display-none");

                                    if (title) {
                                        var s1 = ppp.find('block').children[0];
                                        s1.find('input').value = s1.find('input').dataset.value = title;
                                        s1.all('footer box')[1].classList.remove('opacity-50pct');

                                        var s2 = ppp.find('block').children[1];
                                        var picture = s2.find('picture');
                                        console.log(picture.firstElementChild)

                                        if (brand) {
                                            //alert("Step Three");

                                            var svg = new DOMParser().parseFromString(brand, "image/svg+xml").documentElement;
                                            var safety = 1 < 0;
                                            if (safety) {
                                                picture.innerHTML = svg.outerHTML;
                                            } else {
                                                var rect = svg.find('rect');
                                                picture.find('rect').setAttribute('fill', rect.getAttribute('fill'))

                                                var foreignObject = svg.find('foreignObject');
                                                var scale = foreignObject.getAttribute('width').split("%")[0];
                                                picture.find('foreignObject').innerHTML = foreignObject.innerHTML;
                                                picture.find('foreignObject').setAttribute('height', scale + "%");
                                                picture.find('foreignObject').setAttribute('width', scale + "%");
                                                picture.find('foreignObject').style.transform = "translate(calc((100% - " + scale + "%)/2), calc((100% - " + scale + "%)/2))";

                                                s2.find('[data-before="size"]').closest('box').find('input').setAttribute('value', foreignObject.getAttribute('width').split("%")[0]);
                                            }

                                            $(form.all('block > *')).addClass('display-none');
                                            $(form.all('form > header box flex')).attr("data-height", "30px");
                                            $(form.all('form > header box flex')).attr("data-width", "30px");
                                            $(form.all('form > header box flex')[2]).attr("data-height", "50px");
                                            $(form.all('form > header box flex')[2]).attr("data-width", "50px");
                                            $(form.all('block > *')[2]).removeClass('display-none');

                                            if (about) {
                                                alert(about);
                                            }
                                        } else {
                                            //alert("Step Two");

                                            $(form.all('block > *')).addClass('display-none');
                                            $(form.all('form > header box flex')).attr("data-height", "30px");
                                            $(form.all('form > header box flex')).attr("data-width", "30px");
                                            $(form.all('form > header box flex')[1]).attr("data-height", "50px");
                                            $(form.all('form > header box flex')[1]).attr("data-width", "50px");
                                            $(form.all('block > *')[1]).removeClass('display-none');

                                            var color = colors.random();
                                            controller.setup.iro(color);
                                        }
                                    }
                                }
                                resolve(route);
                            }
                        }
                        ).catch(async(error)=>{
                            console.log("43.error", {
                                error
                            });
                            //if (error.code === 404) {
                            //alert("Setup Project");
                            //}

                            const user = await github.user.get();
                            var file = "site.webmanifest";
                            var json = {};

                            var params = {};
                            params.owner = user.login;
                            params.path = "/" + file;
                            params.repo = GET[1]

                            var settings = {};
                            settings.data = JSON.stringify({
                                content: btoa(JSON.stringify(json, null, 2)),
                                message: "Create " + file
                            }),
                            settings.dataType = "PUT";

                            console.log(498, {
                                params,
                                settings
                            });

                            const aa = async(e)=>{
                                const html = await ajax('/raw/html/template/template.setup.html');
                                var ppp = await modal.page(html);
                                ppp.find('form').classList.remove("display-none");
                                resolve(route);
                            }

                            const bb = (e)=>{}

                            github.repos.contents(params, settings).then(aa).catch(bb);

                        }
                        );
                    }
                } else {

                    if (github.oauth.verify()) {
                        var params = {};
                        const user = await github.user.get();
                        0 > 1 ? params = {
                            owner: user.login,
                            repo: "db.dompad.io",
                            path: "/v1/apps/index.json"
                        } : null;
                        0 < 1 ? params = {
                            query: {
                                per_page: 25,
                                sort: "created"
                            }
                        } : null;
                        //github.repos.contents(params).then(d=>{
                        github.user.repos(params).then(d=>{
                            //data = data.filter(item=>item.name.includes('blog.cms'));
                            //var data = JSON.parse(atob(d.content))
                            var data = 0 < 1 ? d : JSON.parse(atob(d.content));
                            console.log(596, {
                                d,
                                data
                            });
                            const feed = byId('feed-dashboard');
                            feed.innerHTML = "";
                            if (data.length > 0) {
                                var x = 0;
                                do {
                                    const row = data[x].repository ? data[x].repository : data[x];
                                    var private = row.private;
                                    const shortname = row.name;
                                    var pushed_at = new Date(row.pushed_at);
                                    var date = pushed_at.toLocaleString('en-US', {
                                        month: 'short'
                                    }) + " " + (pushed_at.getDay() + 1) + ", " + pushed_at.getFullYear();

                                    const template = byId('template-feed-dashboard').content.firstElementChild.cloneNode(true);

                                    (Math.abs(x % 2) == 1) ? template.classList.add('background-color-fff') : null;

                                    //private === true ? template.find('.gg-lock').closest('text').dataset.display = "flex" : null;

                                    template.find('text').dataset.owner = row.owner.login;
                                    template.find('text').dataset.repo = row.name;
                                    template.find('text').textContent = shortname;
                                    template.find('[placeholder="Date"]').textContent = date;
                                    template.dataset.href = "/dashboard/" + row.name + "/";

                                    feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                    x++;
                                } while (x < data.length);
                            }
                        }
                        );
                    }
                }
                resolve(route);
            } else if (root === "design") {

                if (get.length > 1) {

                    if (get.length > 2) {

                        if (get[2] === "preview") {
                            var vp = dom.body.find('[data-page="' + route.page + '"]');
                            var iframe = vp.find('iframe');
                            iframe.name = "iframe-" + get[1];
                            controller.templates.preview(iframe);
                        }

                    }

                } else {

                    var params = {
                        owner: "dompad",
                        path: "/",
                        repo: "preview"
                    };
                    var settings = {};
                    github.repos.contents(params, settings).then(data=>{
                        data = data.filter(row=>row.type === "dir")
                        console.log(319, {
                            data
                        });
                        const feed = byId('feed-templates');
                        if (data.length > 0) {
                            feed.innerHTML = "";
                            const template = byId('template-template').content.firstElementChild.cloneNode(true);
                            var x = 0;
                            do {
                                const row = data[x];
                                const name = row.name;
                                template.find('ico').dataset.href = "/" + root + "/" + name + "/editor/";
                                //mtemplate.find('text').dataset.href = "/templates/" + name + "/";
                                template.find('text').textContent = name;
                                template.find('picture').dataset.href = "/" + root + "/" + name + "/preview/";
                                feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                x++;
                            } while (x < data.length);
                        }
                    }
                    )

                }
                resolve(route)
            } else if (root === "marketplace") {
                if (github.oauth.verify()) {
                    const settings = {};
                    console.log(settings);
                    const user = await github.user.get();
                    console.log({
                        user
                    }, user.login);
                    github.search.code('q="key": "32616927" filename:site.webmanifest').then(data=>{
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
                                const row = data[x].repository;
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
            } else if (root === "new") {
                if (get[1] === "app") {
                    var vp = dom.body.find('[data-pages="/new/app/"]');
                    var form = vp.find('form');
                    form.find('input').value = "";
                }
                if (get[1] === "import") {
                    const settings = {};
                    console.log(settings);
                    const user = await github.user.get();
                    //github.search.code(query).then(data=>{
                    github.user.repos({
                        query: {
                            per_page: 25,
                            sort: "created"
                        }
                    }).then(data=>{
                        //data = data.filter(item=>item.name.includes('blog.cms'));
                        console.log(596, {
                            data
                        });
                        const feed = byId('feed-new-import');
                        feed.innerHTML = "";
                        if (data.length > 0) {
                            var x = 0;
                            do {
                                const row = data[x].repository ? data[x].repository : data[x];
                                var private = row.private;
                                const shortname = row.name;
                                const template = byId('template-feed-new-import').content.firstElementChild.cloneNode(true);

                                (Math.abs(x % 2) == 1) ? template.classList.add('background-color-fff') : null;

                                private === true ? template.find('.gg-lock').closest('text').dataset.display = "flex" : null;

                                template.find('text').dataset.owner = row.owner.login;
                                template.find('text').dataset.repo = row.name;
                                template.find('text').innerHTML = shortname;

                                feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                x++;
                            } while (x < data.length);
                        }
                    }
                    );
                }
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
            const repo = GET[1];
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

    build: {
        boot: async(iframe)=>{
            var vp = iframe.closest('pages');
            var header = vp.find('header');
            console.log(668, {
                iframe,
                vp,
                header
            });

            const user = await github.user.get();
            const owner = user.login;
            const repo = route.GOT[1];

            const error = {
                document: (error)=>{
                    console.log('error.build.document', {
                        error
                    });
                }
                ,
                shell: (error)=>{
                    console.log('error.build.shell', {
                        error
                    });
                }
            }

            //DOCUMENT
            var path = "index.html";
            var params = {
                owner,
                repo,
                path
            }
            var data = await github.repos.contents(params, {})
            const content = data.content;
            const raw = atob(content);
            console.log(695, {
                data,
                raw,
                iframe
            });
            await controller.build.iframe(iframe, raw);
            console.log(796, "iframe built");
        }
        ,
        editor: async()=>{

            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = iframe.closest('main nav + pages');

            nav.classList.add('display-none');
            //nav.dataset["960pxTransform"] = "translateX(0%)";

            blocks.classList.remove('margin-left-240px');
            blocks.dataset["960pxTransform"] = "0";

            block.removeAttribute('data-transform');
            block.dataset.width = "calc(100% - 20px)";

            const win = iframe.contentWindow;
            const head = win.document.head;
            const body = win.document.body;

            if (head.find) {
                const css = head.find("#style-editor");
                header.classList.remove('display-none');
                block.classList.add('border-top-left-radius-10px');
                block.classList.add('border-top-right-radius-10px');
                block.classList.add('margin-top-10px');
                block.classList.add('margin-x-10px');
                //block.find('builder-toolbar-preview').classList.add('display-none');
                css.setAttribute('href', 'raw/css/editor.css')
            }

            var path = route.path;
            var dir = rout.ed.dir(path);
            dir = dir.splice(4, dir.length - 1);
            var href = "/dashboard/" + route.GOT[1] + "/build/er" + rout.ed.url(dir);
            //alert("controller.build.editor: " + href);

        }
        ,
        else: async()=>{
            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = iframe.closest('main nav + pages');
            const toggle = 0 < 1;

            nav.classList.remove('display-none');
            //nav.dataset["960pxTransform"] = "translateX(0%)";

            blocks.classList.add('margin-left-240px');
            blocks.dataset["960pxTransform"] = "0";

            block.dataset.transform = "translateY(100%)";
            block.dataset.height = "calc(100% - 10px)";
            block.dataset.width = "calc(100% - 260px)";

            const win = iframe.contentWindow;
            const head = win.document.head;
            const body = win.document.body;

            if (head.find) {
                const css = head.find("#style-editor");
                header.classList.remove('display-none');
                block.classList.add('border-top-left-radius-10px');
                block.classList.add('border-top-right-radius-10px');
                block.classList.add('margin-top-10px');
                block.classList.add('margin-x-10px');
                //block.find('builder-toolbar-preview').classList.add('display-none');
                css.removeAttribute('href')
            }
        }
        ,
        iframe: (iframe)=>{
            return new Promise(async(resolve,reject)=>{
                const user = await github.user.get();
                const owner = user.login;
                const repo = route.GOT[1];
                const branch = 'main';
                try {
                    var raw = await ajax('raw/html/template/template.iframe.document.html');
                    //var raw = atob((await github.raw.path('/anoniiimous/' + GET[1] + '/' + branch + '/index.html')).content);
                    var doc = new DOMParser().parseFromString(raw, 'text/html')

                    try {
                        var css = atob((await github.raw.path('/' + owner + '/' + repo + '/' + branch + '/raw/style/theme.css')).content);
                        var link = document.createElement('link');
                        link.href = blob(css, 'text/css');
                        link.rel = "stylesheet";
                        doc.head.appendChild(link);
                    } catch (e) {
                        console.log(e);
                    }

                    try {
                        var css = atob((await github.raw.path('/' + owner + '/' + repo + '/' + branch + '/index.css')).content);
                        var link = document.createElement('link');
                        link.href = blob(css, 'text/css');
                        link.rel = "stylesheet";
                        doc.head.appendChild(link);
                    } catch (e) {
                        console.log(e);
                    }

                    console.log('controller.build.iframe', {
                        doc,
                        raw: doc.documentElement.outerHTML
                    });

                    iframe.src = blob(doc.documentElement.outerHTML, "text/html");
                    iframe.onload = ()=>{
                        console.log("controller.build.iframe iframe.onload", {
                            iframe,
                            body: iframe.contentWindow.document.body.outerHTML
                        });
                        resolve(iframe);
                    }
                } catch (e) {}
            }
            )
        }
        ,
        index: async()=>{
            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = iframe.closest('main nav + pages');
            const toggle = 0 < 1;

            nav.classList.remove('display-none');
            //nav.dataset["960pxTransform"] = "translateX(0%)";

            blocks.classList.add('margin-left-240px');
            blocks.dataset["960pxTransform"] = "0";

            block.dataset.transform = "translateY(calc(100% - 50px))";
            block.dataset.height = "calc(100% - 10px)";
            block.dataset.width = "calc(100% - 260px)";

            const win = iframe.contentWindow;
            const head = win.document.head;
            const body = win.document.body;

            if (head.find) {
                const css = head.find("#style-editor");
                header.classList.remove('display-none');
                block.classList.add('border-top-left-radius-10px');
                block.classList.add('border-top-right-radius-10px');
                block.classList.add('margin-top-10px');
                block.classList.add('margin-x-10px');
                //block.find('builder-toolbar-preview').classList.add('display-none');
                css.removeAttribute('href')
            }
        }
        ,
        preview: ()=>{

            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = iframe.closest('main nav + pages');
            const toggle = nav.classList.contains('display-none');

            nav.classList.add('display-none');
            //nav.dataset["960pxTransform"] = "translateX(0)";
            blocks.classList.remove('margin-left-240px');
            //blocks.dataset["960pxTransform"] = "translateX(240px)";

            block.removeAttribute('data-transform');
            block.dataset.height = "100%";
            block.dataset.width = "100%";

            const win = iframe.contentWindow;
            const head = win.document.head;
            const body = win.document.body;

            if (head.find) {
                const css = head.find("#style-editor");

                const toggle = header.classList.contains('display-none');
                //alert(toggle)
                if (toggle) {
                    header.classList.remove('display-none');
                    block.classList.add('border-top-left-radius-10px');
                    block.classList.add('border-top-right-radius-10px');
                    block.classList.add('margin-top-10px');
                    block.classList.add('margin-x-10px');
                    //block.find('builder-toolbar-preview').classList.add('display-none');
                    css.setAttribute('href', 'raw/css/editor.css')
                } else {
                    header.classList.add('display-none');
                    block.classList.remove('border-top-left-radius-10px');
                    block.classList.remove('border-top-right-radius-10px');
                    block.classList.remove('margin-top-10px');
                    block.classList.remove('margin-x-10px');
                    //block.find('builder-toolbar-preview').classList.remove('display-none');
                    css.removeAttribute('href');
                }
            }
        }
        ,
        route: (iframe)=>{
            if (0 > 1) {
                const nav = document.body.find('body > main nav');
                const transform = nav.dataset["960pxTransform"];
                const blocks = dom.body.find('main > pages');
                nav.classList.add('display-none');
                //nav.dataset["960pxTransform"] = "translateX(0%)";
                blocks.classList.remove('margin-left-240px');
                blocks.dataset["960pxTransform"] = "0";
            }
        }
    },

    design: {

        install: async(target)=>{
            if (target) {
                var user = await github.user.get();
                var card = target.closest('card');
                var owner = user.login;
                var repo = GET[1];
                var theme = card.find('box text').textContent;
                if (theme) {
                    const callBack = async()=>{

                        //alert("Installing theme");

                        //DATA
                        window.source = {
                            copy: {},
                            paste: {}
                        };
                        window.tree = [];

                        var params = {
                            branch: "main",
                            owner,
                            repo
                        }
                        var s = (data)=>{
                            return data;
                        }
                        var settings = {
                            dataType: "GET"
                        };
                        var refs = await github.database.references(params, settings).then(s);
                        var sha = refs.object.sha;
                        console.log("references", {
                            refs
                        });

                        //FILES
                        var params = {
                            owner: "dompad",
                            repo: "preview",
                            path: "/" + theme + "/raw/files"
                        }
                        var a = async(data)=>{
                            var content = [];
                            if (data.length > 0) {
                                var d = 0;
                                do {
                                    var row = data[d];
                                    if (row.type === "file") {
                                        var name = row.name;
                                        var path = row.path;
                                        var html = await github.repos.contents({
                                            owner: "dompad",
                                            repo: "preview",
                                            path
                                        }, {});
                                        content[d] = {
                                            content: atob(html.content),
                                            name,
                                            path
                                        };
                                        //console.log("pages", { html, d, row });
                                    }
                                    d++;
                                } while (d < data.length);
                            }
                            return content;
                        }
                        var asset = await github.repos.contents(params, {}).then(a);
                        window.source.copy.files = asset;

                        //PAGES
                        var params = {
                            owner: "dompad",
                            repo: "preview",
                            path: "/" + theme + "/raw/pages"
                        }
                        var p = async(data)=>{
                            var content = [];
                            if (data.length > 0) {
                                var d = 0;
                                do {
                                    var row = data[d];
                                    if (row.type === "file") {
                                        var name = row.name;
                                        var path = row.path;
                                        var html = await github.repos.contents({
                                            owner: "dompad",
                                            repo: "preview",
                                            path
                                        }, {});
                                        content[d] = {
                                            content: atob(html.content),
                                            name,
                                            path
                                        };
                                        console.log("pages", {
                                            html,
                                            d,
                                            row
                                        }, content[d]);
                                    }
                                    d++;
                                } while (d < data.length);
                            }
                            return content;
                        }
                        var pages = await github.repos.contents(params, {
                            cache: "reload"
                        }).then(p);
                        window.source.copy.pages = pages;

                        //STYLE
                        var t = async(data)=>{
                            var content = [];
                            if (data.length > 0) {
                                var d = 0;
                                do {
                                    var row = data[d];
                                    if (row.type === "file") {
                                        var name = row.name;
                                        var path = row.path;
                                        var html = await github.repos.contents({
                                            owner: "dompad",
                                            repo: "preview",
                                            path
                                        }, {});
                                        content[d] = {
                                            content: atob(html.content),
                                            name,
                                            path
                                        };
                                    }
                                    d++;
                                } while (d < data.length);
                            }
                            return content;
                        }
                        var css = await github.repos.contents({
                            owner: "dompad",
                            repo: "preview",
                            path: "/" + theme + "/raw/style/"
                        }, {
                            cache: "reload"
                        }).then(t);
                        window.source.copy.style = css;

                        //BLOBS
                        var copy = source.copy;
                        var keys = Object.keys(copy);
                        var resources = {};
                        if (keys.length > 0) {
                            var c = 0;
                            var t = 0;
                            var values = Object.values(copy);
                            do {
                                var key = keys[c];
                                var value = values[c];
                                if (value.length > 0) {
                                    var v = 0;
                                    do {
                                        var val = value[v];
                                        var content = btoa(val.content);
                                        var data = {
                                            content
                                        };
                                        var params = {
                                            owner,
                                            repo
                                        };
                                        var settings = {
                                            data: JSON.stringify({
                                                content: val.content
                                            }),
                                            dataType: "POST"
                                        };

                                        var b = (data)=>{
                                            return data;
                                        }
                                        var bb = (error)=>{
                                            alert("Blob failed!");
                                        }
                                        var blob = await github.database.blobs(params, settings).then(b).catch(bb);

                                        var path = "raw/" + key + "/" + val.name;

                                        resources[path] = blob;
                                        var mode = "100644";
                                        var type = "blob";
                                        tree[t] = {
                                            path,
                                            mode: "100644",
                                            type: "blob",
                                            sha: blob.sha
                                        };

                                        var rs = [{
                                            path,
                                            blob
                                        }, {
                                            key,
                                            val
                                        }, {
                                            params,
                                            settings
                                        }];

                                        console.log(t + " resource: " + path, rs);
                                        t++;
                                        v++;
                                    } while (v < value.length)
                                }

                                c++;
                            } while (c < keys.length);
                            console.log("resources", {
                                resources,
                                tree
                            });
                        }

                        //TREE
                        var params = {
                            owner,
                            path: "/raw",
                            repo,
                            sha
                        };
                        var settings = {
                            dataType: "GET"
                        };
                        var t = (data)=>{
                            return data;
                        }
                        var tt = (error)=>{}
                        var trees = await github.database.trees(params, settings).then(t).catch(tt);
                        var raw = trees.tree.filter(row=>row.path === "style")[0];
                        tree = raw ? tree : trees.tree.concat(tree);
                        var base_tree = raw ? raw.sha : null;
                        console.log("trees: " + settings.dataType, {
                            raw,
                            trees,
                            tree
                        });

                        var params = {
                            owner,
                            repo
                        };
                        var settings = {
                            data: JSON.stringify({
                                "base_tree": base_tree,
                                "tree": tree
                            }),
                            dataType: "POST"
                        };
                        var t = (data)=>{
                            return data;
                        }
                        var tt = (error)=>{}
                        var trees = await github.database.trees(params, settings).then(t).catch(tt);
                        console.log("trees: " + settings.dataType, {
                            sha: trees.sha,
                            tree,
                            trees
                        });

                        //COMMIT
                        var params = {
                            owner,
                            repo
                        };
                        var data = JSON.stringify({
                            "message": "Install Template",
                            "parents": [refs.object.sha],
                            "tree": trees.sha
                        });
                        var settings = {
                            data,
                            dataType: "POST"
                        };
                        var c = (data)=>{
                            return data;
                        }
                        var cc = (error)=>{}
                        var commits = await github.database.commits(params, settings).then(t).catch(tt);
                        console.log("commits: " + settings.dataType, {
                            commits,
                            sha: commits.sha
                        });

                        //REFERENCES
                        var params = {
                            branch: "main",
                            owner,
                            repo
                        }
                        var s = (data)=>{
                            return data;
                        }
                        var settings = {
                            data: JSON.stringify({
                                force: true,
                                sha: commits.sha
                            }),
                            dataType: "PATCH"
                        };
                        var refs = await github.database.references(params, settings).then(s);
                        var sha = refs.object.sha;
                        console.log("references", {
                            refs
                        });

                        "/dashboard/:get/build/".router();
                    }
                    var confirm = await modal.confirm({
                        title: theme.capitalize(),
                        body: "Are you sure you want to install this template?"
                    }, ["Cancel", "Install"], callBack);
                    if (confirm) {
                        callBack()
                    }
                }
            }
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

        select: async(event)=>{
            const input = event.target;
            const label = input.closest('[data-file]');
            const select = input.closest('card');
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
            console.log(1165, {
                input,
                label,
                file
            });

            on.change.file(event).then(async(result)=>{
                const user = await github.user.get();

                var params = {};
                params.owner = user.login;
                params.path = "/raw/files/" + file.name;
                params.repo = GET[1]

                var settings = {};
                settings.data = JSON.stringify({
                    content: result.split('base64,')[1],
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
            );

        }
        ,

        selecting: e=>{
            console.log({
                e
            });
            const input = e.srcElement;
            const load = input.closest('card').find('load');
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
            params.path = "/raw/files/" + file.name;
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

            const nav = dom.body.find('body > main nav');
            nav.dataset["960pxTransform"] = "translateX(0%)";
            nav.firstElementChild.classList.remove('display-none');

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

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main nav + pages');

            nav.classList.remove('display-none');
            blocks.classList.add('margin-left-240px');
            nav.dataset["960pxTransform"] = "translateX(-100%)";
            blocks.dataset["960pxTransform"] = "0";

        }
        ,

        toggle: (target)=>{

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main nav + pages');
            const toggle = transform === "translateX(0)";

            nav.classList.remove('display-none');
            if (toggle) {
                nav.dataset["960pxTransform"] = "translateX(-100%)";
                blocks.classList.add('margin-left-240px');
                blocks.dataset["960pxTransform"] = "0";
            } else {
                nav.dataset["960pxTransform"] = "translateX(0)";
                blocks.classList.remove('margin-left-240px');
                blocks.dataset["960pxTransform"] = "translateX(240px)";
            }

        }

    },

    new: {
        app: async(target)=>{
            var form = target.closest('form');
            var title = form.find('input').value;
            if (title.length > 0) {
                form.find('[type="submit"]').click();
            } else {
                modal.alert({
                    body: "A name is required to continue.",
                    submit: "Go back",
                    title: "New App"
                });
            }
        }
        ,

        import: async(target)=>{
            const user = await github.user.get();
            if (target.closest('card')) {
                var repository = target.closest('card').all('box')[1].find('text').textContent;
                var params = {
                    owner: user.login,
                    path: "/v1/apps/index.json",
                    repo: "db.dompad.io"
                }
                var settings = {};

                var n = async(data)=>{
                    var href = "/dashboard/" + repository + "/";
                    var confirm = await modal.confirm({
                        body: "Would you like to start editing this project?",
                        title: params.repo
                    }, ["Builder", "Dashboard"]);
                    console.log(1540, {
                        href,
                        confirm
                    });
                    if (confirm) {
                        href = "/dashboard/";
                    }
                    console.log(1544, {
                        href,
                        confirm
                    });
                    href.router();
                }

                var s = async(d)=>{
                    d.content = d.content.length > 0 ? d.content : [];
                    var data = JSON.parse(atob(d.content))
                    var row = {
                        "name": repository,
                        "owner": {
                            "login": "anoniiimous"
                        },
                        "private": true,
                        "pushed_at": "2023-01-20T12:30:44Z"
                    };
                    data.push(row);
                    var obj = JSON.stringify({
                        content: btoa(JSON.stringify(data, null, 4)),
                        message: "Updated Apps Cache",
                        sha: d.sha ? d.sha : null
                    });
                    settings = {
                        data: obj,
                        dataType: "PUT"
                    }
                    console.log(1703, {
                        d,
                        data,
                        settings
                    });
                    0 < 1 ? github.repos.contents(params, settings).then(n).catch((e)=>{
                        console.log(1560, e);
                        modal.alert({
                            body: e.message.message,
                            submit: "OK",
                            title: "Import Error"
                        });
                    }
                    ) : null;
                }
                var ss = ()=>{
                    console.log("Creating database repository for " + user.login + "...", {
                        params
                    });
                    github.user.repos({}, {
                        data: JSON.stringify({
                            name: params.repo
                        }),
                        dataType: "POST"
                    }).then(()=>{
                        settings = {
                            data: JSON.stringify({
                                content: btoa(JSON.stringify([], null, 4)),
                                message: ""
                            }),
                            dataType: "PUT"
                        }
                        github.repos.contents(params, settings).then(n).catch((e)=>{
                            console.log(1560, e);
                            modal.alert({
                                body: e.message.message,
                                submit: "OK",
                                title: "Import Error"
                            });
                        }
                        );
                    }
                    ).catch((e)=>{
                        console.log(1560, e);
                        modal.alert({
                            body: e.message.message,
                            submit: "OK",
                            title: "Database Error"
                        });
                    }
                    )
                }

                var p = {
                    "template_owner": "dompad",
                    "template_repo": "database"
                };
                var c = {
                    data: JSON.stringify({
                        name: "db.dompad.io",
                        private: true
                    }),
                    dataType: "POST"
                };
                var i = (e)=>{
                    console.log(1560, e);
                    modal.alert({
                        body: e.message.message,
                        submit: "OK",
                        title: "Cache Error"
                    });
                }
                github.repos.contents(params).then(s).catch(ss);
                //github.repos.generate(p, c).then(s).catch(i)
            }
        }
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
                path: '/raw/cache/posts.json'
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
                path: '/raw/cache/posts.json',
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
            const path = "/raw/cache/posts.json";
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

        app: async(event)=>{

            event.preventDefault();
            const form = event.target;
            const steps = form.all('block > column');
            const title = steps[0].find('[type="text"]').value;
            //const color = steps[1].find('#color-data-hex').all('text')[1].textContent.split('#')[1];
            //const about = steps[2].find('textarea').value;
            //alert("webmanifest: " + title + " : " + color + " : " + about);

            if (title) {
                const user = await github.user.get();
                var data = JSON.stringify({
                    //description: about,
                    name: title,
                    owner: user.login,
                    private: true
                });
                const dataType = "POST";
                const params = {
                    "template_owner": "dompad",
                    "template_repo": "app.cms.www"
                };
                const settings = {
                    data,
                    dataType
                };
                console.log("controller.setup.app", {
                    params,
                    settings
                });
                var html = await ajax("raw/html/template/template.loader.new.app.html");
                steps[0].find('card').innerHTML = html;
                var s = async(data)=>{
                    steps[0].find('card').innerHTML = "";
                    var confirm = 1 < 0 ? await modal.confirm({
                        body: "Do you want to create a logo or skip this wizard?",
                        title: "App Created"
                    }, ["Skip", "Continue"]) : null;
                    if (confirm) {
                        var href = "/new/app/" + data.name + "/";
                        href.router();
                    } else {
                        var name = data.name;
                        console.log('repos.generate ' + name, {
                            data
                        });
                        var href = "/dashboard/" + data.name + "/";
                        href.router();
                    }
                }
                var ss = ()=>{
                    steps[0].find('card').innerHTML = "";
                }
                1 > 0 ? github.repos.generate(params, settings).then(s).catch(ss) : null;
            }
        }
        ,

        background: async(target)=>{
            var button = target.closest('column').find('span');
            var prompt = await modal.prompt({
                body: 'Enter a background color value.',
                title: 'Hex Color Code'
            }, ['Cancel', 'Update'], button.textContent);
            console.log(1368, {
                prompt
            });
            if (prompt) {
                console.log({
                    target,
                    column: target.closest('column'),
                    button: target.closest('column').find('span')
                });
                button.textContent = prompt;
                controller.setup.iro(prompt)
            }
        }
        ,

        icon: data=>{

            //var files = event.target.files
            ImageTracer.imageToSVG(data, (svgstr)=>{
                byId('new-app-icon').find('foreignObject').innerHTML = svgstr;
            }
            , {
                viewbox: true
            })

        }
        ,

        ico: (el)=>{
            var elem = el.find('picture').firstElementChild;
            var xml = new XMLSerializer().serializeToString(elem);
            return obj = {
                download: GET[1] + ".svg",
                href: "data:image/svg;base64," + btoa(xml)
            };
        }
        ,

        iro: (color)=>{
            //picture.find('rect').fill = color; 
            var icon = byId('new-app-icon');
            //icon.find('n').textContent = icon.closest('form').find('block').children[1].find('input').value.charAt(0);

            byId('color-data-hex').all('text')[1].find('span').textContent = color;

            var sel = "iro-setup-about-brand";
            var el = byId(sel);
            el.innerHTML = "";
            if (el.innerHTML === "") {
                var icon = byId('new-app-icon');
                var width = el.clientWidth - 51;
                var box = 1 < 0;
                console.log("controller.setup.iro");
                window.picker = new iro.ColorPicker("#" + sel,{
                    color,
                    layout: [{
                        component: iro.ui.Slider,
                        options: {
                            sliderType: 'hue'
                        }
                    }, {
                        component: iro.ui.Slider,
                        options: {
                            sliderType: 'saturation'
                        }
                    }, {
                        component: iro.ui.Slider,
                        options: {
                            sliderType: 'value'
                        }
                    }],
                    layoutDirection: "vertical",
                    margin: 20,
                    sliderSize: 30
                });
                picker.on("color:change", function(color) {
                    var icon = byId('new-app-icon');
                    var hexString = color.hexString;
                    var rgb = color.rgba;
                    var rgbString = rgb.r + "," + rgb.g + "," + rgb.b;
                    var hsl = color.hsla;
                    var hslString = hsl.h + "," + hsl.s + "%," + hsl.l + "%";
                    byId("color-data-hex").all('text')[1].find('span').textContent = hexString;
                    byId("color-data-rgb").all('text')[1].find('span').textContent = rgbString;
                    byId("color-data-hsl").all('text')[1].find('span').textContent = hslString;
                    icon.find('rect').setAttribute('fill', hexString);
                    //icon.style.backgroundColor = hexString;
                    //icon.style.color = colors.contrast(hexString);
                    //icon.dataset.contrast = icon.style.color;
                });
                picker.on("mount", colorPicker);
                window.addEventListener("resize", reSize)
                function colorPicker(e) {
                    //console.log(e);
                    reSize();
                    var color = e.color;
                    var hexString = color.hexString;
                    var rgb = color.rgba;
                    var rgbString = rgb.r + "," + rgb.g + "," + rgb.b;
                    var hsl = color.hsla;
                    var hslString = hsl.h + "," + hsl.s + "%," + hsl.l + "%";
                    byId("color-data-hex").all('text')[1].find('span').textContent = hexString;
                    byId("color-data-rgb").all('text')[1].find('span').textContent = rgbString;
                    byId("color-data-hsl").all('text')[1].find('span').textContent = hslString;
                    icon.find('rect').setAttribute('fill', hexString);
                    //icon.style.backgroundColor = hexString;
                    //icon.style.color = colors.contrast(hexString);
                }
                function reSize() {
                    var size = dom.body.clientWidth > 570 ? 480 : dom.body.clientWidth - 90;
                    picker.resize(size);
                    var img = icon.find('picture img');
                    if (img) {
                        if (img.clientWidth > img.clientHeight) {
                            //icon.find('picture img').style.width = (size * 0.69) + 'px';
                            img.style.width = "69%";
                        } else {
                            //icon.find('picture img').style.height = (size * 0.69) + 'px';
                            img.style.height = "69%";
                        }
                        //icon.find('picture img').style.height = (size * 1) + 'px';
                        //icon.find('picture img').style.width = (size * 1) + 'px';
                    } else {
                        img = icon.find('picture foreignObject');
                    }
                }
            }
        }
        ,

        load: (target)=>{
            var button = target.closest('box > *').find('ico n');
            if (button.className === "gg-software-upload") {//alert('Import File');
            }
            if (button.className === "gg-software-download") {
                (async function() {
                    var confirm = await modal.confirm({
                        body: 'Are you sure you want to save this icon to your device?',
                        title: 'Export'
                    }, ["Cancel", "Download"]);
                    if (confirm) {
                        var icon = controller.setup.ico(target.closest('box').previousElementSibling);
                        download(icon);
                    }
                }
                )()
            }
        }
        ,

        scale: (event)=>{
            var target = event.target;
            var value = target.value;
            var foreignObject = target.closest('box').parentNode.firstElementChild.find('foreignObject');
            console.log("controller.setup.scale", {
                event,
                foreignObject,
                target,
                value
            });
            foreignObject.setAttribute('height', value + '%');
            foreignObject.setAttribute('width', value + '%');
            foreignObject.style.transform = "translate(calc((100% - " + value + "%)/2), calc((100% - " + value + "%)/2))";
            target.previousElementSibling.lastElementChild.textContent = value;
        }
        ,

        step: async(target)=>{
            var form = target.closest('form');
            var step = target.closest('block > *');
            var index = step.index();
            var button = target.closest('box').find('n');
            if (button) {
                var steps = target.closest('block').all('block > *');
                if (button.className === "gg-chevron-left") {
                    if (index === 1) {
                        $(form.all('block > *')).addClass('display-none');
                        $(form.all('form > header box flex')).attr("data-height", "30px");
                        $(form.all('form > header box flex')).attr("data-width", "30px");
                        $(form.all('form > header box flex')[0]).attr("data-height", "50px");
                        $(form.all('form > header box flex')[0]).attr("data-width", "50px");
                        $(form.all('block > *')[0]).removeClass('display-none');
                    }
                    if (index === 2) {
                        $(form.all('block > *')).addClass('display-none');
                        $(form.all('form > header box flex')).attr("data-height", "30px");
                        $(form.all('form > header box flex')).attr("data-width", "30px");
                        $(form.all('form > header box flex')[1]).attr("data-height", "50px");
                        $(form.all('form > header box flex')[1]).attr("data-width", "50px");
                        $(form.all('block > *')[1]).removeClass('display-none');

                        var picture = steps[1].find('picture');
                        var color = picture.firstElementChild.tagName === "svg" ? picture.find('rect').getAttribute('fill') : "#" + colors.random();

                        controller.setup.iro(color);
                    }
                }
                if (button.className === "gg-chevron-right") {
                    var title = step.find('input');
                    if (index === 0) {
                        if (title.value.length > 0) {
                            if (title.dataset.value === title.value) {
                                $(form.all('block > *')).addClass('display-none');
                                $(form.all('form > header box flex')).attr("data-height", "30px");
                                $(form.all('form > header box flex')).attr("data-width", "30px");
                                $(form.all('form > header box flex')[1]).attr("data-height", "50px");
                                $(form.all('form > header box flex')[1]).attr("data-width", "50px");
                                $(form.all('block > *')[1]).removeClass('display-none');
                                controller.setup.iro('#' + colors.random());
                            } else {
                                //alert("Step Two");
                                var user = await github.user.get();

                                //Update index.html
                                github.repos.contents({
                                    owner: user.login,
                                    repo: GET[1],
                                    path: "/index.html"
                                }, {
                                    cache: "reload"
                                }).then(async(data)=>{
                                    var raw = data.content;
                                    var sha = data.sha;
                                    var content = atob(raw);
                                    var doc = new DOMParser().parseFromString(content, "text/html");
                                    //var json = JSON.parse(content);
                                    console.log(807, {
                                        content,
                                        data,
                                        doc,
                                        raw,
                                        sha,
                                        step,
                                        steps
                                    });
                                    doc.head.find('title').textContent = title.value;
                                    var DOM = {
                                        body: doc.body,
                                        doc: doc.head,
                                        head: doc.head,
                                        html: doc.all[0]
                                    }
                                    console.log(808, {
                                        DOM
                                    });
                                    var content = btoa(DOM.html.outerHTML);
                                    var message = "Update index.html";

                                    var upload = 1 > 0 ? await github.repos.contents({
                                        owner: user.login,
                                        repo: GET[1],
                                        path: "/index.html"
                                    }, {
                                        data: JSON.stringify({
                                            content,
                                            message,
                                            sha
                                        }),
                                        dataType: "PUT"
                                    }).then(function() {
                                        step.find('input').dataset.value = title.value;
                                        $(form.all('block > *')).addClass('display-none');
                                        $(form.all('form > header box flex')).attr("data-height", "30px");
                                        $(form.all('form > header box flex')).attr("data-width", "30px");
                                        $(form.all('form > header box flex')[1]).attr("data-height", "50px");
                                        $(form.all('form > header box flex')[1]).attr("data-width", "50px");
                                        $(form.all('block > *')[1]).removeClass('display-none');
                                        controller.setup.iro('#' + colors.random());
                                    }) : null;
                                }
                                );
                            }
                        } else {
                            modal.alert({
                                body: "Provide a title for your app.",
                                submit: "Go back",
                                title: "Step One"
                            });
                        }
                    }
                    if (index === 1) {
                        var icon = step.find('picture');
                        if (icon.innerHTML === "") {
                            var confirm = await modal.confirm({
                                body: "Are you sure want to create an icon without a graphic?",
                                title: "Step Two"
                            }, ["Cancel", "Continue"]);
                        } else {
                            $(form.all('block > *')).addClass('display-none');
                            $(form.all('form > header box flex')).attr("data-height", "30px");
                            $(form.all('form > header box flex')).attr("data-width", "30px");
                            $(form.all('form > header box flex')[1]).attr("data-height", "50px");
                            $(form.all('form > header box flex')[1]).attr("data-width", "50px");
                            $(form.all('block > *')[1]).removeClass('display-none');
                        }

                        //Import icon.svg
                        var box = icon.parentNode;
                        var file = controller.setup.ico(box);
                        var user = await github.user.get();
                        github.repos.contents({
                            owner: user.login,
                            repo: GET[1],
                            path: "/icon.svg"
                        }, {
                            cache: "reload"
                        }).then(async(data)=>{
                            var raw = data.content;
                            var sha = data.sha;
                            var content = atob(raw);
                            var doc = new DOMParser().parseFromString(content, "text/html");
                            //var json = JSON.parse(content);
                            console.log(807, {
                                content,
                                data,
                                doc,
                                raw,
                                sha,
                                step,
                                steps
                            });
                            createIcon(file, sha);
                        }
                        ).catch(()=>{
                            console.log(1792, {
                                file
                            });
                            createIcon(file);
                        }
                        )

                        async function createIcon(icon, sha) {
                            console.log(1749, {
                                icon
                            });
                            var b64 = icon.href;
                            var content = b64.split(';base64,')[1];
                            var message = "Create icon.svg";
                            var data = {
                                content,
                                message,
                            };
                            sha ? data.sha = sha : null;
                            console.log({
                                b64,
                                data,
                                sha
                            });
                            var upload = 1 > 0 ? await github.repos.contents({
                                owner: user.login,
                                repo: GET[1],
                                path: "/icon.svg"
                            }, {
                                data: JSON.stringify(data),
                                dataType: "PUT"
                            }).then(function() {
                                $(form.all('block > *')).addClass('display-none');
                                $(form.all('form > header box flex')).attr("data-height", "30px");
                                $(form.all('form > header box flex')).attr("data-width", "30px");
                                $(form.all('form > header box flex')[2]).attr("data-height", "50px");
                                $(form.all('form > header box flex')[2]).attr("data-width", "50px");
                                $(form.all('block > *')[2]).removeClass('display-none');
                            }) : null;
                        }

                    }
                    if (index === 2) {
                        var about = steps[2].find('textarea').value;
                        if (about.length > 0) {
                            var confirm = await modal.confirm({
                                body: "Are you sure you want to create this project?",
                                title: "Confirm Setup"
                            }, ["Cancel", "Continue"]);
                            if (confirm) {
                                //Update site.webmanifest
                                var user = await github.user.get();
                                github.repos.contents({
                                    owner: user.login,
                                    repo: GET[1],
                                    path: "/site.webmanifest"
                                }, {
                                    cache: "reload"
                                }).then(async(data)=>{
                                    var raw = data.content;
                                    var sha = data.sha;
                                    var content = atob(raw);
                                    var json = JSON.parse(content);
                                    json.description = about;
                                    json.icons = [{
                                        src: "icon.png",
                                        sizes: "570x570",
                                        type: "image/png"
                                    }];
                                    json.name = steps[0].find('input').value;
                                    json["short_name"] = GET[1];
                                    var content = btoa(JSON.stringify(json, null, 2));
                                    var message = "Create site.webmnifest";
                                    var data = {
                                        content,
                                        message,
                                        sha
                                    };
                                    sha ? data.sha = sha : null;
                                    console.log(1708, {
                                        content,
                                        data,
                                        json,
                                        raw,
                                        sha
                                    });

                                    var upload = 1 > 0 ? await github.repos.contents({
                                        owner: user.login,
                                        repo: GET[1],
                                        path: "/site.webmanifest"
                                    }, {
                                        data: JSON.stringify({
                                            content,
                                            message,
                                            sha
                                        }),
                                        dataType: "PUT"
                                    }).then(function(data) {
                                        console.log(1805, {
                                            data
                                        });
                                        window.location.pathname.router();
                                    }) : null;
                                }
                                );

                            }
                        } else {
                            modal.alert({
                                body: "A description is required in order to proceed.",
                                submit: "Go back",
                                title: "Step Three"
                            });
                        }
                    }
                }
            }
        }
        ,

        webmanifest: async(event)=>{
            event.preventDefault();
            const form = event.target;
            const steps = form.all('block > column');
            const title = steps[0].find('[type="text"]').value;
            const color = steps[1].find('#color-data-hex').all('text')[1].find('span').textContent.split('#')[1];
            const about = steps[2].find('textarea').value;
            alert("webmanifest: " + title + " : " + color + " : " + about);

            const user = await github.user.get();
            var owner = user.login;
            var repo = title;
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
            //github.repos.contents(params, settings).then((window.location.pathname + window.location.hash).router())
        }

    },

});
