window.mvc.c ? null : (window.mvc.c = controller = {

    audio: {

        cover: async (event) => {
            var input = event.target.closest('label').find('input');
            var figure = input.closest('box').find('figure');
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
                input.insertAdjacentHTML('beforebegin', input.outerHTML);
                input.remove();
            }
        },

        create: async () => {

            event.preventDefault();
            var form = event.target;
            var description = form.find("textarea").value;

            var photos = form.find('box > figure').children;
            var photo = photos.length > 0 ? photos[0] : null;
            var src = photo ? photo.src : null;
            var filename = photo ? photo.dataset.filename : null;

            var photos2 = form.find('card').all('box')[0].find('audio');
            var photo2 = photos2;
            var src2 = photo2 ? photo2.src : null;
            var filename2 = photo2 ? photo2.dataset.filename : null;
            console.log(photos2, photo2);

            var keywords = form.find('[data-after="Tags"]').closest('box').find('flex').all('text');
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
                tags ? row.tags = tags : null;
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
                var str1 = JSON.stringify(rows, null, 4);

                //AUDIO
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/audio/audio.json"
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                    content: str3,
                    path: "raw/media/audio/" + slug + "/audio.json"
                }];
                photo.src.startsWith('data:') ? array.push({
                    content: photo.src.split(';base64,')[1],
                    path: "raw/media/audio/" + slug + "/image.jpg",
                    type: "base64"
                }) : null;
                photo2.src.startsWith('data:') ? array.push({
                    content: photo2.src.split(';base64,')[1],
                    path: "raw/media/audio/" + slug + "/audio." + filename2.split('.')[filename2.split('.').length - 1],
                    type: "base64"
                }) : null;
                console.log(2452, 'controller.audio.update', "array", {
                    array
                });
                await github.crud.update(params, array);
                "/dashboard/:get/media/".router()
            }
        },

        remove: target => {
            if (window.wavesurfer) {
                window.wavesurfer.destroy();
            }
            target.closest('column').firstElementChild.innerHTML = "";
        },

        track: async (event) => {
            var input = event.target.closest('label').find('input');
            var file = await on.change.file(event);
            s
            var figure = input.closest('label').previousElementSibling;
            var template = input.closest('column').find('template').content.firstElementChild.cloneNode(true);
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
            window.wavesurfer.load(file.result, [0.0218, 0.0183, 0.0165, 0.0198, 0.2137, 0.2888, 0.2313, 0.15, 0.2542, 0.2538, 0.2358, 0.1195, 0.1591, 0.2599, 0.2742, 0.1447, 0.2328, 0.1878, 0.1988, 0.1645, 0.1218, 0.2005, 0.2828, 0.2051, 0.1664, 0.1181, 0.1621, 0.2966, 0.189, 0.246, 0.2445, 0.1621, 0.1618, 0.189, 0.2354, 0.1561, 0.1638, 0.2799, 0.0923, 0.1659, 0.1675, 0.1268, 0.0984, 0.0997, 0.1248, 0.1495, 0.1431, 0.1236, 0.1755, 0.1183, 0.1349, 0.1018, 0.1109, 0.1833, 0.1813, 0.1422, 0.0961, 0.1191, 0.0791, 0.0631, 0.0315, 0.0157, 0.0166, 0.0108]);
            figure.find('audio').dataset.filename = file.files[0].name;
            input.insertAdjacentHTML('beforebegin', input.outerHTML);
            input.remove();
        }

    },

    blog: {

        render: (iframe, json) => {

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

            github.repos.contents(params, settings).then(data => {
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

                const vp = dom.body.find('[data-page="/*/*"]');
                iframe.contentWindow.document.body.innerHTML = body.innerHTML;
            }).catch(async (error) => {
                console.log("43.error", {
                    error
                });
            });

        }

    },

    branding: {
                
        android: (event) => {
            var target = event.target;
            var value = target.value;
            var svg = target.closest('card').find('svg');
            var rect = svg.find('rect');
            var icon = svg.find('svg');
                    
            var vb = svg.getAttribute('viewBox').split(' ');
            var w = vb[vb.length - 2];
            var h = vb[vb.length - 1];
            if(value === 'default') {
                $(target.closest('card').all('rect')).attr('fill', 'transparent')
                $(target.closest('card').all('foreignObject, svg')).attr('height', h + "px").attr('width', w + "px")
                $(target.closest('card').all('foreignObject')).attr('x', 0).attr('y', 0);
            }
            if(value === 'custom') {
                var row = target.closest('row');                                
                var ms = w - (row.find('[name="android-marginSize"]').value);                        
                var hw = (w - ms) / 2;
                var x = hw;
                var y = hw;
                var fill = row.find('[type="text"]').value;
                $(target.closest('card').find('[name="radio-androidChrome"][value="custom"]').closest('row').all('input:not([type="radio"])')).removeAttr('disabled')
                $(target.closest('card').all('rect')).attr('fill', fill)
                $(target.closest('card').all('foreignObject, svg')).attr('height', ms + "px").attr('width', ms + "px")
                $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
            } else {
                $(target.closest('card').find('[name="radio-androidChrome"][value="custom"]').closest('row').all('input:not([type="radio"])')).attr('disabled', true);
            }
            if(value === 'shadow') {                              
                var ms = w - 83.125;                        
                var hw = (w - ms) / 2;
                var x = hw;
                var y = hw;
                $(target.closest('card').all('rect')).attr('fill', 'transparent')
                $(target.closest('card').all('foreignObject, svg')).attr('height', ms + "px").attr('width', ms + "px")
                $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
            }
        },
                
        browser: (event) => {
            var target = event.target;
            var value = target.value;
            var row = target.closest('row');
            var svg = target.closest('card').find('svg');
            var rect = svg.find('rect');
            var icon = svg.find('svg');
                    
            var vb = svg.getAttribute('viewBox').split(' ');
            var w = vb[vb.length - 2];
            var h = vb[vb.length - 1];
            if(value === 'default') {
                $(target.closest('card').find('[value="custom"]').closest('row').all('input:not([type="radio"])')).attr('disabled', true)
                $(target.closest('card').all('rect')).attr('fill', 'transparent')
                $(target.closest('card').all('foreignObject, svg')).attr('height', h + "px").attr('width', w + "px")
                $(target.closest('card').all('foreignObject')).attr('x', 0).attr('y', 0);
            }
            if(value === 'custom') {                                
                var hw = row.find('[name="browser-imageSize"]').value;
                var x = (w - hw) / 2;
                var y = (h - hw) / 2;
                var fill = row.find('[type="text"]').value;
                var rx = row.find('[name="browser-borderRadius"]').value;
                $(row.all('input:not([type="radio"])')).removeAttr('disabled')
                $(target.closest('card').all('rect')).attr('fill', fill)
                $(target.closest('card').all('rect')).attr('rx', rx + "px")
                $(target.closest('card').all('foreignObject, svg')).attr('height', hw + "px").attr('width', hw + "px")
                $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
            }
        },
                
        ios: (event) => {
            var target = event.target;
            var value = target.value;
            var svg = target.closest('card').find('svg');
            var rect = svg.find('rect');
            var icon = svg.find('svg');
                    
            var vb = svg.getAttribute('viewBox').split(' ');
            var w = vb[vb.length - 2];
            var h = vb[vb.length - 1];
            if(value === 'default') {
                rect.setAttribute('fill', '#000');
                $(target.closest('card').find('[value="background"]').closest('row').all('input:not([type="radio"])')).attr('disabled', true)
            }
            if(value === 'background') {
                var fill = target.closest('row').find('[type="text"]').value;
                rect.setAttribute('fill', fill)
                    
                var row = target.closest('row');                                
                var ms = w - (row.find('[type="range"]').value);                        
                var hw = (w - ms) / 2;
                var x = hw;
                var y = hw;
                var fill = row.find('[type="text"]').value;
                    
                $(target.closest('card').find('[value="background"]').closest('row').all('input:not([type="radio"])')).removeAttr('disabled')
                $(target.closest('card').all('rect')).attr('fill', fill)
                $(target.closest('card').all('foreignObject, svg')).attr('height', ms + "px").attr('width', ms + "px")
                $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
            }
        },
                
        safari: (event) => {
            var target = event.target.closest('[type]');
                    
            if(target) {
                var type = target.getAttribute('type');
                var value = target.getAttribute('value');
                var svg = target.closest('card').find('svg');
                var svgs = target.closest('box').previousElementSibling.all('picture > svg:first-child');
                        
                if(value === 'default') {
                    var color = target.closest('column').find('[type="text"]').value; console.log(color);
                    $(svgs[1].all('path')).attr('fill', color);
                    svgs[1].nextElementSibling.find('rect').setAttribute('fill', color);
                    svgs[2].closest('picture').style.backgroundColor = color;
                        
                    $(svgs).removeAttr('css-display', 'none');
                    svgs.forEach(el => {
                        el.nextElementSibling.setAttribute('css-display', 'none');
                    });
                }
                if(value === 'character') {
                    svgs.forEach(el => {
                        el.nextElementSibling.removeAttribute('css-display', 'none');
                    });                        
                    $(svgs).attr('css-display', 'none');
                    //$(svg.all('path')).attr('fill', 'white');
                }
            }
        },
                
        windows: (event) => {
            var target = event.target.closest('[type]');
                    
            if(target) {
                var type = target.getAttribute('type');
                var value = target.getAttribute('value');
                var svg = target.closest('card').find('svg');
                      
                if(type === "color") {
                     var bg = target.getAttribute('css-background-color');
                     //svg.closest('picture').style.backgroundColor = bg;
                     svg.find('rect').setAttribute('fill', bg);
                     target.closest('row').previousElementSibling.find('[type="text"]').value = bg;
                }
                        
                if(type === "radio") {
                    if(value === 'default') {
                        $(svg.all('path')).removeAttr('fill');
                    }
                    if(value === 'white') {
                        $(svg.all('path')).attr('fill', 'white');
                    }
                }
            }
        },
                        
    },

    build: {
        boot: async (iframe) => {
            return new Promise(async (resolve, reject) => {
                const user = await github.user.get();
                const owner = user.login;
                const repo = route.GOT[1];
                const branch = 'main';
                try {
                    var raw = 0 > 1 ? await github.repos.contents({
                        owner: window.owner.login,
                        path: 'index.html',
                        repo: GET[1]
                    }, {
                        accept: 'application/vnd.github.raw'
                    }) : await ajax('raw/asset/html/template/template.iframe.html');
                    var doc = new DOMParser().parseFromString(raw, 'text/html');

                    try {
                        var css = atob((await github.raw.path('/' + owner + '/' + repo + '/' + branch + '/raw/style/theme.css')).content);
                        var link = document.createElement('link');
                        link.href = blob(css, 'text/css');
                        link.rel = "stylesheet";
                        doc.head.find('link').insertAdjacentHTML('beforebegin', link.outerHTML);
                    } catch (e) {
                        console.log(e);
                    }

                    0 < 1 ? console.log('controller.build.iframe', {
                        doc,
                        html: doc.documentElement.outerHTML,
                        raw
                    }) : null;

                    iframe.src = blob('<!DOCTYPE html>' + doc.documentElement.outerHTML, "text/html");
                    0 < 1 ? iframe.onload = () => {
                            var elems = {
                                iframe,
                                head: iframe.contentWindow.document.head,
                                body: iframe.contentWindow.document.body,
                                main: iframe.contentWindow.document.body.find('main')
                            };
                            console.log(422, "controller.build.iframe iframe.onload", elems);
                            //window.top.css.style.sheet(elems.body);
                            elems.body.setAttribute('buildable', true);

                            elems.body.addEventListener('mouseover', (e) => {
                                var target = e.target;
                                var selectors = target.closest('blocks block, blocks card, blocks box, body > header, body > header card, body > header box, body > footer, body > footer card, body > footer box');
                                if(selectors) {
                                    var tagName = selectors.tagName.toLowerCase();
                                    if(['block', 'box', 'card', 'footer', 'header'].includes(tagName)) {
                                        var block = target.closest('block, footer, header');
                                        console.log('hovering block', {
                                            block,
                                            tagName,
                                            target
                                        });                                        
                                    }
                                }
                            })
                            
                            resolve(elems.iframe);
                        } :
                        resolve(iframe);
                } catch (e) {}
            })
        },
        editor: async () => {

            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = iframe.closest('main nav + pages');

            const builder = iframe.closest('pages[data-page="/dashboard/*/build"]');
            builder.setAttribute("css-transform", "translateY(0)");

            const win = iframe.contentWindow;
            const head = win.document.head;
            const body = win.document.body;

            if (head.find) {
                const css = head.find("#style-editor");
                //header.classList.remove('display-none');
                builder.classList.add('border-top-left-radius-10px');
                builder.classList.add('border-top-right-radius-10px');
                builder.classList.add('margin-top-10px');
                builder.classList.add('margin-x-20px');
                builder.setAttribute("css-width", "calc(100% - 40px)");
                //block.find('builder-toolbar-preview').classList.add('display-none');
                //css.setAttribute('href', 'raw/css/editor.css')
            }

            iframe.contentWindow.document.body.setAttribute('buildable', true);
            iframe.contentWindow.document.body.setAttribute('wireframe', true);

            var path = route.path;
            var dir = rout.ed.dir(path);
            dir = dir.splice(4, dir.length - 1);
            var href = "/dashboard/" + route.GOT[1] + "/build/er" + rout.ed.url(dir);

            var path = "/" + window.parent.owner.login + "/" + window.parent.GET[1] + "/main/" + href;
            var data = await github.raw.git("/" + window.parent.owner.login + "/" + window.parent.GET[1] + "/main" + '/raw/pages/pages.json');
            var json = data.find(o => o.slug === rout.ed.url(dir))
            0 > 1 ? console.log({
                json
            }) : null;
            //alert("controller.build.editor: " + href);

            //iframe.closest('pages').previousElementSibling.find('[placeholder="Page Name"]').textContent = json.title;
            //iframe.closest('pages').previousElementSibling.find('[placeholder="/page-name"]').textContent = json.slug;

        },
        else: async () => {

            const iframe = byId('iframe-editor');
            const block = dom.body.find('[data-page="/dashboard/*/build/er"]');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = block.closest('main nav + pages');
            const toggle = 0 < 1;

            nav.classList.remove('display-none');

            if (iframe) {

                iframe.contentWindow.document.body.removeAttribute('buildable');
                iframe.contentWindow.document.body.removeAttribute('wireframe');

                block.classList.add('border-top-left-radius-10px');
                block.classList.add('border-top-right-radius-10px');
                block.classList.add('margin-top-10px');
                block.classList.add('margin-x-10px');
                //block.find('builder-toolbar-preview').classList.add('display-none');
                //css.removeAttribute('href');
            }
        },
        index: async () => {

            const iframe = byId('iframe-editor');
            const block = dom.body.find('[data-page="/dashboard/*/build"]');
            //iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = block.closest('main nav + pages');
            const toggle = 0 < 1;

            nav.classList.remove('display-none');
            //nav.getAttribute("css-dw960px-transform") = "translateX(0%)";

            //blocks.classList.add('left-320px');
            //blocks.getAttribute("css-dw960px-transform") = "0";

            const builder = iframe.closest('pages[data-page="/dashboard/*/build"]');
            builder.setAttribute("css-transform", "translateY(calc(100% - 50px))");
            //block.dataset.height = "calc(100% - 10px)";
            //block.dataset.width = "calc(100% - 260px)";

            if (0 > 1 && iframe) {
                const css = head.find("#style-editor");
                header.classList.remove('display-none');
                block.classList.add('border-top-left-radius-10px');
                block.classList.add('border-top-right-radius-10px');
                block.classList.add('margin-top-10px');
                block.classList.add('margin-x-10px');
                //block.find('builder-toolbar-preview').classList.add('display-none');
                css.removeAttribute('href')
            }
        },
        preview: async function() {

            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = iframe.closest('main nav + pages');

            const builder = iframe.closest('pages[data-page="/dashboard/*/build"]');
            builder.setAttribute("css-transform", "translateY(0)");

            const win = iframe.contentWindow;
            const head = win.document.head;
            const body = win.document.body;

            if (head.find) {
                const css = head.find("#style-editor");
                //header.classList.remove('display-none');
                builder.classList.add('border-top-left-radius-10px');
                builder.classList.add('border-top-right-radius-10px');
                builder.classList.add('margin-top-10px');
                builder.classList.add('margin-x-20px');
                builder.dataset.width = "calc(100% - 40px)";
                //block.find('builder-toolbar-preview').classList.add('display-none');
                //css.setAttribute('href', 'raw/css/editor.css')
            }

            iframe.contentWindow.document.body.removeAttribute('buildable');
            iframe.contentWindow.document.body.setAttribute('wireframe', true);

            var path = route.path;
            var dir = rout.ed.dir(path);
            dir = dir.splice(4, dir.length - 1);
            var href = "/dashboard/" + route.GOT[1] + "/build/er" + rout.ed.url(dir);

            var path = "/" + window.parent.owner.login + "/" + window.parent.GET[1] + "/main/" + href;
            var data = await github.raw.git("/" + window.parent.owner.login + "/" + window.parent.GET[1] + "/main" + '/raw/pages/pages.json');
            var json = data.find(o => o.slug === rout.ed.url(dir))
            console.log({
                json
            });
            //alert("controller.build.editor: " + href);

            console.log(524, iframe.closest('pages').previousElementSibling);

            var dock = iframe.closest('pages').previousElementSibling;
            //dock.find('[placeholder="Page Name"]').textContent = json.title;
            //dock.find('[placeholder="/page-name"]').textContent = json.slug;
        },
        previewer: () => {

            const iframe = byId('iframe-editor');
            const block = iframe.closest('pages');
            const header = block.find('header');

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = iframe.closest('main nav + pages');
            const toggle = nav.classList.contains('display-none');

            block.removeAttribute('css-transform');
            block.setAttribute("css-height", "100%");
            block.setAttribute("css-width", "100%");

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
    },

    builder: {

        create: async function(target) {

            var iframe = byId('iframe-editor');
            var win = iframe.contentWindow;
            var doc = win.document;

            //$(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.find('.gg-add') ? null : o.classList.add('display-none'));

            var focus = doc.body.getAttribute('focus');
            var focused = win.$('[focus]');
            var focusing = focused[focused.length - 1];

            if (focus) {

                var template = win.byId('template-elements').content.firstElementChild;
                var parent = focusing.find('column, row, section');
                var length = parent.children.length;
                var el = template.find(focus).nextElementSibling

                if (el) {

                    console.log({
                        template,
                        el
                    });

                    parent.insertAdjacentHTML('beforeend', el.outerHTML);
                    var elem = parent.lastElementChild;

                    if (0 > 1) {
                        focus = elem.tagName.toLowerCase();
                        console.log({
                            focus,
                            el,
                            elem
                        });

                        $(doc.body.all('[focus]')).forEach(function(l) {
                            l.removeAttribute('focus');
                        });
                        $(doc.body.all('box text[contenteditable]')).forEach(function(l) {
                            l.removeAttribute('contenteditable');
                        });
                        $([doc.body]).attr('focus', focus);
                        $([elem, elem.closest('block, footer, header')]).attr('focus', focus);
                    }

                }

                if (focus === "box") {
                    console.log({
                        focus
                    });

                    var html = await ajax('raw/asset/html/template/template.toolbox.create.html');
                    var ppp = await modal.popup(html);

                    var focused = $(doc.body.all('[focus]'));
                    ppp.focus = focused[focused.length - 1];
                }

            } else {

                if (target.closest('ico').getAttribute("css-transform") === "rotate(45deg)") {

                    doc.body.removeAttribute('insertable');

                    $(doc.body.all('insertable')).remove();
                    target.closest('ico').removeAttribute("css-transform");

                } else {

                    doc.body.setAttribute('insertable', true);

                    $(doc.documentElement.all('[focus]')).forEach(function(el) {
                        el.removeAttribute('focus');
                    });
                    $(doc.documentElement.all('box text[contenteditable]')).forEach(function(el) {
                        el.removeAttribute('contenteditable');
                    });

                    var main = doc.body.find('main');
                    var sections = $(doc.body.all('body > section'));
                    if (sections.length > 0) {
                        sections.forEach(function(block) {
                            console.log(546, {
                                block
                            });
                            //block.insertAdjacentHTML('beforebegin', add.outerHTML);
                            //block.nextElementSibling ? null : block.insertAdjacentHTML('afterend', add.outerHTML);
                        });
                    } else {
                        //var section = main.previousElementSibling.content.firstElementChild.cloneNode(true);
                        //main.insertAdjacentHTML('beforebegin', section.outerHTML);
                        //main.insertAdjacentHTML('afterend', section.outerHTML);
                    }

                    $(doc.body.all('blocks block')).forEach(function(block) {
                        var add = byId('framework-builder-insert').content.firstElementChild.cloneNode(true);
                        block.insertAdjacentHTML('beforebegin', add.outerHTML);
                        block.nextElementSibling ? null : block.insertAdjacentHTML('afterend', add.outerHTML);
                    });

                    target.closest('ico').setAttribute("css-transform", "rotate(45deg)");

                }

            }

        },

        read: async function(target) {},

        update: async function(target) {
            var dock = target.closest('pages > header');
            //var toolset = dock.children[0];
            //var toolbar = dock.children[1];
            //$([toolset, toolbar]).toggleClass('display-none')

            var iframe = byId('iframe-editor');
            var doc = iframe.contentWindow.document;
            var element = doc.body.getAttribute('focus');

            if ("toolbar" === "toolbar") {

                var html = await ajax('raw/asset/html/tool/tool.bar.' + element + '.html');
                var ppp = new DOMParser().parseFromString(html, "text/html");

                var declarations = ppp.body.all('[data-declaration]');
                0 > 1 ? console.log(705, ppp, {
                    declarations
                }) : null;

                //var card = toolbar.find('[data-declaration]');
                //card.dataset.property = declarations[3].closest('[data-property]').dataset.property;
                //card.innerHTML = declarations[3].outerHTML;
                //declarations.forEach(function(declaration) { });

            }

            if ("toolbox" === "toolbox") {

                var html = await ajax('raw/asset/html/template/template.toolbox.update.html');
                var ppp = await modal.popup(html);

                var html = await ajax('/raw/asset/html/tool/tool.bar.' + element + '.html');
                var col = new DOMParser().parseFromString(html, "text/html");

                var focused = $(doc.body.all('[focus]'));
                ppp.focus = focused[focused.length - 1];

                var box = ppp.find('text[data-before="' + element + '"]').closest('box');
                box.classList.remove('border-bottom-1px-solid');
                //console.log({ppp, focus: ppp.focus})

                var header = ppp.find('card header');

                var tabs = header.parentNode.all('card > column');
                $(tabs).attr('css-display', 'none')

                var fetching = ppp.all('[data-fetch]');
                //console.log(col.body, fetching);
                fetching.length > 0 ? fetching.forEach(async function(column, index) {
                    var html = await ajax(column.dataset.fetch);
                    var parser = new DOMParser().parseFromString(html, "text/html");
                    column.innerHTML = parser.body.firstElementChild.innerHTML;
                    var tab = index === box.index() ? column : null;
                    if (tab) {
                        tab.removeAttribute('css-display');
                        //console.log(tab);
                        tool.box.css(tab);
                    }
                }) : null;
            }
        },

        delete: async function(target) {
            var iframe = byId('iframe-editor');
            var doc = iframe.contentWindow.document;
            var type = doc.body.getAttribute('focus');
            var confirm = await modal.confirm({
                body: "Are you sure you want to remove this " + type + "?",
                title: "Remove " + type
            }, ["Cancel", "Remove"]);
            console.log(536, {
                confirm
            });
            if (confirm) {
                var focused = doc.body.all('[focus]');
                var focus = focused[focused.length - 1];
                var tagName = doc.body.getAttribute('focus');
                var parent = null;
                if (tagName === "card") {
                    parent = focus.closest("block");
                }
                if (tagName === "box") {
                    parent = focus.closest("card");
                }
                console.log({
                    focus,
                    parent,
                    tagName
                }, doc.body.dataset);
                if (["footer", "header"].includes(tagName)) {
                    var replace = doc.createElement(tagName);
                    focus.insertAdjacentHTML('beforebegin', replace.outerHTML);
                }
                var prev = focus.previousElementSibling;
                var next = focus.nextElementSibling;
                if (prev) {
                    $([target.closest('body'), prev]).attr('focus', prev.tagName.toLowerCase());
                } else {
                    if (next) {
                        $([target.closest('body'), next]).attr('focus', next.tagName.toLowerCase());
                    } else {
                        $([target.closest('body'), parent]).attr('focus', parent.tagName.toLowerCase());
                    }
                }
                console.log({
                    prev,
                    next
                });
                focus.remove();
                //parent ? $([parent.closest('body'), parent]).attr('focus', parent.tagName.toLowerCase()) : null;
            }
        },

        push: async function() {
            var iframe = byId('iframe-editor');
            var doc = iframe.contentWindow.document;
            var vp = doc.body.find('[data-page][data-active="true"]');

            var title = iframe.closest('pages').previousElementSibling.find('[placeholder="Page Name"]').textContent;
            var path = vp.dataset.fetch;
            var content = vp.innerHTML;
            console.log(693, {
                content
            });

            //PUSH
            var params = {
                message: 'Update "' + title + '" Page UI',
                repo: GET[1],
                owner: window.owner.login
            };
            var array = [{
                content,
                path
            }];
            try {
                console.log(2452, 'controller.merch.update', "array", {
                    array
                });
                await github.crud.update(params, array);
                ("/dashboard/:get/build/preview/:dir").router();
            } catch (e) {
                modal.alert({
                    body: "There was an error creating this product.",
                    submit: "OK",
                    title: "Catalog Error"
                })
            }
        }

    },

    catalog: {

        attribute: async (target) => {
            var attribute = target.find('input');
            var variations = target.nextElementSibling;
            if (attribute.value.length > 0) {
                variations.classList.remove('opacity-50pct');
            } else {
                variations.classList.add('opacity-50pct');
            }
        },

        category: async (target) => {
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
        },

        create: async (event) => {
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
            rows = Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
            var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                content: JSON.stringify([row], null, 4),
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
        },

        parent: async (event) => {
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
                rows = Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));

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
                }).then(() => {
                    "/dashboard/:get/merch/".router()
                    event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
                    event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
                }).catch(e => {
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                });

            }
        },

        step: (target) => {
            var form = target.closest('form');
            var step = target.closest('block > * > card');
            var index = step.index();
            var box = target.closest('box');
            var button = box.find('n');
            if (button) {
                var steps = target.closest('block').all('block > * > card');
                if (button.className === "gg-chevron-left") {
                    if (index === 1) {
                        step.setAttribute("css-display", "none")
                        steps[index - 1].setAttribute("css-display", "flex");
                    }
                    if (index === 2) {
                        step.setAttribute("css-display", "none")
                        steps[index - 1].setAttribute("css-display", "flex");
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
                            step.setAttribute("css-display", "none")
                            steps[index + 1].setAttribute("css-display", "flex");
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
                            step.setAttribute("css-display", "none")
                            steps[index + 1].setAttribute("css-display", "flex");
                        }
                    }
                }
            }

        },

        variation: async (target) => {
            var footer = target.closest('footer');
            var template = footer.find('template').content.firstElementChild.cloneNode(true);
            footer.insertAdjacentHTML('beforebegin', template.outerHTML);
        },

        variations: async (target) => {
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
        },

    },

    checkout: {
        toggle: (event) => {}
    },

    config: {

        branch: async(target) => {
            var button = target.closest('[data-tap] > text');
            if(button) {
                var span = button.find('span');
                var box = span.closest('box').nextElementSibling;
                var branch = '';
                var text = '';
                if(span.dataset.after) {
                    branch = text = span.dataset.after;
                    box.removeAttribute('css-display');
                } else {
                    text = 'None';
                    box.setAttribute('css-display', 'none');
                }
                $(button.parentNode.all('ico n')).attr('css-display', 'none');
                button.find('ico n').removeAttribute('css-display');
                var value = button.closest('column').previousElementSibling;
                branch.length > 0 ? value.find('ico').removeAttribute('css-display') : value.find('ico').setAttribute('css-display', 'none');
                value.find('text').textContent = text;
            }
                    
        },

        category: async (target) => {
            var categories = await ajax('raw/asset/json/category.json');
            var dropdown = target.closest('dropdown')
            var category = await modal.dropdown(dropdown, {
                other: true,
                rows: JSON.parse(categories)
            });
        },

        cname: async function(event) {

            var input = event.target;
            var value = input.value;
            if(value.length > 0) {
                if(input.dataset.cname === value) {
                    input.nextElementSibling.find('span').setAttribute('css-opacity', '50%');
                } else {
                    input.nextElementSibling.find('span').removeAttribute('css-opacity');                                
                }
            } else {
                input.nextElementSibling.find('span').setAttribute('css-opacity', '50%');
            }
                            
        },
            
        delete: async function() {
            var confirm = await modal.confirm({
                body: "Are you sure you want to delete this project",
                title: "Delete Project"
            }, ["No", "Yes"]);
            if(confirm) {
                console.log(window.owner.login, GET[1]);
                github.repos.delete({
                    owner: window.owner.login,
                    repo: GET[1]
                }, {
                    dataType: "DELETE"
                }).then(data => {
                    0 < 1 ? console.log(1074, {
                        data
                    }) : null;
                    '/dashboard/'.router();
                });
            }
        },

        deploy: async (event) => {
            event.preventDefault();
            var form = event.target;
            var branch = "";
            var path = "";
            if(!form.all('box')[2].getAttribute('css-display')) {
                branch = form.all('box')[1].find('text').textContent;
                path = form.all('box')[2].find('text').getAttribute('value');
            }
            console.log({
                branch,
                path
            });
            if(branch && path) {
                var create = await github.pages.crud({
                    owner: window.owner.login,
                    repo: GET[1]
                }, {
                    data: JSON.stringify({
                        build_type: "legacy",
                        source: {
                            branch,
                            path
                        }
                    }),
                    dataType: "POST"
                });
                console.log(1136, 'controller.config.deploy', {
                    create
                });
            }
        },

        details: async function(event) {
            event.preventDefault();
            var form = event.target;
            var name = form.find('[name="name"]').value;
            var description = form.find('[name="description"]').value;
            var categories = [];
            form.find('[name="categories"]').all('text').forEach(function(text) {
                var category = text.find('span').textContent;
                categories.push(category);
            });
            categories.sort();
            console.log({
                name,
                description,
                categories
            });
                
            var json = await github.repos.contents({
                owner: window.owner.login,
                repo: GET[1],
                path: "/site.webmanifest"
            }, {
                accept: "application/vnd.github.json"
            });
            var webmanifest = JSON.parse(atob(json.content));
            console.log({
                json,
                webmanifest
            });
            name ? webmanifest.name = name : null;
            description ? webmanifest.description = description : null;
            categories.length > 0 ? webmanifest.categories = categories : null;
                
            var update = 0 < 1 ? await github.repos.contents({
                owner: window.owner.login,
                repo: GET[1],
                path: "/site.webmanifest"
            }, {
                data: JSON.stringify({
                    message: "Update Webmanifest",
                    content: btoa(JSON.stringify(webmanifest, null, 4)),
                    sha: json.sha
                }),
                dataType: "PUT"
            }) : github.crud.update({
                message: "Update Webmanifest",
                repo: GET[1],
                owner: owner.login
            }, [{
                content: webmanifest,
                path: "site.webmanifest"
            }]);
            console.log({
                update,
                webmanifest
            });
        },

        domain: async(event) => {
                    
            event.preventDefault();
            var form = event.target;
            var submit = form.find('input[type="submit"]');
            if(!submit.nextElementSibling.getAttribute('css-opacity')) {
                var input = form.find('input[type="text"]');
                var value = input.value;
                if(value.length > 0) {
                    try {
                        var update = await github.pages.crud({
                            owner: window.owner.login,
                            repo: GET[1]
                        }, {
                            data: JSON.stringify({
                                cname: value
                            }),
                            dataType: "PUT"
                        });
                        console.log(1233, 'controller.config.deploy', {
                            update
                        });        
                    } catch(e) {
                        console.log(e);
                    }
                }
            }
                    
        },

        io: async(target) => {
            try {
                var remove = await github.pages.crud({
                    owner: window.owner.login,
                    repo: GET[1]
                }, {
                    data: JSON.stringify({
                        cname: null
                    }),
                    dataType: "PUT"
                });
                console.log(1136, 'controller.config.deploy', {
                    remove
                });          
            } catch(e) {
                console.log(e);
            }
                    
            var form = target.closest('form');
            var input = form.find('input[type="text"]');
            input.value = '';
        },

        path: async(target) => {
            var button = target.closest('[data-tap] > text');
            if(button) {
                var span = button.find('span');
                if(span) {
                    var path = span.textContent;
                    span.closest('column').previousElementSibling.find('text').setAttribute('value', span.getAttribute('value'));
                    span.closest('column').previousElementSibling.find('text').textContent = path;
                }
                $(button.parentNode.all('ico n')).attr('css-display', 'none');
                button.find('ico n').removeAttribute('css-display');
            }
                    
        },

        rebrand: async(event) => {
                    
            var target = event.target;
            var vp = target.closest('[data-page]');
            var data = await on.change.file(event);
            var brand = target.closest('box').previousElementSibling;
            var foreignObject = brand.find('foreignObject');
            console.log(1286, data);
                    
            ImageTracer.imageToSVG(data.result, (svgstr) => {
                //console.log(svgstr);
                foreignObject.innerHTML = svgstr;
                $(foreignObject).innerHTML = svgstr;
                var svg = foreignObject.firstElementChild;
                svg.setAttribute('class', 'height-100pct position-absolute top-0 width-100pct');
                $(vp.all('[data-value="favicon"]')).html(svgstr);
            }, {
                viewbox: true
            });
                    
        },

        shortname: async function(event) {

            event.preventDefault();
            var form = event.target;
            var submit = form.find('[data-submit]');
            var disabled = submit.parentNode.classList.contains('opacity-50pct');
            if (disabled === false) {
                var name = form.find('input[type="text"]').value;
                var update = await github.repos.update({
                    owner: window.owner.login,
                    repo: GET[1]
                }, {
                    data: JSON.stringify({
                        name
                    }),
                    dataType: "PATCH"
                });
                console.log(1074, {
                    update,
                    name
                });
                ("/dashboard/" + name + "/config").router();
            }

        },

        template: async (event) => {

            var checkbox = event.target;
            var checked = checkbox.checked;
            console.log(1082, {
                checkbox,
                checked
            });

            var ico = checkbox.closest('label').nextElementSibling.find('ico');
            ico.firstElementChild.setAttribute('css-display', 'flex');
            ico.lastElementChild.setAttribute('css-display', 'none');

            github.repos.update({
                owner: window.owner.login,
                repo: GET[1]
            }, {
                data: JSON.stringify({
                    is_template: checked
                }),
                dataType: "PATCH"
            }).then(update => {
                console.log(1074, {
                    update
                });
                ico.firstElementChild.setAttribute('css-display', 'none');
                ico.lastElementChild.setAttribute('css-display', 'flex');
            })

        },

        unbrand: (target) => {
            console.log(1346, target);
            var brand = target.closest('box').previousElementSibling;
            var svg = brand.find('svg');
            var icon = controller.setup.ico(svg);
            console.log(icon);
            download(icon);
        },

        visibility: async(target) => {
            var repository = await github.repos.get({
                owner: window.owner.login,
                repo: GET[1]
            });
            //console.log({repository});
            var visibility = repository.private ? 'public' : 'private';
            var confirm = await modal.confirm({
                body: "Are you sure you want to make this project " + visibility,
                title: "Change Visibility"
            }, ["No", "Yes"]);
            if(confirm) {
                github.repos.update({
                    owner: window.owner.login,
                    repo: GET[1]
                }, {
                    data: JSON.stringify({
                        visibility
                    }),
                    dataType: "PATCH"
                }).then(update => {
                    0 > 1 ? console.log(1074, {
                        update
                    }) : null;
                    target.closest('box').previousElementSibling.find('[name="visibility"]').textContent = visibility;
                });
            }
        }

    },

    connect: {
        remove: async(target) => {
            var gateway = target.closest('[data-value]').dataset.value.split('.')[1];
                
            try {
                    
                var file = await github.repos.contents({
                    owner: window.owner.login,
                    repo: GET[1],
                    path: '/raw/asset/json/stripe.json'
                });
                    
                var remove = await github.repos.contents({
                    owner: window.owner.login,
                    path: "raw/asset/json/stripe.json",
                    repo: GET[1]
                }, {
                    data: JSON.stringify({
                        message: "Remove Stripe Gateway",
                        sha: file.sha
                    }),
                    dataType: "DELETE"
                });
                    
                console.log(1599, remove);

                var box = target.closest('box');
                var column = box.parentNode;
                box.remove();
                var methods = column.children;
                console.log(methods, methods.length);
                if(methods.length === 0) {
                    column.closest('block').setAttribute('css-display', 'none');
                    column.closest('block').nextElementSibling.find('[data-value="stripe.connect"]').closest('box').removeAttribute('css-display');
                }
                    
            } catch (e) {
                console.log(1594, e, gateway);
            }
        },
        stripe: target => {
            var redirect_uri = window.location.protocol + '//' + global.domains.subdomain + '.' + global.domains.domain + '.' + global.domains.tld;
            var state = 'stripe_' + Crypto.uid.create(1);
            localStorage.redirect_uri = route.path;
            target.href = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" + stripe.oauth.client_id[stripe.config.livemode ? 'live' : 'test'] + "&redirect_uri=" + stripe.config.redirect_uri + "&scope=read_write&state=" + stripe.config.state;
        }
    },

    controls: {

        audio: event => {
            var node = event.target;
            var target = node.closest('[data-element]');
            if (target) {
                var audio = window.wavesurfer;
                var element = target.dataset.element;
                if (element === 'audio.play') {
                    if (audio.isPlaying()) {
                        target.find('n').className = 'gg-play-button';
                        audio.pause();
                    } else {
                        target.find('n').className = 'gg-play-pause';
                        audio.play();
                    }
                }
            }
        },

        video: event => {
            var node = event.target;
            var target = node.closest('[data-element]');
            if (target) {
                var video = target.closest('box').find('video') || target.closest('card').find('video') || target.closest('block').find('video');
                var element = target.dataset.element;
                if (element === 'video.play') {
                    if (video.paused) {
                        target.find('n').className = 'gg-play-pause';
                        video.play();
                    } else {
                        target.find('n').className = 'gg-play-button';
                        video.pause();
                    }
                }
                if (element === 'video.seeker') {
                    var rect = target.getBoundingClientRect();
                    var x = event.clientX - rect.left;
                    var width = rect.width;
                    var percent = x / width;
                    video.currentTime = video.duration * percent;
                }
            }
        }

    },

    design: {

        install: async (target) => {
            var user = await github.user.get();
            var card = target.closest('card');
            var full_name = card.dataset.full_name;
            var theme = card.find('box text').textContent;
            var owner = full_name.split('/')[0];
            var repo = full_name.split('/')[1];
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
                        owner: owner,
                        repo: repo
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
                            array = array.filter(branch => (branch.path !== "raw/files" && branch.path !== "raw/pages" && branch.path !== "raw/style"))
                            array = array.filter(branch => (branch.path.startsWith('raw/files') || branch.path.startsWith('raw/pages') || branch.path.startsWith('raw/style')))
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
                                        content: typeof content === 'object' ? JSON.stringify(content) : content,
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
                                }).catch(error => {
                                    console.log(2504, 'github.database.blobs', error);
                                });
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
                            owner: window.owner.login
                        };
                        console.log(2452, 'controller.posts.update', "array", {
                            array: sprout,
                            params
                        });
                        await github.crud.update(params, sprout);
                        ('/dashboard/' + GET[1] + '/build/er').router();
                    }

                }
            }
        }

    },

    files: {

        cancel: () => {
            dom.body.find('[data-page="/dashboard/*/files/file/"]').innerHTML = "";
            ("/dashboard/:get/files/").router();
        },

        clear: target => {
            var form = target.closest('form');
            form.find('[type="file"]').closest('label').innerHTML = form.find('[type="file"]').closest('label').innerHTML;
            form.children[1].find('column').innerHTML = "";
        },

        delete: async (slugs) => {
            //console.log(2443, slugs);

            try {
                var res = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/files"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (res.length > 0) {
                    var files = res.filter(function(obj) {
                        //console.log('posts', slugs, obj.slug, !slugs.includes(obj.slug));
                        return !slugs.includes(obj.name);
                    });
                    var deleted = res.filter(function(obj) {
                        //console.log('deleted', slugs, obj.slug, slugs.includes(obj.slug));
                        return slugs.includes(obj.name);
                    })
                }
            } catch (e) {
                console.log("error", {
                    e
                })
            }

            var titles = "";
            if (slugs.length > 1) {
                titles = slugs.length + " files";
            } else {
                titles = '"' + deleted[0].name + '"';
            }

            console.log(944, {
                slugs,
                titles,
                deleted,
                files,
                res
            });

            //PUSH
            if (0 < 1) {
                var params = {
                    message: "Delete " + titles + " from Files",
                    repo: GET[1],
                    owner: window.owner.login
                };
                var array = [];
                if (deleted.length > 0) {
                    var d = 0;
                    do {
                        var removed = deleted[d];
                        var arr = {
                            content: null,
                            path: removed.path
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
                ('/dashboard/:get/files/').router();
            }
        },

        deselect: target => {
            var box = target.closest('box');
            var name = box.find('[placeholder="filename.ext"]').textContent;
            var input = box.closest('form').children[0].find('[type="file"]');
            if (input.fileList && input.fileList.length > 0) {
                var f = 0;
                do {
                    var file = input.fileList[f];
                    if (file.name === name) {
                        input.fileList.splice(f, 1);
                        box.remove();
                    }
                    f++;
                } while (f < input.fileList.length);
            } else {
                box.remove();
            }
        },

        download: (target) => {
            var src = null;
            var element = target.closest('header').nextElementSibling.find('card > column > :not(.display-none)');
            if (element.find('img')) {
                src = {
                    download: GET[4],
                    href: element.find('img').src
                };
            } else if (element.find('textarea')) {
                src = {
                    download: GET[4],
                    href: blob(element.find('textarea').value)
                };
            }
            console.log(src);
            src ? download(src) : null;
        },

        file: () => {
            dom.body.find('[data-page="/dashboard/*/files/file/"]').innerHTML = "";
            ("/dashboard/:get/files/file/").router();
        },

        onchange: async (event) => {
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

            on.change.file(event).then(async (result) => {
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

                const aa = (e) => {
                    //('/dashboard/' + GET[1] + '/files/').router();
                    select.classList.add('display-none');
                    metadata.classList.remove('display-none');
                    metadata.find('text').textContent = name;
                    actions.classList.remove('display-none');
                    load.classList.add('display-none');
                    load.find('er').removeAttribute('style');
                }

                const bb = (e) => {
                    //('/dashboard/' + GET[1] + '/files/').router();
                    //select.classList.add('display-none');
                    //metadata.classList.remove('display-none');
                    //metadata.find('text').textContent = name;
                    //actions.classList.remove('display-none');
                    load.classList.add('display-none');
                    load.find('er').removeAttribute('style');
                }

                github.repos.contents(params, settings).then(aa).catch(bb);
            });

        },

        multiple: async (event) => {

            var target = window.select = event.target;
            var form = target.closest('form');
            var list = form.children[1].find('column');
            var template = form.children[1].find('template');

            target.fileList ? null : target.fileList = [];
            Array.from(target.files).forEach(function(file) {
                var exists = target.fileList.some(row => file.name === row.name);
                exists ? null : target.fileList.push(file);
            });

            if (target.fileList.length > 0) {
                list.innerHTML = "";
                var f = 0;
                do {
                    var elem = template.content.firstElementChild.cloneNode(true);
                    elem.find('[placeholder="filename.ext"]').textContent = target.fileList[f].name;
                    list.insertAdjacentHTML('beforeend', elem.outerHTML);
                    f++;
                } while (f < target.fileList.length);
            }

        },

        remove: target => {
            var column = target.closest('block').find('column');
            var checked = column.all(':checked');
            if (checked.length > 0) {
                var slugs = [];
                var c = 0;
                do {
                    var slug = rout.ed.dir(checked[c].closest('card').find('[placeholder="Filename"]').dataset.href).splice(4, 5)[0];
                    slugs.push(slug);
                    c++;
                } while (c < checked.length);
                controller.files.delete(slugs);
            }
        },

        select: async (target) => {
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.setAttribute("css-display", "flex")
            } else {
                footer.setAttribute("css-display", "none")
            }
            0 > 1 ? console.log({
                column,
                footer,
                row,
                selected
            }) : null;
        },

        selecting: e => {
            console.log({
                e
            });
            const input = e.srcElement;
            const load = input.closest('card').find('load');
            const loader = load.find('er');
            var percentLoaded = Math.round((e.loaded / e.total) * 100);
            load.classList.remove('display-none');
            loader.style.width = percentLoaded + "%";
        },

        upload: async (event) => {

            event.preventDefault();

            var form = event.target;
            var input = form.children[0].find('[type="file"]');

            window.files = [];
            //console.log(1165, input.fileList, input.fileList.length);
            if (input.fileList.length > 0) {
                var f = 0,
                    ff = 0;;
                do {
                    var reader = new FileReader();
                    reader.onloadend = (function(file) {
                        return function(evt) {
                            files.push({
                                data: evt.target.result.split(';base64,')[1],
                                name: file.name
                            });
                            if (files.length === input.fileList.length) {
                                push(files);
                            }
                            ff++;
                        }
                    })(input.fileList[f])
                    reader.readAsDataURL(input.fileList[f]);
                    //console.log(f, file);
                    f++;
                } while (f < input.fileList.length);
            }

            async function push(files) {

                var titles = "";
                if (files.length > 0) {
                    if (files.length > 1) {
                        titles = files.length + " uploads";
                    } else {
                        titles = '"' + files[0].name + '"';
                    }
                }

                console.log(2475, {
                    files,
                    titles
                });

                //PUSH
                if (0 < 1) {
                    var params = {
                        message: "Add " + titles + " to Files",
                        repo: GET[1],
                        owner: window.owner.login
                    };
                    var array = [];
                    if (files.length > 0) {
                        var f = 0;
                        do {
                            var file = files[f];
                            array.push({
                                content: file.data,
                                path: "raw/files/" + file.name,
                                type: "base64"
                            });
                            f++;
                        } while (f < files.length);
                    }
                    console.log(1168, 'controller.files.create', "array", {
                        array,
                        params
                    });
                    await github.crud.update(params, array);
                    ('/dashboard/:get/files/').router();
                }

            }

        }

    },

    login: {
        token: target => {
            var input = target.closest('ico').previousElementSibling;
            var token = input.value;
            console.log(token);
            if (token) {
                localStorage.setItem('githubAccessToken', token);
                'dashboard'.router();
            }
        }      
    },

    media: {
        delete: async (slugs) => {
            //console.log(2443, slugs);

            try {
                var res = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/media/media.json"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (res.length > 0) {
                    var media = res.filter(function(obj) {
                        //console.log('posts', slugs, obj.slug, !slugs.includes(obj.slug));
                        return !slugs.includes(obj.slug);
                    });
                    var deleted = res.filter(function(obj) {
                        //console.log('deleted', slugs, obj.slug, slugs.includes(obj.slug));
                        return slugs.includes(obj.slug);
                    })
                    var formats = {};
                    deleted.forEach(function(row) {
                        var format = formats[row.format];
                        format = format ? format : formats[row.format] = [];
                        format.push(row);
                    })
                    var tables = {};
                    var keys = Object.keys(formats);
                    if (keys.length > 0) {
                        var k = 0;
                        do {
                            var format = keys[k]
                            var json = await github.repos.contents({
                                owner: owner.login,
                                repo: GET[1],
                                path: "/raw/media/" + format + "/" + format + ".json"
                            }, {
                                accept: "application/vnd.github.raw",
                                cache: "reload"
                            });
                            tables[format] = json.filter(function(row) {
                                var exists = formats[format].some(f => JSON.stringify(f) === JSON.stringify(row));
                                0 > 1 ? console.log(1190, {
                                    format: formats[format],
                                    row,
                                    exists
                                }) : null;
                                return exists === false;
                            });
                            k++;
                        } while (k < keys.length)
                    }
                }
            } catch (e) {
                console.log("error", {
                    e
                })
            }

            var titles = "";
            if (slugs.length > 1) {
                titles = slugs.length + " uploads";
            } else {
                titles = '"' + deleted[0].title + '"';
            }

            console.log(2475, {
                slugs,
                titles,
                deleted,
                media,
                formats,
                tables,
                res
            });

            //PUSH
            if (0 < 1) {
                var params = {
                    message: "Delete " + titles + " from Media",
                    repo: GET[1],
                    owner: window.owner.login
                };
                var array = [{
                    content: JSON.stringify(media, null, 4),
                    path: "raw/media/media.json"
                }];
                //array = [];
                var keys = Object.keys(tables);
                if (keys.length > 0) {
                    var k = 0;
                    do {
                        var format = keys[k];
                        array.push({
                            content: JSON.stringify(tables[format], null, 4),
                            path: "raw/media/" + format + "/" + format + ".json"
                        })
                        k++;
                    } while (k < keys.length);
                }
                if (deleted.length > 0) {
                    var d = 0;
                    do {
                        var removed = deleted[d];
                        var id = removed.slug;
                        var arr = {
                            content: null,
                            path: "raw/media/" + removed.format + "/" + removed.slug
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
                ('/dashboard/:get/media/').router();
            }
        },

        import: async (b64) => {
            var split = b64.result.split(';base64,')
            var mime = split[0].split(':')[1];
            var type = mime.split('/')[0]
            if (["audio", "image", "video"].includes(type)) {
                type === "image" ? type = "photo" : null;
                GET.length > 4 ? null : await ('/dashboard/:get/media/' + type).router();
                //.then(()=>{
                var vp = dom.body.find('[data-page="/dashboard/*/media/' + type + '"]');
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
                    await controller.video.thumbs(video);
                }
                //});
            }
        },

        remove: target => {
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
                controller.media.delete(slugs);
            }
        },

        select: async (target) => {
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.setAttribute("css-display", "flex")
            } else {
                footer.setAttribute("css-display", "none")
            }
        },

        tags: event => {
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

        delete: async (slugs) => {
            //console.log(2443, slugs);

            try {
                var res = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/merch/merch.json"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (res.length > 0) {
                    var posts = [];
                    var deleted = [];
                    var all = [];
                    res.forEach(function(obj) {
                        //console.log('posts', slugs, obj.slug, !slugs.includes(obj.slug));
                        slugs.forEach((row) => {
                            if (rout.ed.dir(row).length === 1 && row === rout.ed.dir(obj.slug)[0]) {
                                //console.log(1187, 'delete', row, obj.slug, obj);
                                deleted.push(obj);
                            }
                            all.push(obj)
                        })
                    });
                    deleted = [...new Set(deleted)];
                    all = [...new Set(all)];
                    posts = all.filter(function(item) {
                        return !deleted.includes(item)
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
                all,
                deleted,
                posts,
                res
            });

            //PUSH
            if (0 < 1) {
                var params = {
                    message: "Delete " + titles + " from Merch",
                    repo: GET[1],
                    owner: window.owner.login
                };
                var array = [{
                    content: JSON.stringify(posts, null, 4),
                    path: "raw/merch/merch.json"
                }];
                //array = [];
                if (slugs.length > 0) {
                    var d = 0;
                    do {
                        var removed = slugs[d];
                        var id = removed.slug;
                        var arr = {
                            content: null,
                            path: "raw/merch/" + removed
                        };
                        array.push(arr);
                        d++;
                    } while (d < slugs.length);
                }
                console.log(1168, 'controller.merch.delete', "array", {
                    array,
                    params,
                    posts,
                });
                await github.crud.update(params, array);
                ('/dashboard/:get/merch/').router();
            }
        },

        remove: target => {
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
                controller.merch.delete(slugs);
            }
        },

        select: async (target) => {
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.setAttribute("css-display", "flex")
            } else {
                footer.setAttribute("css-display", "none")
            }
            0 > 1 ? console.log({
                column,
                footer,
                row,
                selected
            }) : null;
        }

    },

    product: {

        select: async (target) => {
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.setAttribute("css-display", "flex")
            } else {
                footer.setAttribute("css-display", "none")
            }
            console.log({
                column,
                footer,
                row,
                selected
            });
        },

        attribute: async (target) => {
            var attribute = target.find('input');
            var variations = target.nextElementSibling;
            if (attribute.value.length > 0) {
                variations.classList.remove('opacity-50pct');
            } else {
                variations.classList.add('opacity-50pct');
            }
        },

        attributes: async (target) => {
            var attributes = await modal.dropdown(target);
            var variations = target.nextElementSibling;
            console.log(attributes, variations, target.find('[placeholder]').textContent);
            if (target.find('[placeholder]').textContent.length > 0) {
                variations.classList.remove('opacity-50pct');
            } else {
                variations.classList.add('opacity-50pct');
            }
        },

        browsenode: async (target) => {
            var dropdown = await modal.dropdown(target.closest('dropdown'), {
                other: true
            });
            var step = target.closest('card');
            var category = step.find('[placeholder]').textContent;
        },

        category: async (target) => {
            var dropdown = await modal.dropdown(target.closest('dropdown'), {
                other: true
            });
            var step = target.closest('card');
            var category = step.find('[placeholder]').textContent;
        },

        create: async (event) => {
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
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                    var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                    //console.log(1225, exists, rows);
                    var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                    var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                    rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                    var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
        },

        delete: async (slug) => {
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
        },

        details: target => {
            var template = target.closest('footer').find('template').content.firstElementChild.cloneNode(true);
            target.closest('box').find('column').insertAdjacentHTML('beforeend', template.outerHTML);
        },

        matrix: target => {
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
        },

        features: event => {
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
        },

        quantity: target => {
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
        },

        ring: (target) => {
            var index = target.closest('box').index();
            var card = target.closest('card');
            var section = card.find('box > section');
            section.style.transform = "translateX(-" + index + "00%)";
        },

        thumb: async (event) => {
            var target = event.target;
            var card = target.closest('card');
            var section = card.find('box > section');
            var thumbnails = card.find('[data-columns]')
            var b64 = await on.change.file(event);

            var template = card.find('template').content.firstElementChild.cloneNode(true);
            var img = document.createElement('img');
            img.className = "height-100pct object-fit-cover position-absolute top-0 width-100pct";
            img.src = b64.result;
            template.dataset.tap = "controller.product.ring(target)";
            template.find('picture').innerHTML = img.outerHTML;
            thumbnails.lastElementChild.insertAdjacentHTML('beforebegin', template.outerHTML);

            var picture = document.createElement('picture');
            picture.className = "border-radius-20px display-inline-flex height-100pct overflow-hidden position-relative top-0 width-100pct";
            picture.appendChild(img);
            section.appendChild(picture);
            section.style.transform = "translateX(-" + section.lastElementChild.index() + "00%)";
        },

        traits: async (target) => {
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
                        values.push(name.toLowerCase().replaceAll('-', '') + "-" + value.toLowerCase().replaceAll('-', '').replaceAll(' ', '-'));
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
        },

        variation: async (target) => {
            var footer = target.closest('footer');
            var template = footer.find('template').content.firstElementChild.cloneNode(true);
            footer.insertAdjacentHTML('beforebegin', template.outerHTML);
        },

        variations: async (target) => {
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
        },

        pinky: (target) => {
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

        close: () => {

            const nav = dom.body.find('body > main nav');
            nav.getAttribute("css-dw960px-transform") = "translateX(0%)";
            nav.firstElementChild.classList.rRemove('display-none');

        },

        open: () => {

            const nav = dom.body.find('body > nav');
            nav.getAttribute("css-dw960px-transform") = "0";
            nav.firstElementChild.classList.remove('display-none');

        }

    },

    nav: {

        card: target => {
            var button = target.closest('ico');
            if (button && button.find('.gg-chevron-down')) {
                $(target.closest('card').parentNode.all('card > row + column')).attr('css-display', 'none');
                $(target.closest('nav > column').all('ico.transition-1s')).removeAttr('css-transform');

                var elem = target.closest('card > row');
                if (elem.nextElementSibling.getAttribute("css-display") === 'none') {
                    elem.nextElementSibling['removeAttribute']('css-display', 'none');
                    button.find('.gg-chevron-down').parentNode['setAttribute']('css-transform', 'rotate(180deg)');
                } else {
                    elem.nextElementSibling['setAttribute']('css-display', 'none');
                    button.find('.gg-chevron-down').parentNode['removeAttribute']('css-transform', 'none');
                }
            }
        },

        close: () => {

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = dom.body.find('main nav + pages');

            nav.setAttribute("css-transform", "translateX(-100%)");
            blocks.setAttribute("css-transform", "0");

            nav.getAttribute("css-dw960px-transform") = "translateX(-100%)";
            blocks.getAttribute("css-dw960px-transform") = "0";

        },

        hide: () => {

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = dom.body.find('main nav + pages');

            nav.setAttribute("css-transform", "translateX(-100%)");
            blocks.setAttribute("css-transform", "0");

            nav.setAttribute("css-dw960px-transform", "translateX(-100%)");
            blocks.setAttribute("css-dw960px-transform", "0");

            blocks.setAttribute("css-left", "0");
            blocks.setAttribute("css-dw960px-left", "0");

        },

        toggle: (target) => {

            const nav = document.body.find('body > main nav');
            const transform = nav.getAttribute("css-dw960px-transform");
            const blocks = dom.body.find('main nav + pages');
            const toggle = transform === "translateX(0)";

            if (toggle) {
                nav.setAttribute("css-transform", "translateX(-100%)");
                nav.setAttribute("css-dw960px-transform", "translateX(-100%)");

                blocks.setAttribute("css-left", "0");
                blocks.setAttribute("css-dw960px-left", "0");
            } else {
                nav.setAttribute("css-transform", "translateX(0)");
                nav.setAttribute("css-dw960px-transform", "translateX(0)");

                blocks.setAttribute("css-left", "320px");
                blocks.setAttribute("css-dw960px-left", "320px");
            }

        }

    },

    new: {
        app: async (target) => {
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
        },

        import: async (target) => {

            const user = await github.user.get();

            var el = target.closest('card').all('box')[1].find('text');
            var owner = el.dataset.owner;
            var repository = el.textContent;
            var private = el.nextElementSibling.getAttribute("css-display") === "flex";

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
                rows = Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.find(item => item.name === repository);
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
                }).then(() => {
                    ("/dashboard/" + repository + "/").router()
                }).catch(e => {
                    console.log(e);
                    0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                        body: "There was an error creating this page.",
                        submit: "OK",
                        title: "Error"
                    })) : null;
                }) : null;
            }
        }

    },

    pages: {

        create: async (event) => {

            event.preventDefault();

            var form = event.target;
            var postfix = form.find("[data-value='pages.slug']");
            var prefix = postfix.previousElementSibling;
            var slug = postfix.value === "index.html" ? prefix.value : rout.ed.url(rout.ed.dir(prefix.value.substring(0, prefix.value.length - 1) + (postfix.value ? "/" + postfix.value : "").toLowerCase()));
            var title = form.find("[data-value='pages.title']").value;
            var route = form.find("[data-value='pages.route']").value;
            var pages = form.find("[data-value='pages.pages']").checked;
            var main = !form.find("[data-value='pages.main']").checked;
            var visibility = form.find("[data-value='pages.visibility']").checked;

            var dir = [];
            rout.ed.dir(slug).forEach(function(o) {
                var name = o === "*" ? "_" : o;
                name ? dir.push(name) : null;
            })
            var page = 'page.' + dir.join('.') + (dir.length > 0 ? '.' : '') + 'html';

            var seo = {};
            var description = form.find("textarea[data-value='seo.description']").value;
            var seo_title = form.find("textarea[data-value='seo.title']").value;
            description && description.length > 0 ? seo.description = description : null;
            seo_title && seo_title.length > 0 ? seo.title = seo_title : null;
            var noindex = form.find("[data-value='seo.noindex']").checked;
            0 > 1 ? console.log({
                seo,
                desc: form.find("textarea[data-value='seo.description']"),
                description,
                seo_title,
                ttl: form.find("textarea[data-value='seo.title']")
            }) : null;

            var photo = form.find('[data-value="social.image"]').find('img') ? form.find('[data-value="social.image"]').find('img').src : null;
            var image = photo ? "image." + photo.split(';base64,')[0].split('/')[1] : null;

            var data = {};
            image ? data.image = image : null;
            data.main = main;
            data.noindex = noindex;
            data.page = page;
            data.pages = pages;
            data.popup = popup;
            Object.keys(seo).length > 0 ? data.seo = seo : null;
            data.slug = slug;
            data.title = title;
            data.visibility = visibility;

            var code = {
                css: vp.advanced.find('[data-value="advanced.css"]').value,
                js: vp.advanced.find('[data-value="advanced.js"]').value,
                html: vp.advanced.find('[data-value="advanced.html"]').value
            };
            var head = "";
            head += "<head>";
            head += "<style>" + code.css + "</style>";
            head += `<script type="text/javasript">` + code.js + "</script>";
            head += "</head>";
            var body = "<body>" + code.html + "</body>";
            var content = "<html>" + head + body + "</html>";

            0 > 1 ? console.log(2644, {
                data
            }) : null;
            if (0 < 1 && href.length > 0 && title.length > 0) {
                //JSON
                //var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
                var row = data;

                //MEDIA
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/pages/pages.json"
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
                var str1 = JSON.stringify(rows, null, 4);

                if (exists === true && GET.length === 4) {

                    alert("This page already exists");

                } else {

                    //PUSH
                    var params = {
                        message: 'Create "' + title + ' Page',
                        repo: GET[1],
                        owner: owner.login
                    };
                    var array = [{
                        content: str1,
                        path: "raw/pages/pages.json"
                    }, {
                        content,
                        path: "raw/pages/" + page
                    }, {
                        content,
                        path: "raw/pages" + (slug === "/" ? "" : slug.replace('*', '_')) + "/page.html"
                    }, {
                        content: JSON.stringify(row, null, 4),
                        path: "raw/pages" + (slug === "/" ? "" : slug.replace('*', '_')) + "/page.json"
                    }];
                    if (photo) {
                        if (photo.startsWith('data:')) {
                            array.push({
                                content: photo.split(';base64,')[1],
                                path: "raw/pages" + (slug === "/" ? "" : slug.replace('*', '_')) + "/" + image,
                                type: "base64"
                            });
                        }
                        var img = form.find('[data-value="social.preview"]');
                        if (img.dataset.filename !== "image") {
                            var filename = img.dataset.filename;
                            array.push({
                                content: null,
                                path: "raw/pages" + (slug === "/" ? "" : slug.replace('*', '_')) + "/" + filename,
                            });
                        }
                    } else {
                        var img = form.find('[data-value="social.preview"]');
                        if (img.dataset.filename) {
                            var filename = img.dataset.filename;
                            array.push({
                                content: null,
                                path: "raw/pages" + (slug === "/" ? "" : slug.replace('*', '_')) + "/image." + filename.split(';base64,')[0].split('.')[filename.split(';base64,')[0].split('.').length - 1],
                            });
                        }
                    }
                    console.log(2452, 'controller.pages.update', "array", {
                        array
                    });
                    await github.crud.update(params, array);
                    "/dashboard/:get/pages/".router();

                }
            } else {
                alert("You must supply a title.");
            }
        },

        delete: async (slugs) => {
            console.log(2443, slugs);

            try {
                var res = await github.repos.contents({
                    owner: owner.login,
                    repo: GET[1],
                    path: "/raw/pages/pages.json"
                }, {
                    accept: "application/vnd.github.raw",
                    cache: "reload"
                });
                if (res.length > 0) {
                    var pages = res.filter(function(obj) {
                        var dir = rout.ed.dir(obj.page);
                        var exists = slugs.some(e => JSON.stringify(e) === JSON.stringify(dir));
                        console.log('posts', {
                            slugs,
                            obj,
                            page: obj.page,
                            dir,
                            exists
                        });
                        return !exists;
                    });
                    var deleted = res.filter(function(obj) {
                        var dir = rout.ed.dir(obj.page);
                        var exists = slugs.some(e => JSON.stringify(e) === JSON.stringify(dir));
                        console.log('posts', {
                            slugs,
                            obj,
                            page: obj.page,
                            dir,
                            exists
                        });
                        return exists;
                    })
                    console.log({
                        pages,
                        deleted
                    });
                }
            } catch (e) {
                console.log("error", {
                    e
                })
            }

            var titles = "";
            if (slugs.length > 1) {
                titles = slugs.length + " pages";
            } else {
                deleted.length > 0 ? titles = '"' + deleted[0].title + '"' : null;
            }

            console.log(2475, {
                slugs,
                titles,
                deleted,
                pages,
                res
            });

            //PUSH
            if (0 < 1) {
                var params = {
                    message: "Delete " + titles + " from Pages",
                    repo: GET[1],
                    owner: window.owner.login
                };
                var array = [{
                    content: JSON.stringify(pages, null, 4),
                    path: "raw/pages/pages.json"
                }];
                //array = [];
                if (deleted.length > 0) {
                    var d = 0;
                    do {
                        var removed = deleted[d];
                        array.push({
                            content: null,
                            path: "raw/pages" + removed.slug.replace('*', '_') + '/page.html'
                        });
                        array.push({
                            content: null,
                            path: "raw/pages" + removed.slug.replace('*', '_') + '/page.json'
                        });
                        removed.image ? array.push({
                            content: null,
                            path: "raw/pages" + removed.slug.replace('*', '_') + '/' + removed.image
                        }) : null;
                        d++;
                    } while (d < deleted.length);
                }
                console.log(1168, 'controller.posts.delete', "array", {
                    array,
                    params
                });
                await github.crud.update(params, array);
                ('/dashboard/:get/pages/').router();
            }
        },

        image: async function(event) {
            var input = event.target;
            var file = await on.change.file(event);

            var img = document.createElement('img');
            img.className = 'height-100pct object-fit-cover position-absolute top-0 width-100pct';
            img.src = file.result;
            $(event.target.closest('block').all('picture[data-value]')).html(img.outerHTML);

            var img = document.createElement('img');
            img.className = 'height-100pct object-fit-contain position-absolute top-0 width-100pct';
            img.src = file.result;
            $(event.target.closest('box').find('picture[data-value]')).html(img.outerHTML);

            input.insertAdjacentHTML('beforebegin', input.outerHTML);
            input.remove();
            console.log(event, file);
        },

        remove: target => {
            var column = target.closest('block').find('column');
            var checked = column.all(':checked');
            if (checked.length > 0) {
                var slugs = [];
                var c = 0;
                do {
                    var href = checked[c].closest('row').find('[placeholder="Page URL"]').closest('box').dataset.href;
                    var dir = rout.ed.dir(href)
                    var slug = dir.splice(4, dir.length);
                    slugs.push(slug);
                    c++;
                } while (c < checked.length);
                controller.pages.delete(slugs);
            }
        },

        select: async (target) => {
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.setAttribute("css-display", "flex")
            } else {
                footer.setAttribute("css-display", "none")
            }
        },

        seo: target => {
            var characters = target.value.length;
            var maxlength = parseInt(target.closest('box').find('[data-maxlength]').dataset.maxlength);
            on.key.up.auto.size(event.target);
            target.closest('box').find('[data-maxlength]').textContent = maxlength - characters;
            var value = target.closest('box').find('[data-after]').dataset.after;
            var preview = target.closest('block').find('[data-value="seo.' + value + '"]');
            var social = target.closest('form').find('[data-page="/dashboard/*/pages/social"] [data-value="social.' + value + '"]');
            if (target.value.length > 0) {
                social.textContent = preview.textContent = target.value;
            } else {
                var el = target.closest('form').find('[data-value="pages.' + value + '"]');
                social.textContent = preview.textContent = (el ? el : target).value;
            }
        },

        title: event => {
            if (event.type === "keydown") {
                if (event.keyCode === 13) {
                    event.preventDefault();
                }
            }
            if (event.type === "keyup") {
                event.target.closest('form').find('[data-value="social.title"]').textContent = event.target.value;
                event.target.closest('form').find('[data-value="seo.title"]').textContent = event.target.value;
            }
        }

    },

    photo: {

        clear: target => {
            var box = target.closest('box');
            box.firstElementChild.innerHTML = '';
            var input = box.find('input');
            input.insertAdjacentHTML('beforebegin', input.outerHTML);
            input.remove();
        },

        create: async (event) => {
            event.preventDefault();
            var form = event.target;
            var description = form.find("textarea").value;
            var photos = form.find('figure').children;
            var photo = photos.length > 0 ? photos[0] : null;
            var src = photo ? photo.src : null;
            var filename = photo ? photo.dataset.filename : null;
            var tags = [];
            var keywords = form.find('[data-value="photo.tags"]').all('text');
            if (keywords.length > 0) {
                var k = 0;
                do {
                    var child = keywords[k];
                    var tag = child.find('span').textContent;
                    tags.push(tag);
                    k++;
                } while (k < keywords.length)
            }
            var title = form.find('input[type="text"]').value;
            var data = {
                description,
                photo,
                tags,
                title
            };
            console.log(2001, {
                data
            });
            if (0 < 1 && photos.length > 0 && title) {
                //JSON
                var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
                var row = {
                    format: "photo",
                    slug,
                    title
                };
                description ? row.description = description : null;
                tags ? row.tags = tags : null;

                //MEDIA
                try {
                    var data = await github.repos.contents({
                        owner: owner.login,
                        repo: GET[1],
                        path: "/raw/media/media.json"
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                    content: JSON.stringify(row, null, 4),
                    path: "raw/media/photo/" + slug + "/photo.json"
                }];
                photo.src.startsWith('data:') ? array.push({
                    content: photo.src.split(';base64,')[1],
                    path: "raw/media/photo/" + slug + "/image." + filename.split('.')[filename.split('.').length - 1],
                    type: "base64"
                }) : null;
                console.log(2452, 'controller.photo.update', "array", {
                    array
                });
                github.crud.update(params, array).then(() => {
                    "/dashboard/:get/media/".router()
                })
            }
        }

    },

    posts: {

        create: async (event) => {
            event.preventDefault();

            var form = event.target;

            var image = form.find('[type="file"]').closest("card").firstElementChild.find('img') ? form.find('[type="file"]').closest("card").firstElementChild.find('img').src : null;
            var title = form.find('[data-after="Title"]').closest('box').find('textarea').value;
            var slug = title.replaceAll(/[^\w ]/g, "").replaceAll(' ', '-').toLowerCase();
            var description = form.find('[data-after="Description"]').closest('box').find('textarea').value.length > 0 ? form.find('[data-after="Description"]').closest('box').find('textarea').value : null;
            var body = form.find('[contenteditable]').innerHTML.length > 0 ? form.find('[contenteditable]').innerHTML : "";

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
                rows = Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
        },

        delete: async (slugs) => {
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
        },

        read: async () => {

            var user = await github.user.get();
            var feed = byId('feed-dashboard-posts');
            var vp = dom.body.find('page[data-page="/dashboard/*/merch"]');
            //alert("Attempting to fetch files");
            github.repos.contents({
                owner: user.login,
                path: "/raw/posts/posts.json",
                repo: GET[1]
            }, {
                accept: "application/vnd.github.raw"
            }).then(data => {
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

            })

        },

        update: async (event) => {
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
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
                inc ? null : json.push(row);
            } catch (e) {
                var j = [];
                var json = [row];
            }
            rows = Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
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
        },

        reader: async (shortname) => {

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

            github.repos.contents(params, settings).then(data => {
                const content = data.content;
                const raw = atob(content);
                const json = JSON.parse(raw);
                console.log(282, {
                    data,
                    raw,
                    json
                });

                var vp = dom.body.find('page[data-page="/dashboard/*/posts"]');
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
            }).catch(async (error) => {
                console.log("43.error", {
                    error
                });
            });

        },

        remove: target => {
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
        },

        image: async (event) => {
            var reader = await on.change.file(event);
            var card = event.target.closest('card');
            var img = document.createElement('img');
            img.className = "height-100pct object-fit-cover position-absolute width-100pct";
            img.src = reader.result;
            card.firstElementChild.innerHTML = img.outerHTML;
            console.log({
                reader
            });
        },

        select: async (target) => {
            var column = target.closest('column')
            var row = target.closest('card');
            var selected = column.all(':checked');
            var footer = column.parentNode.lastElementChild;
            if (selected.length > 0) {
                footer.setAttribute("css-display", "flex")
            } else {
                footer.setAttribute("css-display", "none")
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

        app: async (event) => {

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
                var s = async (data) => {
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
                var ss = () => {
                    steps[0].find('card').innerHTML = "";
                }
                1 > 0 ? github.repos.generate(params, settings).then(s).catch(ss) : null;
            }
        },

        background: async (target) => {
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
        },

        icon: data => {

            //var files = event.target.files
            ImageTracer.imageToSVG(data.result, (svgstr) => {
                //console.log(svgstr);
                byId('new-app-icon').find('foreignObject').innerHTML = svgstr;
                var svg = byId('new-app-icon').find('foreignObject').firstElementChild;
                svg.classList.add('height-100pct');
                svg.classList.add('width-100pct');
            }, {
                viewbox: true
            })

        },

        ico: (el) => {
            var xml = new XMLSerializer().serializeToString(el);
            return obj = {
                download: GET[1] + ".svg",
                href: "data:image/svg;base64," + btoa(xml)
            };
        },

        iro: (color, sel) => {
            sel = sel ? sel : "iro-setup-about-brand";
            var el = byId(sel);
            el.innerHTML = "";
            //picture.find('rect').fill = color; 
            var icon = byId('new-app-icon');
            //icon.find('n').textContent = icon.closest('form').find('block').children[1].find('input').value.charAt(0);

            byId('color-data-hex') ? byId('color-data-hex').all('text')[1].find('span').textContent = color : null;

            if (el.innerHTML === "") {
                var icon = byId('new-app-icon');
                var width = el.clientWidth - 0;
                var box = 1 < 0;
                console.log("controller.setup.iro");
                window.picker = new iro.ColorPicker("#" + sel, {
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
                    byId("color-data-hex") ? byId("color-data-hex").all('text')[1].find('span').textContent = hexString : null;
                    byId("color-data-rgb") ? byId("color-data-rgb").all('text')[1].find('span').textContent = rgbString : null;
                    byId("color-data-hsl") ? byId("color-data-hsl").all('text')[1].find('span').textContent = hslString : null;
                    icon ? icon.find('rect').setAttribute('fill', hexString) : null;
                    //icon.style.backgroundColor = hexString;
                    //icon.style.color = colors.contrast(hexString);
                }

                function reSize() {
                    var size = dom.body.clientWidth > 570 ? 480 : dom.body.clientWidth - 90;
                    size = el.clientWidth;
                    picker.resize(size);
                    var img = icon ? icon.find('picture img') : null;
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
                        img = icon ? icon.find('picture foreignObject') : null;
                    }
                }
            }
        },

        colorPicker: (el, options) => {
            console.log(el);
            el.innerHTML = "";

            var id = el.dataset.iro;
            var color = options && options.color ? options.color : '#ffffff';

            //picture.find('rect').fill = color; 
            //icon.find('n').textContent = icon.closest('form').find('block').children[1].find('input').value.charAt(0);                

            byId('color-data-hex') ? byId('color-data-hex').all('text')[1].find('span').textContent = color : null;

            if (el.innerHTML === "") {
                var icon = el.find('svg');
                var width = el.clientWidth - 0;
                var box = 1 < 0;
                console.log("controller.setup.iro");
                window.picker = new iro.ColorPicker(el, {
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
                    var icon = byId(el.dataset.iro);
                    var hexString = color.hexString;
                    var rgb = color.rgba;
                    var rgbString = rgb.r + "," + rgb.g + "," + rgb.b;
                    var hsl = color.hsla;
                    var hslString = hsl.h + "," + hsl.s + "%," + hsl.l + "%";
                    var iro = event.srcElement && event.srcElement.closest('color') ? event.srcElement.closest('color').nextElementSibling : null;
                    if (iro) {
                        iro.find("#color-data-hex").all('text')[1].find('span').textContent = hexString;
                        iro.find("#color-data-rgb").all('text')[1].find('span').textContent = rgbString;
                        iro.find("#color-data-hsl").all('text')[1].find('span').textContent = hslString;
                    }
                    icon.find('rect').setAttribute('fill', hexString);
                    //icon.style.backgroundColor = hexString;
                    var fg = colors.contrast(hexString);
                    console.log({icon, hexString, fg})
                    icon.setAttribute('css-color', fg);
                    $(icon.all('path')).attr('fill', fg)
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
                    byId("color-data-hex") ? byId("color-data-hex").all('text')[1].find('span').textContent = hexString : null;
                    byId("color-data-rgb") ? byId("color-data-rgb").all('text')[1].find('span').textContent = rgbString : null;
                    byId("color-data-hsl") ? byId("color-data-hsl").all('text')[1].find('span').textContent = hslString : null;
                    icon ? icon.find('rect').setAttribute('fill', hexString) : null;
                    //icon.style.backgroundColor = hexString;
                    //icon.style.color = colors.contrast(hexString);
                }

                function reSize() {
                    var size = dom.body.clientWidth > 570 ? 480 : dom.body.clientWidth - 90;
                    size = el.clientWidth;
                    picker.resize(size);
                    var img = icon ? icon.find('picture img') : null;
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
                        img = icon ? icon.find('picture foreignObject') : null;
                    }
                }
            }
        },

        load: (target) => {
            var button = target.closest('box > *').find('ico n');
            if (button.className === "gg-software-upload") { //alert('Import File');
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
                })()
            }
        },

        scale: (event) => {
            var target = event.target;
            var value = target.value;
            var foreignObject = target.closest('box').parentNode.firstElementChild.find('foreignObject');
            var svg = foreignObject.find('svg');
            var wh = svg.closest('picture > svg').getAttribute('viewBox').split(' ');
            var height = wh[wh.length - 1];
            var width = wh[wh.length - 2];
            0 > 1 ? console.log("controller.setup.scale", {
                foreignObject,
                value,
                height,
                h: (value/100)
            }) : null;
            var w = Math.round(height * (value/100));
            var h = Math.round(height * (value/100));
            var x = (width - w) / 2;
            var y = (height - h) / 2;
            foreignObject.setAttribute('x', x);
            foreignObject.setAttribute('y', y);
            foreignObject.setAttribute('height', h);
            foreignObject.setAttribute('width', w);
            svg.setAttribute('height', Math.round(height * (value/100)));
            svg.setAttribute('width', Math.round(width * (value/100)));
            //svg.style.transform = "translate(calc((100% - " + value + "%)/2), calc((100% - " + value + "%)/2))";
            target.previousElementSibling.lastElementChild.textContent = value;
        },

        step: async (target) => {
            var form = target.closest('form');
            var step = target.closest('block > *');
            var index = step.index();
            var button = target.closest('box').find('n');
            if (button) {
                var steps = target.closest('block').all('block > *');
                if (button.className === "gg-chevron-left") {
                    if (index === 1) {
                        $(form.all('block > *')).addClass('display-none');
                        $(form.all('form > header box flex')).attr("css-height", "30px");
                        $(form.all('form > header box flex')).attr("css-width", "30px");
                        $(form.all('form > header box flex')[0]).attr("css-height", "50px");
                        $(form.all('form > header box flex')[0]).attr("css-width", "50px");
                        $(form.all('block > *')[0]).removeClass('display-none');
                    }
                    if (index === 2) {
                        $(form.all('block > *')).addClass('display-none');
                        $(form.all('form > header box flex')).attr("css-height", "30px");
                        $(form.all('form > header box flex')).attr("css-width", "30px");
                        $(form.all('form > header box flex')[1]).attr("css-height", "50px");
                        $(form.all('form > header box flex')[1]).attr("css-width", "50px");
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
                                $(form.all('form > header box flex')).attr("css-height", "30px");
                                $(form.all('form > header box flex')).attr("css-width", "30px");
                                $(form.all('form > header box flex')[1]).attr("css-height", "50px");
                                $(form.all('form > header box flex')[1]).attr("css-width", "50px");
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
                                }).then(async (data) => {
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
                                        $(form.all('form > header box flex')).attr("css-height", "30px");
                                        $(form.all('form > header box flex')).attr("css-width", "30px");
                                        $(form.all('form > header box flex')[1]).attr("css-height", "50px");
                                        $(form.all('form > header box flex')[1]).attr("css-width", "50px");
                                        $(form.all('block > *')[1]).removeClass('display-none');
                                        controller.setup.iro('#' + colors.random());
                                    }) : null;
                                });
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
                            $(form.all('form > header box flex')).attr("css-height", "30px");
                            $(form.all('form > header box flex')).attr("css-width", "30px");
                            $(form.all('form > header box flex')[1]).attr("css-height", "50px");
                            $(form.all('form > header box flex')[1]).attr("css-width", "50px");
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
                        }).then(async (data) => {
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
                        }).catch(() => {
                            console.log(1792, {
                                file
                            });
                            createIcon(file);
                        })

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
                                $(form.all('form > header box flex')).attr("css-height", "30px");
                                $(form.all('form > header box flex')).attr("css-width", "30px");
                                $(form.all('form > header box flex')[2]).attr("css-height", "50px");
                                $(form.all('form > header box flex')[2]).attr("css-width", "50px");
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
                                }).then(async (data) => {
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
                                });

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
        },

        webmanifest: async (event) => {
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

        clear: target => {
            var box = target.closest('box');
            box.firstElementChild.innerHTML = '';
            var input = box.find('input');
            input.insertAdjacentHTML('beforebegin', input.outerHTML);
            input.remove();
            var thumbnails = $(box.closest('form').all('card')[1].all('box')[0].all('figure picture'));
            thumbnails.html('');
        },

        create: async (event) => {

            event.preventDefault();
            var form = event.target;
            var description = form.find("textarea").value;
            var photos = form.find('figure').children;
            var photo = video = photos.length > 0 ? photos[0] : null;
            var src = photo ? photo.src : null;
            var filename = photo ? photo.dataset.filename : null;
            var tags = [];
            var keywords = form.find('[data-value="video.tags"]').all('text');
            if (keywords.length > 0) {
                var k = 0;
                do {
                    var child = keywords[k];
                    var tag = child.find('span').textContent;
                    tags.push(tag);
                    k++;
                } while (k < keywords.length)
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
                tags ? row.tags = tags : null;
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                rows = 0 > 1 ? json : Array.from(new Set(json.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                var inc = j.some(item => (JSON.stringify(item) === JSON.stringify(row)));
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
                    content: str3,
                    path: "raw/media/video/" + slug + "/video.json"
                }];

                //var thumbnails = form.all('card')[0].all('box')[1].all('img');
                //if (thumbnails.length > 0) {
                form.all('card')[1].all('box')[0].all('img.outline-4px-solid')[0].src.startsWith('data:') ? array.push({
                    content: form.all('card')[1].all('box')[0].all('img.outline-4px-solid')[0].src.split(';base64,')[1],
                    path: "raw/media/video/" + slug + "/image.jpg",
                    type: "base64"
                }) : null;
                //}

                photo.src.startsWith('data:') ? array.push({
                    content: photo.src.split(';base64,')[1],
                    path: "raw/media/video/" + slug + "/video." + filename.split('.')[filename.split('.').length - 1],
                    type: "base64"
                }) : null;

                console.log(2452, 'controller.video.update', "array", {
                    array,
                    video: {
                        width: video.videoWidth,
                        height: video.videoHeight
                    }
                });
                await github.crud.update(params, array);
                "/dashboard/:get/media/".router();
            }

        },

        ontimeupdate: event => {
            var video = event.target;
            var elapsed = video.currentTime;
            var duration = video.duration;
            var width = (elapsed / duration) * 100;
            var seeker = video.closest('box').find('[data-element="video.seeker"]');
            seeker.find('line').style.width = width + '%';
            var time = video.closest('box').find('[data-element="video.time"]').all('span')[0].textContent = format(elapsed);
            var time = video.closest('box').find('[data-element="video.time"]').all('span')[2].textContent = format(duration);

            function format(s) {
                var m = Math.floor(s / 60);
                m = (m >= 10) ? m : "0" + m;
                s = Math.floor(s % 60);
                s = (s >= 10) ? s : "0" + s;
                return m + ":" + s;
            }
        },

        poster: target => {
            $(target.closest('column').all('img')).removeClass('outline-4px-solid').removeClass('outline-color-005cc8').removeClass('outline-offset-minus-2px');
            target.closest('img') ? $(target.closest('img')).addClass('outline-4px-solid').addClass('outline-color-005cc8').addClass('outline-offset-minus-2px') : null;
        },

        thumbs: (video) => {

            return new Promise(async function(resolve, reject) {

                var canvas = video.closest('box').find('canvas');
                var form = video.closest('form');
                var thumbs = form.all('card')[1].all('box')[0].all('figure picture');
                console.log(thumbs)
                var i = 0;
                var t = 0;

                video.addEventListener('loadedmetadata', function() {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    video.classList.add('display-none');
                    this.currentTime = i;
                });
                video.addEventListener('seeked', seeking, true);

                function seeking() {
                    var x = thumbs.length > 1 ? (this.duration / (thumbs.length + 1)) * t : (this.duration / thumbs.length + 1);
                    generateThumbnail(i);
                    console.log('seeking', {
                        i,
                        x
                    }, (video.duration / (thumbs.length + 1)));
                    i += x;
                    if (i <= this.duration) {
                        this.currentTime = i;
                    } else {
                        this.classList.remove('display-none');
                        this.removeEventListener("seeked", seeking, true);
                        this.currentTime = 0;
                        resolve(this);
                    }
                }

                function generateThumbnail(i) {
                    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    var img = document.createElement('img');
                    img.className = "border-radius-20px height-100pct left-0 object-fit-cover position-absolute top-0 width-100pct";
                    img.src = canvas.toDataURL();
                    thumbs[t].innerHTML = img.outerHTML;
                    console.log(i, t);
                    t++;
                }

            });

        },

        thumbnail: async (event) => {

            var target = event.target;
            var file = await on.change.file(event);

            var img = document.createElement('img');
            img.className = "border-radius-10px height-100pct left-0 object-fit-cover position-absolute top-0 width-100pct"
            img.src = file.result;
            target.closest('figure').find('picture').innerHTML = img.outerHTML;

        }
    },

    wysiwyg: {

        caret: (node, pos) => {

            var sel = document.getSelection();
            let range = new Range();
            range.setStart(node, pos);
            range.setEnd(node, pos);
            sel.removeAllRanges();
            sel.addRange(range);

        },

        command: (target) => {
            const wysiwyg = target.closest('box').find('[contenteditable]');
            var button = target.closest('[data-command]');
            const command = button ? button.dataset.command : null;

            if (command) {

                //console.log(command)

                window.selected = window.getSelection();
                if (command === "deselect" && window.selected.rangeCount > 0) {
                    window.range = window.selected.getRangeAt(0);
                    window.selected.removeAllRanges();
                    console.log({
                        selected,
                        range
                    });
                }

                var value = button.dataset.value ? button.dataset.value : (target.closest('[data-value]') ? target.closest('[data-value]').dataset.value : null);
                if (value) {

                    if (["fontName"].includes(command)) {
                        wysiwyg === document.activeElement ? null : wysiwyg.focus();
                        console.log(command, value);
                        if (window.range) {
                            //wysiwyg.focus();
                            window.selected.removeAllRanges();
                            window.selected.addRange(window.range);
                        }
                        //document.execCommand('insertHTML', false, span.outerHTML);
                        document.execCommand('fontName', false, value);
                        //node.removeAttribute('size');
                        //node.style.fontSize = value;

                        if (window.selected && window.range) {
                            window.selected = null;
                            window.range = null;
                        }
                    } else if (["foreColor", "hiliteColor"].includes(command)) {

                        if (window.range) {
                            //wysiwyg.focus();
                            window.selected.removeAllRanges();
                            window.selected.addRange(window.range);
                        }
                        document.execCommand(command, null, value)
                        window.range = null;
                        window.selected = null;

                    } else if (command === "fontSize") {

                        wysiwyg === document.activeElement ? null : wysiwyg.focus();
                        console.log(command, value);
                        if (window.range) {
                            //wysiwyg.focus();
                            window.selected.removeAllRanges();
                            window.selected.addRange(window.range);
                        }
                        //document.execCommand('insertHTML', false, span.outerHTML);
                        document.execCommand('fontSize', false, "7");

                        var fontElements = wysiwyg.getElementsByTagName("font");
                        for (var i = 0, len = fontElements.length; i < len; ++i) {
                            if (fontElements[i].size == "7") {
                                fontElements[i].removeAttribute("size");
                                fontElements[i].setAttribute('size', value + "px");
                            }
                        }
                        //node.removeAttribute('size');
                        //node.style.fontSize = value;

                        if (window.selected && window.range) {
                            window.selected = null;
                            window.range = null;
                        }

                    } else if (command === "paragraphFormat") {

                        var node = controller.wysiwyg.node();
                        var sel = document.getSelection();
                        var aos = sel.anchorOffset;
                        var fne = sel.focusNode;
                        var pos = sel.focusOffset;

                        var parent = node.closest('p, h1, h2, h3, h4, h5, h6, wysiwyg > *');
                        var el = document.createElement(value);
                        if (parent) {
                            el.innerHTML = parent.innerHTML;
                            parent.replaceWith(el);
                            var idx = Array.from(parent.childNodes).indexOf(fne);
                            var nnd = el.childNodes[idx];
                            0 < 1 ? console.log(4480, {
                                node,
                                nnd,
                                idx
                            }, {
                                aos,
                                fne,
                                pos
                            }) : null;
                            controller.wysiwyg.caret(nnd, pos);
                            //el.innerHTML = parent.innerHTML;
                            //console.log(sel, el, fn, pos);
                            //controller.wysiwyg.caret(el, pos);
                        } else {
                            el.innerHTML = node.innerHTML;
                            node.parentNode.innerHTML = el.outerHTML;
                        }

                    } else if (command === "quote") {

                        var node = controller.wysiwyg.node();
                        console.log(command, value);

                        var parent = node.closest('blockquote, tab, p, h1, h2, h3, h4, h5, h6');
                        if (parent) {
                            var sel = document.getSelection();
                            var pos = sel.focusOffset;
                            var fne = sel.focusNode;
                            var idx = Array.from(parent.childNodes).indexOf(fne);
                            var nnd = parent.childNodes[idx];

                            if (value === "increase") {
                                var tab = document.createElement('blockquote');
                                tab.innerHTML = node.innerHTML;
                                parent.innerHTML = tab.outerHTML;
                                controller.wysiwyg.caret(parent.find('blockquote').childNodes[idx], pos);
                            } else if (value === "decrease") {
                                var tab = node.closest('blockquote');
                                var mother = tab ? tab.parentNode : null;
                                if (mother) {
                                    mother.innerHTML = tab.innerHTML;
                                    controller.wysiwyg.caret(mother.childNodes[idx], pos);
                                }
                            }
                        }

                    } else if (command === "inlineStyle") {

                        console.log(command, value);
                        var span = document.createElement('span');
                        span.innerHTML = document.getSelection();
                        span.style = value;
                        document.execCommand('insertHTML', false, span.outerHTML);

                    } else if (["insertOrderedList", "insertUnorderedList"].includes(command)) {

                        var el = window.getSelection().focusNode.parentNode;
                        var ul = el.closest('ol, ul');
                        var tagName = el.tagName.toLowerCase();
                        if (ul) {
                            value === "default" ? ul.removeAttribute('style') : ul.style.listStyleType = value;
                        } else {
                            document.execCommand(command, false, value);
                        }

                    } else if (command === "lineHeight") {

                        var node = controller.wysiwyg.node();
                        var sel = getSelection();

                        if (value === "lineHeight") {
                            node.style.lineHeight = null;
                        } else {
                            node.style.lineHeight = value;
                        }
                        console.log(4551, {
                            node,
                            sel,
                            value
                        });

                    }

                } else {

                    if (["bold", "fontName", "italic", "justifyCenter", "justifyFull", "justifyLeft", "justifyRight", "insertHorizontalRule", "insertOrderedList", "redo", "removeFormat", "selectAll", "strikethrough", "subscript", "superscript", "underline", "undo", "insertUnorderedList"].includes(command)) {
                        wysiwyg === document.activeElement ? null : wysiwyg.focus();
                        console.log(command, value);
                        if (window.range) {
                            //wysiwyg.focus();
                            window.selected.removeAllRanges();
                            window.selected.addRange(window.range);
                        }
                        document.execCommand(command, false, '');

                        if (window.selected && window.range) {
                            window.selected = null;
                            window.range = null;
                        }
                    } else if (["clear"].includes(command)) {

                        document.execCommand('selectAll', false, null);
                        document.execCommand("insertHTML", false, "<p><br></p>");

                    } else if (["fullscreen"].includes(command)) {

                        fullscreen(event.target.closest('box'));

                    } else if (["help"].includes(command)) {

                        ajax('raw/asset/html/template/template.wysiwyg.help.html').then(function(html) {
                            modal.popup(html);
                        })

                    } else if (["indent", "outdent"].includes(command)) {
                        var node = controller.wysiwyg.node();
                        var ou = node.closest('ol, ul');
                        if (ou) {
                            wysiwyg === document.activeElement ? null : wysiwyg.focus();
                            console.log(command, value);

                            if (window.range) {
                                //wysiwyg.focus();
                                window.selected.removeAllRanges();
                                window.selected.addRange(window.range);
                            }
                            document.execCommand(command, false, value);

                            if (window.selected && window.range) {
                                window.selected = null;
                                window.range = null;
                            }
                        } else {
                            var parent = node.closest('blockquote, tab, p, h1, h2, h3, h4, h5, h6');
                            if (parent) {
                                var sel = document.getSelection();
                                var pos = sel.focusOffset;
                                var fne = sel.focusNode;
                                var idx = Array.from(parent.childNodes).indexOf(fne);
                                var nnd = parent.childNodes[idx];

                                if (command === "indent") {
                                    var tab = document.createElement('tab');
                                    tab.innerHTML = node.innerHTML;
                                    parent.innerHTML = tab.outerHTML;
                                    controller.wysiwyg.caret(parent.find('tab').childNodes[idx], pos);
                                } else if (command === "outdent") {
                                    var tab = node.closest('tab');
                                    var mother = tab ? tab.parentNode : null;
                                    if (mother) {
                                        mother.innerHTML = tab.innerHTML;
                                        controller.wysiwyg.caret(mother.childNodes[idx], pos);
                                    }
                                }
                            }
                        }
                    } else if (["inserthref"].includes(command)) {
                        if (window.range) {
                            //wysiwyg.focus();
                            window.selected.removeAllRanges();
                            window.selected.addRange(window.range);
                        }

                        var row = target.closest('row');
                        var href = row.all('input[type="text"]')[0].value;
                        var text = row.all('input[type="text"]')[1].value;
                        var blank = row.find('input[type="checkbox"]').checked;
                        0 < 1 ? console.log({
                            href,
                            text,
                            blank,
                            range
                        }) : null;
                        var a = document.createElement('a');
                        a.href = href;
                        text ? a.innerHTML = text : a.innerHTML = ranger.getSelectionHTML();
                        blank ? a.target = "_blank" : null;
                        document.execCommand('insertHTML', false, a.outerHTML);
                        target.closest('field > row').setAttribute("css-display", "none")

                        if (window.selected && window.range) {
                            window.selected = null;
                            window.range = null;
                        }
                    } else if (["insertimg"].includes(command)) {
                        if (window.range) {
                            //wysiwyg.focus();
                            window.selected.removeAllRanges();
                            window.selected.addRange(window.range);
                        }

                        var row = target.closest('field > *');
                        var href = row.all('input[type="text"]')[0].value;
                        0 > 1 ? console.log({
                            href,
                            range
                        }) : null;
                        var img = document.createElement('img');
                        img.src = href;
                        document.execCommand('insertHTML', false, img.outerHTML);
                        target.closest('field > *').setAttribute("css-display", "none")

                        if (window.selected && window.range) {
                            window.selected = null;
                            window.range = null;
                        }
                    } else if (["print"].includes(command)) {
                        printer(target.closest('box').find('[printable="true"]'));
                    }
                }

                //POST EVENTS
                if (["insertOrderedList", "insertUnorderedList"].includes(command)) {

                    controller.wysiwyg.onmouseup(wysiwyg)

                }

            }

        },

        more: (target, button) => {
            var menu = target.closest('box > header > flex').nextElementSibling;
            var value = menu.find('[data-more="' + button + '"]');
            if (value.getAttribute("css-display")) {
                $(menu.all('[data-more]')).attr('css-display', 'none');
                $(value).removeAttr('css-display');
            } else {
                $(menu.all('[data-more]')).attr('css-display', 'none');
                $(value).attr('css-display', 'none');
            }
        },

        image: async function(event) {
            var wysiwyg = event.target.closest('box').find('wysiwyg');
            if (window.range) {
                //wysiwyg.focus();
                window.selected.removeAllRanges();
                window.selected.addRange(window.range);
            }

            var row = event.target.closest('row');
            var image = await on.change.file(event);
            var href = image.result;
            0 > 1 ? console.log({
                href
            }) : null;
            var img = document.createElement('img');
            img.src = href;
            //console.log(img);
            document.activeElement === wysiwyg ? null : wysiwyg.focus()
            document.execCommand('insertHTML', false, img.outerHTML);
            event.target.closest('field > *').setAttribute("css-display", "none")

            if (window.selected && window.range) {
                window.selected = null;
                window.range = null;
            }
        },

        iframe: async function(target) {
            var wysiwyg = target.closest('box').find('wysiwyg');
            if (window.range) {
                //wysiwyg.focus();
                window.selected.removeAllRanges();
                window.selected.addRange(window.range);
            }

            var row = event.target.closest('row');
            html = target.closest('section').find('textarea').value;
            //console.log(img);
            document.activeElement === wysiwyg ? null : wysiwyg.focus()
            document.execCommand('insertHTML', false, html);
            event.target.closest('field > *').setAttribute("css-display", "none")

            if (window.selected && window.range) {
                window.selected = null;
                window.range = null;
            }
        },

        node: event => {
            var sel = window.getSelection();
            var node = sel.focusNode && sel.focusNode.nodeType === 3 ? sel.focusNode.parentNode : sel.focusNode;
            return node;
        },

        onkeydown: event => {

            var wysiwyg = event.target;

        },

        onkeyup: event => {

            var wysiwyg = event.target.closest('wysiwyg');
            wysiwyg.innerHTML === "" ? wysiwyg.innerHTML = "<p><br></p>" : null;
            wysiwyg.firstElementChild.focus();

        },

        onmouseup: wysiwyg => {
            //console.log('onmouseup');

            var wysiwyg = event.target;
            var header = wysiwyg.closest('block, card, box').firstElementChild;
            var indent = header.find('[data-command="indent"]');
            var outdent = header.find('[data-command="outdent"]');

            var sel = window.getSelection();
            var node = sel.focusNode && sel.focusNode.nodeType === 3 ? sel.focusNode.parentNode : sel.focusNode;

            var el = node.closest('blockquote, ul');
            var ul = node.closest('ul');
            var ol = node.closest('ol');
            var img = node.closest('img');
            //var tagName = el.tagName.toLowerCase();
            0 > 1 ? console.log('onmouseup', {
                node,
                ul,
                ol
            }) : null;

            if (img) {
                console.log(img);
            } else if (el) {
                indent.classList.add('opacity-50pct');
                outdent.classList.remove('opacity-50pct');
            } else {
                indent.classList.remove('opacity-50pct');
                outdent.classList.add('opacity-50pct');
            }
        },

        onpaste: function(e) {

            var clipboardData, pastedData;

            // Stop data actually being pasted into div
            e.stopPropagation();
            e.preventDefault();

            // Get pasted data via clipboard API
            var mime = 'text/html';
            clipboardData = e.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData(mime).replace('<span>&nbsp;</span>', '');
            0 > 1 ? console.log({
                pastedData
            }) : null;
            var doc = new DOMParser().parseFromString(pastedData, mime);
            $(doc.body.all('[class], [id], [style]')).removeAttr('class').removeAttr('id').removeAttr('style');
            $(doc.body.all('picture source')).remove();
            //console.log(doc.body.innerHTML);
            var ps = doc.body.textual();
            doc.body.innerHTML = ps;
            //console.log(ps);

            // Do whatever with pasteddata
            var node = controller.wysiwyg.node();
            wysiwyg = node.closest('wysiwyg')
            //console.log(node);
            var sel = document.getSelection();
            var fo = sel.focusOffset;
            //controller.wysiwyg.caret(node, fo);
            range = document.getSelection().getRangeAt(0);
            var pasted = document.createElement('p');
            pasted.innerHTML = doc.body.innerHTML;
            if (node.parentElement === wysiwyg) { //node.parentElement.innerHTML = "";
                //range.selectNode(wysiwyg);
            }
            //range.insertNode(pasted);
            //insertHtmlAfterSelection(pasted.outerHTML);

            replaceSelectionWithHtml(pasted.outerHTML);

            //controller.wysiwyg.caret(node, fo);

            //console.log(pastedData, node, sel);
            function replaceSelectionWithHtml(html) {
                var range;
                if (window.getSelection && window.getSelection().getRangeAt) {
                    range = window.getSelection().getRangeAt(0);
                    range.deleteContents();
                    var div = document.createElement("div");
                    div.innerHTML = html;
                    var frag = document.createDocumentFragment(),
                        child;
                    while ((child = div.firstChild)) {
                        frag.appendChild(child);
                    }
                    range.insertNode(frag);
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    range.pasteHTML(html);
                }
            }

        },

        tab: target => {
            var button = target.closest('[data-tap] > [data-tab]');
            if (button) {
                var index = button.index();

                $(target.closest('[data-tap]').children).removeClass('background-color-fff');
                button.classList.add('background-color-fff');

                $(target.closest('[data-tap]').nextElementSibling.children).attr('css-display', 'none');
                target.closest('[data-tap]').nextElementSibling.children[index].setAttribute('css-display', 'flex');
            }
        },

        video: async function(event) {
            var wysiwyg = event.target.closest('box').find('wysiwyg');
            if (window.range) {
                //wysiwyg.focus();
                window.selected.removeAllRanges();
                window.selected.addRange(window.range);
            }

            var row = event.target.closest('row');
            var image = await on.change.file(event);
            var href = image.result;
            0 > 1 ? console.log({
                href
            }) : null;
            var video = document.createElement('video');
            video.controls = true;
            video.src = href;
            //console.log(img);
            document.activeElement === wysiwyg ? null : wysiwyg.focus()
            document.execCommand('insertHTML', false, video.outerHTML);
            event.target.closest('field > *').setAttribute("css-display", "none")

            if (window.selected && window.range) {
                window.selected = null;
                window.range = null;
            }
        }

    }

});