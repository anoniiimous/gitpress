window.modal = {
    card: (h,style,className)=>{
        var ppp = document.createElement('aside')
        ppp.setAttribute('class', 'aside body-aside card');
        ppp.innerHTML = `<section><card class="card">` + h + `</card></section>`;
        ppp.onclick = event=>{
            event.target.classList.contains('aside') ? event.target.remove() : null
        }
        ;
        var card = ppp.firstElementChild;
        if (style && Object.keys(style).length > 0) {
            card.style = style;
            card.className = className;
            var i = 0;
            do {
                var key = Object.keys(style)[i];
                card.style[key] = style[key];
                i++;
            } while (i < Object.keys(style).length);
            style["max-width"] ? card.style["max-width"] = style["max-width"] : null;
            style["width"] ? card.style["width"] = style["width"] : null;
            style["left"] ? card.style["left"] = style["left"] : null;
            style["bottom"] ? card.style["bottom"] = style["bottom"] : null;
            style["top"] ? card.style["top"] = style["top"] : null;
            style["right"] ? card.style["right"] = style["right"] : null;
            style["border-radius"] ? card.style["border-radius"] = style["border-radius"] : null;
            card.setAttribute('class', 'aside body-aside panel');
        }
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    panel: (h,style,className)=>{
        console.log({
            h,
            style,
            className
        });
        var ppp = document.createElement('aside');
        ppp.innerHTML = h;
        var card = ppp.children[0];
        if (style) {
            card.style = style;
            card.style["margin"] = style["margin"];
            card.style["max-width"] = style["max-width"];
            card.style["width"] = style["width"];
            card.style["left"] = style["left"];
            card.style["bottom"] = style["bottom"];
            card.style["top"] = style["top"];
            card.style["right"] = style["right"];
            card.style["border-radius"] = style["border-radius"];
        }
        ppp.setAttribute('class', 'aside body-aside panel');
        className ? card.className = className : null;
        //ppp.onclick = event => { //console.log(event);
        //event.target.classList.contains('aside') ? event.target.remove() : null
        //};
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside'));
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    hints: (h,style,className)=>{
        //console.log({h, style, className});
        var ppp = document.createElement('aside');
        ppp.innerHTML = h;
        var card = ppp;
        if (style) {
            //card.style = style;
            var styles = Object.keys(style);
            var s = 0;
            do {
                var style = styles[s];
                var value = Object.values(style)[s];
                card.style[style] = value;
                s++;
            } while (s < styles.length);
        }
        ppp.setAttribute('class', 'aside body-aside panel');
        card.className = className;
        //ppp.onclick = event => { //console.log(event);
        //event.target.classList.contains('aside') ? event.target.remove() : null
        //};
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside'));
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    page: async(h,style,className)=>{
        //console.log(style);
        var ppp = document.createElement('aside');
        ppp.innerHTML = h;
        if (style) {
            var keys = Object.keys(style);
            if (keys.length > 0) {
                var k = 0;
                do {
                    var key = keys[k];
                    ppp.style[key] = style[key];
                    k++;
                } while (k < keys.length);
            }
        }
        (className) ? ppp.setAttribute('class', className) : null;

        const fetching2 = ppp.all('[data-fetch]');
        console.log({
            ppp,
            fetching2,
        });
        if (fetching2.length > 0) {
            var ff = 0;
            do {
                if (fetching2[ff].innerHTML === "") {
                    fetching2[ff].innerHTML = await ajax(fetching2[ff].dataset.fetch);
                }
                ff++;
            } while (fetching2.length < 0);
        }

        ppp.onclick = event=>{
            //console.log(event);
            if (event.target.classList.contains('aside')) {
                event.target.remove()
            }
        }
        ;
        byId('boot').insertAdjacentHTML('afterend', ppp.outerHTML);
        modal.zIndex(document.querySelectorAll('aside'));
        dom.body.classList.add('overflow-hidden');
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    alert: async(h,ppp=document.createElement('aside'))=>{
        var innerHTML = await ajax('raw/asset/html/modal/modal.alert.html');
        var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;
        h.title ? html.find('[placeholder="Title"]').textContent = h.title : null;
        h.body ? html.find('[placeholder="Body"]').textContent = h.body : null;
        h.submit ? html.find('[placeholder="OK').textContent = h.submit : null;
        ppp.innerHTML = html.outerHTML;
        ppp.onclick = event=>{
            var io = false;
            if (event.target.classList.contains('aside')) {
                event.target.remove();
            } else {
                var target = event.target;
                var ok = target.closest("[placeholder='OK']");
                if (ok) {
                    modal.exit(target);
                }
            }
        }
        ;
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
    }
    ,
    confirm: async(h,opt,callBack,ppp=document.createElement('aside'))=>{
        return new Promise(async(resolve,reject)=>{
            var innerHTML = await ajax('raw/asset/html/modal/modal.confirm.html');
            var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;
            html.find('[placeholder="Title"]').textContent = h.title;
            html.find('[placeholder="Body"]').textContent = h.body;
            html.find('[placeholder="No"]').textContent = opt[0];
            html.find('[placeholder="Yes"]').textContent = opt[1];
            ppp.innerHTML = html.outerHTML;
            ppp.onclick = event=>{
                var io = false;
                if (event.target.classList.contains('aside')) {
                    event.target.remove();
                } else {
                    var target = event.target;
                    var confirm = target.closest("[placeholder='Yes']");
                    var cancel = target.closest("[placeholder='No']");
                    if (confirm || cancel) {
                        io = confirm ? true : false;
                        modal.exit(target);
                        resolve(io);
                    }
                }
            }
            ;
            dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
            modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
        }
        );
    }
    ,
    counter: 0,
    dropdown: async(dropdown,settings,ppp=document.createElement('aside'))=>{
        return new Promise(async(resolve,reject)=>{

            var multi = settings && settings.multi;
            var other = settings && settings.other;

            var innerHTML = await ajax('raw/asset/html/modal/modal.dropdown.html');
            var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;

            html.find('[placeholder="Title"]').textContent = settings && settings.title ? settings.title : dropdown.find('[placeholder]').getAttribute('placeholder');
            html.find('card > section').innerHTML = dropdown.children[1].innerHTML;

            if (other === false) {
                html.find('form').dataset.display = "none";
            }

            if (html.find('card > section').children.length > 0) {
                $(html.find('card > section').all('box text ico')).removeClass('color-0096c7')
                $(html.find('card > section').all('box text ico')).addClass('border-color-ccc')
                $(html.find('card > section').all('box text span')).removeClass('color-0096c7')
            }

            if (dropdown.find('[placeholder]').textContent.length > 0) {
                var attribute = dropdown.find('[placeholder]').textContent;
                var span = html.find('card > section box text span[data-after="' + attribute + '"]');
                if (span) {
                    var box = span.closest('box');
                    box.find('box text ico').classList.add('color-0096c7')
                    box.find('box text ico').classList.remove('border-color-ccc')
                    box.find('box text span').classList.add('color-0096c7')
                }
            }
            ppp.innerHTML = html.outerHTML;
            ppp.onclick = event=>{
                if (event.target.closest('card')) {
                    var box = event.target.closest('card > section > box text');
                    if (box) {
                        dropdown.find("[placeholder]").textContent = box.find('span').dataset.after;
                        dropdown.children[1].innerHTML = ppp.find('card > section').innerHTML;
                        modal.exit(event.target);
                        resolve(ppp.find('card > section').children);
                    }
                    var ico = event.target.closest('card > section > box ico');
                    if (ico) {
                        event.target.closest('box').remove();
                        if (ico.closest('box').find('span').classList.contains('color-0096c7')) {
                            dropdown.find("[placeholder]").textContent = "";
                        }
                    }
                    var none = event.target.closest('card > row > box');
                    if (none) {
                        dropdown.children[1].innerHTML = ppp.find('card > section').innerHTML;
                        dropdown.find("[placeholder]").textContent = "";
                        modal.exit(event.target);
                        resolve(ppp.find('card > section').children);
                    }
                } else {
                    if (multi) {
                        var attribute = multi.find('[placeholder]').textContent;
                        var column = document.createElement('column');
                        column.dataset.attribute = attribute;
                        column.innerHTML = ppp.find('card > section').innerHTML;
                        var element = dropdown.lastElementChild.find('[data-attribute="' + attribute + '"]');
                        //dropdown.lastElementChild.appendChild(column);
                        //alert(element.outerHTML);
                        modal.exit(event.target);
                        resolve(ppp.find('card > section').children);
                    } else {
                        dropdown.children[1].innerHTML = ppp.find('card > section').innerHTML;
                        modal.exit(event.target);
                        resolve(ppp.find('card > section').children);
                    }
                }
            }
            ppp.find('form').onsubmit = event=>{
                event.preventDefault();
                var form = event.target;
                var input = form.find('input');
                var value = input.value;
                var template = form.parentNode.find('template').content.firstElementChild;
                template.find('span').dataset.after = value;
                ppp.find('card > section').insertAdjacentHTML('beforeend', template.outerHTML);
                input.value = "";
            }
            dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
            modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
            dom.body.classList.add('overflow-hidden');
        }
        );
    }
    ,
    exit: target=>{
        target.closest('aside').remove();
        dom.body.classList.remove('overflow-hidden');
    }
    ,
    popup: (h,ppp=document.createElement('aside'))=>{
        byId('boot').insertAdjacentHTML('afterend', `<aside class="aside body-aside popup"">` + h + `</aside>`);
        modal.zIndex(document.querySelectorAll('aside'));
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    prompt: async(h,opt,value,ppp=document.createElement('aside'))=>{
        return new Promise(async(resolve,reject)=>{
            var innerHTML = await ajax('raw/asset/html/template/template.modal.prompt.html');
            var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;
            html.find('[placeholder="Title"]').textContent = h.title;
            html.find('[placeholder="Body"]').textContent = h.body;
            html.find('input').setAttribute('value', value);
            html.find('[placeholder="No"]').textContent = opt[0];
            html.find('[placeholder="Yes"]').textContent = opt[1];
            ppp.innerHTML = html.outerHTML;
            ppp.onclick = event=>{
                var io = false;
                if (event.target.classList.contains('aside')) {
                    event.target.remove();
                } else {
                    var target = event.target;
                    var confirm = target.closest("[placeholder='Yes']");
                    var cancel = target.closest("[placeholder='No']");
                    if (confirm || cancel) {
                        io = confirm ? target.closest('card').find('input').value : false;
                        modal.exit(target);
                        resolve(io);
                    }
                }
            }
            ;
            dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
            modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
        }
        );
    }
    ,
    input: (html,callBack,ppp=document.createElement('aside'))=>{
        ppp.setAttribute('class', 'aside body-aside card');
        ppp.innerHTML = html;
        ppp.onclick = event=>{
            var target = event.target;
            if (target.classList.contains('aside')) {
                target.remove();
            }
        }
        ;
        ppp.find('form').onsubmit = event=>{
            event.preventDefault();
            callBack(event.target.find('[name="code"]').value);
            modal.exit(event.target);
        }
        ;
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
    }
    ,
    select: (html,callBack,ppp=document.createElement('aside'))=>{
        ppp.setAttribute('class', 'aside body-aside card');
        ppp.innerHTML = html;
        ppp.onclick = event=>{
            if (event.target.classList.contains('aside')) {
                event.target.remove();
            } else {
                var target = event.target;
                var el = target.closest('[data-value]');
                if (el) {
                    callBack(el.dataset.value);
                    modal.exit(target);
                }
            }
        }
        ;
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
    }
    ,
    await: async(h,callBack)=>{
        var ppp = document.createElement('aside');
        ppp.innerHTML = h;
        ppp.className = "aside body-aside";
        ppp.onclick = event=>{
            console.log(event);
            event.target.classList.contains('aside') ? event.target.remove() : null
        }
        ;
        byId('boot').insertAdjacentHTML('afterend', ppp.outerHTML);
        modal.zIndex(document.querySelectorAll('aside'));
        callBack;
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    zIndex: elem=>elem.forEach((v,k)=>{
        v.style.zIndex = 123456789 + (elem.length - k);
    }
    )
};
