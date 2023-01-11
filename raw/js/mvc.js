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
                    const title = get[1];
                    dom.body.find('main > nav [placeholder="Project Name"]').textContent = title;
                    if (get.length > 2) {
                        if (get[2] === "build") {
                            resolve(route);
                        }
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
                                    path: "/raw/files",
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

                    const user = await github.user.get();
                    var params = {
                        owner: user.login,
                        path: "/site.webmanifest",
                        repo: get[1]
                    };
                    var settings = {};
                    github.repos.contents(params, settings).then(async(data)=>{
                        if (data) {
                            const content = data.content;
                            const raw = atob(content);
                            const json = JSON.parse(raw);
                            console.log({
                                content,
                                data,
                                json,
                                raw
                            });
                            var description = json.description;
                            var icons = json.icons;
                            var title = json.title
                            if (description && icons && title) {
                                alert("Setup Complete!");
                                dom.body.find('main > nav').find('[placeholder="Project Name"]').textContent = title;
                            } else {
                                const html = await ajax('/raw/html/template/template.setup.html');
                                var ppp = await modal.page(html);
                                var form = ppp.find('form');

                                //Update index.html
                                github.repos.contents({
                                    owner: user.login,
                                    repo: GET[1],
                                    path: "index.html"
                                }, {}).then(async(data)=>{
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
                                        sha
                                    });
                                    var title = doc.head.find('title');
                                    if (title.textContent.length > 0) {
                                        var s1 = ppp.find('block').children[0];
                                        s1.find('input').value = s1.find('input').dataset.value = title.textContent;
                                        s1.all('footer box')[1].classList.remove('opacity-50pct');

                                        $(form.all('block > *')).addClass('display-none');
                                        $(form.all('form > header box flex')).attr("data-height", "30px");
                                        $(form.all('form > header box flex')).attr("data-width", "30px");
                                        $(form.all('form > header box flex')[1]).attr("data-height", "50px");
                                        $(form.all('form > header box flex')[1]).attr("data-width", "50px");
                                        $(form.all('block > *')[1]).removeClass('display-none');

                                        controller.setup.iro('#' + colors.random());
                                    }
                                }
                                );
                            }
                            resolve(route);
                        }
                    }
                    ).catch(async(error)=>{
                        console.log("43.error", {
                            error
                        });
                        if (error.code === 404) {
                            //alert("Setup Project");
                            const html = await ajax('/raw/html/template/template.setup.html');
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
                        console.log(243, {
                            user
                        }, user.login);
                        const query = 'q="key": 32616927 filename:index.json user:' + user.login;
                        github.search.code(query).then(data=>{
                            //data = data.filter(item=>item.name.includes('blog.cms'));
                            console.log({
                                data,
                                query
                            });
                            const feed = byId('feed-dashboard');
                            feed.innerHTML = "";
                            if (data.length > 0) {
                                const template = byId('template-feed-dashboard').content.firstElementChild.cloneNode(true);
                                var x = 0;
                                do {
                                    const row = data[x].repository;
                                    const shortname = row.name
                                    //.split('.')[2];
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
                if (auth.user()) {
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
                if (1 === 0 && get[1] === "app") {

                    var vp = dom.body.find('[data-pages="/new/app/"]');
                    var form = vp.find('form');

                    $(form.all('block > *')).addClass('display-none');
                    $(vp.all('form > header box flex')).attr("data-height", "30px");
                    $(vp.all('form > header box flex')).attr("data-width", "30px");
                    //vp.all('block[data-step]')[0].find('input[type="text"]').value = get[1];
                    //vp.all('block[data-step]')[0].find('footer').classList.remove('opacity-50pct');
                    //vp.all('block[data-step]')[0].find('[data-goto="two"]').dataset.disabled = "false";

                    if (get.length > 2) {
                        form.all('block > *')[0].find('input').value = get[2];
                        form.all('block > *')[0].all('footer box')[1].classList.remove('opacity-50pct');
                        var icon = byId('new-app-icon');
                        if (get.length > 3) {
                            $(vp.all('form > header box flex')[2]).attr("data-height", "50px");
                            $(vp.all('form > header box flex')[2]).attr("data-width", "50px");
                            $(vp.all('block > *')[2]).removeClass('display-none');

                            var hexString = '#' + get[3];
                            icon.style.backgroundColor = hexString;
                            icon.style.color = colors.contrast(hexString);
                            byId("color-data-hex").all('text')[1].textContent = hexString;
                            //byId("color-data-rgb").all('text')[1].textContent = rgbString;
                            //byId("color-data-hsl").all('text')[1].textContent = hslString;

                            if (get.length > 4) {
                                var textarea = vp.all('block > *')[2].find('textarea');
                                if (get.length === 5) {
                                    textarea.value = atob(get[4]);
                                }
                            }
                        } else {
                            //alert("Step Two");
                            icon.find('n').textContent = get[2].charAt(0);
                            $(vp.all('form > header box flex')[1]).attr("data-height", "50px");
                            $(vp.all('form > header box flex')[1]).attr("data-width", "50px");
                            $(vp.all('block > *')[1]).removeClass('display-none');

                            var sel = "iro-setup-about-brand";
                            var el = byId(sel);
                            if (el.innerHTML === "") {
                                var width = el.clientWidth - 51;
                                var box = 1 < 0;
                                window.picker = new iro.ColorPicker("#" + sel,{
                                    color: byId("color-data-hex").all('text')[1].textContent,
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
                                    byId("color-data-hex").all('text')[1].textContent = hexString;
                                    byId("color-data-rgb").all('text')[1].textContent = rgbString;
                                    byId("color-data-hsl").all('text')[1].textContent = hslString;
                                    icon.style.backgroundColor = hexString;
                                    icon.style.color = colors.contrast(hexString);
                                    //icon.dataset.contrast = icon.style.color;
                                });
                                picker.on("mount", function(e) {
                                    console.log(e);
                                    var color = e.color;
                                    var icon = byId('new-app-icon');
                                    var hexString = color.hexString;
                                    var rgb = color.rgba;
                                    var rgbString = rgb.r + "," + rgb.g + "," + rgb.b;
                                    var hsl = color.hsla;
                                    var hslString = hsl.h + "," + hsl.s + "%," + hsl.l + "%";
                                    byId("color-data-hex").all('text')[1].textContent = hexString;
                                    byId("color-data-rgb").all('text')[1].textContent = rgbString;
                                    byId("color-data-hsl").all('text')[1].textContent = hslString;
                                    icon.style.backgroundColor = hexString;
                                    icon.style.color = colors.contrast(hexString);
                                    picker.resize(dom.body.clientWidth > 480 ? 480 : dom.body.clientWidth - 90);
                                });
                                box ? window.addEventListener("resize", byId("color-picker").clientWidth > 0 ? picker.resize(byId("color-picker").clientWidth - 90) : null) : null;
                                //window.addEventListener("resize", byId("color-picker").clientWidth > 0 ? picker.resize(byId("color-picker").clientWidth - 90) : null)
                            }
                        }
                    } else {
                        //alert("Step One");
                        $(vp.all('form > header box flex')[0]).attr("data-height", "50px");
                        $(vp.all('form > header box flex')[0]).attr("data-width", "50px");
                        $(vp.all('block > *')[0]).removeClass('display-none');
                    }
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

                        //ASSET
                        var params = {
                            owner: "dompad",
                            repo: "preview",
                            path: "/" + theme + "/style/asset"
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
                        window.source.copy.asset = asset;

                        //PAGES
                        var params = {
                            owner: "dompad",
                            repo: "preview",
                            path: "/" + theme + "/style/pages"
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
                                        //console.log("pages", { html, d, row });
                                    }
                                    d++;
                                } while (d < data.length);
                            }
                            return content;
                        }
                        var pages = await github.repos.contents(params, {}).then(p);
                        window.source.copy.pages = pages;

                        //THEME
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
                            path: "/" + theme + "/style/shell/"
                        }, {}).then(t);
                        window.source.copy.theme = css;

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
                                                content: btoa(content)
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

                                        var path = "style/" + key + "/" + val.name;

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
                            path: "/style",
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
                    }
                    modal.confirm({
                        title: theme,
                        body: "Are you sure you want to install this template?"
                    }, ["Yes", "No"], callBack)
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

        webmanifest: async(event)=>{
            event.preventDefault();
            const form = event.target;
            const steps = form.all('block > column');
            const title = steps[0].find('[type="text"]').value;
            const color = steps[1].find('#color-data-hex').all('text')[1].textContent.split('#')[1];
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
        ,

        ico: (el)=>{
            html2canvas(el, {
                backgroundColor: null
            }).then(canvas=>{
                var link = document.createElement('a');
                link.download = GET[1] + '.png';
                link.href = canvas.toDataURL()
                link.click();
            }
            );
        }
        ,

        iro: (color)=>{
            var icon = byId('new-app-icon');
            icon.find('n').textContent = icon.closest('form').find('block').children[1].find('input').value.charAt(0);

            byId('color-data-hex').all('text')[1].textContent = color;

            var sel = "iro-setup-about-brand";
            var el = byId(sel);
            if (el.innerHTML === "") {
                var icon = byId('new-app-icon');
                var width = el.clientWidth - 51;
                var box = 1 < 0;
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
                    byId("color-data-hex").all('text')[1].textContent = hexString;
                    byId("color-data-rgb").all('text')[1].textContent = rgbString;
                    byId("color-data-hsl").all('text')[1].textContent = hslString;
                    icon.find('picture').style.backgroundColor = hexString;
                    icon.style.color = colors.contrast(hexString);
                    //icon.dataset.contrast = icon.style.color;
                });
                picker.on("mount", colorPicker);
                window.addEventListener("resize", reSize)
                function colorPicker(e) {
                    console.log(e);
                    reSize();
                    var color = e.color;
                    var hexString = color.hexString;
                    var rgb = color.rgba;
                    var rgbString = rgb.r + "," + rgb.g + "," + rgb.b;
                    var hsl = color.hsla;
                    var hslString = hsl.h + "," + hsl.s + "%," + hsl.l + "%";
                    byId("color-data-hex").all('text')[1].textContent = hexString;
                    byId("color-data-rgb").all('text')[1].textContent = rgbString;
                    byId("color-data-hsl").all('text')[1].textContent = hslString;
                    icon.find('picture').style.backgroundColor = hexString;
                    icon.style.color = colors.contrast(hexString);
                }
                function reSize() {
                    var size = dom.body.clientWidth > 570 ? 480 : dom.body.clientWidth - 90;
                    picker.resize(size);
                    icon.find('img').style.width = (size * 0.69) + 'px';
                }
            }
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
                    }
                }
                if (button.className === "gg-chevron-right") {
                    var title = steps[0].find('input');
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
                                    path: "index.html"
                                }, {}).then(async(data)=>{
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
                                        sha
                                    });
                                    doc.head.find('title').textContent = title;
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
                                    }).then(controller.setup.iro(form)) : null;
                                }
                                );

                                //Update site.webmanifest
                                1 < 0 ? github.repos.contents({
                                    owner: user.login,
                                    repo: GET[1],
                                    path: "site.webmanifest"
                                }, {}).then(async(data)=>{
                                    var raw = data.content;
                                    var sha = data.sha;
                                    var content = atob(raw);
                                    //var doc = new DOMParser().parseFromString(content, "text/html");
                                    var json = JSON.parse(content);
                                    console.log(807, {
                                        content,
                                        data,
                                        json,
                                        raw,
                                        sha
                                    });
                                    var raw = JSON.stringify({
                                        name: title,
                                    }, null, 2);
                                    console.log(1451, {
                                        raw
                                    });
                                    var content = btoa(DOM.html.outerHTML);
                                    var message = "Update index.html";

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
                                    }) : null;
                                }
                                ) : null;
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
                        $(form.all('form > header box flex')[2]).attr("data-height", "50px");
                        $(form.all('form > header box flex')[2]).attr("data-width", "50px");
                        $(form.all('block > *')[2]).removeClass('display-none');
                    }
                    if (index === 2) {
                        var about = steps[2].find('textarea').value;
                        if (about.length > 0) {
                            var confirm = await modal.confirm({
                                body: "Are you sure you want to create this project?",
                                title: "Confirm Setup"
                            }, ["Cancel", "Continue"]);
                            if (confirm) {
                                //target.closest('form').find('[type="submit"]').click();
                                const user = await github.user.get();
                                var owner = user.login;
                                var repo = title;
                                var path = "/index.html";
                                var params = {
                                    owner,
                                    repo,
                                    path
                                }
                                var raw = JSON.stringify({
                                    name: title,
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
                                var s1 = (data)=>{
                                    console.log("index.html", {
                                        data
                                    });
                                }
                                github.repos.contents(params, settings).then(u1)
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
        ,

        out: async(event)=>{
            event.preventDefault();
            firebase.auth().signOut();
        }

    },

    templates: {

        install: (template)=>{
            console.log(template);
        }
        ,

        preview: async(iframe)=>{
            var path = "/";
            var template = iframe.name.split('-').pop();
            console.log(792, path, template);

            iframe.src = "/preview/" + template + "/#" + path;

            var params = {
                owner: "dompad",
                repo: "demo",
                path: "/" + template + "/site.webmanifest"
            }
            var settings = {}

            const webmanifest = github.repos.contents(params, settings).then(data=>{
                console.log(807, {
                    data
                });
            }
            );

            params.path = "/" + template + "/shell.html";
            const shell = github.repos.contents(params, settings).then(data=>{
                console.log(807, {
                    data
                });
            }
            );
        }

    }

});
