# Materia - Angular Universal

Enable Server Side Rendering for your angular application

## Features

- Extend Materia Server express app with @nguniversal

## Installation from NPM

In your Materia application, run `yarn add @materia/angular-universal` or `npm install @materia/angular-universal --save`

Restart Materia Designer

## Installation from local files

Clone this repository:

```
git clone git@github.com:geoastronaute/materia-angular-universal.git
cd materia-angular-universal
```

Then install dependencies and build:

```
yarn
yarn build:prod
```

To test your addon locally before publishing it to NPM, use `npm link` or `yarn link`:

```
cd dist && npm link
```

and in your materia application

```
npm link @materia/angular-universal
```

then add `"@materia/angular-universal"` in the links array of your materia.json config file - it will let Materia knows of the existance of the linked addon.
