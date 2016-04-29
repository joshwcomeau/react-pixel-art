export function bindMethods(context, methods) {
  methods.forEach(method => {
    // eslint-disable-next-line no-param-reassign
    context[method] = context[method].bind(context);
  });
}
