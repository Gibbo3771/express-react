/**
MIT License

Copyright (c) 2020 Stephen Gibson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import { renderToString } from "react-dom/server";
import { hydrate, render } from "react-dom";
import React from "react";
import { RequestHandler } from "express";

/**
 * A registered component
 */
export interface RegisteredComponent<T = {}> {
  /**
   * The name given to the component
   */
  name: string;
  /**
   * The component itself
   */
  Component: React.ComponentType<T>;
}

export interface ComponentData<T = {}> {
  /**
   * The name of the component that is to be hydrated, this component must first
   * be registered before it can be used
   */
  name: string;
  /**
   * The props that are used to hydrate the component
   */
  props?: T;
  /**
   * Options for this components render pass
   */
  options: RenderOptions;
}

/**
 * Options that are passed to the react_render helper function
 */
export interface RenderOptions {
  /**
   * Determines if the component should be renderer using SSR
   * Defaults to true
   */
  ssr: boolean;
}

export const defaultOptions: RenderOptions = {
  ssr: true,
};

export class ExpressReact {
  /**
   * All the components that are registered with the renderer
   */
  registeredComponents: RegisteredComponent[];

  constructor() {
    this.registeredComponents = [];
  }

  /**
   * Checks if the script is running server side or in the browsers.
   * Evaluated by checking of module.exports and window exists
   */
  isServer = (): boolean => {
    return (
      typeof module !== "undefined" &&
      module.exports &&
      typeof window === "undefined"
    );
  };

  /**
   * Finds a registered component
   * @param name The name of the component
   */
  find = (name: string) => {
    const registered = this.registeredComponents.find((c) => c.name === name);
    if (!registered)
      throw new Error(
        `Can't render ${name} as it has not found to be registered`
      );
    return registered;
  };

  /**
   * Registers a component
   * @param name The name to give the component
   */
  register = <T extends {} = {}>(component: RegisteredComponent<T>): void => {
    if (this.registeredComponents.find((c) => c.name === component.name))
      throw new Error(
        `Component already registered with the name "${component.name}". Make sure you are not registered the same component twice, or using the same name for two different components`
      );
    this.registeredComponents.push(component);
  };

  /**
   * Renders a registered component
   * @param name The name of the component to render
   * @param initialProps Props to pass to the component for the SSR
   * @param options
   */
  render = (
    name: string,
    initialProps?: any,
    options: RenderOptions = defaultOptions
  ) => {
    const data: ComponentData = {
      name,
      props: initialProps,
      options,
    };
    const registered = this.find(name);
    const partial = options.ssr
      ? React.createElement(registered.Component, initialProps)
      : null;
    const root = React.createElement(
      "div",
      {
        "data-reactroot": JSON.stringify(data),
      },
      partial
    );

    return renderToString(root);
  };

  /**
   * Should be called client side in order to hydrate or render the DOM.
   * Without this, the page will NOT be reactive
   */
  client = () => {
    if (this.isServer())
      throw new Error(
        "Tried to initialize express react client side but was called on server"
      );

    document.addEventListener("DOMContentLoaded", () => {
      const propsElements = document.querySelectorAll(`[data-reactroot]`);
      propsElements.forEach((el) => {
        const attr = el.getAttribute("data-reactroot");
        const data: ComponentData = JSON.parse(attr);
        const { props, name, options } = data;
        const registered = this.find(name);
        options.ssr
          ? hydrate(React.createElement(registered.Component, props), el)
          : render(React.createElement(registered.Component, props), el);
        el.removeAttribute("data-reactroot");
      });
    });
  };
}

const instance = new ExpressReact();

/**
 * Registers a component
 * @param name The name to give the component
 */
export const registerComponent = instance.register;

/**
 * Should be called client side in order to hydrate or render the DOM.
 * Without this, the page will NOT be reactive
 */
export const client = instance.client;

/**
 * Middleware for Express app. Position in the middleware stack does not affect the rendering process
 * @param staticProps Props that you want to make available to every react component
 */
export default function <T extends any = {}>(staticProps?: T): RequestHandler {
  return (res, req, next) => {
    req.locals.react_render = (
      name: string,
      initialProps?: any,
      options: RenderOptions = defaultOptions
    ) => {
      return instance.render(
        name,
        { ...staticProps, ...initialProps },
        options
      );
    };
    next();
  };
}
