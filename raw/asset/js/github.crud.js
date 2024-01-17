window.github.crud = {};
window.github.crud.create = async(event)=>{
    var row = [];
    event.preventDefault();
    var form = event.target;
    var value = form.find('[type="text"]').value;
    //alert(value);

    if (0 < 1 && value.length > 0) {
        const user = await github.user.get();
        const fix = value.toLowerCase();
        const filename = "page." + fix.split(' ').join('-') + ".html";

        const message = "Add " + value + " to Posts";
        const content = "";

        var rte = rout.ed.dir(route.path);
        rte.splice(0, 4);

        event.target.closest('form').find('[type="submit"]').removeAttribute('disabled');
        event.target.closest('form').find('[data-submit]').classList.remove('opacity-50pct');

        var page = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
        var path = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
        var row = {
            slug: value.replaceAll(' ', '-').replaceAll(/[\u0250-\ue007]/g, '').replaceAll(/\W/g, "").toLowerCase(),
            title: value
        };
        var sha = null;

        try {
            var data = await github.repos.contents({
                owner: user.login,
                repo: GET[1],
                path: "/raw/posts/posts.json"
            });
            var sha = data.sha;
            var j = JSON.parse(atob(data.content));
            var json = JSON.parse(atob(data.content));
            json.push(row);
        } catch (e) {
            var j = [];
            var json = [row];
        }
        rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
        var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
        var str = JSON.stringify(rows, null, 4);

        inc ? alert("This item already exists.") : github.repos.contents({
            owner: user.login,
            repo: GET[1],
            path: "/raw/posts/posts.json"
        }, {
            data: JSON.stringify({
                content: btoa(unescape(encodeURIComponent(str))),
                message,
                sha
            }),
            dataType: "PUT"
        }).then(()=>{
            "/dashboard/:get/posts/".router()
            event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
            event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
        }
        ).catch(e=>{
            console.log(e);
            0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                body: "There was an error creating this page.",
                submit: "OK",
                title: "Error"
            })) : null;
        }
        );

    }
}
window.github.crud.delete = ()=>{}
window.github.crud.read = ()=>{}
github.crud.update = async(params,array)=>{
    console.log(2466, 'controller.posts.update', "variables", {
        params,
        array
    });

    //var user = await github.users.user();
    var message = params.message;
    var owner = params.owner;
    var repo = params.repo;

    //REFERENCES
    var references = await github.database.references({
        branch: "main",
        owner,
        repo
    }).then((data)=>{
        return data;
    }
    );
    var sha = references.object.sha;
    console.log(2466, 'controller.posts.update', "references", {
        references,
        sha
    });

    //TREE
    var tree = [];
    if (array.length > 0) {
        var b = 0;
        do {
            var row = array[b];
            if (row.content) {
                var res = await github.database.blobs({
                    owner,
                    repo
                }, {
                    body: JSON.stringify({
                        content: row.content,
                        encoding: row.type ? row.type : "utf-8"
                    }),
                    method: "POST"
                }).catch(error=>{
                    console.log(2504, 'github.database.blobs', error, row);
                }
                );
            }
            var sha = null;
            console.log(49, {row, res});
            if(row && row.sha) {
                sha = row.sha;
            } else {
                if(res && res.sha) {
                    sha = res && res.sha ? res.sha : ""
                }
            }
            console.log(1076, row);
            tree[b] = {
                content: row.content,
                path: row.path,
                mode: "100644",
                type: "blob",
                sha: sha
            };
            b++;
        } while (b < array.length)
    }
    console.log(2517, 'controller.posts.update', "tree", {
        tree
    });

    //TREES GET
    var trees = await github.database.trees({
        owner,
        path: "/",
        recursive: true,
        repo,
        sha: references.object.sha
    }).catch(error=>{
        console.log(2530, 'GET github.database.trees', error);
    }
    );
    var rt = trees.tree;
    var tr = trees.tree;
    console.log(1122, 'controller.posts.update', "GET trees", {
        rt,
        tr
    });
    if (tr.length > 0) {
        var t = 0;
        do {
            var tt = 0;
            var trt = tr[t];
            do {
                var trx = tree[tt];
                var dir = trx.path.split('/').filter(o=>o.length > 0);
                var ttt = 0;
                do {
                    var d = trx.path.split('/').filter(o=>o.length > 0)[ttt];
                    var dd = trx.path.split('/').filter(o=>o.length > 0).splice(0, ttt + 1);
                    var ddu = (dd.length > 0 ? dd.join('/') : "/").replace(/^\/|\/$/g, '');
                    var dp = ddu.split('/').filter(o=>o.length > 0);
                    tr = tr.filter(row=>{
                        var rp = row.path.split('/').filter(o=>o.length > 0);
                        var here = ddu.startsWith(row.path) && dp.every(v=>rp.includes(v));
                        return !here;
                    }
                    )
                    0 > 1 ? console.log(t, tt, ttt, {
                        ddu,
                        trt: trt.path,
                        trx: trx.path
                    }, {
                        trt
                    }) : null;
                    ttt++;
                } while (ttt < dir.length);
                tt++;
            } while (tt < tree.length);
            t++;
        } while (t < tr.length)
    }
    tree = tr.concat(tree);
    var treef = [];
    //console.log(1180, tree);
    if (tree.length > 0) {
        tree.sort((a,b)=>a.path.localeCompare(b.path));
        //console.log(1183, tree);
        //var del = tree.filter(row=>row.content === null)
        var t = 0;
        do {
            var trt = tree[t];
            if ("content"in trt && trt.content === null) {
                treef.push(trt.path);
                //console.log(1191, t, treef, trt.path);
            }
            //0 > 1 || trt.content === null ? console.log(1167, t, trt) : null;
            if ("content"in trt && trt.content === null) {
                var tp = trt.path.split('/').filter(o=>o.length > 0);
                0 > 1 ? console.log(1161, t, row.path, trt.path, {
                    tp
                }, {
                    row,
                    trt,
                    treet: tree[t]
                }) : null;
                //0 < 1 ? console.log(1198, row) : null;
                tree.forEach(row=>{
                    var rp = row.path.split('/').filter(o=>o.length > 0);
                    var here = row.path.startsWith(trt.path)
                    // && rp.has(tp);
                    //0 < 1 ? console.log(1177, trt.path) : null;
                    if (row.content === null || here) {
                        //0 > 1 ? console.log(1177, rp.has(tp), {
                            //rp,
                            //tp
                        //}, row, trt.path) : null;
                        0 > 1 ? tree = tree.filter(r=>{
                            if (row.path === r.path) {//console.log(row.path, r.path);
                            }
                            return row.path !== r.path;
                        }
                        ) : null;
                    }
                    //return !here
                    //return !row.path.startsWith(trt.path) && !rout.ed.dir(row.path).has(tp)
                }
                )
                //tree = tree.filter(row=>(!row.path === trt.path))
                //tree = tree.filter(row=>(!row.path.startsWith(trt.path)))
                //tree = tree.filter(row=>(!rout.ed.dir(row.path).has(tp)))
            }
            t++;
        } while (t < tree.length);
    }
    var i = 0;
    //console.log(1227, treef);
    var treex = [];
    0 < 1 ? treef.forEach(r=>{
        var tp = r.split('/').filter(o=>o.length > 0);
        tree.filter(row=>{
            var rp = row.path.split('/').filter(o=>o.length > 0);
            //console.log(1238, tp, row.path);
            var every = tp.every(v=>rp.includes(v));
            if (every) {
                console.log(1240, i, row);
                treex.push(row.path);
                //delete row.content;
                //return row;
            } else {//console.log(1243, i, row);
            //return !rp.has(tp);
            //return row;
            }
            i++;
        }
        )
    }
    ) : null;
    var treen = tree.filter((el)=>{
        delete el.content;
        //console.log(1256, treex.includes(el.path), treex, el, el.path);
        return !treex.includes(el.path)
    }
    )
    tree = treen;
    console.log(1227, {
        tree,
        treef,
        treex,
        treen
    });
    var diff = {
        deleted: rt.filter(function(obj) {
            return !tree.some(function(el) {
                return el.path === obj.path
            })
        }).filter(function(el) {
            return el.type === "blob"
        }),
        removed: rt.filter(function(obj) {
            return !tree.some(function(el) {
                return el.path === obj.path
            })
        }),
        keep: rt.filter(function(obj) {
            return tree.some(function(el) {
                return el.path === obj.path
            })
        })
    };
    console.log(2533, 'controller.posts.update', "GET trees", {
        diff,
        trees: trees.tree,
        tree,
        rt,
        tr
    });

    //TREES POST
    if (0 < 1) {
        var trees = await github.database.trees({
            owner,
            repo
        }, {
            body: JSON.stringify({
                "tree": tree
            }),
            method: "POST"
        }).catch(error=>{
            console.log(2530, 'POST github.database.trees', error);
        }
        );
        console.log(2537, 'controller.posts.update', "POST trees", {
            trees
        });
    }

    //COMMIT
    if (0 < 1) {
        var commits = await github.database.commits({
            owner,
            repo
        }, {
            body: JSON.stringify({
                "message": message,
                "parents": [references.object.sha],
                "tree": trees.sha
            }),
            method: "POST"
        }).catch(error=>{
            console.log(2530, 'POST github.database.commits', error);
        }
        );
        console.log(2575, 'controller.posts.commits', {
            commits
        });
    }

    //REFERENCES
    if (0 < 1) {
        var refs = await github.database.references({
            branch: "main",
            owner,
            repo
        }, {
            body: JSON.stringify({
                force: true,
                sha: commits.sha
            }),
            method: "PATCH"
        });
        //var sha = refs.object.sha;
        console.log("references", {
            refs
        });

        return refs;
    }

}