import type { Plugin } from '@envelop/core';
import { type DocumentNode, Kind, type SelectionSetNode, visit } from 'graphql';

type PluginConfig = {
	disable: boolean;
};

const defaultPluginConfig: PluginConfig = {
	disable: false,
};

const originalDocumentMap = new WeakMap<DocumentNode, DocumentNode>();

/*
	Plugin lifecycle: https://github.com/n1ru4l/envelop/blob/main/packages/types/src/plugin.ts

	addTypename plugin automatically adds typename to query fields.
	This is used during server side invocation of execute() function.
	This DOES NOT add typename to requests coming from clients or graphql playground.
	This ONLY adds typename for server side direct invocation of GraphQL operations
	when the arg addTypename is passed to execute() function.
	
	
	Usage: 
	- When invoking execute() function, make sure you pass an additional arg
		addTypename: true to it. If not, this plugin won't have any impact.
*/
export const addTypenamePlugin = (
	pluginConfig: PluginConfig = defaultPluginConfig
): Plugin => {
	return {
		/*
			This is the ideal way to add __typename to types.
			But during our server render we don't parse the queries
			using the parse method from getEnveloped() so
			__typename is added during execute phase (onExecute callback)
		*/
		onParse() {
			return ({ result, replaceParseResult }) => {
				if (
					pluginConfig.disable !== true &&
					/* 
						non-standard API
						 but we're doing this to give control to the execute function
						 to optionally auto add typename to all types
					*/
					// @ts-ignore
					args.addTypename === true &&
					!originalDocumentMap.has(result) &&
					result.kind === Kind.DOCUMENT
				) {
					const newDocument = addTypeNameToDocument(result);
					replaceParseResult(newDocument);
				}
			};
		},
		/* NOTE:
			This really shouldn't happen during execute phase. 
			It should happen during parse phase but if you don't parse 
			your graphql queries using the parse function from getEnveloped(), 
			(Eg. you use gql tag from libraries to parse your query strings)
			your only option is to add __typename during execute phase.
		*/
		onExecute({ args }) {
			if (
				pluginConfig.disable !== true &&
				/* 
					non-standard API
				 	but we're doing this to give control to the execute function
				 	to optionally auto add typename to all types
				*/
				// @ts-ignore
				args.addTypename === true &&
				!originalDocumentMap.has(args.document) &&
				args.document.kind === Kind.DOCUMENT
			) {
				args.document = addTypeNameToDocument(args.document);
			}
		},
	};
};

function addTypeNameToDocument(document: DocumentNode): DocumentNode {
	let documentChanged = false;
	const newDocument = visit(document, {
		SelectionSet(node): SelectionSetNode {
			if (
				!node.selections.some(
					(selection) =>
						selection.kind === Kind.FIELD &&
						selection.name.value === '__typename'
				)
			) {
				documentChanged = true;
				return {
					...node,
					selections: [
						{
							kind: Kind.FIELD,
							name: {
								kind: Kind.NAME,
								value: '__typename',
							},
						},
						...node.selections,
					],
				};
			}
			return node;
		},
	});
	if (documentChanged) {
		originalDocumentMap.set(newDocument, document);
	}
	return newDocument;
}
