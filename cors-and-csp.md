# The problem

On the one hand, CORS may prevent the editor's instance of w2c-core from
fetching target HTMLs needed for XPath selection steps.

On the other hand, CSP may prevent us from injecting the editor's sidebar on
the target webpage.

# The solutions

## Messages between frames

Our w2c-core wrapper's translate method may preload target webpage's HTML cache.
To do so, we may have cross-frame fetcher utility that posts a message to the
parent page requesting that it fetches the required resource. This message would
include a request ID so that when a response is received we can fulfill or
reject the corresponding pending promise.

Aditionally, we would need to inject a message handler on the target page, that
receives and handles the messages sent from our iframe.

### Pros
* Works with our bookmarklet, which collaborators can use without installing
anything on their browsers.

### Cons
* This only solves the CORS issue. We won't be able to inject the sidebar if the
target page has some strict CSP policy.
* This won't work in the standalone editor, as we don't have the parent webpage
there. Note that the standalone editor may be useful for users accessing from
mobile devices, and for webpages with strict CSP policies.

## CORS proxy

We could set up a CORS proxy that makes sure we can access any resource from
w2c-core running on a browser.

### Pros
* This would work both for the sidebar and the standalone version of the editor.
* We make sure collaborator get the same HTML version that the translation
server does.

### Cons
* This does not solve the CSP issue, although we'll have the standalone editor
for these cases.
* All HTTP requests would go through us.

## Browser extension

### Pros
* This would solve both the CORS and the CSP issues.
* The script won't have to be downloaded every time that one wants to use it.

### Cons
* Users have to install it to use it.
* Mobile users won't be able to use it in most cases (although honestly most of
them won't be able to use the bookmarklet version either).

## Remote Web2Cit

w2c-editor is prepared to use different w2c-core wrappers. The one currently
developed is a wrapper for a local w2c-core instance running on the browser.
However, a wrapper for a remote w2c-core instance (e.g., w2c-server) would be
implementable.

# Pros
* We make sure users get the exact same results they will get using our
translation server.

# Cons
* Our servers would be involved in all edition attempts, as well as all requests
to external sources.
  
# Discussion

The standalone version would be useful for mobile users, and in cases where one
wants to make some changes without having to visit the target webpage, or
without having to download the sidebar or install an extension.

However, the only ways to have the standalone version working seem to be with
a CORS proxy or with a remote wrapper, which would require our servers be
involved more than we may want.

A browser extension may support a standalone version, but that would not work
for most mobile users (because extensions are usually not supported).

Regarding the sidebar mode, the browser extension seems the most promising,
because it solves both the CORS and the CSP issues. However, having to install
a browser extension may discourage some users who may prefer using a bookmarklet
instead.

In addition, developing the extension would mean some extra effort at the
current stage of development.

# Conclusion

We may begin with the cross-frame messaging approach, as it may be used in a
browser-extension version later on.

Later, we may try developing a browser-extension version, which only supports
working as a sidebar at first. Standalone editing may come later.

Finally, we may develop a remote wrapper or deploy a CORS proxy, which would
only be used for non-extension standalone editor.