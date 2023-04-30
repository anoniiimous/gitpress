window.framework = {};

framework.builder = {};
framework.builder.block = async function(target) {
    var box = target.closest('box');
    if (box) {
        var index = box.index() + 1;
        var tagName = target.closest('card').dataset.element;
        var html = await ajax('raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html')
        //window.parent.modal.popup(html);
        var element = dom.body.find(tagName);
        var block = framework.builder.focus();
        if (element) {
            element.insertAdjacentHTML('beforeend', html);
            modal.exit(target)
        }
        console.log({
            element,
            target,
            block,
            html
        }, 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html');
    }
}
framework.builder.blocks = async function(target) {
    if (target) {
        var tagName = typeof target === "string" ? target : (target.closest('block, main') || target.closest('empty').previousElementSibling).tagName.toLowerCase();
        var html = await ajax('raw/asset/html/template/template.blocks.' + tagName + '.html')
        var ppp = await window.parent.modal.popup(html);
        console.log(27, {
            tagName,
            target
        }, typeof target);
        ppp.find('card').lastElementChild.onclick = async(event)=>{
            //framework.builder.block(event.target);
            var box = event.target.closest('box');
            if (box) {
                var index = box.index() + 1;
                var element = target.closest('empty').previousElementSibling;
                var tagName = event.target.closest('[data-element]').dataset.element;
                tagName = tagName === 'main' ? 'block' : tagName;
                var asset = 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html';
                var html = await ajax(asset)
                //window.parent.modal.popup(html);
                //var element = dom.body.find(tagName);
                var block = framework.builder.focus();
                if (element) {
                    element.insertAdjacentHTML('beforeend', html);
                    modal.exit(event.target)
                }
                console.log({
                    asset,
                    element,
                    target,
                    block,
                    html
                }, 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html');
            }
        }
        console.log({
            target,
            html,
            ppp
        });
    }
}
framework.builder.focus = ()=>{
    var focused = dom.body.all('[focus="true"]');
    return focused[focused.length - 1];
}
framework.builder.select = ()=>{
    $('focus').remove();
    var elem = dom.body.find('[focus]')
    var selection = window.parent.byId('focus-element').content.firstElementChild.cloneNode(true);
    var rect = elem.getBoundingClientRect();
    selection.style.height = elem.clientHeight + "px";
    selection.style.width = elem.clientWidth + "px";
    //selection.style.backgroundColor = "rgba(0,0,0,0.5)";
    selection.style.left = (rect.left + document.documentElement.scrollLeft) + "px";
    selection.style.top = (rect.top + document.documentElement.scrollTop) + "px";
    selection.style.zIndex = "1234568799";
    doc.body.insertAdjacentHTML('beforeend', selection.outerHTML);
}
framework.builder.insert = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var blocks = $(doc.body.all('blocks block'));
    //blocks.attr('data-transform', 'scale(calc(1/3))');
    var element = target.closest('[data-element]').dataset.element;
    console.log({
        blocks,
        element,
        target
    });
    if (element === 'main') {
        if (target.closest('[data-tap]').tagName.toLowerCase() === 'text') {
            var el = document.createElement('block');
            el.innerHTML = '<flex></flex>';

            var page = doc.body.find('[data-active="true"][data-page]');
            page.find('blocks').insertAdjacentHTML('beforeend', el.outerHTML);

            var block = page.find('blocks').lastElementChild;
            $(doc.body.all('[focus]')).removeAttr('focus');
            block.setAttribute('focus', 'block');
            doc.body.setAttribute('focus', 'block');

            var rect = block.getBoundingClientRect();
            console.log(doc, doc.body.all('[focus]'), block, block.scrollTop, win.scrollTop, rect);
            win.scrollTo({
                behavior: 'smooth',
                left: 0,
                top: rect.top + doc.documentElement.scrollTop
            });

            modal.exit(target);
        }
    }
}
framework.branding = {};
framework.branding.appName = event=>{
    var target = event.target;
    var value = target.value;
    var card = target.closest('card');
    var names = card.all('[data-value="app-name"]');
    $(names).html(value);
}
framework.branding.backgroundColor = event=>{
    var target = event.target;
    var value = target.value;
    var card = target.closest('card');
    var themes = card.all('[data-background-color]');
    themes.forEach(function(theme) {
        var ground = theme.dataset.backgroundColor;
        var isHex = is.hex(value);
        if (ground === "foreground") {
            var color = theme.getAttribute('css-color');
            if (!color) {
                color = theme.getAttribute('disabled-css-color');
            }
        }
        if (ground === "background") {
            var bg = theme.getAttribute('css-background-color');
            if (!bg) {
                bg = theme.getAttribute('disabled-css-background-color');
            }
        }
        if (value.length === 0) {
            if (ground === "foreground") {
                theme.setAttribute('disabled-css-color', color);
                theme.removeAttribute('css-color');
            }
            if (ground === "background") {
                theme.setAttribute('disabled-css-background-color', bg);
                theme.removeAttribute('css-background-color');
            }
        }
        if (ground === "background") {
            if (value.length > 0) {
                if (isHex) {
                    theme.style.backgroundColor = value;
                    theme.setAttribute('fill', value);
                }
            } else {
                theme.style.backgroundColor = bg;
                theme.setAttribute('fill', bg);
            }
        }
        if (ground === "foreground") {
            0 > 1 ? console.log('color', {
                value,
                color
            }) : null;
            if (value.length > 0) {
                if (isHex) {
                    $(theme.all('svg [fill]')).attr('fill', value);
                }
            } else {
                $(theme.all('svg [fill]')).attr('fill', color);
            }
            0 > 1 ? console.log('color', {
                color
            }) : null;
        }
    });
}
framework.branding.borderRadius = event=>{
    var target = event.target;
    var value = target.value;
    var svg = target.closest('card').find('svg');
    var rect = svg.find('rect');
    var icon = svg.find('svg');

    var vb = svg.getAttribute('viewBox').split(' ');
    var w = vb[vb.length - 2];
    var h = vb[vb.length - 1];

    var row = target.closest('row');
    var rx = row.find('[name="browser-borderRadius"]').value;
    $(target.closest('card').all('rect')).attr('rx', rx + "px");
}
framework.branding.dedicatedPicture = async function(event) {
    var target = event.target;
    var row = target.closest('column').nextElementSibling.lastElementChild;
    var svg = row.find('svg');
    var file = await on.change.file(event);
    ImageTracer.imageToSVG(file.result, (svgstr)=>{
        svg.find('foreignObject').innerHTML = svgstr;
        row.removeAttribute('css-display');
    }
    , {
        viewbox: true
    });
}
framework.branding.display = (event)=>{
    var target = event.target;
    var value = target.value;
    var row = target.closest('row');

    if (value === 'browser') {
        $(target.closest('card').find('[value="custom"]').closest('row').all('input:not([type="radio"])')).attr('disabled', true);
    }
    if (value === 'standalone') {
        $(row.all('input:not([type="radio"])')).removeAttr('disabled');
    }
}
framework.branding.generate = async function(target) {
    var form = target.closest('form');
    var cards = form.all('card');

    var zip = {};
    var head = [];

    var icon = cards[0];
    var iconSVG = icon.find('card > flex > box svg');
    zip["icon.svg"] = iconSVG.outerHTML;

    var desktop = cards[1];
    var faviconICO = desktop.find('card > column > flex > box svg');
    zip["favicon.svg"] = faviconICO.outerHTML;
    zip["favicon-32x32.png"] = await convert(faviconICO, {
        mimeType: "image/png",
        size: {
            height: 32,
            width: 32
        }
    });
    zip["favicon-16x16.png"] = await convert(faviconICO, {
        mimeType: "image/png",
        size: {
            height: 16,
            width: 16
        }
    });
    zip["favicon.ico"] = await convert(faviconICO, {
        mimeType: "image/x-icon",
        size: {
            height: 16,
            width: 16
        }
    });

    var ios = cards[2];
    var appleTouchIconPNG = ios.find('card > column > flex > box svg');
    zip["apple-touch-icon.svg"] = appleTouchIconPNG.outerHTML;
    zip["apple-touch-icon.png"] = await convert(appleTouchIconPNG, {
        mimeType: "image/png"
    });

    var chrome = cards[3];
    var androidChromePNG = chrome.find('card > column > flex > box svg');
    zip["android-chrome.svg"] = androidChromePNG.outerHTML;
    zip["android-chrome-192x192.png"] = await convert(androidChromePNG, {
        mimeType: "image/png",
        size: {
            height: 192,
            width: 192
        }
    });
    zip["android-chrome-512x512.png"] = await convert(androidChromePNG, {
        mimeType: "image/png",
        size: {
            height: 512,
            width: 512
        }
    });

    var metro = cards[4];
    var xml = await ajax('raw/asset/xml/browserconfig.xml');
    var browserconfigXML = new DOMParser().parseFromString(xml, 'text/xml');
    var color = metro.find('card > column > flex > box svg rect').getAttribute('fill');
    browserconfigXML.getElementsByTagName("TileColor")[0].textContent = color;
    zip["browserconfig.xml"] = new XMLSerializer().serializeToString(browserconfigXML);
    var mstile150x150PNG = metro.find('card > column > flex > box svg').cloneNode(true);
    zip["mstile.svg"] = mstile150x150PNG.outerHTML;
    mstile150x150PNG.find('rect').remove();
    zip["mstile-150x150.png"] = await convert(mstile150x150PNG, {
        mimeType: "image/png",
        size: {
            height: 150,
            width: 150
        }
    });

    var safari = cards[5];
    //if (safari.find('[name="radio-macOSSafari"][value="default"]').checked) {
    var safariPinnedTabSVG = safari.find('box picture > svg:not([css-display]) foreignObject svg');
    zip["safari-pinned-tab.svg"] = safariPinnedTabSVG.outerHTML;
    //}

    var siteWEBMANIFEST = await github.repos.contents({
        owner: window.owner.login,
        path: 'site.webmanifest',
        repo: GET[1]
    }, {
        accept: 'application/vnd.github.raw'
    });
    var color = chrome.all('card > column > flex > box')[1].find('[name="android-chrome-themeColor"]').value;
    var display = chrome.all('card > column > flex > box')[1].find('[name="radio-androidChrome-options"]:checked').value;
    var orientation = chrome.all('card > column > flex > box')[1].find('[name="radio-androidChrome-orientation"]:checked').value;
    var start_url = chrome.all('card > column > flex > box')[1].find('[name="text-androidChrome-startUrl"]').value;
    //console.log({siteWEBMANIFEST, display, color});
    siteWEBMANIFEST.icons = [{
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
    }, {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
    }];
    siteWEBMANIFEST.background_color = color,
    siteWEBMANIFEST.theme_color = color;
    siteWEBMANIFEST.display = display;
    orientation ? siteWEBMANIFEST.orientation = orientation : null;
    start_url.length > 0 ? siteWEBMANIFEST.start_url = start_url : null;
    zip["site.webmanifest"] = JSON.stringify(siteWEBMANIFEST, null, 4);

    var appleTouchIconLINK = document.createElement('link');
    var favicon32x32LINK = document.createElement('link');
    var favicon16x16LINK = document.createElement('link');
    var manifestLINK = document.createElement('link');
    var safariPinnedTabLINk = document.createElement('link');
    var msApplicationTileColorMETA = document.createElement('meta');
    var themeColorMETA = document.createElement('meta');
    var content = await github.repos.contents({
        owner: window.owner.login,
        path: 'index.html',
        repo: GET[1]
    }, {
        accept: 'application/vnd.github.raw'
    });
    var html = new DOMParser().parseFromString(content, 'text/html').documentElement;
    console.log(245, {
        zip,
        html
    });
    html.find('link[href="/apple-touch-icon.png"]') ? html.find('head').appendChild(appleTouchIconLINK) : null;
    html.find('link[href="/favicon-32x32.png"]') ? html.find('head').appendChild(favicon32x32LINK) : null
    html.find('link[href="/favicon-16x16.png"]') ? html.find('head').appendChild(favicon16x16LINK) : null;
    html.find('link[href="/site.webmanifest"]') ? html.find('head').appendChild(manifestLINK) : null;
    html.find('link[href="/safari-pinned-tab.svg"]') ? html.find('head').appendChild(safariPinnedTabLINK) : null
    html.find('meta[name="msapplication-TileColor"]') ? html.find('head').appendChild(msApplicationTileColorMETA) : null;
    html.find('meta[name="theme-color"]') ? html.find('head').appendChild(themeColorMETA) : null;

    console.log(245, {
        zip,
        head: html.outerHTML
    });

    //PUSH
    var params = {
        message: "Generate Favicons",
        repo: GET[1],
        owner: window.owner.login
    };
    var array = [];
    Object.values(zip).forEach(function(content, index) {
        var path = Object.keys(zip)[index];
        var file = {
            path
        };
        if (content.startsWith('data:')) {
            file.content = content.split(';base64,')[1];
            file.type = "base64";
        } else {
            file.content = content;
        }
        array.push(file);
    });
    console.log(2452, 'controller.posts.update', "array", {
        array
    });
    try {
        await github.crud.update(params, array);
    } catch (e) {
        console.log(e);
        alert('There was an error generating favicons.');
    }
}
framework.branding.icon = function(event) {
    var target = event.target;
    var row = target.closest('row');
    var svg = row.find('svg');
    var icon = svg.find('foreignObject svg');
    var foreignObjects = target.closest('box').previousElementSibling.all('picture > svg:first-child foreignObject');
    $(foreignObjects).html(icon.outerHTML)
}
framework.branding.imageSize = event=>{
    var target = event.target;
    var value = target.value;
    var svg = target.closest('card').find('svg');

    var vb = svg.getAttribute('viewBox').split(' ');
    var w = vb[vb.length - 2];
    var h = vb[vb.length - 1];

    var row = target.closest('row');
    var hw = value;
    var x = (w - hw) / 2;
    var y = (h - hw) / 2;
    $(target.closest('card').all('foreignObject, svg')).attr('height', hw + "px").attr('width', hw + "px")
    $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
}
framework.branding.themeColor = event=>{
    var target = event.target;
    var value = target.value;
    var card = target.closest('card');
    var themes = card.all('[data-theme-color]');
    themes.forEach(function(theme) {
        var ground = theme.dataset.themeColor;
        var isHex = is.hex(value);
        if (ground === "foreground") {
            var color = theme.getAttribute('css-color');
            if (!color) {
                color = theme.getAttribute('disabled-css-color');
            }
        }
        if (ground === "background") {
            var bg = theme.getAttribute('css-background-color');
            if (!bg) {
                bg = theme.getAttribute('disabled-css-background-color');
            }
        }
        if (value.length === 0) {
            if (ground === "foreground") {
                theme.setAttribute('disabled-css-color', color);
                theme.removeAttribute('css-color');
            }
            if (ground === "background") {
                theme.setAttribute('disabled-css-background-color', bg);
                theme.removeAttribute('css-background-color');
            }
        }
        if (ground === "background") {
            if (value.length > 0) {
                if (isHex) {
                    theme.style.backgroundColor = value;
                    theme.setAttribute('fill', value);
                    theme.style.color = colors.contrast(value)
                }
            } else {
                theme.style.backgroundColor = bg;
                theme.setAttribute('fill', bg);
                theme.style.color = colors.contrast(bg)
            }
        }
        if (ground === "foreground") {
            console.log('color', {
                value,
                color
            });
            if (value.length > 0) {
                if (isHex) {
                    $(theme.all('svg [fill]')).attr('fill', value);
                }
            } else {
                $(theme.all('svg [fill]')).attr('fill', color);
            }
            console.log('color', {
                color
            });
        }
    });
}
framework.branding.marginSize = event=>{
    var target = event.target;
    var value = target.value;
    var svg = target.closest('card').find('svg');
    var rect = svg.find('rect');
    var icon = svg.find('svg');

    var vb = svg.getAttribute('viewBox').split(' ');
    var w = vb[vb.length - 2];
    var h = vb[vb.length - 1];
    var row = target.closest('row');

    var ms = w - (value);
    var hw = (w - ms) / 2;
    var x = hw;
    var y = hw;
    //var fill = row.parentElement.nextElementSibling.find('[type="text"]').value;

    //$(target.closest('card').find('[name="radio-androidChrome"][value="custom"]').closest('row').all('input:not([type="radio"])')).removeAttr('disabled')
    //$(target.closest('card').all('rect')).attr('fill', fill)
    $(target.closest('card').all('foreignObject, svg')).attr('height', ms + "px").attr('width', ms + "px")
    $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
}

framework.on = async function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe(window)) {
            var target = event.target;
            var buildable = dom.body.getAttribute('buildable') === "true";
            var insertable = dom.body.getAttribute('insertable') === "true";
            var elem = target.closest('box, card, block, body > header, body > footer');
            var focused = elem.getAttribute('focus');
            var tagName = elem.tagName.toLowerCase();
            var el = ["block", "card", "footer", "header"].includes(tagName) ? tagName : 'box';
            var element = dom.body.getAttribute('focus');
            var sel = element ? ':not(body)[focus="' + element + '"] ' + element + '' : null;
            var selected = sel ? event.target.closest(sel) : null;
            var focusing = sel && event.target.closest(sel) ? event.target.closest(sel).getAttribute('focus') : null;
            0 > 1 ? console.log({
                sel,
                selected,
                focusing
            }) : null;
            if (buildable && !insertable) {
                var focus = target.closest('focus');
                if (elem !== event.target.closest(':not(block):not(body > header):not(body > footer)[focus]')) {

                    var focused = $('[focus]');

                    console.log(89, {
                        elem,
                        target: event.target.closest('[focus]'),
                        focuser: focused.length > 0 ? focused[focused.length - 1] : null,
                        contains: focused.length > 0 ? focused[focused.length - 1].contains(elem) : null,
                        focus,
                        focused
                    });

                    if ((elem && $('[focus]').length === 0) || (elem && ((focused && focused[focused.length - 1].contains(elem)) || (sel && focused && focused[focused.length - 1].parentNode.contains(elem) && !focusing && element === elem.tagName.toLowerCase())))) {

                        $('[focus]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('contenteditable');
                        });

                        var tool = window.top.dom.body.find('tool');

                        $([dom.body]).attr('focus', el);
                        $([elem, elem.closest('block, footer, header')]).attr('focus', el);

                        if (focused === "true") {
                            if (tagName === "picture") {}
                            if (tagName === "text") {//elem.contentEditable = "true";
                            }
                        } else {
                            if (tagName === "picture") {}
                            if (tagName === "text") {
                                elem.contentEditable = "true";
                            }
                        }

                        console.log({
                            focused,
                            tagName,
                            tool,
                            icons: $(tool.all('ico')),
                            array: Array.prototype
                        });

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.classList.remove('display-none'));

                    } else {

                        console.log($('[focus]'));

                        $('[focus]').forEach(function(el) {
                            el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el.removeAttribute('contenteditable');
                        });

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.find('.gg-add') ? null : o.classList.add('display-none'));

                    }

                } else {

                    if (el === "box") {
                        var media = selected.closest('[media]') ? selected.closest('[media]').getAttribute('media') : null;
                        var id = selected.dataset.id;
                        if (media && !id) {
                            var json = is.json(media) ? JSON.parse(media) : false;
                            if (json) {
                                console.log('mixed', media);
                            } else {
                                var confirm = await window.top.modal.confirm({
                                    body: "Do you want to save your changes before creating a new item?",
                                    title: "Unsaved Changes"
                                }, ["No", "Yes"]);
                                if (confirm) {
                                    '/dashboard/:get/merch/catalog'.router();
                                }
                            }
                            console.log(media, json);
                        }
                    }
                }
            }
        }
    }
}

