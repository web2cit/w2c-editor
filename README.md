# Web2Cit Editor

The editor can be injected as a sidebar on the page you are visiting using our
bookmarklet.

Alternatively, it can be used as a standalone editor.

## Sidebar (bookmarklet)

The bookmarklet injects the editor as a sidebar inside an iframe.

We need to use an iframe so that we can reach metawiki for configuration files,
and wikipedia for the Citoid API. Otherwise, it may be blocked by CSP policies
of the target page.

Note: CCSP may block loading the editor into the iframe altogether.
There may be cases where CSP would allow loading the editor (script-src *), but
forbid fetching config files or Citoid responses (connect-src).
See https://bugs.chromium.org/p/chromium/issues/detail?id=233903
See https://bugzilla.mozilla.org/show_bug.cgi?id=866522
As of 2020, 7% of websites have CSP enabled: https://www.rapid7.com/blog/post/2020/11/02/overview-of-content-security-policies-csp-on-the-web/
Should we consider avoiding the burden of using an iframe?
Alternatively, using the standalone editor would not work with w2c-core wrapper
if the target webpage uses CORS.
Options left include having a browser extension, or a w2c-server wrapper.


The bookmarklet also injects a fetcher on the parent page, so we can fetch
HTML source code needed by some selection steps, in cases where CORS policy
would forbid doing so from the iframe.

# Known issues
The bookmarklet loads an embed.js script from Web2Cit servers. This will fail if
the parent page uses CSP to restrict script sources.

The embed.js script creates an iframe sidebar which loads the editor from
Web2Cit servers. This will fail with some CSP policies (e.g. frame).

The editor may need to fetch HTML sources from the target web server. This is
done either from the editor sidebar injected by the bookmarklet, or from the
standalone editor. Hence, it won't work if the target server uses CORS.

A solution for the latter would involve loading a fetcher to the parent page
and have the sidebar iframe communicate with it via frame rpc to preload the
webpage cache of w2c-core.

Finally, the best solution would be having a browser extension.

# Deploying on Toolforge
npm complains that React is not compatible with node<14. Consider running
`npm install` from a shell launched as `webservice --backend=kubernetes node16 shell`.

If `npm run build` is throwing a `RpcIpcMessagePortClosedError: Process xx exited [SIGKILL]`
error, it may be that we run out of memory. See https://github.com/TFNS/CTFNote/issues/126.
Try running from a shell launched as `webservice --mem 4Gi` to increase memory.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
