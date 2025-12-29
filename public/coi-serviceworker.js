/*! coi-serviceworker v0.1.7 - Guido Zuidhof and contributors, licensed under MIT */
let coepCredentialless = false;
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

    self.addEventListener("message", (ev) => {
        if (!ev.data) {
            return;
        } else if (ev.data.type === "deregister") {
            self.registration.unregister()
                .then(() => {
                    return self.clients.matchAll();
                })
                .then(clients => {
                    clients.forEach(client => client.navigate(client.url))
                });
        } else if (ev.data.type === "coepCredentialless") {
            coepCredentialless = ev.data.value;
        }
    });

    self.addEventListener("fetch", function (event) {
        const r = event.request;
        if (r.cache === "only-if-cached" && r.mode !== "same-origin") {
            return;
        }

        const request = (coepCredentialless && r.mode === "no-cors")
            ? new Request(r, {
                credentials: "omit",
            })
            : r;
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy",
                        coepCredentialless ? "credentialless" : "require-corp"
                    );
                    if (!coepCredentialless) {
                        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    }

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });

} else {
    (() => {
        const reloadedByCoiServiceWorker = window.sessionStorage.getItem("coiReloadedByCoiServiceWorker");
        window.sessionStorage.removeItem("coiReloadedByCoiServiceWorker");
        const coepDegrading = (reloadedByCoiServiceWorker == "coepdegrade");

        // You can customize the behavior of this script through a global `coi` variable.
        const coi = {
            shouldRegister: () => !reloadedByCoiServiceWorker,
            shouldDeregister: () => false,
            coepCredentialless: () => true,
            doReload: () => window.location.reload(),
            quiet: false,
            ...window.coi
        };

        const n = navigator;
        const controlling = n.serviceWorker && n.serviceWorker.controller;

        // Record the failure if the page is served by serviceWorker.
        if (controlling && !window.crossOriginIsolated) {
            window.sessionStorage.setItem("coiReloadedByCoiServiceWorker", coepDegrading ? "coepdegrade" : "reload");
            // Delay so that we don't get a race condition with threads trying to update sessionStorage
            setTimeout(() => coi.doReload(), 0);
        }

        // Only if we're in a secure context...
        if (!window.crossOriginIsolated && window.isSecureContext && coi.shouldRegister()) {
            if (!controlling) {
                // Probe for SharedArrayBuffer support (or other reasons to enable coi)
                // In some environments (e.g. Firefox private mode) this can cause a console message to be logged.
                if (typeof SharedArrayBuffer !== "undefined") {
                    if (!coi.quiet) console.log("✅ SharedArrayBuffer is supported");
                } else {
                    if (!coi.quiet) console.log("❌ SharedArrayBuffer is not supported");
                }

                n.serviceWorker.register(window.document.currentScript.src).then(
                    (registration) => {
                        if (!coi.quiet) console.log("✅ ServiceWorker registered", registration.scope);

                        registration.addEventListener("updatefound", () => {
                            if (!coi.quiet) console.log("✅ ServiceWorker update found", registration.scope);
                        });

                        // If the registration is active, but it's not controlling the page
                        if (registration.active && !n.serviceWorker.controller) {
                            if (!coi.quiet) console.log("✅ ServiceWorker active");
                            window.sessionStorage.setItem("coiReloadedByCoiServiceWorker", "reload");
                            coi.doReload();
                        }
                    },
                    (err) => {
                        if (!coi.quiet) console.error("❌ ServiceWorker failed to register", err);
                    }
                );
            }
        } else {
            if (!coi.quiet) console.log("✅ Already cross-origin isolated or in insecure context");
        }

        if (coi.shouldDeregister()) {
            n.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    if (registration.scope.indexOf(window.origin) === 0) {
                        registration.unregister();
                    }
                }
            });
        }

        if (controlling) {
            controlling.postMessage({
                type: "coepCredentialless",
                value: coi.coepCredentialless(),
            });
        }
    })();
}
