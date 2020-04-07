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
