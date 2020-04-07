# Express React

A server side React renderer that embeds into your templating language. Inspired by ReactRails/ReactOnRails.

---

# Getting started

## Installation

TODO - add npm instructions. Current issue with npm org account

## Setup

Express React has been designed to work as a middleware with ExpressJS. It ensures that the `react_render` view helper function is exposed to your templating engine.

Add it to your app like so:

```js
import express from "express";
import expressReact from "express-react";

const app = express();
app.use(expressReact());
```

We now need to do 3 things.

- Register a React component
-

_Documentation is yet to come, as test coverage and cleaning up of the code is required. No NPM package yet._
