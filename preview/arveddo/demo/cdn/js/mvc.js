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

        $(dom.body.all('aside')).remove()

        if (root) {

            const roots = ["dashboard"];
            if (roots.indexOf(root) === -1) {
                const owner = root;
                const repo = "blog.cms." + get[1];
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
                    dom.body.find('[placeholder="App Name"]').textContent = json.name;
                }
                ).catch(async(error)=>{
                    console.log("43.error", {
                        error
                    });
                }
                );

                if (get[2] === "posts") {
                    if (get.length > 3) {
                        const owner = root;
                        const repo = "blog.cms." + get[1];
                        const path = "/cdn/html/posts/" + get[3] + ".html";
                        const params = {
                            owner,
                            repo,
                            path
                        }
                        const settings = {}
                        const vp = dom.body.find('[data-page="/*/*/posts/*/"]');
                        vp.all('block')[1].find('text').textContent = "";
                        github.repos.contents(params, settings).then(data=>{
                            const content = data.content;
                            const raw = atob(content);
                            const doc = new DOMParser().parseFromString(raw, "text/html");
                            //const json = JSON.parse(raw);
                            console.log(49, {
                                data
                            });
                            vp.all('block')[0].find('text').textContent = doc.head.find('title').textContent;
                            vp.all('block')[1].find('text').textContent = doc.body.find('article').innerHTML;
                            //vp.find('[placeholder="Site"]').textContent = json.name;
                            //controller.blog.render(byId('iframe-user-blog'), json);
                        }
                        ).catch(async(error)=>{
                            console.log("43.error", {
                                error
                            });
                        }
                        );
                    }
                    resolve(route);
                }
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

    blog: {

        render: (iframe,json)=>{

            const theme = json["theme_color"];

            const doc = iframe.contentWindow.document;
            doc.body.style.backgroundColor = theme;

            const owner = GET[0];
            const repo = "blog.cms." + GET[1];
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
                vp.find('[placeholder="Site"]').textContent = json.name;
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
