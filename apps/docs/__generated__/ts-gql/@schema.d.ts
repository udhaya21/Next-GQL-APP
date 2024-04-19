// ts-gql-integrity:a682819d476d4022b8bd38f9ac14961a
/*
ts-gql-meta-begin
{
  "hash": "5124712e1c23f7388ca765f2ede9ac76"
}
ts-gql-meta-end
*/
/** @deprecated This should not be used outside of code generated by ts-gql */
export type Maybe<T> = T | null;
/** @deprecated This should not be used outside of code generated by ts-gql */
export type InputMaybe<T> = Maybe<T>;
/** @deprecated This should not be used outside of code generated by ts-gql */
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** @deprecated This should not be used outside of code generated by ts-gql */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
/** @deprecated This should not be used outside of code generated by ts-gql */
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

/** @deprecated This should not be used outside of code generated by ts-gql */
export type Scalars = {
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
};

export type Query = {
  readonly __typename: "Query";
  readonly hello: Hello | null;
};

export type Hello = {
  readonly __typename: "Hello";
  readonly message: string;
};

type TSGQLMaybeArray<T> = ReadonlyArray<T> | T

export {};
export interface TSGQLDocuments extends Record<string, import('@ts-gql/tag').TypedDocumentNode<import('@ts-gql/tag').BaseDocumentTypes>> {}

export type TSGQLRequiredFragments<T> = (providedFragments: T) => T;