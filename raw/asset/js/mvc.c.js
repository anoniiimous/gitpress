window.mvc.c ? null : (window.mvc.c = controller = {

    audio: {

        cover: async(event)=>{
            var figure = event.target.closest('box').nextElementSibling.find('figure');
            var b64 = await on.change.file(event);
            var split = b64.result.split(';base64,')
            var mime = split[0].split(':')[1];
            var type = mime.split('/')[0]
            console.log({
                b64,
                figure,
                mime,
                type
            })
            if (type === "image") {
                var img = document.createElement('img');
                img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                img.dataset.filename = b64.files[0].name;
                img.src = b64.result;
                figure.innerHTML = img.outerHTML;
            }
        }
        ,

        create: async()=>{

            event.preventDefault();
            var form = event.target;
            var description = form.find("textarea").value;

            var photos = form.find('box > figure').children;
            var photo = photos.length > 0 ? photos[0] : null;
            var src = photo ? photo.src : null;
            var filename = photo ? photo.dataset.filename : null;

            var photos2 = form.find('box > column > figure').lastElementChild;
            var photo2 = photos2;
            var src2 = photo2 ? photo2.src : null;
            var filename2 = photo2 ? photo2.dataset.filename : null;
            console.log(photos2, photo2);

            var tags = [];
            var children = form.lastElementChild.find('footer span').children;
            if (children.length > 0) {
                do {
                    var child = children.children[c];
                    var tag = child.textContent;
                    tags.push(tag);
                } while (c < children.length)
            }
            var title = form.find('input[type="text"]').value;
            var data = {
                description,
                event,
                photo,
                tags,
                title
            };
            console.log(2001, {
                data,
                form
            });
            if (photos.length > 0 && title) {
                //JSON
                var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
                var row = {
                    "format": "audio",
                    "slug": slug,
                    "title": title
                };
                description ? row.description = description : null;
                tags ? row.tags : null;
                var str3 = JSON.stringify(row, null, 4);

                //MEDIA
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/media.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str1 = JSON.stringify(rows, null, 4);

                //VIDEO
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/audio/audio.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str2 = JSON.stringify(rows, null, 4);

                var canvas = form.find('canvas');

                //PUSH
                var params = {
                    message: "Add " + title + " to Audio",
                    repo: GET[1],
                    owner: owner.login
                };
                var array = [{
                    content: str1,
                    path: "raw/media/media.json"
                }, {
                    content: str2,
                    path: "raw/media/audio/audio.json"
                }, {
                    content: photo.src.split(';base64,')[1],
                    path: "raw/media/audio/" + slug + "/image.jpg",
                    type: "base64"
                }, {
                    content: str3,
                    path: "raw/media/audio/" + slug + "/audio.json"
                }, {
                    content: photo2.src.split(';base64,')[1],
                    path: "raw/media/audio/" + slug + "/audio." + filename2.split('.')[filename2.split('.').length - 1],
                    type: "base64"
                }];
                console.log(2452, 'controller.audio.update', "array", {
                    array
                });
                github.crud.update(params, array).then("/dashboard/:get/media/".router())
            }
        }
        ,

        track: async(event)=>{
            var file = await on.change.file(event);
            var audio = document.createElement('audio');
            console.log({
                event,
                file
            });
            audio.src = file.result;
            audio.dataset.filename = file.files[0].name;
            var figure = event.target.closest('label').previousElementSibling;
            var options = {
                container: figure,
                backend: "MediaElement",
                barHeight: 50,
                barWidth: 3,
                cursorColor: "#fff",
                mediaType: "audio",
                normalize: true,
                progressColor: "#ff5900",
                waveColor: "#fff"
            };
            window.wavesurfer = WaveSurfer.create(options);
            window.wavesurfer.load(file.result, [0.0218, 0.0183, 0.0165, 0.0198, 0.2137, 0.2888, 0.2313, 0.15, 0.2542, 0.2538, 0.2358, 0.1195, 0.1591, 0.2599, 0.2742, 0.1447, 0.2328, 0.1878, 0.1988, 0.1645, 0.1218, 0.2005, 0.2828, 0.2051, 0.1664, 0.1181, 0.1621, 0.2966, 0.189, 0.246, 0.2445, 0.1621, 0.1618, 0.189, 0.2354, 0.1561, 0.1638, 0.2799, 0.0923, 0.1659, 0.1675, 0.1268, 0.0984, 0.0997, 0.1248, 0.1495, 0.1431, 0.1236, 0.1755, 0.1183, 0.1349, 0.1018, 0.1109, 0.1833, 0.1813, 0.1422, 0.0961, 0.1191, 0.0791, 0.0631, 0.0315, 0.0157, 0.0166, 0.0108]);
            figure.insertAdjacentHTML('beforeend', audio.outerHTML);
            figure.firstElementChild.dataset.filename = file.files[0].name;
        }

    },

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

        category: async(target)=>{
            var dropdown = await modal.dropdown(target.closest('dropdown'), {
                other: false
            });
            var step = target.closest('card');
            var category = step.find('[placeholder]').textContent;
            var button = step.find('footer .gg-chevron-right').closest('box');
            if (category.length > 0) {
                button.classList.remove('opacity-50pct')
            } else {
                button.classList.add('opacity-50pct')
            }
        }
        ,

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
                    content: result.result.split('base64,')[1],
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
            var split = b64.result.split(';base64,')
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
                        var column = vp.find('.gg-play-button').closest('box').find('column');
                        var audio = document.createElement('audio');
                        audio.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                        audio.dataset.filename = b64.files[0].name;
                        audio.src = b64.result;
                        0 < 1 ? audio.controls = true : null;
                        column.innerHTML = audio.outerHTML;
                    }
                    if (type === "photo") {
                        var img = document.createElement('img');
                        img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                        img.dataset.filename = b64.files[0].name;
                        img.src = b64.result;
                        vp.find('figure').innerHTML = img.outerHTML;
                    }
                    if (type === "video") {
                        var video = document.createElement('video');
                        video.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
                        video.dataset.filename = b64.files[0].name;
                        video.playsinline = true;
                        video.src = b64.result;
                        vp.find('figure').innerHTML = video.outerHTML;
                        var canvas = vp.find('canvas');
                        var video = vp.find('figure video');
                        video.autoplay = true;
                        video.addEventListener("loadedmetadata", loadCanvas)
                        video.addEventListener("play", loadPlay, true)
                        video.addEventListener("pause", loadCapture, true)
                        function loadCanvas() {
                            canvas.height = video.videoHeight;
                            canvas.width = video.videoWidth;
                            video.classList.add('display-none');
                        }
                        function loadCapture() {
                            video.currentTime = video.duration / 2;
                            canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                            video.poster = canvas.toDataURL();
                            video.removeEventListener("pause", loadCapture, true)
                            video.controls = true;
                            video.currentTime = 0;
                            video.classList.remove('display-none');
                        }
                        function loadPlay() {
                            video.pause();
                            video.removeEventListener("play", loadPlay, true)
                        }
                    }
                }
                );
            }
        }
        ,

        select: async(target)=>{
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.dataset.display = "flex";
            } else {
                footer.dataset.display = "none";
            }
            console.log({
                column,
                footer,
                row,
                selected
            });
        }
        ,

        tags: event=>{
            var target = event.target;

            var keywords = target.closest('box').find('flex').all('text');
            var tags = [];
            if (keywords.length > 0) {
                var t = 0;
                do {
                    var tag = keywords[t];
                    var keyword = tag.find('span').textContent.toLowerCase();
                    tags.push(keyword);
                    t++;
                } while (t < keywords.length);
                tags = [...new Set(tags)];
            }

            if (tags.includes(target.textContent.toLowerCase())) {
                target.closest('flex > *').classList.add('color-ff3b30');
            } else {
                target.closest('flex > *').classList.remove('color-ff3b30');
            }

            if ([13, 32].includes(event.keyCode)) {
                if (tags.includes(target.textContent.toLowerCase()) === false) {
                    var template = target.closest('box').find('template').content.firstElementChild.cloneNode(true);
                    template.find('span').textContent = target.textContent;
                    target.closest('flex > *').insertAdjacentHTML('beforebegin', template.outerHTML);
                    target.textContent = "";
                }
            }
        }

    },

    merch: {

        select: async(target)=>{
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.dataset.display = "flex";
            } else {
                footer.dataset.display = "none";
            }
            console.log({
                column,
                footer,
                row,
                selected
            });
        }

    },

    product: {

        select: async(target)=>{
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.dataset.display = "flex";
            } else {
                footer.dataset.display = "none";
            }
            console.log({
                column,
                footer,
                row,
                selected
            });
        }
        ,

        attribute: async(target)=>{
            var attribute = target.find('input');
            var variations = target.nextElementSibling;
            if (attribute.value.length > 0) {
                variations.classList.remove('opacity-50pct');
            } else {
                variations.classList.add('opacity-50pct');
            }
        }
        ,

        attributes: async(target)=>{
            var attributes = await modal.dropdown(target);
            var variations = target.nextElementSibling;
            console.log(attributes, variations, target.find('[placeholder]').textContent);
            if (target.find('[placeholder]').textContent.length > 0) {
                variations.classList.remove('opacity-50pct');
            } else {
                variations.classList.add('opacity-50pct');
            }
        }
        ,

        browsenode: async(target)=>{
            var dropdown = await modal.dropdown(target.closest('dropdown'), {
                other: true
            });
            var step = target.closest('card');
            var category = step.find('[placeholder]').textContent;
        }
        ,

        catalog: async(event)=>{
            event.preventDefault();

            var form = event.target;
            var steps = form.all('block card');
            var step1 = steps[0];
            var step2 = steps[1];
            var step3 = steps[2];

            var title = step1.find('input').value;
            var category = step2.find('dropdown [placeholder]').textContent;
            var dimensions = [];

            var variations = step3.firstElementChild.lastElementChild.all('column');
            if (variations.length > 0) {
                var d = 0;
                do {
                    var dimension = variations[d];
                    dimensions[d] = {
                        name: dimension.find('field input').value,
                        values: []
                    };

                    var values = dimension.find('dropdown group').children;
                    if (values.length) {
                        var v = 0;
                        do {
                            dimensions[d].values[v] = values[v].find('span').dataset.after;
                            v++;
                        } while (v < values.length)
                    }

                    d++;
                } while (d < variations.length);
            }

            var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();

            var row = {
                category,
                dimensions,
                slug,
                title
            }
            console.log(1961, row);

            //MERCH
            try {
                var data = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/merch/merch.json"
                });
                var j = JSON.parse(atob(data.content));
                var json = JSON.parse(atob(data.content));
                json.push(row);
            } catch (e) {
                var j = [];
                var json = [row];
            }
            rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
            var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
            var str1 = JSON.stringify(rows, null, 4);

            //PUSH
            var params = {
                message: "Add " + name + " to Merch",
                repo: GET[1],
                owner: owner.login
            };
            var array = [{
                content: str1,
                path: "raw/merch/merch.json"
            }, {
                content: JSON.stringify(row, null, 4),
                path: "raw/merch/" + slug + "/merch.json"
            }];
            console.log(2452, 'controller.merch.update', "array", {
                array
            });
            try {
                await github.crud.update(params, array);
                ("/dashboard/:get/merch/catalog/" + slug + "/").router()
            } catch (e) {
                modal.alert({
                    body: "There was an error creating this product.",
                    submit: "OK",
                    title: "Catalog Error"
                })
            }
        }
        ,

        category: async(target)=>{
            var dropdown = await modal.dropdown(target.closest('dropdown'), {
                other: true
            });
            var step = target.closest('card');
            var category = step.find('[placeholder]').textContent;
        }
        ,

        create: async(event)=>{
            event.preventDefault();

            var form = event.target;

            var images = [];
            var thumbnails = form.find('card').firstElementChild.find('box > section').all('img');
            if (thumbnails.length > 0) {
                var i = 0;
                do {
                    var thumbnail = thumbnails[i];
                    images.push(thumbnail.src.startsWith("data:") ? {
                        content: thumbnail.src,
                        extension: thumbnail.src.split(';base64,')[0].split('/')[1]
                    } : {
                        content: thumbnail.dataset.resource,
                        extension: thumbnail.dataset.resource.split('.')[thumbnail.dataset.resource.split('.').length - 1]
                    });
                    i++;
                } while (i < thumbnails.length)
            }

            var category = form.find('[data-after="Category"]').closest('box').find('[placeholder="Value"]').textContent;

            var title = form.find('[placeholder="Enter a title"]').value;

            var description = form.find('[placeholder="Provide a detailed description."]').value;

            var keywords = form.find('[data-after="Tags"]').closest('box').find('flex').all('text');
            var tags = [];
            if (keywords.length > 0) {
                var t = 0;
                do {
                    var tag = keywords[t];
                    var keyword = tag.find('span').textContent;
                    tags.push(keyword);
                    t++;
                } while (t < keywords.length);
                tags = [...new Set(tags)];
            }

            var attributes = {};
            var dimensions = [];
            var traits = form.find('[data-after="Traits"]').closest('box').children[1].children;
            if (traits.length > 0) {
                var t = 0;
                do {
                    var trait = traits[t];
                    var name = trait.find('field [placeholder]').textContent;
                    var value = trait.find('dropdown [placeholder]').textContent;
                    if (name && value) {
                        attributes[name] = value;
                    }
                    dimensions[t] = {
                        name,
                        values: []
                    };
                    var values = trait.find('dropdown').children[1].children;
                    if (values.length > 0) {
                        var v = 0;
                        do {
                            dimensions[t].values[v] = values[v].find('span').dataset.after;
                            v++;
                        } while (v < values.length);
                    }
                    t++;
                } while (t < traits.length);
            }

            var child = null;
            var cousin = null;
            var parent = null;

            var keys = Object.keys(attributes);
            var child = keys.length > 0 && keys.length === traits.length;
            var cousin = keys.length > 0 && keys.length < traits.length;
            var parent = keys.length === 0;

            var valid = [];
            if (!GET[5] && images.length === 0) {
                valid.push("images");
            }

            if (valid.length === 0) {
                var row = {
                    description,
                    title
                }

                if (category.length > 0) {
                    row.category = category;
                }

                if (images.length > 0) {
                    var imgs = [];
                    var i = 0;
                    do {
                        if (images[i].content.startsWith("data:")) {
                            if (child || cousin) {
                                imgs.push("/raw/merch/" + GET[4] + "/" + GET[5] + "/image." + i + "." + images[i].extension);
                            } else {
                                imgs.push("/raw/merch/" + GET[4] + "/image." + i + "." + images[i].extension);
                            }
                        } else {
                            imgs.push(images[i].content);
                        }
                        i++;
                    } while (i < images.length);
                    imgs.length > 0 ? row.images = imgs : null;
                }

                if (tags.length > 0) {
                    row.tags = tags;
                }

                var values = {};
                var details = form.find('[data-after="Details"]').closest('box').find('column').children;
                if (details.length > 0) {
                    var d = 0;
                    do {
                        var detail = details[d];
                        var name = detail.all('field')[0].find('textarea').value;
                        var value = detail.all('field')[1].find('textarea').value;
                        if (name.length > 0 && value.length > 0) {
                            values[name] = value;
                        }
                        d++;
                    } while (d < details.length);
                    row.details = values;
                }

                var features = [];
                var about = form.find('[data-after="About"]').closest('box').find('column').children;
                if (about.length > 0) {
                    var a = 0;
                    do {
                        var feature = about[a];
                        var text = feature.find('textarea').value;
                        if (text.length > 0) {
                            features.push(text);
                        }
                        a++;
                    } while (a < about.length);
                    row.about = features;
                }

                var ListPrice = form.find('[data-after="Pricing"]').closest('box').find('flex').children[0].find('[type="number"]').value;
                var SalePrice = form.find('[data-after="Pricing"]').closest('box').find('flex').children[1].find('[type="number"]').value;
                if (ListPrice || SalePrice) {
                    row.pricing = {};
                    ListPrice ? row.pricing.ListPrice = ListPrice : null;
                    SalePrice ? row.pricing.SalePrice = SalePrice : null;
                }

                var quantity = form.find('[data-after="Quantity"]').closest('box').find('input').value;
                if (quantity.length > 0 && parseInt(quantity) > 0) {
                    row.quantity = parseInt(quantity);
                }

                if (child || cousin) {
                    row.attributes = attributes;
                    row.slug = slug = GET[4] + "/" + GET[5];
                }
                if (parent) {
                    row.dimensions = dimensions;
                    row.slug = slug = GET[4];
                }

                //MERCH
                if (child || cousin) {
                    try {
                        var data = await github.repos.contents({
                            owner: owner.login,
                            repo: GET[1],
                            path: "/raw/merch/merch.json"
                        });
                        var j = JSON.parse(atob(data.content));
                        var json = JSON.parse(atob(data.content));
                        var exists = false;
                        if (json.length > 0) {
                            var js = 0;
                            do {
                                if (json[js].slug === slug) {
                                    var exists = true;
                                    json[js] = row;
                                }
                                js++;
                            } while (js < json.length);
                        }
                        if (exists === false) {
                            json.push(row);
                        }
                    } catch (e) {
                        var j = [];
                        var json = [row];
                    }
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                    var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                    var str = JSON.stringify(rows, null, 4);

                    try {
                        var data = await github.repos.contents({
                            owner: owner.login,
                            repo: GET[1],
                            path: "/raw/merch/" + GET[4] + "/merch.json"
                        });
                        var j = JSON.parse(atob(data.content));
                        var json = JSON.parse(atob(data.content));
                        var exists = false;
                        if (json.length > 0) {
                            var js = 0;
                            do {
                                if (json[js].slug === slug) {
                                    var exists = true;
                                    json[js] = row;
                                } else {}
                                js++;
                            } while (js < json.length);
                        }
                        //console.log(1218, exists, row);
                        if (exists === false) {
                            json.push(row);
                        }
                    } catch (e) {
                        var j = [];
                        var json = [row];
                    }
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                    //console.log(1225, exists, rows);
                    var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                    var str0 = JSON.stringify(rows, null, 4);

                    var str1 = JSON.stringify(row, null, 4);
                } else {
                    try {
                        var data = await github.repos.contents({
                            owner: owner.login,
                            repo: GET[1],
                            path: "/raw/merch/merch.json"
                        });
                        var j = JSON.parse(atob(data.content));
                        var json = JSON.parse(atob(data.content));
                        var exists = false;
                        if (json.length > 0) {
                            var js = 0;
                            do {
                                if (json[js].slug === slug) {
                                    var exists = true;
                                    json[js] = row;
                                }
                                js++;
                            } while (js < json.length);
                        }
                        if (exists === false) {
                            json.push(row);
                        }
                    } catch (e) {
                        var j = [];
                        var json = [row];
                    }
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                    var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                    var str = JSON.stringify(rows, null, 4);

                    try {
                        var data = await github.repos.contents({
                            owner: owner.login,
                            repo: GET[1],
                            path: "/raw/merch/" + GET[4] + "/merch.json"
                        });
                        var j = JSON.parse(atob(data.content));
                        var json = JSON.parse(atob(data.content));
                        var exists = false;
                        if (json.length > 0) {
                            var js = 0;
                            do {
                                if (json[js].slug === GET[4]) {
                                    var exists = true;
                                    json[js] = row;
                                } else {}
                                js++;
                            } while (js < json.length);
                        }
                        if (exists === false) {
                            json.push(row);
                        }
                    } catch (e) {
                        var j = [];
                        var json = [row];
                    }
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                    var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                    var str0 = JSON.stringify(rows, null, 4);
                }

                0 > 1 ? console.log(1902, "controller.merch.create", {
                    row
                }) : null;

                //PUSH
                var params = {
                    message: "Add " + title + " to Merch",
                    repo: GET[1],
                    owner: window.owner.login
                };
                if (child || cousin) {
                    var array = [{
                        content: str,
                        path: "raw/merch/merch.json"
                    }, {
                        content: str0,
                        path: "raw/merch/" + GET[4] + "/merch.json"
                    }, {
                        content: str1,
                        path: "raw/merch/" + GET[4] + "/" + GET[5] + "/merch.json"
                    }];
                } else {
                    var array = [{
                        content: str,
                        path: "raw/merch/merch.json"
                    }, {
                        content: str0,
                        path: "raw/merch/" + GET[4] + "/merch.json"
                    }];
                }
                if (images.length > 0) {
                    var i = 0;
                    do {
                        if (images[i].content.startsWith('data:')) {
                            array.push({
                                content: images[i].content.split(';base64,')[1],
                                path: "raw/merch/" + slug + "/image." + i + "." + images[i].extension,
                                type: "base64"
                            });
                        }
                        i++;
                    } while (i < images.length)
                }
                console.log(1168, 'controller.merch.update', "array", {
                    array,
                    attributes,
                    tags
                }, {
                    child,
                    cousin,
                    parent
                }, {
                    row,
                    str: JSON.parse(str),
                    str0: JSON.parse(str0),
                    str1: str1 ? JSON.parse(str1) : null
                });
                await github.crud.update(params, array);
            } else {
                modal.alert({
                    body: "You must supply " + valid.join(', ') + ".",
                    submit: "OK",
                    title: "Validation Error"
                })
            }
        }
        ,

        delete: async(slug)=>{
            console.log(slug);
            var dir = rout.ed.dir(slug);
            console.log(dir);

            try {
                var ancestor = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/merch/" + dir[0] + "/merch.json"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (ancestor.length > 0) {
                    var ancestor = ancestor.filter(function(obj) {
                        return obj.slug !== slug;
                    });
                }
                console.log(1417, {
                    ancestor
                })
            } catch (e) {
                console.log("error", {
                    e
                })
            }

            try {
                var merch = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/merch/merch.json"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (merch.length > 0) {
                    var merch = merch.filter(function(obj) {
                        return obj.slug !== slug;
                    });
                }
                console.log(1447, {
                    merch
                })
            } catch (e) {
                console.log("error", {
                    e
                })
            }

            //PUSH
            if (0 < 1) {
                var params = {
                    message: "Delete " + slug + " from Merch",
                    repo: GET[1],
                    owner: window.owner.login
                };
                var array = [{
                    content: JSON.stringify(merch, null, 4),
                    path: "raw/merch/merch.json"
                }];
                var url = '/dashboard/:get/merch/';
                if (dir.length > 1) {
                    array.push({
                        content: JSON.stringify(ancestor, null, 4),
                        path: "raw/merch/" + dir[0] + "/merch.json"
                    })
                    array.push({
                        content: null,
                        path: "raw/merch/" + slug
                    })
                    var url = '/dashboard/:get/merch/catalog/:get/';
                } else {
                    array.push({
                        content: null,
                        path: "raw/merch/" + dir[0]
                    })
                }
                console.log(1168, 'controller.merch.update', "array", {
                    array,
                    params
                }, {
                    dir,
                    slug
                }, {
                    ancestor,
                    merch
                });
                await github.crud.update(params, array);
                url.router();
            }
        }
        ,

        details: target=>{
            var template = target.closest('footer').find('template').content.firstElementChild.cloneNode(true);
            target.closest('box').find('column').insertAdjacentHTML('beforeend', template.outerHTML);
        }
        ,

        matrix: target=>{
            var dimensions = [];
            var traits = target.closest('box').all('column');
            var t = 0;
            if (traits.length > 0) {
                do {
                    var trait = traits[t];
                    var attribute = trait.find('field').find('input').value;
                    dimensions[t] = {
                        name: attribute
                    };
                    var values = trait.find("dropdown").lastElementChild;
                    if (values.length > 0) {
                        var v = 0;
                        dimensions[t].values = [];
                        do {
                            dimensions[t].values[v] = values.children[v].find('[placeholder="Value"]').textContent;
                            v++;
                        } while (v < values.length);
                    }
                    t++;
                } while (t < traits.length);
            }
            console.log(1984, {
                dimensions
            });
        }
        ,

        features: event=>{
            on.key.up.auto.size(event.target)
            if (event.keyCode === 8) {
                var target = event.target;
                if (target.value === "" && target.closest('column').children.length > 1) {
                    var input = target.closest('text').previousElementSibling.find('textarea');
                    input.selectionStart = input.selectEnd = input.value.length;
                    input.focus();
                    target.closest('text').remove();
                }
            }
            if (event.keyCode === 13) {
                var target = event.target;
                var box = target.closest('box');
                var template = box.find('template').content.firstElementChild.cloneNode(true);
                target.closest('text').insertAdjacentHTML('afterend', template.outerHTML);
                var input = target.closest('text').nextElementSibling.find('textarea');
                var range = document.createRange();
                var sel = window.getSelection();
                range.setStart(input, input.value.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                input.focus();

            }
        }
        ,

        quantity: target=>{
            var button = target.closest('row').find('input');
            var ico = target.closest('ico');
            if (button && ico) {
                var up = ico.find('.gg-chevron-up');
                var down = ico.find('.gg-chevron-down');
                button.value = button.value === '' ? 0 : button.value;
                if (up) {
                    button.value = parseInt(button.value) + 1;
                }
                if (down && button.value > 0) {
                    button.value = parseInt(button.value) - 1;
                }
            }
        }
        ,

        ring: (target)=>{
            var index = target.closest('box').index();
            var card = target.closest('card');
            var section = card.find('box > section');
            section.style.transform = "translateX(-" + index + "00%)";
        }
        ,

        step: (target)=>{
            var form = target.closest('form');
            var step = target.closest('block > * > card');
            var index = step.index();
            var box = target.closest('box');
            var button = box.find('n');
            if (button) {
                var steps = target.closest('block').all('block > * > card');
                if (button.className === "gg-chevron-left") {
                    if (index === 1) {
                        step.dataset.display = "none";
                        steps[index - 1].dataset.display = 'flex';
                    }
                    if (index === 2) {
                        step.dataset.display = "none";
                        steps[index - 1].dataset.display = 'flex';
                    }
                }
                if (button.className === "gg-chevron-right") {
                    if (index === 0) {
                        if (box.classList.contains('opacity-50pct')) {
                            modal.alert({
                                body: "You must enter a name in order to continue.",
                                submit: "OK",
                                title: "Product Name"
                            });
                        } else {
                            step.dataset.display = "none";
                            steps[index + 1].dataset.display = 'flex';
                        }
                    }
                    if (index === 1) {
                        if (box.classList.contains('opacity-50pct')) {
                            modal.alert({
                                body: "You must select a category in order to continue.",
                                submit: "OK",
                                title: "Browse Node"
                            });
                        } else {
                            step.dataset.display = "none";
                            steps[index + 1].dataset.display = 'flex';
                        }
                    }
                }
            }

        }
        ,

        thumb: async(event)=>{
            var target = event.target;
            var card = target.closest('card');
            var section = card.find('box > section');
            var thumbnails = card.find('[data-columns]')
            var b64 = await on.change.file(event);

            var template = card.find('template').content.firstElementChild.cloneNode(true);
            var img = document.createElement('img');
            img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
            img.src = b64.result;
            template.dataset.tap = "controller.merch.ring(target)";
            template.find('picture').innerHTML = img.outerHTML;
            thumbnails.lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);

            var picture = document.createElement('picture');
            picture.className = "border-radius-20px display-inline-flex height-100pct overflow-hidden position-relative top-0 width-100pct";
            picture.appendChild(img);
            section.appendChild(picture);
            section.style.transform = "translateX(-" + section.lastElementChild.index() + "00%)";
        }
        ,

        traits: async(target)=>{
            var attributes = target.previousElementSibling;
            var variations = await modal.dropdown(target, {
                other: false,
                title: attributes.find('[placeholder]').value
            });

            var url = '/dashboard/' + GET[1] + '/merch/catalog/' + GET[4] + '/';
            var values = [];
            var traits = target.closest('box column').children;
            if (traits.length > 0) {
                var t = 0;
                do {
                    var trait = traits[t];
                    var name = trait.find('field [placeholder]').textContent;
                    var value = trait.find('dropdown [placeholder]').textContent;
                    if (name.length > 0 && value.length > 0) {
                        values.push(name.toLowerCase().replaceAll('-', '') + "-" + value.toLowerCase().replaceAll('-', ''));
                    }
                    t++;
                } while (t < traits.length);
                var matrix = values.join('_');

                if (matrix.length > 0) {
                    //console.log(matrix, values);
                    url += matrix + '/';
                }
                var vp = target.closest('pages');

                0 < 1 ? console.log({
                    route,
                    url,
                    matrix,
                    values
                }, {
                    attributes,
                    variations
                }, {
                    matrix,
                    traits,
                    values
                }) : null;

                route.path === url ? null : url.router();

            }
        }
        ,

        variation: async(target)=>{
            var footer = target.closest('footer');
            var template = footer.find('template').content.firstElementChild.cloneNode(true);
            footer.insertAdjacentHTML('beforebegin', template.outerHTML);
        }
        ,

        variations: async(target)=>{
            if (target.classList.contains('opacity-50pct')) {
                modal.alert({
                    body: "You must select an attribute before creating values for your variations.",
                    submit: "OK",
                    title: "No Attribute Selected"
                });
            } else {
                var attributes = target.previousElementSibling;
                var variations = await modal.dropdown(target, {
                    //multi: attributes,
                    title: attributes.find('[placeholder]').value
                });
                console.log({
                    attributes,
                    variations
                });
            }
        }
        ,

        pinky: (target)=>{
            var box = target.closest('box');
            var row = box.firstElementChild;
            var card = target.closest('card');
            var thumbnails = card.find('card > row');
            var index = Math.abs(row.style.transform.replaceAll("translateX(", "").slice(0, -2)) / 100;

            row.children[index].remove();
            thumbnails.children[index].remove();
            row.style.transform = "translateX(-" + (index - 1) + "00%)";
        }

    },

    menu: {

        close: ()=>{

            const nav = dom.body.find('body > main nav');
            nav.dataset["960pxTransform"] = "translateX(0%)";
            nav.firstElementChild.classList.rRemove('display-none');

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
        ,

        select: async(target)=>{
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.dataset.display = "flex";
            } else {
                footer.dataset.display = "none";
            }
        }

    },

    photo: {

        create: async(event)=>{
            event.preventDefault();
            var form = event.target;
            var description = form.find("textarea").value;
            var photos = form.find('figure').children;
            var photo = photos.length > 0 ? photos[0] : null;
            var src = photo ? photo.src : null;
            var filename = photo ? photo.dataset.filename : null;
            var tags = [];
            var children = form.lastElementChild.find('footer span').children;
            if (children.length > 0) {
                do {
                    var child = children.children[c];
                    var tag = child.textContent;
                    tags.push(tag);
                } while (c < children.length)
            }
            var title = form.find('input[type="text"]').value;
            var data = {
                description,
                photo,
                tags,
                title
            };
            console.log(2001, {
                data,
                form
            });
            if (photos.length > 0 && title) {
                //JSON
                var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
                var row = {
                    format: "photo",
                    slug,
                    title
                };
                description ? row.description = description : null;
                tags ? row.tags : null;

                //MEDIA
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/media.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str1 = JSON.stringify(rows, null, 4);

                //PHOTO
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/photo/photo.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str2 = JSON.stringify(rows, null, 4);

                //PUSH
                var params = {
                    message: "Add " + title + " to Photos",
                    repo: GET[1],
                    owner: owner.login
                };
                var array = [{
                    content: str1,
                    path: "raw/media/media.json"
                }, {
                    content: str2,
                    path: "raw/media/photo/photo.json"
                }, {
                    content: photo.src.split(';base64,')[1],
                    path: "raw/media/photo/" + slug + "/image." + filename.split('.')[filename.split('.').length - 1],
                    type: "base64"
                }];
                console.log(2452, 'controller.photo.update', "array", {
                    array
                });
                github.crud.update(params, array).then(()=>{
                    "/dashboard/:get/media/".router()
                }
                )
            }
        }

    },

    posts: {

        create: async(event)=>{
            event.preventDefault();

            var form = event.target;

            var image = form.find('[type="file"]').closest("card").firstElementChild.find('img') ? form.find('[type="file"]').closest("card").firstElementChild.find('img').src : null;
            var title = form.find('[data-after="Title"]').closest('box').find('textarea').value;
            var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
            var description = form.find('[data-after="Description"]').closest('box').find('textarea').value.length > 0 ? form.find('[data-after="Description"]').closest('box').find('textarea').value : null;
            var body = form.find('wysiwyg').innerHTML.length > 0 ? form.find('wysiwyg').innerHTML : "";

            console.log({
                title,
                category,
                slug,
                image,
                body
            });

            if (body && description && image && title) {

                var row = {
                    description,
                    image: image.startsWith("data:") ? "/raw/posts/" + slug + "/image.jpeg" : image,
                    slug,
                    title
                }

                var category = form.find('[data-after="Category"]').closest('box').find('dropdown [placeholder]').textContent.length > 0 ? form.find('[data-after="Category"]').closest('box').find('dropdown [placeholder]').textContent : null;
                category ? row.category = category : null;

                var tags = null;
                var keywords = form.find('[data-after="Tags"]').closest('box').children[1].all('text');
                if (keywords.length > 0) {
                    tags = [];
                    var t = 0;
                    do {
                        var keyword = keywords[t];
                        tags[t] = keyword.find('span').textContent;
                        t++;
                    } while (t < keywords.length);
                    row.tags = tags;
                }

                console.log(1961, row);

                //POST
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/posts/posts.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    var exists = false;
                    if (json.length > 0) {
                        var js = 0;
                        do {
                            if (json[js].slug === slug) {
                                var exists = true;
                                json[js] = row;
                            }
                            js++;
                        } while (js < json.length);
                    }
                    if (exists === false) {
                        json.push(row);
                    }
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str1 = JSON.stringify(rows, null, 4);

                var str = await ajax('raw/asset/html/template/template.post.html');
                var doc = new DOMParser().parseFromString(str, 'text/html');
                var html = doc.documentElement;
                html.find('head title').textContent = row.title;
                row.category ? html.find('head meta[name="category"]').setAttribute("content", row.category) : null;
                html.find('head meta[name="description"]').setAttribute("content", row.description);
                row.tags ? html.find('head meta[name="keywords"]').setAttribute("content", row.tags.join(', ')) : html.find('head meta[name="keywords"]').remove();
                html.find('body article').innerHTML = body;

                //PUSH
                var params = {
                    message: "Add " + name + " to Merch",
                    repo: GET[1],
                    owner: owner.login
                };
                var array = [{
                    content: str1,
                    path: "raw/posts/posts.json"
                }, {
                    content: image.split(';base64,')[1],
                    path: "raw/posts/" + slug + "/image." + image.split(';base64,')[0].split('/')[1],
                    type: "base64"
                }, {
                    content: html.outerHTML,
                    path: "raw/posts/" + slug + "/index.html"
                }, {
                    content: JSON.stringify(row, null, 4),
                    path: "raw/posts/" + slug + "/index.json"
                }];
                console.log(2452, 'controller.merch.update', "array", {
                    array
                });
                try {
                    await github.crud.update(params, array);
                    ("/dashboard/:get/posts/").router()
                } catch (e) {
                    modal.alert({
                        body: "There was an error creating this product.",
                        submit: "OK",
                        title: "Catalog Error"
                    })
                }

            }
        }
        ,

        delete: async(slugs)=>{
            //console.log(2443, slugs);

            try {
                var res = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/posts/posts.json"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (res.length > 0) {
                    var posts = res.filter(function(obj) {
                        //console.log('posts', slugs, obj.slug, !slugs.includes(obj.slug));
                        return !slugs.includes(obj.slug);
                    });
                    var deleted = res.filter(function(obj) {
                        //console.log('deleted', slugs, obj.slug, slugs.includes(obj.slug));
                        return slugs.includes(obj.slug);
                    })
                }
            } catch (e) {
                console.log("error", {
                    e
                })
            }

            var titles = "";
            if (slugs.length > 1) {
                titles = slugs.length + " products";
            } else {
                titles = '"' + deleted[0].title + '"';
            }

            console.log(2475, {
                slugs,
                titles,
                deleted,
                posts,
                res
            });

            //PUSH
            if (0 < 1) {
                var params = {
                    message: "Delete " + titles + " from Posts",
                    repo: GET[1],
                    owner: window.owner.login
                };
                var array = [{
                    content: JSON.stringify(posts, null, 4),
                    path: "raw/posts/posts.json"
                }];
                //array = [];
                if (deleted.length > 0) {
                    var d = 0;
                    do {
                        var removed = deleted[d];
                        var id = removed.slug;
                        var arr = {
                            content: null,
                            path: "raw/posts/" + removed.slug
                        };
                        array.push(arr);
                        d++;
                    } while (d < deleted.length);
                }
                console.log(1168, 'controller.posts.delete', "array", {
                    array,
                    params
                });
                await github.crud.update(params, array);
                ('/dashboard/:get/posts/').router();
            }
        }
        ,

        deletion: async(target)=>{
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
                    0 > 1 ? console.log(84, {
                        data
                    }) : null;
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
                            card.find('[placeholder="Title"]').dataset.href = "/dashboard/:get/posts/post/" + slug + "/";
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
        ,

        remove: target=>{
            var column = target.closest('block').find('column');
            var checked = column.all(':checked');
            if (checked.length > 0) {
                var slugs = [];
                var c = 0;
                do {
                    var slug = rout.ed.dir(checked[c].closest('card').find('[placeholder="Title"]').dataset.href).splice(4, 5)[0];
                    slugs.push(slug);
                    c++;
                } while (c < checked.length);
                controller.posts.delete(slugs);
            }
        }
        ,

        image: async(event)=>{
            var reader = await on.change.file(event);
            var card = event.target.closest('card');
            var img = document.createElement('img');
            img.className = "height-100pct object-fit-cover position-absolute width-100pct";
            img.src = reader.result;
            card.firstElementChild.innerHTML = img.outerHTML;
            console.log({
                reader
            });
        }
        ,

        select: async(target)=>{
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.dataset.display = "flex";
            } else {
                footer.dataset.display = "none";
            }
            console.log({
                column,
                footer,
                row,
                selected
            });
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

    video: {

        create: async(event)=>{

            event.preventDefault();
            var form = event.target;
            var description = form.find("textarea").value;
            var photos = form.find('figure').children;
            var photo = video = photos.length > 0 ? photos[0] : null;
            var src = photo ? photo.src : null;
            var filename = photo ? photo.dataset.filename : null;
            var tags = [];
            var children = form.lastElementChild.find('footer span').children;
            if (children.length > 0) {
                do {
                    var child = children.children[c];
                    var tag = child.textContent;
                    tags.push(tag);
                } while (c < children.length)
            }
            var title = form.find('input[type="text"]').value;
            var data = {
                description,
                event,
                photo,
                tags,
                title
            };
            console.log(2001, {
                data,
                form
            });
            if (photos.length > 0 && title) {
                //JSON
                var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
                var row = {
                    "format": "video",
                    "slug": slug,
                    "title": title
                };
                description ? row.description = description : null;
                tags ? row.tags : null;
                var str3 = JSON.stringify(row, null, 4);

                //MEDIA
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/media.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str1 = JSON.stringify(rows, null, 4);

                //VIDEO
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/video/video.json"
                    });
                    var j = JSON.parse(atob(data.content));
                    var json = JSON.parse(atob(data.content));
                    json.push(row);
                } catch (e) {
                    var j = [];
                    var json = [row];
                }
                rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
                var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
                var str2 = JSON.stringify(rows, null, 4);

                var canvas = form.find('canvas');

                //PUSH
                var params = {
                    message: "Add " + title + " to Videos",
                    repo: GET[1],
                    owner: owner.login
                };
                var array = [{
                    content: str1,
                    path: "raw/media/media.json"
                }, {
                    content: str2,
                    path: "raw/media/video/video.json"
                }, {
                    content: form.find('video').poster.split(';base64,')[1],
                    path: "raw/media/video/" + slug + "/image.jpg",
                    type: "base64"
                }, {
                    content: str3,
                    path: "raw/media/video/" + slug + "/video.json"
                }, {
                    content: photo.src.split(';base64,')[1],
                    path: "raw/media/video/" + slug + "/video." + filename.split('.')[filename.split('.').length - 1],
                    type: "base64"
                }];
                console.log(2452, 'controller.video.update', "array", {
                    array,
                    video: {
                        width: video.videoWidth,
                        height: video.videoHeight
                    }
                });
                github.crud.update(params, array).then("/dashboard/:get/media/".router())
            }

        }
    }

});

controller.merch = controller.product;