window.tool = {}

window.tool.set = {};
window.tool.set.tab = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;

    var ppp = target.closest('aside');

    var header = target.closest('card > header');
    $(header.children).addClass('border-bottom-1px-solid');

    var box = target.closest('box');
    box.classList.remove('border-bottom-1px-solid');

    var tabs = header.parentNode.all('card > column');
    var tab = $(tabs)[box.index()];
    console.log(tabs);

    $(tabs).attr('css-display', 'none')
    tab.removeAttribute('css-display');

    var element = box.find('text').dataset.before;
    var parent = ppp.focus.closest(element);
    var elem = ppp.focus.closest('box, card, block, body > header, body > footer');

    $(doc.body.all('[focus]')).forEach(function(el) {
        el.removeAttribute('focus');
    });
    $(doc.body.all('box text[contenteditable]')).forEach(function(el) {
        el.removeAttribute('contenteditable');
    });
    $([doc.body]).attr('focus', element);
    $([parent, elem.closest('block, footer, header')]).attr('focus', element);

    console.log(dom.body, $('[focus]'), $(dom.body.all('[focus]')), {
        tabs,
        tab
    }, {
        elem,
        focus: ppp.focus,
        parent
    });
}

/*TOOL API*/
window.tool.tip = {};

window.tool.bar = {};

