import { GraphQLSchema } from "graphql";

import * as graphql from "../graphql-ts";
import { queries } from "./queries";

const Query = graphql.object()({
  name: "Query",
  fields: {
    ...queries,
  },
});

export const unwrappedSchema = new GraphQLSchema({
  query: Query.graphQLType,
});
