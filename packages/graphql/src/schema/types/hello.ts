import * as graphql from "../../graphql-ts";

export type Hello = {
  message: string;
};

export const Hello = graphql.object<Hello>()({
  name: "Hello",
  fields: {
    message: graphql.field({
      type: graphql.nonNull(graphql.String),
    }),
  },
});
