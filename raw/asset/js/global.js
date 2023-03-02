var domains = window.location.host.split('.');
window.isIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(window.location.host.split(':')[0]);
window.hub = (isIp)

window.database = {
    dashboard: {},
    user: {}
};

window.global = window.globals = {
    database,
    domains: {
        domain: domains.length > 1 ? domains[domains.length - 2] : null,
        subdomain: domains.length > 2 ? domains[domains.length - 3] : null,
        tld: domains[domains.length - 1]
    }
};

window.global.dashboard = {}
window.global.dashboard.routes = ["build", "config", "files", "media", "merch", "pages", "posts"];