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

        if (root) {

            if (root === "dashboard") {
                if (get.length > 1) {
                    const title = get[1];
                    dom.body.find('main > nav [placeholder]').textContent = title;
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
            const token = localStorage.githubAccessToken;
            if (token) {
                var credential = firebase.auth.GithubAuthProvider.credential(token);
                firebase.auth().signInWithCredential(credential).then((result)=>{
                    //alert("Signed in with credential.");
                }
                ).catch((error)=>{
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.email;
                    // ...
                }
                );
            } else {
                var provider = new firebase.auth.GithubAuthProvider();
                provider.addScope('repo');
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
