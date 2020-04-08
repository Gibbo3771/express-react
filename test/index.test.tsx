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

import {
  ExpressReact,
  registerComponent,
  client,
  RegisteredComponent,
} from "../src/index";
import React from "react";

type Props = {
  name: string;
};

const Component: React.FC<Props> = ({ name }) => {
  return <div>Hello, {name}</div>;
};

describe("ExpressReact", () => {
  describe("component registration", () => {
    let instance: ExpressReact;

    beforeEach(() => {
      instance = new ExpressReact();
    });

    it("contains an empty list when a new instance is created", () => {
      expect(instance.registeredComponents).toBeDefined();
      expect(instance.registeredComponents.length).toEqual(0);
    });

    it("the module exports a function to register components", () => {
      expect(registerComponent).toBeDefined();
    });

    it("a component can be registered", () => {
      instance.register({ name: "test", Component });
      expect(instance.registeredComponents.length).toEqual(1);
    });

    it("duplicate component names should throw an error", () => {
      instance.register({ name: "test", Component });
      const register = () => {
        instance.register({ name: "test", Component });
      };
      expect(register).toThrowError(
        'Component already registered with the name "test". Make sure you are not registered the same component twice, or using the same name for two different components'
      );
    });
  });

  describe("finding registered component", () => {
    let instance: ExpressReact;
    let registeredComponent: RegisteredComponent = {
      name: "test",
      Component,
    };

    beforeEach(() => {
      instance = new ExpressReact();
      instance.register(registeredComponent);
    });

    it("a registered component should be found if it exists", () => {
      expect(instance.find("test")).toEqual(registeredComponent);
    });

    it("if a component is not found, an error should be thrown", () => {
      const find = () => {
        instance.find("some-component");
      };
      expect(find).toThrowError(
        `Can't render some-component as it has not found to be registered`
      );
    });
  });

  describe.skip("Test render SSR functionality", () => {
    test.skip("TODO", () => {});
  });
  describe.skip("Test client render", () => {
    test.skip("TODO", () => {});
  });
});