window.tool.box = {};
window.tool.box.columns = function(event) {
    var target = event.target;
    var value = target.value;
    console.log(268, value);
}
window.tool.box.css = function(tab) {

    var ppp = tab.closest('aside');

    var iframe = byId('iframe-editor');
    var doc = iframe.contentWindow.document;
    var element = doc.body.getAttribute('focus');

    var declarations = $(tab.all('[data-declaration]'));
    console.log(304, {
        ppp,
        tab,
        declarations
    });
    if (declarations.length > 0) {
        var focus = tab.node ? tab.node : ppp.focus;
        var nodeName = focus.nodeName.toLowerCase();
        console.log(308, {
            focus
        }, tab.closest('card'), tab.closest('card').node, focus.nodeName.toLowerCase(), ["header", "footer", "block", "card", "box"].includes(nodeName))

        var attrs = {};
        var rules = {};
        var classList = Array.from(focus.classList);

        var c1 = Array.from(focus.classList);
        var a1 = {};
        var a2 = {};

        for (const [i,a] of Object.entries(focus.attributes)) {
            var key = a.name;
            var value = a.value;
            a1[key] = value;
        }

        if (["header", "footer", "block", "card", "box"].includes(nodeName)) {

            classList.concat(Array.from(focus.find('flex, column, row, section').classList));
            var e1 = {
                focus: focus.find('flex, column, row, section').attributes,
                wrapper: focus.find('flex, column, row, section').attributes
            };

            var c2 = Array.from(focus.find('flex, column, row, section').classList);
            var c3 = c1.concat(c2);

            for (const [i,a] of Object.entries(focus.find('flex, column, row, section').attributes)) {
                var key = a.name;
                var value = a.value;
                a2[key] = value;
            }

            var a3 = Object.assign(a1, a2);
            a3.class = c3.join(' ');

        } else {

            var a3 = a1;
            var c3 = c1;
            a3.class = c3.join(' ');

        }

        0 < 1 ? console.log(334, {
            a3
        }) : null;
        for (var [key,value] of Object.entries(a3)) {
            value = value.replace('pct', '%');
            0 > 1 ? console.log(329, {
                key,
                value
            }) : null;
            if (key.startsWith('css')) {
                var camel = [];
                var split = key.rfo('css-').split('-');
                split.forEach(function(s) {
                    if (s.startsWith('dw') || s.startsWith('_')) {
                        //split;
                        camel.push(s);
                    } else {
                        camel.push(s);
                    }
                });
                key = camel.join('-').camelPhynate();
                attrs[key] = value;
            } else if (key.startsWith('class')) {
                //console.log(value);
                value.split(' ').forEach(function(c) {
                    var split = c.split('-');
                    var value = split.splice(split.length - 1)[0];
                    var properties = [];
                    split.forEach(function(s) {
                        if (s.startsWith('dw') || s.startsWith('_')) {
                            split;
                        } else {
                            properties.push(s);
                        }
                    });
                    var property = properties.join('-');
                    rules[property] = value;
                    0 > 1 ? console.log(339, {
                        c,
                        split,
                        property,
                        value
                    }) : null;
                    attrs[property] = value;
                });
            } else {
                attrs[key] = value;
            }
            //key.startsWith('css-') ? attrs[key] = value : null;
        }
        var rules = attrs;
        0 > 1 ? console.log(718, {
            a1,
            a2,
            a3,
            rules,
            declarations
        }) : null;
        declarations.forEach(function(el) {
            var declaration = el.dataset.declaration;
            var row = el.closest('[data-property]');
            if (row) {
                var property = row.dataset.property.camelPhynate();
                Object.entries(rules).forEach(function(rule) {
                    var key = rule[0];
                    var value = rule[1];
                    0 > 1 ? console.log(537, {
                        el,
                        rules,
                        property,
                        declaration
                    }) : null;

                    if (key === property) {
                        0 > 1 ? console.log(517, {
                            el,
                            property,
                            declaration
                        }, property, {
                            key,
                            value
                        }) : null;

                        var tabs = el.closest('box').all('box > [data-tab]');
                        if (tabs.length > 0) {
                            //$(tabs).addClass('display-none');
                            var tab = el.closest('box').find('box > [data-tab="' + value + '"]');
                            if (tab) {
                                tab.classList.remove('display-none');
                            }
                        }

                        if (declaration === "array") {
                            var checkboxes = el.all('input[type="checkbox"]');
                            var json = is.json(value) ? JSON.parse(value) : [value];
                            0 > 1 ? console.log(536, property, {
                                json,
                                checkboxes
                            }) : null;
                            checkboxes.forEach(function(checkbox) {
                                var name = checkbox.name;
                                if (json.includes(name)) {
                                    checkbox.checked = true;
                                }
                            });
                        }
                        if (declaration === "checkbox") {
                            var checkboxes = el.all('input[type="checkbox"]');
                            var json = is.json(value) ? JSON.parse(value) : [value];
                            0 < 1 ? console.log(536, property, {
                                json,
                                checkboxes
                            }) : null;
                            checkboxes.forEach(function(checkbox) {
                                var name = checkbox.name;
                                if (json.includes(name)) {
                                    checkbox.checked = true;
                                }
                            });
                        }
                        if (declaration === "dimension") {
                            var dimension = value.cssValue();
                            var number = el.find('input[type="number"]');
                            var unit = el.find('[data-value="unit"]');
                            if (number) {
                                if (isNaN(parseInt(dimension.number))) {
                                    number.classList.add('display-none');
                                    unit.textContent = dimension.number;
                                } else {
                                    number.classList.remove('display-none');
                                    number.value = dimension.number;
                                    unit.textContent = dimension.unit;
                                }
                            }
                            0 < 1 ? console.log(562, property, {
                                dimension,
                                number,
                                unit
                            }, dimension.number, parseInt(dimension.number), typeof parseInt(dimension.number)) : null;
                        }
                        if (declaration === "number") {
                            var number = el.find('input[type="number"]');
                            if (number) {
                                String.prototype.formulate = function(formula) {
                                    var variable = this.toString();
                                    var v = variable;
                                    formula.split('{var}').forEach(function(x) {
                                        v = v.replace(x, '');
                                        0 > 1 ? console.log(593, {
                                            v,
                                            x,
                                            variable,
                                            formula
                                        }) : null;
                                    });
                                    var reg = variable.matchAll("{var}");
                                    0 > 1 ? console.log({
                                        variable,
                                        formula,
                                        v,
                                        reg
                                    }) : null;
                                    return v;
                                }
                                var formula = number.dataset.formula;
                                if (formula) {
                                    value = value.formulate(formula);
                                }
                                number.value = value;
                            }
                            0 > 1 ? console.log(583, property, {
                                formula,
                                number,
                                value
                            }) : null;
                        }
                        if (declaration === "select") {
                            0 > 1 ? console.log(621, {
                                key,
                                value
                            }) : null;
                            el.find('[data-value="value"]').textContent = value;
                            el.find('[data-value="value"]').setAttribute('value', value);
                        }
                        if (declaration === "string") {
                            el.find('input[type="text"]').value = value;
                        }
                    }
                });
            }
        });
    }

}
window.tool.box.element = async function(target) {
    var button = target.closest('[data-value]');
    if (button) {
        var iframe = byId('iframe-editor');
        var win = iframe.contentWindow;
        var doc = win.document;

        var focused = win.$('[focus]');
        var focusing = focused[focused.length - 1];

        var element = null;
        var value = button.dataset.value;
        console.log(268, {
            focused,
            focusing,
            value
        });

        if (value) {
            var html = await ajax('raw/asset/html/tool/tool.box.elements.html', {
                cache: "reload"
            });
            var parser = new DOMParser().parseFromString(html, "text/html");
            var element = parser.body.firstElementChild.find(value);
            console.log({
                element
            });

            modal.exit(target);

            var wrapper = focusing.find('flex, column, row, section');
            wrapper.insertAdjacentHTML('beforeend', element.outerHTML)
            wrapper.lastElementChild.focus();
        }
    }
}
window.tool.box.values = function(target) {
    var button = target.closest('[data-tap] > [data-value]');
    if (button) {
        var unit = button.textContent;
        var text = button.closest('[data-dropdown] + *').previousElementSibling.firstElementChild;
        text.textContent = unit;

        var input = text.closest('row > * > *').previousElementSibling;
        var onchange = input.getAttribute('onchange').split('(')[0].split('.');
        var method = window;
        console.log({
            button,
            input,
            onchange
        });

        if (button.dataset.dimension === "unit") {
            input.classList.remove('display-none');
        } else {
            input.classList.add('display-none');
        }
        onchange.forEach(function(o) {
            method = method[o];
        });
        method(input);
    }
}
window.tool.box.unit = function(event) {
    var target = event.target;
    var button = target.closest('[data-tap] > *');
    if (button) {
        var unit = button.textContent;
        var text = button.closest('[data-dropdown] + *').previousElementSibling.firstElementChild;
        text.textContent = unit;

        var input = text.closest('row > * > *').previousElementSibling;
        var onchange = input.getAttribute('onchange').split('(')[0].split('.');
        var method = window;
        0 > 1 ? console.log({
            button,
            input,
            onchange
        }) : null;

        if (button.dataset.dimension === "unit") {
            input.classList.remove('display-none');
        } else {
            input.classList.add('display-none');
        }
        onchange.forEach(function(o) {
            method = method[o];
        });

        var event = new Event('change');
        //method(event);
        input.dispatchEvent(event);
    }
}
window.tool.box.value = async function(event) {
    var target = event.target;
    console.log(event, target);
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var tagName = doc.body.getAttribute('focus');
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var attribute = target.closest('[data-property]').dataset.property;
    var element = target.closest('[data-element]').dataset.element;
    if (element === "wrapper") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template)");
    }
    if (element === "children") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template) > *");
    }
    if (element === "node") {
        focus = target.closest('card').node;
        var nodeName = focus.nodeName.toLowerCase();
        if (["picture"].includes(nodeName) && attribute === "src") {
            focus = focus.find('img');
        }
        if (["clip"].includes(nodeName) && attribute === "src") {
            focus = focus.find('video');
        }
        console.log(626, {
            attribute,
            element,
            focus,
            nodeName,
            tagName
        });
    }

    var file = null;
    var node = null;
    var value = null;
    var declaration = target.closest('[data-declaration]').dataset.declaration;
    var property = target.closest('[data-property]').dataset.property;
    if (declaration === "array") {
        var checked = target.closest('[data-declaration]').all(':checked');
        value = [];
        checked.forEach(function(k, v) {
            value.push(k.name);
        });
        value = value.length > 0 ? JSON.stringify(value) : null;
        //value = target.checked ? target.name : null;
        0 > 1 ? console.log(695, {
            checked,
            property,
            value
        }) : null;
    }
    if (declaration === "checkbox") {
        value = target.checked ? target.name : null;
    }
    if (declaration === "dimension") {
        var unit = target.nextElementSibling.find('[data-dropdown]').firstElementChild.textContent;
        if (unit) {
            value = target.classList.contains('display-none') ? unit : target.value.replace('pct', '%') + unit;
        }
    }
    if (declaration === "file") {
        file = target.files[0];
        node = target.closest('card').node;
    }
    if (declaration === "number") {
        var formula = target.dataset.formula ? target.dataset.formula : null;
        value = formula ? formula.replace('{var}', target.value) : target.value.replace('%', 'pct');
    }
    if (declaration === "radio") {
        value = target.checked ? target.name : null;
    }
    if (declaration === "select") {
        value = target.textContent;
        target.closest('[data-tap]').previousElementSibling.firstElementChild.textContent = value;
        target.closest('[data-tap]').previousElementSibling.firstElementChild.value = value;
    }
    if (declaration === "string") {
        value = target.value;
    }
    if (declaration === "value") {
        var selected = target.closest('[data-value]');
        if (selected) {
            value = selected.dataset.value;
            target.closest('[data-tap]').previousElementSibling.firstElementChild.textContent = selected.textContent;
        }
    }

    attribute = property.camelPhenate();
    var supports = CSS.supports(attribute, value);
    0 < 1 ? console.log(729, {
        supports,
        declaration
    }, {
        attribute,
        value
    }, {
        file,
        node
    }) : null;
    if (file && node) {
        var name = node.nodeName.toLowerCase();
        console.log(695, {
            file,
            node,
            name
        });
        if (name === "picture") {
            var img = document.createElement('img');
            var file = await on.change.file(event);
            var src = file.result;
            img.src = src;
            node.innerHTML = img.outerHTML;
        }
        if (name === "clip") {
            var vid = document.createElement('video');
            var file = await on.change.file(event);
            var src = file.result;
            vid.controls = true;
            vid.src = src;
            node.innerHTML = vid.outerHTML;
        }
        if (name === "sound") {
            var wave = document.createElement('sound');
            var file = await on.change.file(event);
            var src = file.result;
            wave.src = src;
            node.innerHTML = img.outerHTML;
        }
        target.insertAdjacentHTML('afterend', target.cloneNode().outerHTML);
        target.remove();
    } else {
        if (supports) {
            var dttribute = target.closest('[data-attribute]') ? target.closest('[data-attribute]').dataset.attribute : null;
            var rule = target.closest('[data-at-rule]') ? target.closest('[data-at-rule]').dataset.atRule : null;
            console.log(723, {
                attribute,
                value,
                dttribute
            });
            window.tool.box.style(focus, {
                attribute,
                value
            }, {
                rule,
                formula,
                dttribute
            });
        } else {
            console.log(734, {
                property,
                value
            });
            if (["innerHTML"].includes(property)) {
                focus[property] = value;
            } else {
                if (property && value) {
                    focus.setAttribute(property, value);
                } else {
                    focus.removeAttribute(property);
                }
            }
        }
    }

    var funxtion = target.closest('[data-function]')
    if (funxtion) {
        var declaration = {
            property,
            value
        };
        var fu = funxtion.dataset.function;
        //console.log(funxtion.dataset.function);
        var f = window;
        fu.split('.').forEach(function(k, v) {
            f = f[k];
        });
        f(focus, declaration);
        //var x = eval(funxtion.dataset.function);
        //typeof x === "function" ? x(declaration) : null;
        //console.log(585, "Running function");
    }
}
window.tool.box.style = async function(focus, declaration, options) {

    declaration.value ? declaration.value = declaration.value.replace('%', 'pct') : null;
    console.log(616, {
        focus,
        declaration,
        options
    });
    var pseudo = options ? options.pseudo : null;
    var rule = options ? options.rule : null;
    var formula = options ? options.formula : null;
    var attribute = attr = declaration.attribute;
    if (formula) {
        var v = formula;
        formula.split('{var}').forEach(function(x) {
            v = v.replace(x, '');
            console.log(593, {
                v,
                x,
                formula
            });
        });
    }
    var value = v = formula ? v : declaration.value.replace('%', 'pct');
    console.log(785, {
        focus,
        declaration,
        options,
        value
    });

    //STYLE SHEETS
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var head = doc.head;
    var styles = head.all('link');
    var sheet = 'sheet-' + attr;
    0 > 1 ? console.log(586, {
        head,
        styles,
        sheet
    }) : null;

    var styleExists = byId(sheet);
    var stylesheet = null;
    if (styles.length > 0) {
        styles.forEach(function(style) {
            if (style.id === sheet) {
                stylesheet = style;
                styleExists = true;
            }
            0 > 1 ? console.log(599, {
                style,
                sheet,
                id: style.id,
                attr
            }) : null;
        });
    }

    //INLINE STYLE
    0 < 1 ? console.log(520, {
        focus,
        attribute,
        value
    }) : null;
    //focus.style[attribute] = value;

    //DATASET
    attribute = attribute.camelPhenate();
    var dttribute = options ? options.dttribute : null;
    var className = [declaration.attribute, declaration.value.replace('%', 'pct')].join('-');
    var obj = {};
    obj[className] = {
        className,
        pseudo,
        rule,
        attribute,
        value,
    };
    0 < 1 ? console.log(472, {
        focus,
        attribute,
        value
    }, obj) : null;
    if (formula || dttribute) {
        focus.setAttribute((dttribute ? dttribute + '-' : 'css-') + declaration.attribute, declaration.value);
    } else {
        //INLINE CLASS
        //else {
        var classExists = false;
        var classList = focus.classList;
        classList.forEach(function(classVal) {
            var cns1 = classVal.split('-');
            var val1 = cns1.pop();
            var cn1 = cns1.join('-')

            var cns = className.split('-');
            var val = cns.pop();
            var cn = cns.join('-')
            if (cn1 == cn) {
                classExists = true;
            }
            0 > 1 ? console.log(557, className, cn, cn1) : null;
            if (classExists) {
                focus.classList.remove(classVal);
            }
        });
        focus.classList.add(className);
        //}
    }

    var rules = null;
    var type = formula || dttribute === 'css' ? 'css' : 'class';
    var property = attr;

    console.log(702, {
        styleExists
    });
    var decs = [{
        type,
        property: declaration.attribute,
        value: declaration.value
    }];
    console.log(716, decs);
    css.style.done(doc, className, decs);
}
window.tool.box.group = function(event) {
    var target = event.target;
    $(target.closest('box > row').nextElementSibling).toggleClass('display-none');
}
window.tool.box.section = function(event) {
    var target = event.target;
    console.log(target);
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var tagName = doc.body.getAttribute('focus');
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var element = target.closest('[data-element]').dataset.element;
    if (element === "wrapper") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template)");
    }
    if (element === "children") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template) > *");
    }

    var button = target.closest('[data-value]');
    var value = button ? button.dataset.value : null;
    if (value) {
        target.closest('[data-tap]').previousElementSibling.firstElementChild.textContent = button.textContent;
        target.closest('[data-tap]').previousElementSibling.firstElementChild.value = button.dataset.value;

        var box = target.closest('box');
        $(box.all('box > row ~ column')).addClass('display-none');

        var attribute = target.closest('[data-property]').dataset.property;
        var rule = target.closest('[data-at-rule]') ? target.closest('[data-at-rule]').dataset.atRule : null;
        var formula = target.dataset.formula ? target.dataset.formula : null;
        console.log(focus, {
            attribute,
            value
        }, {
            rule,
            formula
        });
        window.tool.box.style(focus, {
            attribute,
            value
        }, {
            rule,
            formula
        });

        var tab = value ? $(box.find('box > row ~ column[data-tab="' + value + '"]')) : null;
        if (tab) {
            tab.removeClass('display-none');
        }
    }
}
window.tool.box.width = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var unit = target.nextElementSibling.find('[data-dropdown]').firstElementChild.textContent;
    var value = target.value;
    console.log(347, {
        focus,
        unit,
        value
    });
    if (unit === "auto") {
        focus.style.width = "auto";
    } else {
        focus.style.width = value + unit;
    }
}

