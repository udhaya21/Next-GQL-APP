import { gql } from "@ts-gql/tag/no-transform";

export const HELLO_WORLD = gql`
  query Hello {
    hello {
      message
    }
  }
` as import("../../__generated__/ts-gql/Hello").type;
