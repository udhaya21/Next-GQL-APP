import * as graphql from "../graphql-ts";
import { Hello } from "./types/hello";

export const queries = {
  hello: graphql.field({
    type: Hello,
    resolve: () => {
      return {
        message: "Hello, world!",
      };
    },
  }),
};