/*CSS API*/
window.css = {};

window.css.style = {};
window.css.style.declaration = function(c) {
    var rules = [];
    var split = c.split('-');
    var value = split.splice(split.length - 1)[0];
    var properties = [];
    split.forEach(function(s) {
        if (s.startsWith('dw') || s.startsWith('_')) {
            split;
        } else {
            properties.push(s);
        }
    });
    var property = properties.join('-');
    0 > 1 ? console.log(731, {
        c,
        split,
        property,
        value
    }) : null;
    return [property, value];
}

window.css.style.done = function(doc, rule, decs) {
    doc.head.cssTexts ? null : doc.head.cssTexts = {};
    console.log(947, 'css.style.done', {
        decs
    });
    return new Promise(function(resolve, reject) {
        for (const rule of decs) {
            var type = rule.type;
            var property = rule.property;
            var value = rule.value;
            var className = rule.className;
            var lnk = null;
            var head = doc.head;

            var styleExists = false;
            var stylesheet = null;
            var selector = rule.type === 'css' ? '[css-' + property + '="' + value + '"]' : '.' + [property, value].join('-');
            var attr = '';
            var that = '';
            if (rule.type === 'css') {
                that = property.rfo('css-').split('-').filter(function(row) {
                    return row.startsWith('dw') ? '' : row;
                }).join('-');
            } else {
                that = [property].join('-');
            }
            property = attr = that;
            0 > 1 ? console.log(845, {
                rule,
                attr
            }) : null;
            var sheet = 'sheet-' + attr;
            var style = doc.head.find('#' + sheet);
            style = doc.head.cssTexts[sheet];
            var declaration = "";
            var query = rule.property.startsWith('dw');
            //console.log(854, {query});
            if (query) {
                var dw = rule.property.startsWith('dw');
                var dimension = rule.property.rfo('css-').split('-').filter(function(row) {
                    return row.startsWith('dw') ? row : '';
                }).join('-');
                dw ? declaration += '@media (max-width: ' + dimension.split('dw')[1] + ') {' : '';
                declaration += selector + ' { ' + property + ": " + value.replace('pct', '%') + " }";
                declaration += '}';
            } else {
                declaration = selector + ' { ' + property + ": " + value.replace('pct', '%') + " }";
            }
            0 > 1 ? console.log(864, sheet, {
                declaration,
                style,
                head: doc.head.find('#' + sheet),
                id: byId(sheet)
            }) : null;
            if (style) {
                doc.head.cssTexts[sheet] ? doc.head.cssTexts[sheet].push(declaration) : doc.head.cssTexts[sheet] = [declaration];
                0 > 1 ? console.log(864, style.id, {
                    cssText,
                    sheet: doc.head.cssTexts[sheet],
                    cssTexts: doc.head.cssTexts
                }) : null;
            } else {
                doc.head.cssTexts[sheet] = [declaration];
                0 > 1 ? console.log(891, {
                    query,
                    rule,
                    sheet,
                    declaration,
                    selector,
                    property,
                    value
                }) : null;
            }

            0 > 1 ? console.log(599, {
                style,
                sheet,
                id: style.id,
                attr
            }) : null;
            //});

            0 > 1 ? console.log(929, 'cssLoaded', {
                styleSheets: doc.styleSheets,
                rules,
            }, {
                cssTexts: doc.head.cssTexts,
                stylesheet,
                sheet
            }) : null;
        }

        var entries = Object.entries(doc.head.cssTexts);
        entries = Array.from(new Set(entries.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
        0 < 1 ? console.log(1065, 'doc.head.cssTexts', {
            head: doc.head,
            cssTexts: doc.head.cssTexts,
            entries,
            decs
        }) : null;
        for (const entry of entries) {
            var id = entry[0];
            entry[1] = Array.from(new Set(entry[1].map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
            entry[1].reverse();
            var href = entry[1].join(' ');

            var exists = decs.find(o=>'sheet-' + o.property === id);
            if (exists) {

                var link = doc.head.find('#' + id);
                if (link) {
                    0 < 1 ? console.log(1071, {
                        entry: entry[1],
                        link,
                        id,
                        href
                    }) : null;
                    link.href = blob(href, 'text/css');
                    link.id = id;
                    link.onload = function() {
                        console.log(876, link.id);
                        //resolve(link);
                    }
                    link.rel = "stylesheet";
                    doc.head.appendChild(link);
                } else {
                    var link = document.createElement('link');
                    link.href = blob(href, 'text/css');
                    link.id = id;
                    link.rel = "stylesheet";
                    doc.head.appendChild(link);
                }
            }

        }
    }
    );
}
window.css.style.sheet = async function(el) {
    var win = el.ownerWindow();
    var doc = win.document;
    var html = el.closest('html')
    var head = html.find('head');
    var body = html.find('body');

    var els = $(el.all('[class], [css], [data]')).concat(el);
    var classNames = [];
    var styleset = {};
    els.forEach(function(elem) {
        var classList = elem.classList;
        classList.forEach(function(className) {
            var formula = elem.dataset.formula;
            var split = className.split('-');
            var value = split.splice(split.length - 1)[0];
            var property = split.join('-');

            //value = formula ? formula.replace('{var}', value) : value;
            0 > 1 ? console.log(955, {
                className,
                property
            }) : null;
            classNames.push({
                type: 'class',
                property,
                value
            });
        })

        for (const [i,a] of Object.entries(elem.attributes)) {
            var key = a.name;
            var value = a.value;
            key.startsWith('css-') ? styleset[key.rfo('css-')] = value : null;
        }
        Object.entries(styleset).forEach(function(data, index) {
            var split = data[0].split('-');
            split.splice(split.length - 1);
            var property = data[0];
            var value = data[1];
            0 > 1 ? console.log(949, {
                data,
                property
            }) : null;
            classNames.push({
                type: 'css',
                property,
                value
            });
        })
    })
    //classNames = [...new Set(classNames)];
    //classNames = Array.from(new Set(classNames.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
    console.log(989, {
        classNames,
        styleset
    });

    var declarations = [];
    if (0 > 1) {
        for (var row of classNames) {

            var el = row.el;
            var type = row.type;
            var className = row.property;

            var declaration = css.style.declaration(className);
            var property = row.property;
            var value = row.value;
            declarations[declaration[0]] = declaration[1];

            var split = property.split('-');
            var camel = [];
            split.forEach(function(s) {
                if (s.startsWith('dw') || s.startsWith('_')) {
                    split;
                } else {
                    camel.push(s);
                }
            });
            var attr = camel.join('-').camelPhynate();
            0 > 1 ? console.log({
                attr,
                camel
            }) : null;

            var styles = head.all('link');
            var sheet = 'sheet-' + attr;
            0 > 1 ? console.log(586, {
                head,
                styles,
                sheet
            }) : null;

            var styleExists = false;
            var stylesheet = null;
            if (styles.length > 0) {
                styles.forEach(function(style) {
                    if (style.id === sheet) {
                        stylesheet = style;
                        styleExists = true;
                    }
                    0 > 1 ? console.log(599, {
                        style,
                        sheet,
                        id: style.id,
                        attr
                    }) : null;
                });
            }

            console.log(586, {
                property,
                value
            })

        }
    }

    await css.style.done(doc, {
        type,
        property,
        value
    }, classNames);

    console.log(858, 'css.style.sheet', {
        el,
        els
    }, {
        head,
        body
    }, {
        classNames,
        declarations
    });
}
;

async function toolbelt(mode, options) {
    var tool = window.top.byId('iframe-editor').parentNode.previousElementSibling;
    var toolset = tool.find('[tabindex="1"]');
    var toolbox = tool.find('[tabindex="2"]');
    var toolbar = tool.find('[tabindex="3"]');
    var elements = ["text", "picture", "video", "audio", "line", "embed", "embedded", "sound"];

    var tools = window.top.byId('iframe-editor').nextElementSibling;

    if (mode) {

        $(tools.all('[data-mode]')).addClass('display-none');
        tools.find('[data-mode="' + mode + '"]').classList.remove('display-none');

        if (mode === "set") {
            $(tool.all('[tabindex]')).addClass('display-none');
            toolset.classList.remove('display-none');
        }

        if (mode === "box") {}

        if (mode === "bar") {

            console.log({
                node,
                nodeName,
                options
            });

            var node = options.element;
            var nodeName = element = node.tagName.toLowerCase();

            if (nodeName === 'text') {}
            if (nodeName === 'picture') {}
            if (nodeName === 'video') {}
            if (nodeName === 'audio') {}
            if (nodeName === 'line') {}
            if (nodeName === 'embed') {}

            toolbar.classList.remove('display-none');
            $(toolbar.children).addClass('display-none');
            toolbar.find('[tag="' + nodeName + '"]').classList.remove('display-none');

            var html = await ajax('raw/asset/html/tool/tool.box.element.html', {
                cache: "reload"
            });
            var doc = new DOMParser().parseFromString(html, "text/html");
            var ppp = await window.top.modal.popup(html);
            var cards = ppp.all('card');

            cards.forEach(function(card) {
                if (card.dataset.tag === element) {
                    card.node = card.closest('aside').focus = node;
                    card.removeAttribute('css-display');

                    var fetching = card.all('[data-fetch]');
                    console.log(1305, {
                        fetching
                    });
                    fetching.length > 0 ? fetching.forEach(async function(column, index) {
                        var html = await ajax(column.dataset.fetch);
                        var parser = new DOMParser().parseFromString(html, "text/html");
                        column.innerHTML = parser.body.firstElementChild.innerHTML;
                        console.log(1309, {
                            column
                        });
                        window.tool.box.css(column);
                    }) : null;
                }
            });

            console.log({
                toolset,
                toolbox,
                toolbar
            }, {
                html,
                ppp,
                cards
            });
        }

    }
}

function toolset(mode, options) {

    var tools = window.top.byId('iframe-editor').nextElementSibling;

    if (mode) {

        $(tools.all('[data-mode]')).addClass('display-none');
        tools.find('[data-mode="' + mode + '"]').classList.remove('display-none');

    }

}

window.tool.function = {};
window.tool.function.media = async function(focus, declaration) {

    var value = declaration.value;
    var json = JSON.parse(value);

    var feed = null;
    var template = null;
    var tagname = focus.tagName.toLowerCase();
    if (["block", "card", "box"].includes(focus.parentNode.tagName.toLowerCase())) {
        feed = focus;
        focus = focus.parentNode;
    } else {
        var sel = tagname + ' > column, ' + tagname + ' > flex, ' + tagname + ' > row, ' + tagname + ' > section';
        feed = focus.find(sel);
    }

    if (focus.find('template')) {
        template = focus.find('template');
    } else {
        template = document.createElement('template');
        focus.insertAdjacentHTML('afterend', template.outerHTML);
    }

    template = focus.find('template');
    console.log({
        json,
        focus
    });
    $(feed.all('[placeholder]')).html('');
    $(feed.all('[src]')).removeAttr('src');
    template.innerHTML = feed.innerHTML;

    if (json && json.length > 0) {
        console.log(587, {
            focus,
            declaration
        }, {
            sel,
            tagname
        }, {
            feed,
            content: template.content,
            template
        });

        var property = declaration.property;
        var value = declaration.value;
        var win = focus.ownerWindow();
        var html = await win.model.feed.media(feed);
        console.log(1421, focus, feed);
        feed.innerHTML = html;
    } else {
        console.log("nothing");
    }

}
