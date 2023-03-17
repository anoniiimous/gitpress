
            var host = window.location.host;
            var protocol = window.location.protocol;
            var domains = host.split('.');
            var subdomain = domains[domains.length - 3];
            var domain = domains[domains.length - 2];
            var tld = domains[domains.length - 1];
            if (domain === "github" && tld === "tld") {
                host = "dompad." + domain + '.' + tld;
            }
            if (domain === "dompad" && tld === "io") {
                host = "dompad.io";
            }
            if (domain === "pages" && tld === "dev") {
                host = "dompad.pages.dev";
            }
            if (window.self !== window.top) {
                host = window.parent.location.host;
                protocol = window.parent.location.protocol;
            }