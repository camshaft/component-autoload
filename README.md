component-autoload
==================

An autoload plugin for component

Usage
-----

`component-autoload` assumes the following directory structure by default:

```sh
├── component.json
└── public
    ├── fonts
    │   └── Proxima-Nova.woff
    ├── images
    │   └── cat.gif
    ├── javascripts
    │   └── index.js
    ├── partials
    │   └── index.jade
    │   └── users.html
    └── stylesheets
        ├── hello.styl
        ├── index.styl
        └── testing.css
```

```sh
$ component build --use component-autoload
```
