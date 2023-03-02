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
                    route.search = "";
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
                        if (get[2] === "config") {
                            if (get.length === 4) {
                                if (get[3] === "checkout") {
                                    var vp = dom.body.find('page[data-page="' + route.page + '"]');
                                    var connect = {
                                        stripe: vp.find('[data-value="stripe.connect"]')
                                    };
                                    var redirect_uri = window.location.protocol + '//' + global.domains.subdomain + '.' + global.domains.domain + '.' + global.domains.tld;
                                    var state = 'stripe_' + Crypto.uid.create(1);
                                    localStorage.redirect_uri = route.path;
                                    connect.stripe.href = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" + stripe.config.client_id.test + "&redirect_uri=" + stripe.config.redirect_uri + "&scope=read_write&state=" + stripe.config.state;
                                }
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
                                                    owner: user.login,
                                                    repo: get[1],
                                                    path: '/raw/files/' + filename
                                                }, {
                                                    accept: "application/vnd.github.raw",
                                                    cache: "reload"
                                                });
                                                src = 'data:image/svg+xml;base64,' + btoa(res);
                                            } else {
                                                src = await github.raw.blob({
                                                    owner: user.login,
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
                                            var text = await github.raw.git("/" + user.login + "/" + get[1] + '/main/raw/files/' + filename);
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
                                if (get[4]) {}
                            } else {

                                var vp = dom.body.find('page[data-page="/dashboard/*/media"]');
                                //alert("Attempting to fetch files");
                                github.repos.contents({
                                    owner: user.login,
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
                                                    owner: user.login,
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
                                                owner: user.login,
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
                                            vp.find('[data-after="Traits"]').closest('box').removeAttribute('data-display');

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
                                            vp.find('[data-after="Traits"]').closest('box').dataset.display = "none";
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
                                                    owner: user.login,
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
                                        var columns = card.find('[data-columns]');
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
                                        //vp.find('form').removeAttribute('data-display');
                                        //vp.find('error').dataset.display = "none";

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
                                var vp = dom.body.find('page[data-page="/dashboard/*/merch"]');
                                vp.find('block > footer').dataset.display = "none";
                                //alert("Attempting to fetch files");
                                github.repos.contents({
                                    owner: user.login,
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
                                if (get[3] === "page") {
                                    var vp = dom.body.find('pages[data-page="/dashboard/*/pages/*"]');
                                    var name = rout.ed.dir(route.path);
                                    name.splice(0, 4);
                                    vp.find('[placeholder="Page URL"]').innerHTML = "<span>" + rout.ed.url(name) + "</span><span contenteditable placeholder=':slug'></span>";
                                }
                            } else {
                                var feed = byId('feed-dashboard-pages');
                                if (0 < 1) {
                                    var vp = dom.body.find('pages[data-page="/dashboard/*/pages"]');
                                    //alert("Attempting to fetch files");
                                    github.repos.contents({
                                        owner: user.login,
                                        path: "/raw/pages/pages.json",
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
                                                    card.find('[placeholder="Page URL"]').dataset.href = "/dashboard/:get/pages/page" + href;
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
                                var vp = dom.body.find('pages[data-page="/dashboard/*/posts/*"]');

                                var image = vp.find('block > header card').firstElementChild;
                                var title = vp.find('[data-after="Title"]').closest('box').find('textarea');
                                var description = vp.find('[data-after="Description"]').closest('box').find('textarea');
                                var article = vp.find('wysiwyg[contenteditable]');
                                var category = vp.find('[data-after="Category"]').closest('box').find('dropdown [placeholder]');
                                var tags = vp.find('[data-after="Tags"]').closest('box');

                                image.innerHTML = "";
                                title.value = "";
                                description.value = "";
                                article.innerHTML = "";
                                category.textContent = "";
                                $(tags.children[1].all('text')).remove();

                                if (get.length > 4) {
                                    const user = await github.user.get();

                                    if (0 < 1) {

                                        github.repos.contents({
                                            owner: user.login,
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
                                controller.posts.read(get[1]);
                            }
                        } else if (get[2] === "setup") {
                            var vp = dom.body.find('[data-page="/setup"]');
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
                                    const html = await ajax('/raw/asset/html/template/template.setup.html');
                                    var ppp = 0 < 1 ? await modal.page(html) : dom.body.find('[data-fetch="raw/asset/html/template/template.setup.html"]')
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
                    resolve(route);
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
                    resolve(route);
                }
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
