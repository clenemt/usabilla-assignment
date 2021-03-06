# usabilla-assignment [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/clenemt/docdash/blob/master/LICENSE.md)

A sample react assignment. Feel free to fork, copy and modify as needed.

## Example

See https://clenemt.github.io/usabilla-assignment/ for a look at the code live. :rocket:

## How to

To run the sample locally, do the following:

```sh
npm install
npm run start
```

It will install dependencies and launch a small server at [localhost:9000](http://localhost:9000).

## Explanation

It only runs **thanks to**:

* [webpack-dev-server](https://github.com/webpack/webpack-dev-server) for the simple http server
* [axios](https://github.com/axios/axios) for the promise based HTTP client
* [store.js](https://github.com/marcuswestin/store.js/) for the Cross-browser storage API
* [fuse.js](http://fusejs.io/) for the fuzzy-search library

Most of the user actions (page, search, sort, filter) are saved to local storage and restored when you reload for a better UX.

Try clicking the nav for some easter egg.

Tests only runs **thanks to**:

* [Jest](https://github.com/facebook/jest) for assertion and test running
* [Enzyme](https://github.com/airbnb/enzyme) for rendering react components

## Guidelines

* [Prettier](https://github.com/prettier/prettier) is used for style consistencies in all files
* [ESlint](http://eslint.org/) is used for linting the `.js` files
* [EditorConfig](http://editorconfig.org/) is used to enforce correct spacings on all files
* The above is **enforced when you try to commit**
* Commits should be in the form of:

```
<emoji> <title>

# 📝 Update README.md
# ✅ Add unit test for inputs
```

For ease of use you can use the template provided above. The following command will add it as default for this repo only:

```
git config commit.template .gitmessage
```

## Contributing

To make a build for github pages, do the following:

```sh
npm run build
```

Make sure all the tests succeeds before you do so:

```sh
npm run test
```

Check the created bundles for inconsistencies with:

```sh
npm run stats
```

## License

Licensed under [MIT](LICENSE.md).
