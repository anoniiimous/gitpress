window.mvc.v ? null : (window.mvc.v = view = function(route) {
    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var search = route.search;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        var last = window.rout.ed.history[window.rout.ed.history.length - 1];
        if (last !== path) {
            var pushState = true;
            window.rout.ed.history.push(path);
            0 > 1 ? console.log('state', {
                path,
                last
            }) : null;
        }

        0 < 1 ? console.log(22, {
            route
        }) : null;

        if (search) {
            var params = Object.fromEntries(new URLSearchParams(search));
            var keys = Object.keys(params);
            if (keys.length > 0) {
                console.log(params);
                if (keys.includes("code")) {
                    if (keys.includes('state')) {
                        var state = params['state'].split('_')[0];
                        if (state === 'github') {
                            await github.oauth.authorize(params);
                        }
                        if (state === 'stripe') {
                            await stripe.oauth.authorize(params);
                        }
                    }
                    //route.search = "";
                }
            }
        }

        var token = localStorage.githubAccessToken;
        if (token) {
            dom.body.dataset.uid = token;
        }

        $(dom.body.all('aside')).remove()
        //console.log(route, root);

        if (root) {

            const roots = ["dashboard", "design", "developer", "marketplace", "new"];
            if (roots.indexOf(root) === -1) {
                alert(root);
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
                        const vp = dom.body.find('[data-page="/*/*"]');
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
                    var vp = dom.body.find('[data-page="/*"]');
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
                //console.log(107, root, get);
                0 < 1 ? controller.nav.hide() : controller.nav.close();
                if (get.length > 1) {

                    var repository = await github.repos.get({
                        owner: window.owner.login,
                        repo: get[1]
                    }, {
                        accept: "application/vnd.github.raw",
                        cache: "reload"
                    });
                    console.log({
                        repository
                    });
                    if (repository.private) {
                        dom.body.find('[data-page="/dashboard/*"]').setAttribute('github-repo-private', repository.private);
                    }

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

                    //alert(window.database.dashboard.hasOwnProperty(get[1]));
                    //if (window.database.dashboard.hasOwnProperty(get[1]) === false) {
                    //const user = await github.user.get();
                    try {
                        var json = await github.repos.contents({
                            owner: window.owner.login,
                            path: "/site.webmanifest",
                            repo: get[1]
                        }, {
                            accept: "application/vnd.github.raw",
                            cache: "reload"
                        });
                        if (json) {
                            //var content = data.content;
                            //var raw = atob(content);
                            //var json = JSON.parse(raw);
                            0 > 1 ? console.log(261, {
                                json
                            }) : null;

                            var description = json.description;
                            var icons = json.icons;
                            var name = json.name;
                            var short_name = json.short_name;
                            window.database.dashboard[short_name] = json;
                            if (description && icons && name) {
                                dom.body.find('main nav').find('[placeholder="Project Name"]').textContent = name;
                            } else {
                                const html = await ajax('/raw/asset/html/template/template.setup.html');
                                var ppp = 0 < 1 ? await modal.page(html) : dom.body.find('[data-fetch="raw/asset/html/template/template.setup.html"]')
                                var form = ppp.find('form');

                                //GET index.html
                                try {
                                    var data = await github.repos.contents({
                                        owner: window.owner.login,
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
                                        owner: window.owner.login,
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
                                        owner: window.owner.login,
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
                                        $(form.all('form > header box flex')).attr("css-height", "30px");
                                        $(form.all('form > header box flex')).attr("css-width", "30px");
                                        $(form.all('form > header box flex')[2]).attr("css-height", "50px");
                                        $(form.all('form > header box flex')[2]).attr("css-width", "50px");
                                        $(form.all('block > *')[2]).removeClass('display-none');

                                        if (about) {
                                            alert(about);
                                        }
                                    } else {
                                        //alert("Step Two");

                                        $(form.all('block > *')).addClass('display-none');
                                        $(form.all('form > header box flex')).attr("css-height", "30px");
                                        $(form.all('form > header box flex')).attr("css-width", "30px");
                                        $(form.all('form > header box flex')[1]).attr("css-height", "50px");
                                        $(form.all('form > header box flex')[1]).attr("css-width", "50px");
                                        $(form.all('block > *')[1]).removeClass('display-none');

                                        var color = colors.random();
                                        controller.setup.iro(color);
                                    }
                                }
                            }
                            resolve(route);
                        }
                    } catch (error) {
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
                            owner: window.owner.login,
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
                    resolve(route);
                } else {
                    console.log(352, github.oauth.verify());
                    window.owner = await github.user.get();
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

                                    //private === true ? template.find('.gg-lock').closest('text').setAttribute("css-display", "flex"); : null;

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
                            owner: window.owner.login,
                            repo: "db.dompad.io",
                            path: "/v1/apps/index.json"
                        }).then(p) : github.user.repos({
                            query: {
                                per_page: 25,
                                sort: "created"
                            }
                        }).then(p);
                    }
                    resolve(route);
                }

                if (get.length > 2) {
                    if (global.dashboard.routes.includes(get[2])) {
                        var index = window.global.dashboard.routes.indexOf(get[2]);
                        dom.body.find('main nav').children[1].children[index].find('.gg-chevron-down').click();
                    }
                    if (get[2] === "build") {
                        var vp = dom.body.find('pages[data-page="/dashboard/*/build"]');
                        var iframe = vp.find('iframe');

                        if (iframe && !iframe.contentWindow.document.body.querySelector('boot')) {
                            await mvc.c.build.boot(iframe);
                        }

                        if (get[3]) {

                            dom.body.classList.add('overflow-hidden');
                            if (get[3] === "er") {
                                controller.build.editor(iframe);
                            } else if (get[3] === "preview") {
                                controller.build.preview(iframe);
                            } else {
                                controller.build.else(iframe);
                            }

                        } else {

                            dom.body.classList.remove('overflow-hidden');
                            controller.build.index(iframe);

                        }

                        resolve(route);
                    } else {

                        dom.body.classList.remove('overflow-hidden');

                    }
                    if (get[2] === "config") {
                        var vp = dom.body.find('block[data-page="' + route.page + '"]');
                        if (get.length > 3) {

                            if (get[3] === "branding") {
                                controller.setup.colorPicker(vp.find('[data-iro]'), {
                                    color: "#ff3b30"
                                });
                                try {
                                    var res = await github.repos.contents({
                                        owner: window.owner.login,
                                        repo: get[1],
                                        path: 'icon.svg'
                                    }, {
                                        accept: 'application/vnd.github.raw'
                                    });
                                    var doc = new DOMParser().parseFromString(res, 'image/svg+xml').documentElement;
                                    var rect = doc.find('rect');
                                    var bg = rect.getAttribute('fill');
                                    var foreignObject = doc.find('foreignObject');
                                    rect.removeAttribute('rx');
                                    //doc.setAttribute('class', 'border-1px-solid border-color-ddd border-radius-15pct box-shadow-0px-1px-6px-0px height-100pct position-absolute top-0 width-100pct');
                                    console.log(svg)
                                    var svg = vp.find('card > header + * picture svg');
                                    svg.find('rect').setAttribute('fill', bg);
                                    svg.find('rect').insertAdjacentHTML('afterend', foreignObject.outerHTML);
                                } catch (e) {
                                    console.log('error', e);
                                }
                            }
                            if (get[3] === "checkout") {

                                var block = vp.find('block');
                                0 > 1 ? console.log(424, route.page, {
                                    route,
                                    vp,
                                    block
                                }) : null;
                                var column = block.all('card')[1].find('column');
                                column.innerHTML = "";

                                try {
                                    var res = await github.repos.contents({
                                        owner: window.owner.login,
                                        repo: get[1],
                                        path: 'index.html'
                                    }, {
                                        accept: 'application/vnd.github.raw'
                                    });
                                    var doc = new DOMParser().parseFromString(res, 'text/html');
                                    var head = doc.head;
                                    block.removeAttribute('css-display');
                                    var template = block.find('template').content;
                                    var checkout = {
                                        cash: template.children[0],
                                        stripe: template.children[1]
                                    };

                                    var stripe_pk = head.find('meta[name="stripe_publishable_key"]');
                                    var stripe_uid = head.find('meta[name="stripe_user_id"]');

                                    0 > 1 ? console.log(153, {
                                        head: head.outerHTML,
                                        res
                                    }) : null;

                                    if (stripe_pk.content && stripe_uid.content) {
                                        var box = checkout.stripe.cloneNode(true);
                                        column.insertAdjacentHTML('beforeend', box.outerHTML);
                                        vp.all('block')[1].all('card')[1].all('box')[0].setAttribute("css-display", "none");
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            if (get[3] === "deploy") {
                                var columns = vp.all('[github-private-display]');
                                $(columns).attr('css-display', 'none');
                                if (repository.private === true) {
                                    vp.find('[github-private-display="true"]').setAttribute('css-display', 'flex');
                                }
                            }

                        } else {
                            var cards = vp.all('card');
                            var general = cards[0];
                            general.find('input[placeholder="Shortname"]').value = repository.name;
                            general.find('input[placeholder="Shortname"]').closest('box').nextElementSibling.firstElementChild.classList.remove('opacity-50pct');
                            general.find('input[type="checkbox"]').checked = repository.is_template;
                            var danger = cards[1];
                            danger.find('data[name="visibility"]').textContent = repository.private === true ? 'private' : 'public';
                        }
                    }
                    if (get[2] === "files") {
                        if (get.length > 3) {
                            if (get[3] === "file") {
                                if (get[4]) {
                                    var vp = dom.body.find('page[data-page="/dashboard/*/files/file/*"]');
                                    var filename = get[4];
                                    var extension = filename.split('.')[filename.split('.').length - 1];
                                    vp.find('block card > header').find('[placeholder="filename.ext"]').textContent = filename;
                                    var column = vp.find('block card > column');
                                    $(column.all('card > column > *')).addClass('display-none');
                                    if (['mp4'].includes(extension)) {
                                        console.log(extension);
                                    } else if (['jpg', 'png', 'svg', 'webp'].includes(extension)) {
                                        var src = '';
                                        if (extension === 'svg') {
                                            var res = await github.repos.contents({
                                                owner: window.owner.login,
                                                repo: get[1],
                                                path: '/raw/files/' + filename
                                            }, {
                                                accept: "application/vnd.github.raw",
                                                cache: "reload"
                                            });
                                            src = 'data:image/svg+xml;base64,' + btoa(res);
                                        } else {
                                            src = await github.raw.blob({
                                                owner: window.owner.login,
                                                repo: get[1],
                                                resource: '/raw/files/' + filename
                                            });
                                        }
                                        var picture = column.find('picture');
                                        picture.classList.remove('display-none');
                                        var img = picture.find('img');
                                        img.src = '';
                                        img.src = src;
                                    } else {
                                        var text = await github.raw.git("/" + window.owner.login + "/" + get[1] + '/main/raw/files/' + filename);
                                        console.log({
                                            text,
                                            json: is.json(text)
                                        });
                                        if (typeof text === "object") {
                                            text = JSON.stringify(text);
                                        }
                                        var textarea = column.find('textarea');
                                        textarea.closest('box').classList.remove('display-none');
                                        textarea.value = text;
                                        on.key.up.auto.size(textarea);
                                    }
                                } else {
                                    var vp = dom.body.find('page[data-page="/dashboard/*/files/file"]');
                                    var form = vp.find('form');
                                    form.children[0].find('[type="file"]').closest('label').innerHTML = form.children[0].find('[type="file"]').closest('label').innerHTML;
                                    form.children[1].find('column').innerHTML = "";
                                    resolve(route);
                                }
                            }
                        } else {
                            var feed = byId('feed-dashboard-files');
                            if (feed) {
                                var vp = dom.body.find('pages[data-page="/dashboard/*/files"]');
                                github.repos.contents({
                                    owner: window.owner.login,
                                    path: "/raw/files",
                                    repo: get[1]
                                }, {}).then(data=>{
                                    if (data) {
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
                                                //box.find('ico n').classList.add("gg-" + icon);
                                                box.find('text').dataset.href = "/dashboard/" + get[1] + "/files/file/" + row.name;
                                                box.find('[placeholder="Filename"]').textContent = row.name;
                                                //box.all('text')[1].textContent = formatBytes(row.size);
                                                var html = box.outerHTML;
                                                feed.insertAdjacentHTML('beforeend', html);
                                                //alert(html);
                                                //console.log(feed);
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
                    }
                    if (get[2] === "media") {

                        if (get[3]) {

                            var vp = dom.body.find('pages[data-page="/dashboard/*/media/' + get[3] + '"]');

                            if (get[3] === "audio") {
                                var track = vp.find('[data-value="audio.track"]');
                                var box = track.closest('box');
                                var input = box.find('input[type="file"]');
                                input.insertAdjacentHTML('beforebegin', input.outerHTML);
                                input.remove();
                                track.innerHTML = '';

                                var image = vp.find('[data-value="audio.cover"]');
                                var box = image.closest('box');
                                var input = box.find('input[type="file"]');
                                input.insertAdjacentHTML('beforebegin', input.outerHTML);
                                input.remove();
                                image.innerHTML = '';

                                var title = vp.find('[data-value="audio.title"]');
                                title.value = '';

                                var description = vp.find('[data-value="audio.description"]');
                                description.value = '';

                                var tags = vp.find('[data-value="audio.tags"]');
                                tags.innerHTML = tags.lastElementChild.outerHTML;
                                $(tags.all('text')).remove();

                                on.key.up.auto.size(description)
                            }

                            if (get[3] === "photo") {
                                var image = vp.find('[data-value="photo.src"]');
                                var box = image.closest('box');
                                var input = box.find('input[type="file"]');
                                input.insertAdjacentHTML('beforebegin', input.outerHTML);
                                input.remove();
                                image.innerHTML = '';

                                var title = vp.find('[data-value="photo.title"]');
                                title.value = '';

                                var description = vp.find('[data-value="photo.description"]');
                                description.value = '';

                                var tags = vp.find('[data-value="photo.tags"]');
                                tags.innerHTML = tags.lastElementChild.outerHTML;
                                $(tags.all('text')).remove();

                                on.key.up.auto.size(description)
                            }

                            if (get[3] === "video") {
                                var image = vp.find('[data-value="video.src"]');
                                var box = image.closest('box');
                                var input = box.find('input[type="file"]');
                                input.insertAdjacentHTML('beforebegin', input.outerHTML);
                                input.remove();
                                image.innerHTML = '';

                                $(vp.find('form').all('card')[1].all('box')[0].all('picture')).html('');

                                //vp.find('[data-value="video.poster"]').innerHTML = '';

                                var title = vp.find('[data-value="video.title"]');
                                title.value = '';

                                var description = vp.find('[data-value="video.description"]');
                                description.value = '';

                                var tags = vp.find('[data-value="video.tags"]');
                                tags.innerHTML = tags.lastElementChild.outerHTML;
                                $(tags.all('text')).remove();

                                on.key.up.auto.size(description)
                            }

                            if (get[4]) {
                                if (get[3] === "audio") {

                                    try {
                                        var filename = 'image.jpg';
                                        var src = await github.raw.blob({
                                            owner: window.owner.login,
                                            resource: "/raw/media/audio/" + get[4] + "/" + filename,
                                            repo: get[1]
                                        });

                                        var img = document.createElement('img');
                                        img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                                        img.dataset.filename = filename;
                                        img.src = src;
                                        image.innerHTML = img.outerHTML;
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    try {
                                        var filename = 'audio.mp3';
                                        var src = await github.raw.blob({
                                            owner: window.owner.login,
                                            resource: "/raw/media/audio/" + get[4] + "/" + filename,
                                            repo: get[1]
                                        });

                                        var figure = vp.find('[data-value="audio.track"]');
                                        var template = figure.closest('column').find('template').content.firstElementChild.cloneNode(true);
                                        figure.innerHTML = template.outerHTML;
                                        var container = figure.find('sound');
                                        var options = {
                                            container,
                                            backend: "MediaElement",
                                            barHeight: 50,
                                            barWidth: 3,
                                            cursorColor: "#fff",
                                            mediaType: "audio",
                                            normalize: true,
                                            progressColor: "#000",
                                            waveColor: "#fff"
                                        };
                                        window.wavesurfer = WaveSurfer.create(options);
                                        window.wavesurfer.load(src, [0.0218, 0.0183, 0.0165, 0.0198, 0.2137, 0.2888, 0.2313, 0.15, 0.2542, 0.2538, 0.2358, 0.1195, 0.1591, 0.2599, 0.2742, 0.1447, 0.2328, 0.1878, 0.1988, 0.1645, 0.1218, 0.2005, 0.2828, 0.2051, 0.1664, 0.1181, 0.1621, 0.2966, 0.189, 0.246, 0.2445, 0.1621, 0.1618, 0.189, 0.2354, 0.1561, 0.1638, 0.2799, 0.0923, 0.1659, 0.1675, 0.1268, 0.0984, 0.0997, 0.1248, 0.1495, 0.1431, 0.1236, 0.1755, 0.1183, 0.1349, 0.1018, 0.1109, 0.1833, 0.1813, 0.1422, 0.0961, 0.1191, 0.0791, 0.0631, 0.0315, 0.0157, 0.0166, 0.0108]);
                                        figure.find('audio').dataset.filename = filename;
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    var res = await github.repos.contents({
                                        owner: window.owner.login,
                                        path: "/raw/media/audio/" + get[4] + "/audio.json",
                                        repo: get[1]
                                    }, {
                                        accept: "application/vnd.github.raw"
                                    });

                                    res.title ? title.value = res.title : null;

                                    res.description ? description.value = res.description : null;

                                    if (res.tags) {
                                        var t = 0;
                                        do {
                                            var tag = res.tags[t];
                                            var template = tags.closest('box').find('template').content.firstElementChild.cloneNode(true);
                                            template.find('span').textContent = tag;
                                            vp.find('[data-after="Tags"]').closest('box').find('flex').lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);
                                            t++;
                                        } while (t < res.tags.length)
                                    }

                                } else if (get[3] === "photo") {

                                    try {
                                        var filename = 'image.jpg';
                                        var src = await github.raw.blob({
                                            owner: window.owner.login,
                                            resource: "/raw/media/photo/" + get[4] + "/" + filename,
                                            repo: get[1]
                                        });

                                        var img = document.createElement('img');
                                        img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                                        img.dataset.filename = filename;
                                        img.src = src;
                                        image.innerHTML = img.outerHTML;
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    var res = await github.repos.contents({
                                        owner: window.owner.login,
                                        path: "/raw/media/photo/" + get[4] + "/photo.json",
                                        repo: get[1]
                                    }, {
                                        accept: "application/vnd.github.raw"
                                    });

                                    res.title ? title.value = res.title : null;

                                    res.description ? description.value = res.description : null;

                                    if (res.tags) {
                                        var t = 0;
                                        do {
                                            var tag = res.tags[t];
                                            var template = tags.closest('box').find('template').content.firstElementChild.cloneNode(true);
                                            template.find('span').textContent = tag;
                                            vp.find('[data-after="Tags"]').closest('box').find('flex').lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);
                                            t++;
                                        } while (t < res.tags.length)
                                    }

                                } else if (get[3] === "video") {

                                    try {
                                        var filename = 'video.mp4';
                                        var src = await github.raw.blob({
                                            owner: window.owner.login,
                                            resource: "/raw/media/video/" + get[4] + "/" + filename,
                                            repo: get[1]
                                        });

                                        var video = document.createElement('video');
                                        video.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                                        video.dataset.filename = filename;
                                        video.playsinline = true;
                                        video.src = src;
                                        vp.find('figure').innerHTML = video.outerHTML;
                                        var canvas = vp.find('canvas');
                                        var video = vp.find('figure video');
                                        video.ontimeupdate = controller.video.ontimeupdate;
                                        //video.autoplay = true;
                                        video.muted = true;
                                        //video.controls = true;

                                        await controller.video.thumbs(video);

                                        canvas.parentElement.setAttribute("css-display", "flex");
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    try {
                                        var poster = await github.raw.blob({
                                            owner: window.owner.login,
                                            resource: "/raw/media/video/" + get[4] + "/image.jpg",
                                            repo: get[1]
                                        });
                                        var img = document.createElement('img');
                                        img.className = "border-radius-20px height-100pct left-0 object-fit-cover position-absolute top-0 width-100pct"
                                        img.src = poster;
                                        vp.find('[data-value="video.poster"]').innerHTML = img.outerHTML;
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    controller.video.poster(vp.find('form').all('card')[1].all('box')[0].find('figure picture img'));

                                    var res = await github.repos.contents({
                                        owner: window.owner.login,
                                        path: "/raw/media/video/" + get[4] + "/video.json",
                                        repo: get[1]
                                    }, {
                                        accept: "application/vnd.github.raw"
                                    });

                                    res.title ? title.value = res.title : null;

                                    res.description ? description.value = res.description : null;

                                    if (res.tags) {
                                        var t = 0;
                                        do {
                                            var tag = res.tags[t];
                                            var template = tags.closest('box').find('template').content.firstElementChild.cloneNode(true);
                                            template.find('span').textContent = tag;
                                            vp.find('[data-after="Tags"]').closest('box').find('flex').lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);
                                            t++;
                                        } while (t < res.tags.length)
                                    }
                                }
                            }

                        } else {

                            var vp = dom.body.find('page[data-page="/dashboard/*/media"]');
                            //alert("Attempting to fetch files");
                            github.repos.contents({
                                owner: window.owner.login,
                                path: "/raw/media/media.json",
                                repo: get[1]
                            }, {
                                accept: "application/vnd.github.raw"
                            }).then((data)=>{
                                console.log(222, {
                                    data,
                                    feed
                                });
                                if (data) {
                                    var feed = vp.all('block')[0].find('template').nextElementSibling;
                                    feed.innerHTML = "";
                                    if (data.length > 0) {
                                        vp.all('header card')[1].find('box').classList.remove('display-none');
                                        var html = "";
                                        var d = 0;
                                        do {
                                            var row = data[d];
                                            var format = row.format;
                                            var title = row.title;
                                            var slug = row.slug;
                                            var card = vp.all('block')[0].find('template').content.firstElementChild.cloneNode(true);
                                            if (format === "audio") {
                                                card.find('box row n').classList.add('gg-music');
                                            } else if (format === "photo") {
                                                card.find('box row n').classList.add('gg-image');
                                            } else if (format === "video") {
                                                card.find('box row n').classList.add('gg-film');
                                            } else {
                                                card.find('box row n').classList.add('gg-file');
                                            }
                                            card.find('[placeholder="Title"]').textContent = title;
                                            card.find('[placeholder="Title"]').dataset.href = "/dashboard/:get/media/" + format + "/" + slug + "/";
                                            var src = 0 > 1 ? github.raw.blob({
                                                owner: window.owner.login,
                                                repo: get[1],
                                                resource: "/raw/media/" + format + "/" + slug + "/image.jpg"
                                            }) : null;
                                            //card.find('column picture img').src = src;
                                            //card.find('.gg-tag').closest('text').dataset.href = "/dashboard/:get/merch/catalog/" + slug + "/";
                                            html += card.outerHTML;
                                            //feed.insertAdjacentHTML('beforeend', html);
                                            d++;
                                        } while (d < data.length);
                                        feed.innerHTML = html;
                                    } else {
                                        vp.all('header card')[1].find('box').classList.add('display-none');
                                    }
                                }

                                if (0 > 1 && data) {
                                    console.log(84, {
                                        data
                                    });
                                    var feed = vp.all('block')[1].find('template').nextElementSibling;
                                    feed.innerHTML = "";
                                    if (data.length > 0) {
                                        var html = "";
                                        var d = 0;
                                        do {
                                            0 > 1 ? console.log(d, {
                                                data
                                            }) : null;
                                            var row = data[d];
                                            var format = row.format;
                                            var title = row.title;
                                            var slug = row.slug;
                                            var card = vp.all('block')[1].find('template').content.firstElementChild.cloneNode(true);
                                            if (0 > 1) {
                                                if (format === "audio") {
                                                    card.find('box row n').classList.add('gg-music');
                                                } else if (format === "photo") {
                                                    card.find('box row n').classList.add('gg-image');
                                                } else if (format === "video") {
                                                    card.find('box row n').classList.add('gg-film');
                                                } else {
                                                    card.find('box row n').classList.add('gg-file');
                                                }
                                            }
                                            //card.find('[placeholder="Title"]').textContent = title;
                                            //card.find('[placeholder="Title"]').dataset.href = "/dashboard/:get/media/" + format + "/" + slug + "/";
                                            var src = 0 < 1 ? github.raw.blob({
                                                owner: window.owner.login,
                                                repo: get[1],
                                                resource: "/raw/media/" + format + "/" + slug + "/image.jpg"
                                            }).then(()=>{
                                                card.find('picture img').src = src;
                                            }
                                            ) : null;
                                            card.find('picture img').src = src;
                                            console.log("/raw/media/" + format + "/" + slug + "/image.jpg");
                                            //card.find('.gg-tag').closest('text').dataset.href = "/dashboard/:get/merch/catalog/" + slug + "/";
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
                    if (get[2] === "merch") {

                        if (get.length > 3) {
                            if (get[3] === "catalog") {
                                var feed = byId('feed-dashboard-catalog');
                                if (get[4]) {
                                    var vp = dom.body.find('pages[data-page="/dashboard/*/merch/catalog/*"]');

                                    //ANCESTOR
                                    try {
                                        var slug = get[5] ? get[4] + "/" + get[5] : get[4];
                                        var res = window.ancestor = await github.repos.contents({
                                            owner: window.owner.login,
                                            repo: get[1],
                                            path: "/raw/merch/" + get[4] + "/merch.json"
                                        }, {
                                            accept: "application/vnd.github.raw",
                                            cache: "reload"
                                        });
                                        if (res.length > 0) {
                                            var r = 0;
                                            do {
                                                if (res[r].slug === get[4]) {
                                                    console.log(211, res[r], slug);
                                                    var json = res[r];
                                                }
                                                r++;
                                            } while (r < res.length);
                                            if (!json) {
                                                throw "Not Found";
                                            }
                                        }
                                        0 < 1 ? console.log(295, {
                                            json,
                                            res
                                        }) : null;
                                    } catch (e) {
                                        console.log(287, {
                                            e
                                        });
                                    }

                                    //DIMENSIONS
                                    var n = 0;
                                    var attr = [];
                                    var variant = false;
                                    var dimensions = json && json.dimensions;
                                    if (dimensions && dimensions.length > 0) {
                                        var footer = vp.find('form [data-after="Traits"]').closest('box').find('footer');

                                        footer.previousElementSibling.innerHTML = "";
                                        vp.find('[data-after="Traits"]').closest('box').removeAttribute('css-display');

                                        var d = 0;
                                        do {
                                            var template = footer.find('template').content.firstElementChild.cloneNode(true);

                                            var name = dimensions[d].name;
                                            var field = template.find('field');
                                            field.find('text').dataset.name = field.find('text').textContent = dimensions[d].name;

                                            var dropdown = template.find('dropdown');
                                            var values = dimensions[d].values;
                                            if (values.length > 0) {
                                                var aa = 0;
                                                var v = 0;
                                                0 > 1 ? console.log(399, {
                                                    values
                                                }) : null;
                                                do {
                                                    var item = dropdown.find('template').content.firstElementChild.cloneNode(true);
                                                    item.find('span').dataset.after = values[v];
                                                    dropdown.children[1].insertAdjacentHTML('beforeend', item.outerHTML);
                                                    v++;
                                                } while (v < values.length);

                                                if (get[5]) {
                                                    var u = rout.ed.dir(route.path);
                                                    var gat = u.splice(5, u.length - 1);
                                                    var matrix = get[5];
                                                    var arr = 0 < 1 ? matrix.split('_') : gat;
                                                    var ax = 0;
                                                    do {
                                                        var ar = arr[ax];
                                                        if (0 < 1 && ar) {
                                                            var dd = 0;
                                                            do {
                                                                var vv = 0;
                                                                do {
                                                                    if (ar) {
                                                                        var value = dimensions[dd].values[vv];
                                                                        var name = dimensions[dd].name;
                                                                        if (value) {
                                                                            var vars = {
                                                                                arr1: ar.split('-')[0].toLowerCase(),
                                                                                arr2: ar.split(ar.split('-')[0] + "-")[1].replace('-', ' ').toLowerCase(),
                                                                                name: name.toLowerCase(),
                                                                                value: value.toLowerCase().replace('-', ''),
                                                                                element: template.find('[placeholder][data-name="' + name + '"]')
                                                                            }
                                                                            //console.log(367, vars);
                                                                            if (vars.element && vars.arr1 === vars.name && vars.arr2 === vars.value) {
                                                                                vars.element.closest('field').nextElementSibling.find('[placeholder]').textContent = value;
                                                                            }
                                                                        }
                                                                        aa++;
                                                                    }
                                                                    vv++;
                                                                } while (vv < values.length);
                                                                dd++;
                                                            } while (dd < dimensions.length);
                                                        }
                                                        ax++;
                                                    } while (ax < arr.length);
                                                }

                                                //Find Variation
                                                if (n === dimensions.length) {
                                                    var variant = true;
                                                }
                                            }

                                            footer.previousElementSibling.insertAdjacentHTML('beforeend', template.outerHTML);

                                            var name = template.find('field [placeholder]').dataset.name;
                                            var value = template.find('dropdown [placeholder]').textContent;
                                            //console.log(template, name, value);
                                            if (name && value) {
                                                attr.push(name.toLowerCase().replaceAll('-', '') + "-" + value.toLowerCase().replaceAll('-', ''));
                                            }
                                            d++;
                                        } while (d < dimensions.length);
                                    } else {
                                        vp.find('[data-after="Traits"]').closest('box').setAttribute("css-display", "none");
                                    }

                                    //DESCENDANT
                                    if (get.length > 5) {
                                        //console.log(395, attr);
                                        if (0 < 1) {
                                            ancestor.sort((a,b)=>b.slug.localeCompare(a.slug));
                                            0 > 1 ? console.log(413, {
                                                ancestor,
                                                variant
                                            }) : null;
                                            if (ancestor.length > 0) {
                                                var arrs = get[5].split('_');
                                                var r = 0;
                                                do {
                                                    var row = ancestor[r];
                                                    var slug = row.slug;
                                                    var dir = rout.ed.dir(row.slug);
                                                    if (dir.length > 1) {
                                                        //console.log(row.slug, dir);
                                                        var attributes = row.attributes;
                                                        var keys = Object.keys(attributes);
                                                        var vals = Object.values(attributes);
                                                        var a = 0;
                                                        if (keys.length > 0) {
                                                            do {
                                                                var name = keys[a];
                                                                var value = Object.values(attributes)[a];
                                                                var str = name.toLowerCase() + "-" + value.toLowerCase();
                                                                if (arrs.length > 0) {
                                                                    var s = 0;
                                                                    do {
                                                                        var as = arrs[s];
                                                                        var atrs = [];
                                                                        var k = 0
                                                                        do {
                                                                            atrs.push(keys[k].toLowerCase().replaceAll("-", "") + "-" + vals[k].toLowerCase().replaceAll("-", ""));
                                                                            k++;
                                                                        } while (k < keys.length);
                                                                        var there = str === as && arrs.has(atrs);
                                                                        0 > 1 ? console.log(there, row.slug, {
                                                                            keys,
                                                                            row,
                                                                            attributes,
                                                                            arrs,
                                                                            atrs
                                                                        }) : null;
                                                                        if (there) {
                                                                            0 > 1 ? console.log(415, a, r, row.slug, {
                                                                                str,
                                                                                as,
                                                                                row
                                                                            }) : null;
                                                                            if (row.images) {
                                                                                json.images = row.images;
                                                                            }
                                                                        }
                                                                        s++;
                                                                    } while (s < arrs.length);
                                                                }
                                                                a++;
                                                            } while (a < attributes.length)
                                                        }
                                                    }
                                                    r++;
                                                } while (r < ancestor.length);
                                            }
                                        }
                                        try {
                                            var res = 0 > 1 ? await github.repos.contents({
                                                owner: window.owner.login,
                                                repo: get[1],
                                                path: "/raw/merch/" + get[4] + "/" + attr.join('_') + "/merch.json"
                                            }, {
                                                accept: "application/vnd.github.raw",
                                                cache: "reload"
                                            }) : window.ancestor.find(row=>row.slug === get[4] + "/" + get[5]);
                                            res ? null : res = json;

                                            0 > 1 ? console.log(474, {
                                                res,
                                                json
                                            }) : null;

                                            var variant = true;

                                            json.category = res.category ? res.category : json.category ? json.category : null;
                                            json.description = res.description ? res.description : null;
                                            json.images = res.images ? res.images : (json.images ? json.images : []);
                                            json.details = res.details ? res.details : (json.details ? json.details : null);
                                            json.about = res.about ? res.about : (json.about ? json.about : null);
                                            json.pricing = res.pricing;
                                            json.quantity = res.quantity ? res.quantity : null;
                                            json.tags = res.tags ? res.tags : null;
                                            0 > 1 ? console.log(464, {
                                                json
                                            }) : null;
                                        } catch (e) {
                                            console.log(316, 'error mvc.v DESCENDANT', {
                                                e,
                                                json
                                            });
                                        }
                                    }

                                    //IMAGES
                                    var card = vp.find('form card');
                                    var section = card.find('box > section');
                                    var columns = card.find('[css-columns]');
                                    section.innerHTML = "";
                                    columns.innerHTML = columns.lastElementChild.outerHTML;
                                    if (json && json.images && json.images.length > 0) {

                                        var i = 0;
                                        do {
                                            var thumbnail = card.all("box")[0].firstElementChild;

                                            var img = document.createElement('img');
                                            img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                                            img.src = await github.raw.blob({
                                                owner: window.owner.login,
                                                repo: get[1],
                                                resource: json.images[i]
                                            });
                                            img.dataset.resource = json.images[i];

                                            var picture = document.createElement('picture');
                                            picture.className = "border-radius-20px display-inline-flex height-100pct overflow-hidden position-relative top-0 width-100pct";
                                            picture.appendChild(img);
                                            section.appendChild(picture);

                                            var template = card.find('template').content.firstElementChild.cloneNode(true);
                                            template.dataset.tap = "controller.product.ring(target)";
                                            template.find('picture').innerHTML = img.outerHTML;
                                            columns.lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);

                                            if (i === json.images.length - 1) {
                                                section.style.transform = "translateX(-" + i + "00%)";
                                            }

                                            i++;
                                        } while (i < json.images.length);
                                    }

                                    //vp.find('[placeholder="Page URL"]').innerHTML = "<span>" + rout.ed.url(name) + "</span><span contenteditable placeholder=':slug'></span>";

                                    //CATEGORY
                                    var arr = await ajax("/raw/asset/json/categories.json");
                                    var categories = JSON.parse(arr).merch;
                                    if (categories.length > 0) {
                                        var c = 0;
                                        var vp = dom.body.find('[data-page="/dashboard/*/merch/catalog/*"]');
                                        var step2 = vp.all('block card')[1];
                                        var list = step2.find('[data-after="Category"]').closest('box').find('dropdown group');
                                        do {
                                            var node = categories[c];
                                            var item = step2.find('dropdown template').content.firstElementChild.cloneNode(true);
                                            item.find('span').dataset.after = node;
                                            list.insertAdjacentHTML('beforeend', item.outerHTML);
                                            c++;
                                        } while (c < categories.length);
                                        json && json.category ? vp.find('[data-after="Category"]').closest('box').find('dropdown [placeholder="Value"]').textContent = json.category : null;
                                    }

                                    //TITLE
                                    vp.find('[placeholder="Enter a title"]').value = "";
                                    json && json.title ? vp.find('[placeholder="Enter a title"]').value = json.title : null;

                                    //DESCRIPTION
                                    vp.find('[placeholder="Provide a detailed description."]').value = "";
                                    json && json.description ? vp.find('[placeholder="Provide a detailed description."]').value = json.description : null;
                                    on.key.up.auto.size(vp.find('[placeholder="Provide a detailed description."]'));

                                    //TAGS
                                    $(vp.find('[data-after="Tags"]').closest('box').find('flex').all('text')).remove();
                                    if (json && json.tags) {
                                        var t = 0;
                                        do {
                                            var tag = json.tags[t];
                                            var template = vp.find('[data-after="Tags"]').closest('box').find('template').content.firstElementChild.cloneNode(true);
                                            template.find('span').textContent = tag;
                                            vp.find('[data-after="Tags"]').closest('box').find('flex').lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);
                                            t++;
                                        } while (t < json.tags.length)
                                    }

                                    //DETAILS
                                    var details = vp.find('[data-after="Details"]').closest('box').find('column');
                                    details.innerHTML = "";
                                    if (json && json.details && Object.keys(json.details).length > 0) {
                                        var d = 0;
                                        do {
                                            if (d >= 0) {
                                                var template = vp.find('[data-after="Details"]').closest('box').find('template').content.firstElementChild.cloneNode(true);
                                                details.insertAdjacentHTML('beforeend', template.outerHTML);
                                            }
                                            var detail = details.children[d];
                                            var name = detail.all('field')[0].find('textarea');
                                            var value = detail.all('field')[1].find('textarea');
                                            name.value = Object.keys(json.details)[d];
                                            value.value = Object.values(json.details)[d];
                                            on.key.up.auto.size(name);
                                            on.key.up.auto.size(value);
                                            d++;
                                        } while (d < Object.keys(json.details).length);
                                    } else {
                                        var template = vp.find('[data-after="Details"]').closest('box').find('template').content.firstElementChild.cloneNode(true);
                                        details.insertAdjacentHTML('beforeend', template.outerHTML);
                                        var detail = details.lastElementChild;
                                        var name = detail.all('field')[0].find('textarea');
                                        var value = detail.all('field')[1].find('textarea');
                                        on.key.up.auto.size(name);
                                        on.key.up.auto.size(value);
                                    }

                                    //ABOUT
                                    var about = vp.find('[data-after="About"]').closest('box').find('column');
                                    about.innerHTML = "";
                                    if (json && json.about && json.about.length > 0) {
                                        var a = 0;
                                        do {
                                            var feature = json.about[a];
                                            var template = vp.find('[data-after="About"]').closest('box').find('template').content.firstElementChild.cloneNode(true);
                                            template.find('textarea').textContent = feature;
                                            about.insertAdjacentHTML('beforeend', template.outerHTML);
                                            on.key.up.auto.size(about.lastElementChild.find('textarea'));
                                            a++;
                                        } while (a < json.about.length);
                                    } else {
                                        var template = vp.find('[data-after="About"]').closest('box').find('template').content.firstElementChild.cloneNode(true);
                                        about.insertAdjacentHTML('beforeend', template.outerHTML);
                                        on.key.up.auto.size(about.lastElementChild.find('textarea'));
                                    }
                                    //console.log(json);

                                    //PRICING
                                    vp.find('[data-after="Pricing"]').closest('box').find('flex').children[0].find('[type="number"]').value = "";
                                    vp.find('[data-after="Pricing"]').closest('box').find('flex').children[1].find('[type="number"]').value = "";
                                    if (json && json.pricing) {
                                        json.pricing.ListPrice ? vp.find('[data-after="Pricing"]').closest('box').find('flex').children[0].find('[type="number"]').value = json.pricing.ListPrice : false;
                                        json.pricing.SalePrice ? vp.find('[data-after="Pricing"]').closest('box').find('flex').children[1].find('[type="number"]').value = json.pricing.SalePrice : false;
                                    }

                                    //QUANTITY
                                    if (json && json.quantity) {
                                        vp.find('[data-after="Quantity"]').closest('box').find('flex').children[0].find('[type="number"]').value = json.quantity;
                                    }

                                } else {
                                    //vp.find('form').removeAttribute('css-display');
                                    //vp.find('error').setAttribute("css-display", "none");

                                    var json = await ajax("/raw/asset/json/categories.json");
                                    var categories = JSON.parse(json).merch;
                                    if (categories.length > 0) {
                                        var c = 0;
                                        var vp = dom.body.find('[data-page="/dashboard/*/merch/catalog"]');
                                        console.log({
                                            vp
                                        });
                                        var step2 = vp.all('block card')[1];
                                        var list = step2.find('dropdown group');
                                        do {
                                            var node = categories[c];
                                            var item = step2.find('dropdown template').content.firstElementChild.cloneNode(true);
                                            item.find('span').dataset.after = node;
                                            list.insertAdjacentHTML('beforeend', item.outerHTML);
                                            c++;
                                        } while (c < categories.length)
                                    }
                                }
                            } else if (get[3] === "product") {
                                var vp = dom.body.find('pages[data-page="/dashboard/*/merch/product"]');
                                var slug = get[4];
                                if (slug) {
                                    var owner = await github.user.get();
                                    var json = await github.repos.contents({
                                        owner: window.owner.login,
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
                            var vp = dom.body.find('page[data-page="/dashboard/*/merch"]');
                            vp.find('block > footer').setAttribute("css-display", "none");
                            //alert("Attempting to fetch files");
                            github.repos.contents({
                                owner: window.owner.login,
                                path: "/raw/merch/merch.json",
                                repo: get[1]
                            }, {
                                accept: "application/vnd.github.raw"
                            }).then(data=>{
                                if (data) {
                                    0 > 1 ? console.log(84, {
                                        data
                                    }) : null;
                                    feed.innerHTML = "";
                                    if (data.length > 0) {
                                        vp.all('header card')[1].find('box').classList.remove('display-none');
                                        var html = "";
                                        var d = 0;
                                        do {
                                            var row = data[d];
                                            var slug = row.slug;
                                            if (rout.ed.dir(slug).length === 1) {
                                                var title = row.title;
                                                var card = byId('template-feed-dashboard-merch').content.firstElementChild.cloneNode(true);
                                                card.find('[placeholder="Title"]').textContent = title;
                                                card.find('[placeholder="Title"]').dataset.href = "/dashboard/:get/merch/catalog/" + slug + "/";
                                                card.find('.gg-tag').closest('text').dataset.href = "/dashboard/:get/merch/catalog/" + slug + "/";
                                                html += card.outerHTML;
                                            }
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

                            var vp = window.vp = {
                                pages: dom.body.find('pages[data-page="/dashboard/*/pages/*"]'),
                                page: dom.body.find('block[data-page="/dashboard/*/pages/page"]'),
                                seo: dom.body.find('block[data-page="/dashboard/*/pages/seo"]'),
                                social: dom.body.find('block[data-page="/dashboard/*/pages/social"]'),
                                advanced: dom.body.find('block[data-page="/dashboard/*/pages/advanced"]')
                            }

                            var page = vp.page.find('[data-value="pages.slug"]').value;
                            var slug = get[4] === "/index.html" ? "/" : get[4];
                            var code = {
                                css: vp.advanced.find('[data-value="advanced.css"]'),
                                js: vp.advanced.find('[data-value="advanced.js"]'),
                                html: vp.advanced.find('[data-value="advanced.html"]')
                            };

                            if (get.length > 4) {

                                try {
                                    var res = await github.repos.contents({
                                        owner: window.owner.login,
                                        path: '/raw/pages/pages.json',
                                        repo: get[1]
                                    }, {
                                        accept: "application/vnd.github.raw"
                                    });
                                    var json = res.find(o=>o.page === slug);
                                    var path = json.slug === "/" ? "index.html" : json.slug.slice(1)
                                    0 > 1 ? console.log(1161, {
                                        json,
                                        page,
                                        path
                                    }) : null;
                                    if (json) {

                                        if (page !== path) {

                                            //alert("Updating fields: " + json.slug.slice(1) + "-" + page);

                                            //GENERAL
                                            if (vp.page) {
                                                vp.page.find('[data-value="pages.title"]').value = "";

                                                var url = vp.page.find('[data-value="pages.slug"]');
                                                //url.dataset.slug = url.value = url.placeholder = slug + (name.length > 0 ? "/" : "");
                                                url.value = "";
                                                //on.key.up.auto.width(url.previousElementSibling);
                                                //on.key.up.auto.width(url);
                                            }

                                            //SEO
                                            if (vp.seo) {
                                                vp.seo.find('textarea[data-value="seo.title"]').value = "";
                                                //on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.title"]'));

                                                vp.seo.find('textarea[data-value="seo.description"]').value = "";
                                                //on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.description"]'));
                                            }

                                            //SOCIAL
                                            if (vp.social) {
                                                vp.social.find('[data-value="social.preview"]').removeAttribute('data-filename');
                                                vp.social.find('[data-value="social.preview"]').innerHTML = "";
                                                vp.social.find('[data-value="social.image"]').innerHTML = "";
                                            }

                                            //ADVANCED
                                            if (vp.advanced) {
                                                code.css.value = "";
                                                code.js.value = "";
                                                code.html.value = "";
                                            }

                                            var seo_description = "seo"in json && json.seo.description ? json.seo.description : "";
                                            var seo_title = "seo"in json && json.seo.title ? json.seo.title : (vp.page.find('[data-value="pages.title"]').value ? vp.page.find('[data-value="pages.title"]').value : json.title);

                                            //GENERAL
                                            if (vp.page) {
                                                vp.page.find('[data-value="pages.title"]').value = "title"in json ? json.title : "";
                                                vp.page.find('[data-value="pages.slug"]').value = "slug"in json && json.slug.length > 1 ? json.slug.slice(1) : "index.html";
                                                vp.page.find('[data-value="pages.pages"]').checked = "pages"in json ? json.pages : false;
                                                vp.page.find('[data-value="pages.main"]').checked = "main"in json ? !json.main : false;
                                                vp.page.find('[data-value="pages.visibility"]').checked = "visibility"in json ? json.visibility : false;

                                                //on.key.up.auto.width(url.previousElementSibling);
                                                //on.key.up.auto.width(url);
                                            }

                                            //SEO
                                            if (vp.seo) {
                                                vp.seo.find('span[data-value="seo.title"]').textContent = seo_title;
                                                vp.seo.find('textarea[data-value="seo.title"]').value = "seo"in json && json.seo.title ? json.seo.title : null;
                                                vp.seo.find('span[data-value="seo.site"]').textContent = window.database.dashboard[get[1]].name;
                                                vp.seo.find('span[data-value="seo.subdomain"]').textContent = window.database.dashboard[get[1]].short_name;
                                                vp.seo.find('text[data-value="seo.description"]').textContent = seo_description;
                                                vp.seo.find('textarea[data-value="seo.description"]').value = seo_description;
                                                vp.seo.find('[data-value="seo.noindex"]').checked = json.noindex;
                                                //on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.title"]'));
                                                //on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.description"]'));
                                            }

                                            //SOCIAL
                                            if (vp.social) {
                                                if (json.image) {
                                                    try {
                                                        var src = await github.raw.blob({
                                                            owner: window.owner.login,
                                                            repo: get[1],
                                                            resource: "/raw/pages" + json.slug.replace('*', '_') + '/' + json.image
                                                        });

                                                        var img = document.createElement('img');
                                                        img.className = 'height-100pct object-fit-cover position-absolute top-0 width-100pct';
                                                        img.src = src;
                                                        vp.social.find('[data-value="social.preview"]').dataset.filename = json.image;
                                                        vp.social.find('[data-value="social.preview"]').innerHTML = img ? img.outerHTML : "";

                                                        var img = document.createElement('img');
                                                        img.className = 'height-100pct object-fit-contain position-absolute top-0 width-100pct';
                                                        img.src = src;
                                                        vp.social.find('[data-value="social.image"]').innerHTML = img ? img.outerHTML : "";
                                                    } catch (e) {
                                                        console.log(e);
                                                    }
                                                } else {
                                                    vp.social.find('[data-value="social.preview"]').removeAttribute('data-filename');
                                                    vp.social.find('[data-value="social.preview"]').innerHTML = "";
                                                    vp.social.find('[data-value="social.image"]').innerHTML = "";
                                                }
                                                vp.social.find('span[data-value="social.title"]').textContent = seo_title;
                                                vp.social.find('span[data-value="social.site"]').textContent = window.database.dashboard[get[1]].name;
                                                vp.social.find('span[data-value="social.subdomain"]').textContent = window.database.dashboard[get[1]].short_name;
                                                vp.social.find('text[data-value="social.description"]').textContent = seo_description;
                                            }

                                            //ADVANCED
                                            if (vp.advanced) {
                                                try {
                                                    var res = await github.repos.contents({
                                                        owner: window.owner.login,
                                                        path: '/raw/pages' + json.slug.replace('*', '_') + (json.slug === "/" ? "" : "/") + 'page.html',
                                                        repo: get[1]
                                                    }, {
                                                        accept: "application/vnd.github.raw"
                                                    });

                                                    var doc = new DOMParser().parseFromString(res, 'text/html');
                                                    var head = doc.head;
                                                    var body = doc.body;

                                                    var style = head.find('style') ? head.find('style').innerHTML : null;
                                                    var script = head.find('script') ? head.find('script').innerHTML : null;
                                                    var html = body.innerHTML.length > 0 ? body.innerHTML : null;
                                                    vp.advanced.find('[data-value="advanced.css"]').value = style;
                                                    vp.advanced.find('[data-value="advanced.js"]').value = script
                                                    vp.advanced.find('[data-value="advanced.html"]').value = html;
                                                } catch (e) {
                                                    console.log(e);
                                                }
                                            }
                                        }

                                    } else {
                                        throw Error("Page not found");
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            } else {
                                //console.log('Create a new page');
                                var then = rout.ed.dir(last).slice(0, 4);
                                var now = rout.ed.dir(path).slice(0, 4);
                                var than = rout.ed.dir(last).slice(0, 3);
                                var naw = rout.ed.dir(path).slice(0, 3);
                                if (now.length > then.length || than[1] !== naw[1]) {

                                    //GENERAL
                                    if (vp.page) {
                                        vp.page.find('[data-value="pages.title"]').value = "";

                                        var url = vp.page.find('[data-value="pages.slug"]');
                                        //url.dataset.slug = url.value = url.placeholder = slug + (name.length > 0 ? "/" : "");
                                        url.value = "";
                                        //on.key.up.auto.width(url.previousElementSibling);
                                        //on.key.up.auto.width(url);
                                    }

                                    //SEO
                                    if (vp.seo) {
                                        vp.seo.find('textarea[data-value="seo.title"]').value = "";
                                        //on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.title"]'));

                                        vp.seo.find('textarea[data-value="seo.description"]').value = "";
                                        //on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.description"]'));
                                    }

                                    //SOCIAL
                                    if (vp.social) {
                                        vp.social.find('[data-value="social.preview"]').removeAttribute('data-filename');
                                        vp.social.find('[data-value="social.preview"]').innerHTML = "";
                                        vp.social.find('[data-value="social.image"]').innerHTML = "";
                                    }

                                    //ADVANCED
                                    if (vp.advanced) {
                                        code.css.value = "";
                                        code.js.value = "";
                                        code.html.value = "";
                                    }

                                }
                            }

                            if (get[3] === "page") {

                                //GENERAL
                                if (vp.page) {
                                    var url = vp.page.find('[data-value="pages.slug"]');
                                    on.key.up.auto.width(url.previousElementSibling);
                                    on.key.up.auto.width(url);
                                }

                            }

                            if (get[3] === "seo") {

                                //SEO
                                if (vp.seo) {
                                    on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.title"]'));
                                    on.key.up.auto.size(vp.seo.find('textarea[data-value="seo.description"]'));
                                }

                            }

                            resolve(route);
                        } else {
                            var feed = byId('feed-dashboard-pages');
                            if (0 < 1) {
                                var vp = dom.body.find('pages[data-page="/dashboard/*/pages"]');
                                //alert("Attempting to fetch files");
                                github.repos.contents({
                                    owner: window.owner.login,
                                    path: "/raw/pages/pages.json",
                                    repo: get[1]
                                }, {}).then(d=>{
                                    var data = JSON.parse(atob(d.content));
                                    if (data) {
                                        0 > 1 ? console.log(84, {
                                            data
                                        }) : null;
                                        feed.innerHTML = "";
                                        if (data.length > 0) {
                                            vp.all('header card')[1].find('box').classList.remove('display-none');
                                            var html = "";
                                            var d = 0;
                                            var names = [];
                                            var html = "";
                                            var hrefs = [];
                                            var arr = [];

                                            do {
                                                var row = data[d];
                                                hrefs[d] = row.slug;
                                                d++;
                                            } while (d < data.length);
                                            hrefs.sort(function(a, b) {
                                                return a.localeCompare(b)
                                            });

                                            d = 0;
                                            var names = [];
                                            do {
                                                var href = hrefs[d];
                                                names[d] = rout.ed.dir(href);
                                                arr[d] = data[d];
                                                d++;
                                            } while (d < hrefs.length);
                                            arr.sort(function(a, b) {
                                                return a.slug.localeCompare(b.slug);
                                            });

                                            d = 0;
                                            do {
                                                var row = arr[d];
                                                var href = hrefs[d];
                                                var card = byId('template-feed-dashboard-pages').content.firstElementChild.cloneNode(true);
                                                if ((d > 0 && names[d][0] !== names[d - 1][0])) {
                                                    html += "</card>";
                                                }
                                                if (d === 0 || (d > 0 && names[d][0] !== names[d - 1][0])) {
                                                    html += "<card class='" + card.className + "'>";
                                                }
                                                card.find('[placeholder="Page URL"]').closest('box').dataset.href = "/dashboard/:get/pages/page/" + row.page;
                                                card.find('[placeholder="Page URL"]').textContent = row.title;
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
                            resolve(route);
                        }
                    }
                    if (get[2] == "posts") {
                        if (get[3] === "post") {
                            var vp = dom.body.find('pages[data-page="/dashboard/*/posts/*"]');

                            var image = vp.find('block > header card').firstElementChild;
                            var title = vp.find('[data-after="Title"]').closest('box').find('textarea');
                            var description = vp.find('[data-after="Description"]').closest('box').find('textarea');
                            var article = vp.find('[contenteditable]');
                            var category = vp.find('[data-after="Category"]').closest('box').find('dropdown [placeholder]');
                            var tags = vp.find('[data-after="Tags"]').closest('box');

                            image.innerHTML = "";
                            title.value = "";
                            description.value = "";
                            article.innerHTML = "<p><br></p>";
                            category.textContent = "";
                            $(tags.children[1].all('text')).remove();

                            if (get.length > 4) {
                                const user = await github.user.get();

                                if (0 < 1) {

                                    github.repos.contents({
                                        owner: window.owner.login,
                                        path: "/raw/posts/" + get[4] + "/index.html",
                                        repo: get[1]
                                    }, {
                                        accept: "application/vnd.github.raw"
                                    }).then(async(data)=>{
                                        //var data = atob(d.content);
                                        if (data) {
                                            const doc = new DOMParser().parseFromString(data, "text/html");

                                            try {
                                                var res = await github.raw.blob({
                                                    owner: window.owner.login,
                                                    repo: get[1],
                                                    resource: "/raw/posts/" + get[4] + "/image.jpeg"
                                                })
                                                var img = document.createElement('img');
                                                img.className = "height-100pct object-fit-cover position-absolute width-100pct";
                                                img.src = res;
                                                image.innerHTML = img.outerHTML;
                                            } catch (e) {
                                                console.log(862, e);
                                            }

                                            title.value = doc.head.find("title").textContent;
                                            on.key.up.auto.size(title);

                                            description.value = doc.head.find("meta[name='description']").content;
                                            on.key.up.auto.size(description);

                                            article.innerHTML = doc.body.all('article')[doc.body.all('article').length - 1].innerHTML;

                                            doc.head.find("meta[name='category']") ? category.textContent = doc.head.find("meta[name='category']").content : null;

                                            var keywords = doc.head.find("meta[name='keywords']");
                                            if (keywords) {
                                                var t = 0;
                                                var hashtags = keywords.content.split(', ');
                                                do {
                                                    var keyword = hashtags[t];
                                                    var template = tags.find('template').content.firstElementChild.cloneNode(true);
                                                    template.find('span').textContent = keyword;
                                                    tags.children[1].lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);
                                                    t++;
                                                } while (t < hashtags.length)
                                            }
                                        }
                                    }
                                    ).catch(async(error)=>{
                                        console.log(507, "Post is empty", {
                                            error
                                        });
                                        if (error.code === 404) {//alert("Setup Project");
                                        //resolve(route);
                                        }
                                    }
                                    );
                                }

                            }
                            resolve(route);
                        } else {
                            const user = await github.user.get();
                            controller.posts.read(get[1]);
                            resolve(route);
                        }
                    } else if (get[2] === "setup") {
                        var vp = dom.body.find('[data-page="/setup"]');
                        if (get.length > 1) {} else {
                            //alert(vp.outerHTML);
                            vp.all('block[data-step]')[0].find('[data-goto="two"]').classList.add('opacity-50pct');
                            vp.all('block[data-step]')[0].find('[data-goto="two"]').dataset.disabled = "true";
                            vp.all('block[data-step]')[0].find('input[type="text"]').value = "";
                            $(vp.all('form > header box flex')[0]).attr("css-height", "50px");
                            $(vp.all('form > header box flex')[0]).attr("css-width", "50px");
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
                                    //var repository = row['_links'].html.split('/');
                                    //var user = repository[0];
                                    //var repo = repository[1];
                                    //template.dataset["full_name"] = row.repository["full_name"];
                                    //template.find('ico').dataset.href = "/" + root + "/" + name + "/editor/";
                                    //mtemplate.find('text').dataset.href = "/templates/" + name + "/";
                                    template.find('text').textContent = name;
                                    //template.find('picture').dataset.href = "/" + root + "/" + name + "/preview/";
                                    try {
                                        var screenshot = 0 < 1 ? null : await github.raw.blob({
                                            owner: owner.login,
                                            resource: "/raw/asset/png/template.png",
                                            repo: repo
                                        }, {
                                            accept: "application/vnd.github.raw"
                                        });
                                        template.find('picture img').src = "raw/asset/png/template/template." + repo.split('.')[2] + ".png";
                                    } catch (e) {}

                                    feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                    x++;
                                } while (x < data.length);
                            }
                        }
                        ajax('raw/asset/json/templates.json').then(a);
                        resolve(route);
                    }
                }
            } else if (root === "design") {

                if (get.length > 1) {

                    if (get.length > 2) {

                        if (get[2] === "preview") {
                            var vp = dom.body.find('[data-page="' + route.page + '"]');
                            var iframe = vp.find('iframe');
                            iframe.name = "iframe-" + get[1];
                            //controller.templates.preview(iframe);
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
                    var vp = dom.body.find('[data-page="/new/app"]');
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

                                private === true ? template.find('.gg-lock').closest('text').setAttribute("css-display", "flex") : null;

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
