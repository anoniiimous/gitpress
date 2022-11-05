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
                    if (get.length > 2) {
                        if (get[2] == "posts") {
                            if (get.length > 3) {
                                if (get.length > 4) {
                                    const user = await github.user.get();
                                    const name = get[4] + '.html';
                                    console.log({
                                        user
                                    }, user.login);
                                    var params = {
                                        owner: user.login,
                                        path: "/cdn/html/posts/" + name,
                                        repo: "blog.cms." + get[1]
                                    };
                                    var settings = {};
                                    github.repos.contents(params, settings).then(data=>{
                                        console.log(50, {
                                            data
                                        });
                                        var vp = dom.body.find('pages[data-pages="/dashboard/*/posts/post/"]');
                                        if (data) {
                                            vp.find('input[type="text"]').value = data.name;
                                            vp.find('textarea').value = atob(data.content);
                                        }
                                    }
                                    ).catch(async(error)=>{
                                        console.log("43.error", {
                                            error
                                        });
                                        if (error.code === 404) {
                                            //alert("Setup Project");
                                            const html = await ajax('/cdn/html/page/page.setup.html');
                                            modal.page(html);
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
                                    path: "/cdn/html/posts",
                                    repo: "blog.cms." + get[1]
                                };
                                var settings = {};
                                github.repos.contents(params, settings).then(data=>{
                                    console.log(50, {
                                        data
                                    });
                                    var vp = dom.body.find('page[data-page="/dashboard/*/posts/"]');
                                    if (data.length > 0) {
                                        const feed = byId('feed-dashboard-posts');
                                        feed.innerHTML = "";
                                        vp.all('card')[1].find('box').classList.remove('display-none');
                                        var x = 0;
                                        do {
                                            const row = data[x];
                                            const template = byId('template-dashboard-posts');
                                            const card = template.content.firstElementChild.cloneNode(true);
                                            const title = row.name.split('.')[0];
                                            console.log(row.name, {
                                                title
                                            });
                                            //title.splice(0, 3);
                                            card.dataset.sha = row.sha;
                                            card.firstElementChild.find('text').dataset.href = "/dashboard/:get/posts/post/" + title + '/';
                                            card.firstElementChild.find('text').textContent = title;
                                            feed.insertAdjacentHTML('beforeend', card.outerHTML)
                                            x++;
                                        } while (x < data.length);
                                    } else {
                                        vp.all('card')[1].find('box').classList.add('display-none');
                                    }
                                }
                                ).catch(async(error)=>{
                                    console.log("43.error", {
                                        error
                                    });
                                    if (error.code === 404) {
                                        //alert("Setup Project");
                                        const html = await ajax('/cdn/html/page/page.setup.html');
                                        //modal.page(html);
                                        resolve(route);
                                    }
                                }
                                );
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
                        }
                    }

                    const user = await github.user.get();
                    console.log({
                        user
                    }, user.login);
                    var params = {
                        owner: user.login,
                        path: "/site.webmanifest",
                        repo: "blog.cms." + get[1]
                    };
                    var settings = {};
                    github.repos.contents(params, settings).then(data=>{
                        const content = data.content;
                        const raw = atob(content);
                        const json = JSON.parse(raw);
                        console.log(43, {
                            data,
                            json
                        });
                        dom.body.find('main > nav').find('[placeholder="Project Name"]').textContent = json.name;
                    }
                    ).catch(async(error)=>{
                        console.log("43.error", {
                            error
                        });
                        if (error.code === 404) {
                            //alert("Setup Project");
                            const html = await ajax('/cdn/html/page/page.setup.html');
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
                        console.log({
                            user
                        }, user.login);
                        github.search.repositories("q=blog.cms+user%3A" + user.login).then(data=>{
                            data = data.filter(item=>item.name.includes('blog.cms'));
                            console.log({
                                data
                            });
                            const feed = byId('feed-dashboard');
                            feed.innerHTML = "";
                            if (data.length > 0) {
                                const template = byId('template-feed-dashboard').content.firstElementChild.cloneNode(true);
                                var x = 0;
                                do {
                                    const row = data[x];
                                    const shortname = row.name.split('.')[2];
                                    ;template.find('text').dataset.href = "/dashboard/" + shortname;
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

    posts: {

        delete: async(target)=>{
            console.log(target);
            const user = await github.user.get();
            const params = {
                repo: 'blog.cms.' + GET[1],
                owner: user.login,
                path: 'cdn/html/posts/' + target.closest('box').previousElementSibling.find('text').textContent + '.html',
                sha: target.closest('card').dataset.sha
            }
            const settings = {
                data: JSON.stringify({
                    message: 'Delete ' + params.path,
                    sha: params.sha
                }),
                dataType: "DELETE"
            }
            const a = ()=>{
                target.closest('card').remove();
            }
            const b = (error)=>{
                alert(error.message);
            }
            github.repos.contents(params, settings).then(a).catch(b);
        }

    },

    setup: {

        category: (target)=>{
            const box = target.closest('box');
            if (box) {
                $(box.parentNode.all('box')).removeClass('color-ff3b30');
                box.classList.add('color-ff3b30');
                box.closest('block').find('footer [data-complete]').dataset.complete = true;
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
                provider.addScope('repo');
                provider.addScope('delete_repo');

                firebase.auth().signInWithRedirect(provider);
            }
        }

    }

});
