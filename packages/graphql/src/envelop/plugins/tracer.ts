import type { Plugin } from '@envelop/core';
import { applyMiddleware, type IMiddleware } from 'graphql-middleware';

type PluginConfig = {
	minResolverExecTimeThreshold: number;
};

const defaultPluginConfig: PluginConfig = {
	/*
    Only resolvers taking longer than this threshold time will be logged.
    If you set it to 0, all resolvers will be logged. (a bit noisy)
  */
	minResolverExecTimeThreshold: 50,
};

type ResolverTraceObject = { name: string; elapsed: string | string[] };

const graphqlMiddlewareAppliedTransformSymbol = Symbol(
	'graphqlMiddleware.appliedTransform'
);

/*
	Plugin lifecycle: https://github.com/n1ru4l/envelop/blob/main/packages/types/src/plugin.ts

	tracerPlugin is a custom envelop plugin to trace the execution of GraphQL
  operations and resolvers. The trace results are added to the operation result
  and can be inspected in Network Tab response.

	NOTE: It's not used anywhere now. We've switched to sentry tracing. Leaving this here
	as an example to write envelop plugins.
*/
export const tracerPlugin = (
	pluginConfig: PluginConfig = defaultPluginConfig
): Plugin => {
	return {
		// For tracing resolver execution time
		onSchemaChange({ schema, replaceSchema }) {
			if (schema.extensions?.[graphqlMiddlewareAppliedTransformSymbol]) {
				return;
			}

			/*
        Middleware wrapper that traces the execution time of all resolvers.
      */
			const traceResolversMiddleware: IMiddleware = async (
				resolve,
				root,
				args,
				context,
				info
			) => {
				const start = performance.now();
				const result = await resolve(root, args, context, info);
				const end = performance.now();
				const elapsed = end - start;
				if (elapsed > pluginConfig.minResolverExecTimeThreshold) {
					if (Array.isArray(context.__resolverTrace)) {
						const existingTraceObject = (
							context.__resolverTrace as ResolverTraceObject[]
						).find((t) => t.name === info.fieldName);
						if (existingTraceObject) {
							if (Array.isArray(existingTraceObject.elapsed)) {
								existingTraceObject.elapsed.push(`${elapsed}ms`);
							} else {
								existingTraceObject.elapsed = [
									existingTraceObject.elapsed,
									`${elapsed}ms`,
								];
							}
						} else {
							context.__resolverTrace.push({
								name: info.fieldName,
								elapsed: `${elapsed}ms`,
							});
						}

						// eslint-disable-next-line no-console
						console.log('🍿 Tracer Plugin: ', {
							type: 'Resolver',
							name: info.fieldName,
							elapsed: `${elapsed}ms`,
						});
					}
				}

				return result;
			};

			const wrappedSchema = applyMiddleware(
				schema,
				...[traceResolversMiddleware]
			);

			wrappedSchema.extensions = {
				...schema.extensions,
				[graphqlMiddlewareAppliedTransformSymbol]: true,
			};

			replaceSchema(wrappedSchema);
		},
		// For tracing operation execution time and adding all trace results to result
		onExecute({ args }) {
			const __resolverTrace: ResolverTraceObject[] = [];
			// @ts-ignore
			args.contextValue.__resolverTrace = __resolverTrace;
			const operationStart = Date.now();

			return {
				onExecuteDone({ args, result, setResult }) {
					const operationEnd = Date.now();
					const elapsed = operationEnd - operationStart;
					// eslint-disable-next-line no-console
					console.log('🍿 Tracer Plugin: ', {
						type: 'Operation',
						name: args.operationName,
						elapsed: `${elapsed}ms`,
					});
					setResult({
						...result,
						extensions: {
							tracer: {
								// @ts-ignore
								resolvers: args?.contextValue?.__resolverTrace,
								operation: {
									operationName: args.operationName || 'anonymous',
									elapsed: `${elapsed}ms`,
								},
							},
						},
					});
				},
			};
		},
	};
};
