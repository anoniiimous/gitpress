window.github = {
    endpoint: "https://api.github.com",
    oauth: {
        authorize: async(params,sl)=>{
            var code = params.code;
            var state = params.state;
            var client_id = github.oauth.client_id[location.host];
            var redirect_uri = github.oauth.config.redirect_uri;
            var settings = {
                data: JSON.stringify({
                    client_id,
                    code,
                    redirect_uri,
                    state
                }),
                dataType: "POST"
            };
            var endpoint = "https://oauth.dompad.workers.dev";
            if (sl) {
                endpoint = "https://github.com/login/oauth/authorize";
                settings.mode = "cors";
            }
            var obj = {
                state
            }
            //var query = new URLSearchParams(obj).toString();
            //endpoint + "?" + query;
            console.log(509, "mvc.js", {
                endpoint,
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
        }
        ,
        client_id: {
            "dompad.io": "1a41e41b2b371e7a1a5b",
            "dompad.pages.dev": "fdeadaa98b35c6df688c",
            "dompad.github.tld": 0 < 1 ? "d100ccbc44112f0d5a92" : "Iv1.cbe275c17b8db02d"
        },
        config: {
            client_id: 0 > 1 ? "Iv1.cbe275c17b8db02d" : "d100ccbc44112f0d5a92",
            redirect_uri: window.location.protocol + "//" + window.location.host + "/dashboard/",
            scope: "delete_repo,user,public_repo,repo"
        },
        login: (target)=>{
            var client_id = github.oauth.client_id[location.host];
            var redirect_uri = github.oauth.config.redirect_uri;
            var search = route.search;

            var scope = github.oauth.config.scope;
            var state = 'github_' + Crypto.uid.create(1);
            var obj = {
                client_id,
                scope,
                state,
                redirect_uri
            }
            var query = new URLSearchParams(obj).toString();

            var a = document.createElement('a');
            var href = "https://github.com/login/oauth/authorize?" + query;
            a.href = href;
            a.click();
            console.log(534, "mvc.js", {
                href,
                obj,
                query
            });
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
        blob: async(params)=>{
            return new Promise((resolve,reject)=>{
                fetch("https://api.github.com/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource, {
                    cache: "reload",
                    headers: {
                        Accept: "application/vnd.github.raw",
                        Authorization: "token " + localStorage.githubAccessToken
                    }
                }).then(async(response)=>{
                    if (response.status === 404) {
                        var res = await response.json();
                        var json = {
                            json: res,
                            error: new Error(response.status)
                        }
                        throw json;
                    } else {
                        return response.blob()
                    }
                }
                ).then((blob)=>{
                    resolve(URL.createObjectURL(blob));
                }
                ).catch((e)=>{
                    reject(e.json)
                }
                );
            }
            );
        }
        ,
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
        res: async(params)=>{
            return new Promise((resolve,reject)=>{
                fetch("https://api.github.com/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource, {
                    cache: "reload",
                    headers: {
                        Accept: "application/vnd.github.raw",
                        Authorization: "token " + localStorage.githubAccessToken
                    }
                }).then(async(response)=>{
                    if (response.status === 404) {
                        var res = await response.json();
                        var json = {
                            json: res,
                            error: new Error(response.status)
                        }
                        throw json;
                    } else {
                        return response.text();
                    }
                }
                ).then((blob)=>{
                    resolve(URL.createObjectURL(blob));
                }
                ).catch((e)=>{
                    reject(e.json)
                }
                );
            }
            );
        }
        ,
        git: async(resource)=>{
            var r = rout.ed.dir(resource);
            var repo = r[1];
            r.splice(0, 3);
            var path = rout.ed.url(r);
            var user = await github.user.get();
            var owner = user.login;
            //console.log({owner, path, repo});
            return await github.repos.contents({
                owner,
                path,
                repo
            }, {
                accept: "application/vnd.github.raw",
                cache: "reload"
            });
        }
        ,
        path: async(resource)=>{
            var r = rout.ed.dir(resource);
            var repo = r[1];
            r.splice(0, 3);
            var path = rout.ed.url(r);
            var user = await github.user.get();
            var owner = user.login;
            //console.log({owner, path, repo});
            return await github.repos.contents({
                owner,
                path,
                repo
            }, {
                //accept: "application/vnd.github.raw",
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
                            const encoding = params.encoding ? settings.encoding = params.encoding : null
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
                            console.log(173, params, {
                                url,
                                settings
                            });
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
            if (settings) {
                if (settings.dataType) {
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
            } else {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var ref = branch ? "/heads/" + branch : params.ref;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings = {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        }
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }

        }
        ,
        trees: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
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
            } else {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var sha = params.sha;
                    var recursive = params.recursive ? "?recursive=" + params.recursive : "";
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha + recursive;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings = {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        }
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
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
    pages: {
        crud: function(params, settings) {
            console.log(586, params, settings);
            return new Promise((resolve,reject)=>{
                console.log(588, params, settings);
                const owner = params.owner;
                const repo = params.repo;
                const path = params.path;
                const url = github.endpoint + "/repos/" + owner + "/" + repo + "/pages";
                const a = (d)=>{
                    const data = d ? JSON.parse(d) : null;
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                settings = settings ? settings : {};
                accessToken ? settings.headers = {
                    Accept: settings && settings.accept ? settings.accept : "application/vnd.github+json",
                    Authorization: "token " + accessToken,
                    'If-None-Match': ''
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    repos: {
        contents: (params,settings)=>{
            //console.log(555, {params, settings});
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
                            Accept: settings.accept ? settings.accept : "application/vnd.github+json",
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
                            Accept: settings.accept ? settings.accept : "application/vnd.github+json",
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
                settings ? null : settings = {};
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const path = params.path;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                    0 > 1 ? console.log(695, {
                        url
                    }) : null;
                    const a = (d)=>{
                        const data = is.json(d) ? JSON.parse(d) : d;
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    settings.cache = "reload";
                    accessToken ? settings.headers = {
                        Accept: settings.accept ? settings.accept : "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        create: (settings)=>{
            return new Promise((resolve,reject)=>{
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
                    Accept: "application/vnd.github.v3+json",
                    Authorization: "token " + accessToken
                } : null;
                const url = github.endpoint + "/user/repos";
                settings.dataType = "POST";
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        delete: async(params)=>{
            const owner = params.owner;
            const repo = params.repo;
            console.log({
                owner,
                repo
            });
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/repos/" + owner + "/" + repo;
                const dataType = "DELETE";
                const a = (d)=>{
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
        ,
        get: (params)=>{
            return new Promise((resolve,reject)=>{
                const owner = params.owner;
                const repo = params.repo;
                const url = github.endpoint + "/repos/" + owner + "/" + repo;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings = {
                    headers: {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    }
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        update: (params,settings)=>{
            return new Promise((resolve,reject)=>{
                const owner = params["owner"];
                const repo = params["repo"];
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
                settings.dataType = "PATCH";
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
    rate: {
        limit: ()=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/rate_limit";
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
    },
    user: {
        get: (prams)=>{
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
        repos: (params,settings)=>{
            var params = params ? params : {};
            var settings = settings ? settings : {};
            console.log(params, settings);
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{   
                        const sort = params.sort;
                        const url = github.endpoint + "/users/" + username + "/repos" + params.query;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            console.log(766, {
                                d
                            });
                            resolve(d);
                        }
                        const b = (error)=>{
                            console.log(770, {
                                error
                            });
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log(777, {
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                return new Promise((resolve,reject)=>{
                    console.log(params.query);
                    const query = params.query ? "?" + new URLSearchParams(params.query).toString() : "";
                    const url = github.endpoint + "/users/" + params.username + "/repos" + query;
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
    },
    users: {

        get: (params)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/users/" + params.username;
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

    }
}
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
window.github.crud.read = ()=>{}
window.github.crud.update = async(params,array)=>{
    console.log(2466, 'controller.posts.update', "variables", {
        params,
        array
    });

    var user = await github.user.get();
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
                    data: JSON.stringify({
                        content: row.content,
                        encoding: row.type ? row.type : "utf-8"
                    }),
                    dataType: "POST"
                }).catch(error=>{
                    console.log(2504, 'github.database.blobs', error, row);
                }
                );
            }
            console.log(1076, row);
            tree[b] = {
                content: row.content,
                path: row.path,
                mode: "100644",
                type: "blob",
                sha: res && res.sha ? res.sha : ""
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
        path: "/raw/merch",
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
                var dir = rout.ed.dir(trx.path);
                var ttt = 0;
                do {
                    var d = rout.ed.dir(trx.path)[ttt];
                    var dd = rout.ed.dir(trx.path).splice(0, ttt + 1);
                    var ddu = rout.ed.url(dd).replace(/^\/|\/$/g, '');
                    var dp = rout.ed.dir(ddu);
                    tr = tr.filter(row=>{
                        var rp = rout.ed.dir(row.path);
                        var here = ddu.startsWith(row.path) && rp.has(dp);
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
                var tp = rout.ed.dir(trt.path);
                0 > 1 ? console.log(1161, t, row.path, trt.path, {
                    tp
                }, {
                    row,
                    trt,
                    treet: tree[t]
                }) : null;
                //0 < 1 ? console.log(1198, row) : null;
                tree.forEach(row=>{
                    var rp = rout.ed.dir(row.path);
                    var here = row.path.startsWith(trt.path)
                    // && rp.has(tp);
                    //0 < 1 ? console.log(1177, trt.path) : null;
                    if (row.content === null || here) {
                        0 > 1 ? console.log(1177, rp.has(tp), {
                            rp,
                            tp
                        }, row, trt.path) : null;
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
        var tp = rout.ed.dir(r);
        tree.filter(row=>{
            var rp = rout.ed.dir(row.path);
            //console.log(1238, tp, row.path);
            if (rp.has(tp)) {
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
            data: JSON.stringify({
                "tree": tree
            }),
            dataType: "POST"
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
            data: JSON.stringify({
                "message": message,
                "parents": [references.object.sha],
                "tree": trees.sha
            }),
            dataType: "POST"
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
            data: JSON.stringify({
                force: true,
                sha: commits.sha
            }),
            dataType: "PATCH"
        });
        //var sha = refs.object.sha;
        console.log("references", {
            refs
        });
    }

}
window.github.crud.delete = ()=>{}
