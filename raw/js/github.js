window.github = {
    endpoint: "https://api.github.com",
    oauth: {
        authorize: async(params,sl)=>{
            var code = params.code;
            var state = params.state;
            var client_id = github.oauth.config.client_id;
            var redirect_uri = github.oauth.config.redirect_uri;
            var settings = {
                data: JSON.stringify({
                    client_id,
                    code,
                    redirect_uri
                }),
                dataType: "POST"
            };
            var endpoint = "https://oauth.dompad.workers.dev/";
            if (sl) {
                endpoint = "https://github.com/login/oauth/authorize";
                settings.mode = "cors";
            }
            console.log(509, "mvc.js", {
                settings
            });
            try {
                var result = JSON.parse(await ajax(endpoint, settings));
                console.log(526, "mvc.js", {
                    result
                });
                var token = result.token;
                if (token) {
                    localStorage.setItem('githubAccessToken', token);
                }
            } catch (e) {
                console.log(e);
            }
        },
        config: {
            client_id: "Iv1.cbe275c17b8db02d",
            redirect_uri: window.location.protocol + "//" + window.location.host + "/dashboard/",
            scope: "user,public_repo,repo"
        },
        login: (target)=>{
            var client_id = github.oauth.config.client_id;
            var redirect_uri = github.oauth.config.redirect_uri;
            var search = route.search;

            var scope = github.oauth.config.scope;
            var state = Crypto.uid.create(1);
            var obj = {
                client_id,
                scope,
                state,
                redirect_uri
            }
            var query = new URLSearchParams(obj).toString();
            console.log(534, "mvc.js", {
                obj,
                query
            });

            var a = document.createElement('a');
            var href = "https://github.com/login/oauth/authorize?" + query;
            a.href = href;
            a.click();
        }
        ,
        logout: ()=>{
            localStorage.removeItem('githubAccessToken');
            dom.body.removeAttribute('data-uid');
        }
        ,
        verify: ()=>{
            return localStorage.githubAccessToken;
        }
    },
    raw: {
        file: (resource)=>{
            return new Promise((resolve,reject)=>{
                var host = 'https://raw.dompad.workers.dev';
                var url = host + resource + '?token=' + localStorage.githubAccessToken;
                var settings = {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'token ' + localStorage.githubAccessToken
                    },
                    mode: 'cors'
                };
                const a = (data)=>{
                    resolve(data);
                }
                ajax(url).then(a);
            }
            );
        }
        ,
        git: (resource)=>{
            return new Promise((resolve,reject)=>{
                var host = 'https://raw.githubusercontent.com';
                var url = host + resource;
                var settings = {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'token ' + localStorage.githubAccessToken
                    },
                    mode: 'cors'
                };
                const a = (data)=>{
                    resolve(data);
                }
                ajax(url, settings).then(a);
            }
            );
        }
        ,
        path: async(resource)=>{
            var r = rout.ed.dir(resource);
            var repo = r[1];
            r.splice(0, 3);
            var path = rout.ed.url(r);
            var user = await github.user.get();
            var owner = user.login;
            return await github.repos.contents({
                owner,
                path,
                repo
            }, {
                cache: "reload"
            });
        }
    },
    database: {
        blobs: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "POST") {
                        return new Promise((resolve,reject)=>{
                            const data = settings.data;
                            const owner = params.owner;
                            const repo = params.repo;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs";
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            //console.log({ url, settings });
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const sha = params.sha;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs/" + sha;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    var settings = {};
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    //console.log({ url, settings });
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        commits: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        var message = params.message;
                        var owner = params.owner;
                        var repo = params.repo;
                        var sha = params.sha;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/commits";
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        references: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "GET") {
                    return new Promise((resolve,reject)=>{
                        var owner = params.owner;
                        var repo = params.repo;
                        var branch = params.branch;
                        var ref = branch ? "/heads/" + branch : params.ref;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
                if (settings.dataType === "PATCH") {
                    return new Promise((resolve,reject)=>{
                        var owner = params.owner;
                        var repo = params.repo;
                        var branch = params.branch;
                        var ref = branch ? "/heads/" + branch : "";
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }

        }
        ,
        trees: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "GET") {
                    return new Promise((resolve,reject)=>{
                        var owner = params.owner;
                        var repo = params.repo;
                        var branch = params.branch;
                        var sha = params.sha;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        var owner = params.owner;
                        var repo = params.repo;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
    },
    gists: {
        create: (settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        update: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "PATCH") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists/" + params.gist;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        delete: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "DELETE") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists/" + params.gist;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        get: (params,settings)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/gists";
                const data = settings.data;
                const dataType = settings.dataType;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    repos: {
        contents: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "DELETE") {
                    console.log(7, {
                        params,
                        settings
                    });
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents/" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                } else if (settings.dataType === "PUT") {
                    console.log(params);
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken,
                            'If-None-Match': ''
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                } else {
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken,
                            'If-None-Match': ''
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const path = params.path;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    settings.cache = "reload";
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        create: (params,settings)=>{
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const owner = "anoniiimous";
                        const repo = "blog.template.default";
                        const url = github.endpoint + "/repos/" + owner + "/" + repo;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        delete: (target)=>{
            console.log(target);
            const box = target.closest('box');
            const owner = box.find('text').dataset.owner;
            const repo = box.find('text').dataset.repo;
            const name = box.find('text').textContent;
            if (confirm("Are you sure you wnat to delete the project entitled " + name + "?")) {
                return new Promise((resolve,reject)=>{
                    const url = github.endpoint + "/repos/" + owner + "/" + repo;
                    const dataType = "DELETE";
                    const a = (d)=>{
                        box.remove();
                        console.log(d);
                        resolve(d);
                    }
                    const b = (error)=>{
                        console.log(error);
                        alert(error.message.message);
                        reject(error);
                    }
                    const settings = {
                        dataType
                    };
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log({
                        settings
                    });
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        generate: (params,settings)=>{
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const template_owner = params["template_owner"];
                        const template_repo = params["template_repo"];
                        const url = github.endpoint + "/repos/" + template_owner + "/" + template_repo + "/generate";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
    },
    search: {
        code: (query)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/search/code?" + query;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    console.log({
                        data
                    });
                    resolve(data.items);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const settings = {};
                settings.cache = "reload";
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        repositories: (query)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/search/repositories?" + query;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    console.log({
                        data
                    });
                    resolve(data.items);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    user: {
        get: ()=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/user";
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    //alert(error.message.message);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        repos: (settings)=>{
            var settings = settings ? settings : {};
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/user/repos";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                return new Promise((resolve,reject)=>{
                    const url = github.endpoint + "/user/repos?direction=desc&per_page=100&sort=updated";
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    settings.cache = "reload";
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log(url, settings);
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
    }
}
