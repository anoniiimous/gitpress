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

framework.on = async function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
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
            var mode = {
                edit: buildable && !insertable,
                plus: buildable && insertable,
                view: !buildable && !insertable
            }
            var node = target.closest('box > * > *, card, block, body > header, body > footer');
            var tool = window.top.byId('iframe-editor').parentNode.previousElementSibling;
            var toolset = tool.find('[tabindex="1"]');
            var toolbox = tool.find('[tabindex="2"]');
            var toolbar = tool.find('[tabindex="3"]');
            var elements = ["text", "picture", "video", "audio", "line", "embed"];
            var nodeName = node.tagName.toLowerCase();
            0 > 1 ? console.log({
                el,
                sel,
                selected,
                focusing
            }, {
                mode,
                buildable,
                insertable
            }) : null;

            $(tool.all('header > *')).addClass('display-none');
            if (mode.edit) {
                var focus = target.closest('[focus]');
                var withh = elem !== event.target.closest(':not(block):not(body > header):not(body > footer)[focus]');
                //console.log({focus,withh}, {elem});
                if (withh) {

                    var focused = $('[focus]');
                    var inn = (elem && $('[focus]').length === 0) || (elem && ((focused && focused[focused.length - 1].contains(elem)) || (sel && focused && focused[focused.length - 1].parentNode.contains(elem) && !focusing && element === elem.tagName.toLowerCase())))

                    0 > 1 ? console.log(89, {
                        elem,
                        inn,
                        target: event.target.closest('[focus]'),
                        focuser: focused.length > 0 ? focused[focused.length - 1] : null,
                        contains: focused.length > 0 ? focused[focused.length - 1].contains(elem) : null,
                        focus,
                        focused
                    }) : null;

                    if (inn) {

                        $('[focus]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('contenteditable');
                        });

                        var tool = window.top.dom.body.find('tool');

                        $([dom.body]).attr('focus', el);
                        $([elem, elem.closest('block, footer, header')]).attr('focus', el);

                        if (focused === "true") {} else {
                            if (tagName === "box") {
                                $(elem.all('text')).attr('contenteditable', true);
                            }
                        }

                        0 < 1 ? (0 > 1 ? console.log({
                            focused,
                            tagName,
                            tool,
                            icons: $(tool.all('ico')),
                            array: Array.prototype
                        }) : console.log({
                            focus: 'with',
                            el
                        })) : null;

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.classList.remove('display-none'));

                    } else {

                        0 < 1 ? console.log({
                            focus: 'without'
                        }) : null;

                        $('[focus]').forEach(function(el) {
                            el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el.removeAttribute('contenteditable');
                        });

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.find('.gg-add') ? null : o.classList.add('display-none'));

                    }
                    toolset.classList.remove('display-none');

                } else {

                    var media = selected.closest('[media]') ? selected.closest('[media]').getAttribute('media') : null;
                    0 < 1 ? console.log({
                        focus: 'within',
                        el,
                        selected
                    }, {
                        media,
                        node
                    }) : null;

                    if (el === "box") {
                        if (media) {
                            var id = selected.dataset.id;
                            if (id) {
                                toolset.classList.remove('display-none');
                                console.log(id);
                            } else {
                                var json = is.json(media) ? JSON.parse(media) : false;
                                if (json) {
                                    console.log('mixed', media);
                                    toolset.classList.remove('display-none');
                                } else {
                                    toolset.classList.remove('display-none');
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
                        } else {
                            if (node) {
                                if (elements.includes(nodeName)) {
                                    if (nodeName === 'text') {}
                                    if (nodeName === 'picture') {}
                                    if (nodeName === 'video') {}
                                    if (nodeName === 'audio') {}
                                    if (nodeName === 'line') {}
                                    if (nodeName === 'embed') {}
                                    toolbar.classList.remove('display-none');
                                    $(toolbar.children).addClass('display-none');
                                    console.log(toolbar, nodeName);
                                    toolbar.find('[tag="' + nodeName + '"]').classList.remove('display-none');
                                } else {
                                    toolset.classList.remove('display-none');
                                }
                                console.log({
                                    toolset,
                                    toolbox,
                                    toolbar
                                });
                            } else {
                                toolset.classList.remove('display-none');
                            }
                        }
                    }
                }
            }
        }
    }
}

//ELEMENTS
window.elements = {};

window.elements.block = function(target) {
    console.log(target);
}

window.elements.card = function(target) {
    console.log(target);
}

window.elements.box = function(target) {
    console.log(target);
}

//TOOL
window.tool = {}

window.tool.set = {};
window.tool.set.tab = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;

    var ppp = target.closest('aside');

    var header = target.closest('header');
    $(header.children).addClass('border-bottom-1px-solid');

    var box = target.closest('box');
    box.classList.remove('border-bottom-1px-solid');

    var tabs = header.parentNode.all('column');
    var tab = $(tabs)[box.index()];

    $(tabs).attr('data-display', 'none')
    tab.removeAttribute('data-display');

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
