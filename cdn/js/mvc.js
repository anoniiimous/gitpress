window.mvc ? null : (window.mvc = {});

window.mvc.m ? null : (window.mvc.m = model = {});

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

        if (root) {

            if (root === "activity") {
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

window.mvc.c ? null : (window.mvc.c = controller = {});
