# Express React

A server side React renderer that embeds into your templating language. Inspired by ReactRails/ReactOnRails.

**Features**

- Lightweight
- Full SSR support
- Typescript

## Demos

TODO - Demo for JS version

TODO - Demo for TS version

## Installation

Via npm

```
npm install @brawcode/express-react
```

Via yarn

```
yarn add @brawcode/express-react
```

## Setup

Express React has been designed to work as a middleware with ExpressJS. It ensures that the `react_render` view helper function is exposed to your templating engine. **This setup guide assumes you know how to configure webpack and babel**.

Add it to your app like so:

```js
import express from "express";
import expressReact from "@brawcode/express-react";

const app = express();
app.use(expressReact());
```

We now need to do 3 things.

- Create and register a React component
- Render that component in a view on the server
- Sync client and server DOM (hydrate)

We will keep it simple and create a HelloReact component.

```jsx
import React from "react";

export const HelloReact = () => {
  return <h1>Hello!</h1>;
};
```

Create a file called `register.js` somewhere in your project. (I create mine under `assets/javascripts`). In here we are going to import our component and register it. The name is what you will use to reference it when you render it in your views, so make it something meaningful.

```js
import { registerComponent } from "@brawcode/express-react";
import { HelloReact } from "./components/HelloReact";

registerComponent({
  Component: HelloReact,
  name: "hello-react",
});
```

I am a big fan of the Pug templating language but you can use whatever template language you like. Here is my simple Pug template.

```pug
html
  head
    title Hello Express!
  body
    =! react_render("hello-react")
```

In here we call `react_render` and pass it the name of the component we want to render. Simple! By default this will render your component on the server before sending the markup to the front end. However, we are missing once thing. We want to make the component _reactive_ right?

Add a new js file called `application.js` and include it in your template via a script tag. In pug this would look like this:

```pug
script(src="/dist/javascripts/application.bundle.js")
```

This assumes that your webpack is configured to output a file called `application.bundle.js` into the `dist` folder whenever you compile.

In `application.js` all we have to do is tell `ExpressReact` that this code is client side, and it should hydrate the DOM. It looks a like this:

```js
import { client } from "@brawcode/express-react";

client();
```

That's it. ExpressReact will hydrate the dom and attach event listeners as required and now your component will be reactive! You can test this by adding some state, and a button to do some stuff:

```jsx
export const HelloReact = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <h1>Hello!</h1>
      <p> Counter: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Increase</button>
    </div>
  );
};
```

## Passing props

It would be a bit pointless if you couldn't pass props to your component serverside! All we have to do is change our `react_render` call to take some props.

```pug
=! react_render("hello-react", { name: "Bobby" })
```

Or you could use a variable from express.

```js
router.get("/", (req, res) => {
  render("path/to/your/view/template", { name: "Bobby" });
});
```

```pug
=! react_render("hello-react", { name })
```

In our component, we just treat it as normal props:

```jsx
export const HelloReact = ({ name }) => {
  return <h1>Hello {name}!</h1>;
};
```

## Static props

There is some but limited support for static props. These are props that are passed into your component without you having to do to it every time. You can do this by changing how you add the middleware:

```js
app.use(
  expressReact({
    name: "Bobby",
  })
);
```

Now the `name` prop will be available in **all registered components** even if you don't pass them during render.

## Render options

You can pass a per render options object when you call `react_render` to customize how that render will behave.

```pug
=! react_render("hello-react", { name }, { /** options here */})
```

### Options

```js
// Available options and their defaults
{
  /**
   * Enables or disables server side rendering for the given component.
   * This may improve performance on the server, large components that don't need to
   * be rendered serverside can be client only
   */
  ssr: true;
}
```

## Typescript

Typescript support is included and the types are documented.

---

## Contributing

You are free to contribute to this project in anyway you see fit. A few good places to start is better static prop support and more test coverage.

## License

MIT
