window.modal = {
    card: (h,style,className)=>{
        var ppp = document.createElement('aside')
        ppp.setAttribute('class', 'aside body-aside card');
        ppp.innerHTML = `<section><card class="card">` + h + `</card></section>`;
        ppp.onclick = event=>{
            //console.log(event);
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
    page: (h,style,className)=>{
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
        ppp.onclick = event=>{
            //console.log(event);
            event.target.classList.contains('aside') ? event.target.remove() : null
        }
        ;
        byId('boot').insertAdjacentHTML('afterend', ppp.outerHTML);
        modal.zIndex(document.querySelectorAll('aside'));
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
    }
    ,
    alert: (h,ppp=document.createElement('aside'))=>{
        ppp.setAttribute('class', 'aside body-aside card');
        ppp.innerHTML = `<section class="card-confirm"><card class="card"><section>` + h + `</section></card></section>`;
        ppp.onclick = event=>{
            if (event.target.classList.contains('aside')) {
                event.target.remove();
            }
            return confirm;
        }
        ;
        dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
    }
    ,
    confirm: async(h,opt,callBack,ppp=document.createElement('aside'))=>{
        return new Promise(async(resolve,reject)=>{
            var innerHTML = await ajax('raw/html/template/template.modal.confirm.html');
            var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;
            html.find('[placeholder="Title"]').textContent = h.title;
            html.find('[placeholder="Body"]').textContent = h.body;
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
                    }
                }
                resolve(io);
            }
            ;
            dom.body.insertBefore(ppp, byId('boot').nextElementSibling);
            modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
        }
        );
    }
    ,
    counter: 0,
    exit: target=>target.closest('aside').remove(),
    popup: (h,ppp=document.createElement('aside'))=>{
        byId('boot').insertAdjacentHTML('afterend', `<aside class="aside body-aside popup"">` + h + `</aside>`);
        modal.zIndex(document.querySelectorAll('aside'));
        return new Promise((resolve,reject)=>resolve(byId('boot').nextElementSibling));
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
