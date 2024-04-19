// ts-gql-integrity:ea54e1d4491f4a677e39a8e6164688f6
/*
ts-gql-meta-begin
{
  "hash": "67fd30ddd6abd47a2a64e8c022fc7a6d"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type HelloQueryVariables = SchemaTypes.Exact<{ [key: string]: never; }>;


type HelloQuery = { readonly hello: { readonly message: string } | null };



export type type = TypedDocumentNode<{
  type: "query";
  result: HelloQuery;
  variables: {};
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    Hello: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"Hello\"},\"variableDefinitions\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hello\"},\"arguments\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"message\"},\"arguments\":[],\"directives\":[]}]}}]}}]}")
