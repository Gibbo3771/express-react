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
