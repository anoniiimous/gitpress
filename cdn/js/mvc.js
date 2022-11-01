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
    console.log(108, {
        route
    });

    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        controller.nav.close();

        $(dom.body.all('aside')).remove()

        if (root) {

            if (root === "dashboard") {
                if (get.length > 1) {
                    const title = get[1];
                    dom.body.find('main > nav [placeholder]').textContent = title;
                } else {
                    if (auth.user()) {
                        const settings = {};
                        console.log(settings);
                        const user = await github.user.get(); console.log({user},user.login);
                        github.search.repositories("q=blog.anoniiimous+user%3A"+user.login).then(data => {
                            data = data.filter(item => item.name.includes('blog.anoniiimous'));
                            console.log({data});
                            const feed = byId('feed-dashboard');
                            feed.innerHTML = "";
                            if(data.length > 0) {
                                const template = byId('template-feed-dashboard').content.firstElementChild.cloneNode(true);
                                var x = 0;
                                do {
                                    const row = data[x];
                                    const shortname = row.name.split('.')[2];;
                                    template.find('text').dataset.href = "/dashboard/" + shortname;
                                    template.find('text').dataset.owner = row.owner.login;
                                    template.find('text').dataset.repo = row.name;
                                    template.find('text').innerHTML = shortname
                                    feed.insertAdjacentHTML('beforeend', template.outerHTML);
                                    x++;
                                } while(x < data.length);
                            }
                        });
                    }
                }
                resolve(route);
            } else if (root === "setup") {
                var vp = dom.body.find('[data-pages="/setup/"]');
                if (get.length > 1) {
                    $(vp.all('form > header box flex')).attr("data-height", "30px");
                    $(vp.all('form > header box flex')).attr("data-width", "30px");
                    vp.all('block[data-step]')[0].find('input[type="text"]').value = get[1];
                    vp.all('block[data-step]')[0].find('[data-goto="two"]').classList.remove('opacity-50pct');
                    vp.all('block[data-step]')[0].find('[data-goto="two"]').dataset.disabled = "false";
                    if (get.length > 2) {
                        if (get.length > 3) {
                            $(vp.all('form > header box flex')[2]).attr("data-height", "50px");
                            $(vp.all('form > header box flex')[2]).attr("data-width", "50px");
                            $(vp.all('block[data-step]')).addClass('display-none');
                            $(vp.all('block[data-step]')[2]).removeClass('display-none');
                        } else {
                            $(vp.all('form > header box flex')[1]).attr("data-height", "50px");
                            $(vp.all('form > header box flex')[1]).attr("data-width", "50px");
                            $(vp.all('block[data-step]')).addClass('display-none');
                            $(vp.all('block[data-step]')[1]).removeClass('display-none');

                            var sel = "iro-setup-about-brand";
                            if (byId(sel).innerHTML === "") {
                                var width = byId(sel).clientWidth - 51;
                                var picker = new iro.ColorPicker("#" + sel,{
                                    width,
                                    color: "#f00",
                                    layout: [{
                                        component: iro.ui.Box
                                    }, {
                                        component: iro.ui.Slider,
                                        options: {
                                            sliderType: "hue"
                                        }
                                    }],
                                    layoutDirection: "horizontal",
                                    margin: 20,
                                    sliderSize: 30
                                });
                                picker.on("color:change", function(color) {
                                    var icon = byId("build-app-icon");
                                    var hexString = color.hexString;
                                    var rgb = color.rgb;
                                    var rgbString = rgb.r + "," + rgb.g + "," + rgb.b;
                                    var hsl = color.hsl;
                                    var hslString = hsl.h + "," + hsl.s + "%," + hsl.l + "%";
                                    byId("color-data-hex").all('text')[1].textContent = hexString;
                                    byId("color-data-rgb").all('text')[1].textContent = rgbString;
                                    byId("color-data-hsl").all('text')[1].textContent = hslString;
                                    //icon.style.backgroundColor = hexString;
                                    //icon.style.color = colors.contrast(hexString);
                                    //icon.dataset.contrast = icon.style.color;
                                });
                                picker.on("mount", function(e) {
                                    console.log(e);
                                    const base = e.base;
                                    base.classList = "height-100pct IroColorPicker position-absolute top-0 width-100pct";
                                    picker.resize(dom.body.clientWidth > 480 ? 390 : dom.body.clientWidth - 90);
                                });
                                window.addEventListener("resize", ()=>byId("color-picker").clientWidth > 0 ? picker.resize(byId("color-picker").clientWidth - 90) : null);
                            }

                        }
                    } else {
                        $(vp.all('form > header box flex')[0]).attr("data-height", "50px");
                        $(vp.all('form > header box flex')[0]).attr("data-width", "50px");
                        $(vp.all('block[data-step]')).addClass('display-none');
                        $(vp.all('block[data-step]')[0]).removeClass('display-none');
                    }
                } else {
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
                provider.addScope('repo');
                provider.addScope('delete_repo');
                provider.setCustomParameters({
                    'redirect_uri': 'https://codepen.io/anoniiimous/pen/WNMvNoY'
                });

                firebase.auth().signInWithPopup(provider).then((result)=>{
                    var credential = result.credential;
                    var token = credential.accessToken;
                    var user = result.user;
                    console.log({
                        result
                    });
                    localStorage.setItem('githubAccessToken', token);
                }
                ).catch((error)=>{
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
                    console.log({
                        error
                    });
                }
                );
            }
        }

    }

});
