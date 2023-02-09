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
        console.log(route, root);

        if (root) {

            const roots = ["dashboard", "design", "developer", "marketplace", "new"];
            if (roots.indexOf(root) === -1) {
                if (get.length > 1) {
                    const owner = root;
                    const repo = get[1];
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
                    resolve(route);
                } else {
                    var vp = dom.body.find('[data-page="/*/"]');
                    var owner = await github.users.get({
                        username: get[0]
                    });
                    console.log({
                        owner
                    });
                    vp.find('block > picture + section picture img').src = owner.avatar_url;
                    vp.find('[placeholder="Firstname Lastname"]').textContent = owner.name;
                    vp.find('[placeholder="username"]').textContent = owner.login;
                    vp.find('[data-after="Projects"]').previousElementSibling.textContent = owner.public_repos;
                    vp.find('[data-after="Snippets"]').previousElementSibling.textContent = owner.public_gists;
                    vp.find('[data-after="Followers"]').previousElementSibling.textContent = owner.followers;
                    vp.find('[data-after="Following"]').previousElementSibling.textContent = owner.following;
                    resolve(route);
                }
            }
            if (root === "dashboard") {
                0 < 1 ? controller.nav.hide() : controller.nav.close();
                if (get.length > 1) {
                    const user = await github.user.get();

                    var project = dom.body.find('main nav').find('[placeholder="Project Name"]');
                    var link = dom.body.find('main nav').find('[placeholder="Link"]');
                    var username = dom.body.find('main nav').find('[placeholder="username"]');

                    //link.dataset.href = "/" + user.login + "/" + get[1] + "." + "dompad.io";
                    link.textContent = get[1];

                    username.textContent = user.login;
                    username.closest('box').dataset.href = "/" + user.login + "/";

                    try {
                        var icon = await github.raw.path("/" + user.login + "/" + get[1] + "/main/icon.svg");
                        project.closest('box').previousElementSibling.find('img').src = "data:image/svg+xml;base64," + icon.content;
                    } catch (e) {
                        console.log(e);
                    }

                    if (get.length > 2) {
                        var arr = ["build", "files", "media", "merch", "pages", "posts", "style"];
                        if (arr.includes(get[2])) {
                            var index = arr.indexOf(get[2]);
                            dom.body.find('main nav').children[1].children[index].find('.gg-chevron-down').click();
                        }
                        if (get[2] === "build") {
                            var vp = dom.body.find('pages[data-pages="/dashboard/*/build/"]');
                            var iframe = vp.find('iframe');

                            if (iframe && !iframe.contentWindow.document.body.querySelector('boot')) {
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
                            if (feed && feed.innerHTML === "") {
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
                                                var box = byId('template-feed-dashboard-files').content.firstElementChild.cloneNode(true);
                                                var name = row.name;
                                                var arr = name.split('.');
                                                var ext = arr[arr.length - 1];
                                                var icon = "file";
                                                ["jpg", "jpeg", "png", "svg", "webp"].includes(ext) ? icon = "image" : null;
                                                ["mp3"].includes(ext) ? icon = "music" : null;
                                                ["mp4", "wav"].includes(ext) ? icon = "video" : null;
                                                ["doc", "docx", "pdf", "txt"].includes(ext) ? icon = "file-document" : null;
                                                box.dataset.sha = row.sha;
                                                box.find('ico n').classList.add("gg-" + icon);
                                                box.find('text').dataset.href = "/dashboard/" + get[1] + "/files/file/" + row.name;
                                                box.find('[placeholder="Filename"]').textContent = row.name;
                                                //box.all('text')[1].textContent = formatBytes(row.size);
                                                var html = box.outerHTML;
                                                feed.insertAdjacentHTML('beforeend', html);
                                                //alert(html);
                                                console.log(feed);
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
                        if (get[2] === "merch") {

                            if (get.length > 3) {
                                if (get[3] === "catalog") {
                                    var feed = byId('feed-dashboard-catalog');
                                    if (get[4]) {
                                        if (get[4] === "item") {
                                            var vp = dom.body.find('pages[data-pages="/dashboard/*/merch/catalog/item/"]');
                                            var name = rout.ed.dir(route.path);
                                            name.splice(0, 4);
                                            //vp.find('[placeholder="Page URL"]').innerHTML = "<span>" + rout.ed.url(name) + "</span><span contenteditable placeholder=':slug'></span>";
                                            vp.find('[placeholder="Product Name"]').value = "";
                                        }
                                    } else {
                                        var vp = dom.body.find('pages[data-pages="/dashboard/*/merch/"]');
                                        //alert("Attempting to fetch files");
                                        github.repos.contents({
                                            owner: user.login,
                                            path: "/raw/merch/catalog.json",
                                            repo: get[1]
                                        }, {}).then(d=>{
                                            var data = JSON.parse(atob(d.content));
                                            if (data) {
                                                console.log(84, {
                                                    data
                                                });
                                                feed.innerHTML = "";
                                                if (data.length > 0) {
                                                    //vp.all('card')[1].find('box').classList.remove('display-none');
                                                    var html = "";
                                                    var d = 0;
                                                    do {
                                                        var row = data[d];
                                                        var title = row.title;
                                                        var slug = row.slug;
                                                        var card = byId('template-feed-dashboard-catalog').content.firstElementChild.cloneNode(true);
                                                        card.find('[placeholder="Title"]').textContent = title;
                                                        card.find('.gg-math-plus').closest('box').dataset.href = "/dashboard/:get/merch/product/" + slug + "/";
                                                        html += card.outerHTML;
                                                        //feed.insertAdjacentHTML('beforeend', html);
                                                        d++;
                                                    } while (d < data.length);
                                                    feed.innerHTML = html;
                                                }
                                            }

                                        }
                                        )
                                    }
                                } else if (get[3] === "product") {
                                    var vp = dom.body.find('pages[data-pages="/dashboard/*/merch/product/"]');
                                    var slug = get[4];
                                    if (slug) {
                                        var owner = await github.user.get();
                                        var json = await github.repos.contents({
                                            owner: user.login,
                                            repo: get[1],
                                            path: "raw/merch/catalog.json"
                                        }, {
                                            accept: "application/vnd.github.raw"
                                        });
                                        var row = json.find(i=>i.slug === slug);
                                        vp.find('[placeholder="Enter a title"]').value = row.title;
                                    }
                                }
                            } else {
                                var feed = byId('feed-dashboard-merch');
                                var vp = dom.body.find('page[data-page="/dashboard/*/merch/"]');
                                //alert("Attempting to fetch files");
                                github.repos.contents({
                                    owner: user.login,
                                    path: "/raw/merch/catalog.json",
                                    repo: get[1]
                                }, {}).then(d=>{
                                    var data = JSON.parse(atob(d.content));
                                    if (data) {
                                        console.log(84, {
                                            data
                                        });
                                        feed.innerHTML = "";
                                        if (data.length > 0) {
                                            vp.all('header card')[1].find('box').classList.remove('display-none');
                                            var html = "";
                                            var d = 0;
                                            do {
                                                var row = data[d];
                                                var title = row.title;
                                                var slug = row.slug;
                                                var card = byId('template-feed-dashboard-merch').content.firstElementChild.cloneNode(true);
                                                card.find('[placeholder="Title"]').textContent = title;
                                                card.find('.gg-tag').closest('text').dataset.href = "/dashboard/:get/merch/catalog/" + slug + "/";
                                                html += card.outerHTML;
                                                //feed.insertAdjacentHTML('beforeend', html);
                                                d++;
                                            } while (d < data.length);
                                            feed.innerHTML = html;
                                        } else {
                                            vp.all('header card')[1].find('box').classList.add('display-none');
                                        }
                                    }

                                }
                                )
                            }
                        }
                        if (get[2] === "pages") {

                            if (get.length > 3) {
                                if (get[3] === "page") {
                                    var vp = dom.body.find('pages[data-pages="/dashboard/*/pages/*/"]');
                                    var name = rout.ed.dir(route.path);
                                    name.splice(0, 4);
                                    vp.find('[placeholder="Page URL"]').innerHTML = "<span>" + rout.ed.url(name) + "</span><span contenteditable placeholder=':slug'></span>";
                                }
                            } else {
                                var feed = byId('feed-dashboard-pages');
                                if (0 < 1) {
                                    var vp = dom.body.find('pages[data-pages="/dashboard/*/pages/"]');
                                    //alert("Attempting to fetch files");
                                    github.repos.contents({
                                        owner: user.login,
                                        path: "/raw/pages/pages.json",
                                        repo: get[1]
                                    }, {}).then(d=>{
                                        var data = JSON.parse(atob(d.content));
                                        if (data) {
                                            data.unshift({
                                                page: "/",
                                                path: "/"
                                            });
                                            console.log(84, {
                                                data
                                            });
                                            feed.innerHTML = "";
                                            if (data.length > 0) {
                                                vp.all('header card')[1].find('box').classList.remove('display-none');
                                                var html = "";
                                                var d = 0;
                                                var names = [];
                                                var html = "";
                                                var hrefs = [];

                                                do {
                                                    var row = data[d];
                                                    hrefs[d] = row.path;
                                                    d++;
                                                } while (d < data.length);
                                                hrefs.sort();

                                                d = 0;
                                                var names = [];
                                                do {
                                                    var href = hrefs[d];
                                                    names[d] = rout.ed.dir(href);
                                                    d++;
                                                } while (d < hrefs.length);

                                                d = 0;
                                                do {
                                                    var href = hrefs[d];
                                                    var card = byId('template-feed-dashboard-pages').content.firstElementChild.cloneNode(true);
                                                    if ((d > 0 && names[d][0] !== names[d - 1][0])) {
                                                        html += "</card>";
                                                    }
                                                    if (d === 0 || (d > 0 && names[d][0] !== names[d - 1][0])) {
                                                        html += "<card class='" + card.className + "'>";
                                                    }
                                                    card.find('[placeholder="Page URL"]').textContent = href;
                                                    card.firstElementChild.dataset.sha = row.sha;
                                                    //card.find('[placeholder="Page URL"]').dataset.href = "/dashboard/:get/build/er/" + name.join('/');
                                                    card.find('.gg-file-add').closest('text').dataset.href = "/dashboard/:get/pages/page" + href;
                                                    card.find('.gg-code-slash').closest('text').dataset.href = "/dashboard/:get/build/er" + href;
                                                    card.find('.gg-eye').closest('text').dataset.href = "/dashboard/:get/build/preview" + href;
                                                    html += card.innerHTML;
                                                    //feed.insertAdjacentHTML('beforeend', html);
                                                    d++;
                                                } while (d < names.length);

                                                feed.innerHTML = html;
                                            } else {
                                                vp.all('header card')[1].find('box').classList.add('display-none');
                                            }
                                        }

                                    }
                                    );
                                }
                            }
                        }
                        if (get[2] == "posts") {
                            if (get[3] === "post") {
                                var vp = dom.body.find('pages[data-pages="/dashboard/*/posts/*/"]');
                                var title = vp.find('[placeholder="Title"]');
                                var description = vp.find('[placeholder="Description"]');
                                var article = vp.find('box [contenteditable]');

                                title.value = "";
                                description.value = "";
                                article.innerHTML = "";

                                if (get.length > 4) {
                                    const user = await github.user.get();

                                    if (0 < 1) {

                                        github.repos.contents({
                                            owner: user.login,
                                            path: "/raw/posts/" + get[4] + "/index.html",
                                            repo: get[1]
                                        }, {
                                            accept: "application/vnd.github.raw"
                                        }).then(data=>{
                                            //var data = atob(d.content);
                                            if (data) {
                                                const doc = new DOMParser().parseFromString(data, "text/html");
                                                console.log(89, {
                                                    data,
                                                    doc,
                                                    vp
                                                });

                                                title.value = doc.head.find("title").textContent;
                                                on.key.up.auto.size(title);

                                                description.value = doc.head.find("meta[name='description']").content;
                                                on.key.up.auto.size(description);

                                                article.innerHTML = doc.body.all('article')[doc.body.all('article').length - 1].innerHTML;

                                                //vp.find('card textarea').value = doc.body.find('article').textContent;
                                                //const gist = doc.head.find('meta[name="gist"]').content;
                                                //gist ? vp.find('form > footer').all('button')[0].dataset.gist = gist : null;                                                
                                            }
                                        }
                                        ).catch(async(error)=>{
                                            console.log(507, "Post is empty", {
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
                                resolve(route);
                            } else {
                                const user = await github.user.get();
                                var params = {
                                    owner: user.login,
                                    path: "/raw/posts",
                                    repo: get[1]
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
                        } else if (get[2] === "style") {
                            var a = async(d)=>{
                                //data = data.filter(row=>row.type === "dir")
                                data = JSON.parse(d);
                                console.log(319, {
                                    data
                                });
                                const feed = byId('feed-dashboard-blog-theme');
                                if (feed && feed.all('card').length === 0 && data.length > 0) {
                                    const template = byId('template-dashboard-blog-theme').content.firstElementChild.cloneNode(true);
                                    var x = 0;
                                    do {
                                        const row = data[x];
                                        //const name = rout.ed.dir(row.path)[0];
                                        const full_name = row.full_name;
                                        const dir = rout.ed.dir(full_name);
                                        var repo = dir[1];
                                        const arr = repo.split('.');
                                        const name = arr[arr.length - 1];
                                        var owner = row.owner;
                                        console.log({
                                            full_name,
                                            dir,
                                            name,
                                            owner
                                        })

                                        var screenshot = await github.repos.contents({
                                            owner: owner.login,
                                            path: "/raw/asset/png/template.png",
                                            repo: repo
                                        });
                                        //var repository = row['_links'].html.split('/');
                                        //var user = repository[0];
                                        //var repo = repository[1];
                                        //template.dataset["full_name"] = row.repository["full_name"];
                                        //template.find('ico').dataset.href = "/" + root + "/" + name + "/editor/";
                                        //mtemplate.find('text').dataset.href = "/templates/" + name + "/";
                                        template.find('text').textContent = name;
                                        //template.find('picture').dataset.href = "/" + root + "/" + name + "/preview/";
                                        template.find('picture img').src = "raw/asset/png/template/template.spryce.png";
                                        feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                        x++;
                                    } while (x < data.length);
                                }
                            }
                            ajax('raw/asset/json/templates.json').then(a);
                        }
                    }

                    //alert(window.database.dashboard.hasOwnProperty(get[1]));
                    if (window.database.dashboard.hasOwnProperty(get[1]) === false) {
                        //const user = await github.user.get();
                        github.repos.contents({
                            owner: user.login,
                            path: "/site.webmanifest",
                            repo: get[1]
                        }, {
                            cache: "reload"
                        }).then(async(data)=>{
                            if (data) {
                                var content = data.content;
                                var raw = atob(content);
                                var json = JSON.parse(raw);
                                0 > 1 ? console.log(261, {
                                    content,
                                    data,
                                    json,
                                    raw
                                }) : null;
                                var description = json.description;
                                var icons = json.icons;
                                var name = json.name;
                                var short_name = json.short_name;

                                window.database.dashboard[short_name] = json;
                                if (description && icons && name) {
                                    dom.body.find('main nav').find('[placeholder="Project Name"]').textContent = name;
                                } else {
                                    const html = await ajax('/raw/html/template/template.setup.html');
                                    var ppp = 0 < 1 ? await modal.page(html) : dom.body.find('[data-fetch="raw/html/template/template.setup.html"]')
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

                            console.log(498, {
                                params,
                                settings
                            });

                            const aa = async(e)=>{
                                const html = await ajax('/raw/asset/html/template/template.setup.html');
                                var ppp = await modal.page(html);
                                ppp.find('form').classList.remove("display-none");
                                resolve(route);
                            }

                            const bb = (e)=>{}

                            github.repos.contents({
                                owner: user.login,
                                path: "/site.webmanifest",
                                repo: GET[1]
                            }, {
                                data: JSON.stringify({
                                    content: btoa(JSON.stringify(json, null, 2)),
                                    message: "Create site.webmanifest"
                                }),
                                dataType: "PUT"
                            }).then(aa).catch(bb);

                        }
                        );
                    }
                } else {

                    if (github.oauth.verify()) {
                        var params = {};
                        const user = await github.user.get();
                        var p = d=>{
                            var data = d.content ? JSON.parse(atob(d.content)) : d;
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
                        cache.feed.dashboard.index ? github.repos.contents({
                            owner: user.login,
                            repo: "db.dompad.io",
                            path: "/v1/apps/index.json"
                        }).then(p) : github.user.repos({
                            query: {
                                per_page: 25,
                                sort: "created"
                            }
                        }).then(p);
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
            var path = "/index.html";
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

            blocks.classList.remove('left-240px');
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
                //css.setAttribute('href', 'raw/css/editor.css')
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

            //blocks.classList.add('left-240px');
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
                    var raw = await ajax('raw/asset/html/template/template.iframe.document.html');
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

            //blocks.classList.add('left-240px');
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
            blocks.classList.remove('left-240px');
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
                    //css.setAttribute('href', 'raw/css/editor.css')
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
                blocks.classList.remove('left-240px');
                blocks.dataset["960pxTransform"] = "0";
            }
        }
    },

    catalog: {

        parent: async(event)=>{
            event.preventDefault();
            var form = event.target;
            var value = form.find('[type="text"]').value;

            if (value.length > 0) {
                const user = await github.user.get();
                const fix = value.toLowerCase();
                const filename = "page." + fix.split(' ').join('-') + ".html";

                const message = "Add " + value + " to Catalog";
                const content = "";

                var rte = rout.ed.dir(route.path);
                rte.splice(0, 4);

                event.target.closest('form').find('[type="submit"]').removeAttribute('disabled');
                event.target.closest('form').find('[data-submit]').classList.remove('opacity-50pct');

                var page = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
                var path = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
                var row = {
                    slug: value.replaceAll(' ', '-').toLowerCase(),
                    title: value
                };
                var sha = null;

                try {
                    var data = await github.repos.contents({
                        owner: user.login,
                        repo: GET[1],
                        path: "/raw/merch/catalog.json"
                    });
                    var sha = data.sha;
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));

                inc ? alert("This item already exists.") : github.repos.contents({
                    owner: user.login,
                    repo: GET[1],
                    path: "/raw/merch/catalog.json"
                }, {
                    data: JSON.stringify({
                        content: btoa(JSON.stringify(rows, null, 4)),
                        message,
                        sha
                    }),
                    dataType: "PUT"
                }).then(()=>{
                    "/dashboard/:get/merch/".router()
                    event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
                    event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
                }
                ).catch(e=>{
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                }
                );

            }
        }

    },

    design: {

        install: async(target)=>{
            var user = await github.user.get();
            var card = target.closest('card');
            var theme = card.find('box text').textContent;
            var owner = "dompad";
            var repo = "design.dompad." + theme;
            if (theme) {
                var confirm = await modal.confirm({
                    title: "Install " + theme.capitalize(),
                    body: "Are you sure you want to use this template?"
                }, ["Cancel", "Install"], callBack);
                if (confirm) {
                    callBack()
                }
                async function callBack() {

                    //VARIABLES
                    var array = [];

                    //REFERENCES
                    var references = await github.database.references(params = {
                        branch: "main",
                        owner: "dompad",
                        repo: "design.dompad." + theme
                    }, {
                        dataType: "GET"
                    });
                    console.log("references", {
                        references
                    });

                    //SPROUT
                    if (0 < 1) {
                        try {
                            var sprout = [];
                            var trees = await github.database.trees({
                                owner,
                                recursive: true,
                                repo,
                                sha: references.object.sha
                            });
                            var array = trees.tree;
                            array = array.filter(branch=>(branch.path !== "raw/files" && branch.path !== "raw/pages" && branch.path !== "raw/style"))
                            array = array.filter(branch=>(branch.path.startsWith('raw/files') || branch.path.startsWith('raw/pages') || branch.path.startsWith('raw/style')))
                            if (array.length > 0) {
                                var t = 0;
                                do {
                                    var tr = array[t];
                                    var path = tr.path;
                                    var content = await github.repos.contents({
                                        owner,
                                        path,
                                        repo
                                    }, {
                                        accept: "application/vnd.github.raw"
                                    })
                                    sprout[t] = {
                                        content,
                                        path
                                    };
                                    0 > 1 ? console.log(1363, {
                                        contents,
                                        path,
                                        tr
                                    }) : null;
                                    t++;
                                } while (t < array.length)
                            }
                            console.log(1339, 'controller.design.installer', "GET trees", {
                                sprout
                            });
                        } catch (error) {
                            console.log(2530, 'GET github.database.trees', error);
                        }
                    }

                    //TREE
                    if (0 > 1) {
                        var tree = [];
                        if (sprout.length > 0) {
                            var b = 0;
                            do {
                                var row = sprout[b];
                                var res = await github.database.blobs({
                                    owner,
                                    repo
                                }, {
                                    data: JSON.stringify({
                                        content: row.content
                                    }),
                                    dataType: "POST"
                                }).catch(error=>{
                                    console.log(2504, 'github.database.blobs', error);
                                }
                                );
                                tree[b] = {
                                    path: row.path,
                                    mode: "100644",
                                    type: "blob",
                                    sha: res.sha
                                };
                                b++;
                            } while (b < sprout.length)
                        }
                        console.log(2517, 'controller.posts.update', "tree", {
                            tree
                        });
                    }

                    //PUSH
                    if (0 < 1) {
                        var params = {
                            message: "Install " + theme.capitalize(),
                            repo: GET[1],
                            owner: user.login
                        };
                        console.log(2452, 'controller.posts.update', "array", {
                            array: sprout
                        });
                        await github.crud.update(params, sprout);
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
            params.repo = GET[1]

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

    media: {

        import: (b64)=>{
            var split = b64.split(';base64,')
            var mime = split[0].split(':')[1];
            var type = mime.split('/')[0]
            console.log({
                b64,
                mime,
                type
            })
            if (["audio", "image", "video"].includes(type)) {
                type === "image" ? type = "photo" : null;
                ('/dashboard/:get/media/' + type).router().then(()=>{
                    var vp = dom.body.find('[data-pages="/dashboard/*/media/' + type + '/"]');
                    if (type === "audio") {
                        var audio = document.createElement('audio');
                        audio.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                        audio.src = b64;
                        vp.find('figure').innerHTML = udio.outerHTML;
                    }
                    if (type === "photo") {
                        var img = document.createElement('img');
                        img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                        img.src = b64;
                        vp.find('figure').innerHTML = img.outerHTML;
                    }
                    if (type === "video") {
                        var video = document.createElement('video');
                        video.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                        video.controls = true;
                        video.playsinline = true;
                        video.src = b64;
                        vp.find('figure').innerHTML = video.outerHTML;
                    }
                }
                );
            }
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

        card: target=>{
            var button = target.closest('ico');
            if (button && button.find('.gg-chevron-down')) {
                $(target.closest('card').parentNode.all('card > row + column')).attr('data-display', 'none');
                $(target.closest('nav > column').all('ico.transition-1s')).removeAttr('data-transform');

                var elem = target.closest('card > row');
                if (elem.nextElementSibling.dataset.display === 'none') {
                    elem.nextElementSibling['removeAttribute']('data-display', 'none');
                    button.find('.gg-chevron-down').parentNode['setAttribute']('data-transform', 'rotate(180deg)');
                } else {
                    elem.nextElementSibling['setAttribute']('data-display', 'none');
                    button.find('.gg-chevron-down').parentNode['removeAttribute']('data-transform', 'none');
                }
            }
        }
        ,

        close: ()=>{

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main nav + pages');

            nav.dataset["transform"] = "translateX(-100%)";
            blocks.dataset["transform"] = "0";

            nav.dataset["960pxTransform"] = "translateX(-100%)";
            blocks.dataset["960pxTransform"] = "0";

        }
        ,

        hide: ()=>{

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main nav + pages');

            nav.dataset["transform"] = "translateX(-100%)";
            blocks.dataset["transform"] = "0";

            nav.dataset["960pxTransform"] = "translateX(-100%)";
            blocks.dataset["960pxTransform"] = "0";

        }
        ,

        toggle: (target)=>{

            const nav = document.body.find('body > main nav');
            const transform = nav.dataset["960pxTransform"];
            const blocks = dom.body.find('main nav + pages');
            const toggle = transform === "translateX(0)";

            if (toggle) {
                nav.dataset["transform"] = "translateX(-100%)";
                blocks.dataset["transform"] = "0";

                nav.dataset["960pxTransform"] = "translateX(-100%)";
                blocks.dataset["960pxTransform"] = "0";
            } else {
                nav.dataset["transform"] = "translateX(0)";
                blocks.dataset["transform"] = "translateX(240px)";

                nav.dataset["960pxTransform"] = "translateX(0)";
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

            var el = target.closest('card').all('box')[1].find('text');
            var owner = el.dataset.owner;
            var repository = el.textContent;
            var private = el.nextElementSibling.dataset.display === "flex";

            var confirm = await modal.confirm({
                body: "Are you sure you want to import this project?",
                title: "Import " + repository
            }, ["No", "Yes"]);
            if (confirm) {

                var date = new Date();
                var pushed_at = date.toISOString();

                var row = {
                    "name": repository,
                    "owner": {
                        "login": owner
                    },
                    "private": private,
                    "pushed_at": pushed_at
                };
                var sha = null;

                try {
                    var data = await github.repos.contents({
                        owner: user.login,
                        path: "/v1/apps/index.json",
                        repo: "db.dompad.io"
                    });
                    var sha = data.sha;
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.find(item=>item.name === repository);
                var str = JSON.stringify(rows, null, 4);

                inc ? alert("This project already exists.") : 0 < 1 ? github.repos.contents({
                    owner: user.login,
                    repo: "db.dompad.io",
                    path: "/v1/apps/index.json"
                }, {
                    data: JSON.stringify({
                        content: btoa(unescape(encodeURIComponent(str))),
                        message: "Import " + repository + " to Projects",
                        sha
                    }),
                    dataType: "PUT"
                }).then(()=>{
                    ("/dashboard/" + repository + "/").router()
                }
                ).catch(e=>{
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                }
                ) : null;
            }
        }

    },

    pages: {

        create: async(event)=>{
            event.preventDefault();

            const form = event.target;
            const value = form.find('[type="text"]').value;

            if (value.length > 0) {
                const user = await github.user.get();
                const fix = value.toLowerCase();
                const filename = "page." + fix.split(' ').join('-') + ".html";

                const message = "Create " + value + " Page";
                const content = "";

                var rte = rout.ed.dir(route.path);
                rte.splice(0, 4);

                event.target.closest('form').find('[type="submit"]').removeAttribute('disabled');
                event.target.closest('form').find('[data-submit]').classList.remove('opacity-50pct');

                var page = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
                var path = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
                var row = {
                    "page": page,
                    "path": path
                }
                var sha = null;

                try {
                    var data = await github.repos.contents({
                        owner: user.login,
                        repo: GET[1],
                        path: "/raw/pages/pages.json"
                    });
                    var sha = data.sha;
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));

                inc ? alert("This page already exists.") : github.repos.contents({
                    owner: user.login,
                    repo: GET[1],
                    path: "/raw/pages/pages.json"
                }, {
                    data: JSON.stringify({
                        content: btoa(JSON.stringify(rows, null, 4)),
                        message,
                        sha
                    }),
                    dataType: "PUT"
                }).then(()=>{
                    "/dashboard/:get/pages/".router()
                    event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
                    event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
                }
                ).catch(e=>{
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/pages/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                }
                );

            }
        }
        ,

        delete: async(target)=>{

            const user = await github.user.get();

            var row = target.closest('row');
            var sha = row.dataset.sha;
            var page = row.find('[placeholder="Page URL"]').textContent;

            try {
                var data = await github.repos.contents({
                    owner: user.login,
                    repo: GET[1],
                    path: "/raw/pages/pages.json"
                });
                var sha = data.sha;
                var json = JSON.parse(atob(data.content)).filter(function(obj) {
                    return obj.page !== page;
                });
                var j = JSON.parse(atob(data.content));
                console.log(2040, {
                    j,
                    json
                });

                0 < 1 ? github.repos.contents({
                    owner: user.login,
                    repo: GET[1],
                    path: "/raw/pages/pages.json"
                }, {
                    data: JSON.stringify({
                        content: btoa(JSON.stringify(json, null, 4)),
                        message: "Delete Page",
                        sha
                    }),
                    dataType: "PUT"
                }).then(()=>{
                    "/dashboard/:get/pages/".router()
                }
                ).catch(e=>{
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/pages/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                }
                ) : null;
            } catch (e) {
                alert("There are no pages.");
            }

        }

    },

    posts: {

        create: async(event)=>{
            event.preventDefault();
            var form = event.target;
            var value = form.find('[type="text"]').value;
            //alert(value);

            if (0 < 1 && value.length > 0) {

                const user = await github.user.get();
                const fix = value.toLowerCase();
                const filename = "page." + fix.split(' ').join('-') + ".html";

                const message = "Add " + value + " to Posts";
                const content = "";

                var rte = rout.ed.dir(route.path);
                rte.splice(0, 4);

                event.target.closest('form').find('[type="submit"]').removeAttribute('disabled');
                event.target.closest('form').find('[data-submit]').classList.remove('opacity-50pct');

                var page = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
                var path = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
                var row = {
                    slug: value.replaceAll(' ', '-').replaceAll(/[\u0250-\ue007]/g, '').replaceAll(/\W/g, "").toLowerCase(),
                    title: value
                };
                var sha = null;

                try {
                    var data = await github.repos.contents({
                        owner: user.login,
                        repo: GET[1],
                        path: "/raw/posts/posts.json"
                    });
                    var sha = data.sha;
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str = JSON.stringify(rows, null, 4);

                inc ? alert("This item already exists.") : github.repos.contents({
                    owner: user.login,
                    repo: GET[1],
                    path: "/raw/posts/posts.json"
                }, {
                    data: JSON.stringify({
                        content: btoa(unescape(encodeURIComponent(str))),
                        message,
                        sha
                    }),
                    dataType: "PUT"
                }).then(()=>{
                    "/dashboard/:get/posts/".router()
                    event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
                    event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
                }
                ).catch(e=>{
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                }
                );

            }
        }
        ,

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
                repo: GET[1],
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
                repo: GET[1],
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
                repo: GET[1],
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

        read: async()=>{

            var user = await github.user.get();
            var feed = byId('feed-dashboard-posts');
            var vp = dom.body.find('page[data-page="/dashboard/*/merch/"]');
            //alert("Attempting to fetch files");
            github.repos.contents({
                owner: user.login,
                path: "/raw/posts/posts.json",
                repo: GET[1]
            }, {
                accept: "application/vnd.github.raw"
            }).then(data=>{
                //var data = JSON.parse(atob(d.content));
                if (data) {
                    console.log(84, {
                        data
                    });
                    feed.innerHTML = "";
                    if (data.length > 0) {
                        //vp.all('card')[1].find('box').classList.remove('display-none');
                        var html = "";
                        var d = 0;
                        do {
                            var row = data[d];
                            var title = row.title;
                            var slug = row.slug;
                            var card = byId('template-feed-dashboard-posts').content.firstElementChild.cloneNode(true);
                            //card.find('[placeholder="Title"]').setAttribute('value', title);
                            card.find('[placeholder="Title"]').textContent = title;
                            card.find('.gg-tag').closest('text').dataset.href = "/dashboard/:get/posts/post/" + slug + "/";
                            html += card.outerHTML;
                            //feed.insertAdjacentHTML('beforeend', html);
                            d++;
                        } while (d < data.length);
                        feed.innerHTML = html;
                    }
                }

            }
            )

        }
        ,

        update: async(event)=>{
            event.preventDefault();

            var form = event.target;
            var article = form.find('box [contenteditable]').innerHTML;
            var description = form.find('[placeholder="Description"]').value;
            var title = form.find('[placeholder="Title"]').value;
            var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
            //.replaceAll(/[\u0250-\ue007]/g, '') Remove non-alphanumeric chars except spaces
            //.replaceAll(/[^\w ]/g, "") Remove non-alphanumeric chars except spaces
            var row = {
                description,
                slug,
                title
            };
            var user = await github.user.get();

            //JSON
            var array = [];
            var data = [];
            try {
                var json = await github.repos.contents({
                    owner: user.login,
                    repo: GET[1],
                    path: "/raw/posts/posts.json"
                }, {
                    accept: "application/vnd.github.raw"
                });
                var j = json;
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                inc ? null : json.push(row);
            } catch (e) {
                var j = [];
                var json = [row];
            }
            rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
            console.log(2452, 'controller.posts.update', "json", {
                data,
                inc,
                json,
                row,
                rows
            });

            //ARTICLE 
            var str = await ajax('raw/asset/html/template/template.post.html');
            var doc = new DOMParser().parseFromString(str, 'text/html');
            var html = doc.documentElement;
            html.find('head title').textContent = title;
            html.find('head meta[name="description"]').setAttribute("content", description);
            html.find('body article').innerHTML = article;
            console.log(2452, 'controller.posts.update', "article", {
                article,
                doc,
                html
            });

            //PUSH
            var params = {
                message: "Add " + title + " to Posts",
                repo: GET[1],
                owner: user.login
            };
            var array = [{
                content: JSON.stringify(json, null, 4),
                path: "raw/posts/posts.json"
            }, {
                content: html.outerHTML,
                path: "raw/posts/" + slug + "/index.html"
            }];
            console.log(2452, 'controller.posts.update', "array", {
                array
            });
            await github.crud.update(params, array);
        }
        ,

        reader: async(shortname)=>{

            const user = await github.user.get();
            const owner = user.login;
            const repo = shortname;
            const path = "/raw/posts/posts.json";
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
                var svg = byId('new-app-icon').find('foreignObject').firstElementChild;
                svg.classList.add('height-100pct');
                svg.classList.add('width-100pct');
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
