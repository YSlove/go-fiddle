function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

export function escape(strings: TemplateStringsArray, ...values: string[]) {
  const components: string[] = [];
  strings.forEach((s, i) => {
    components.push(s);
    if (values[i]) {
      components.push(escapeRegExp(values[i]));
    }
  });
  return components.join('');
}

export function escapeWildcard(strings: TemplateStringsArray, ...values: string[]) {
  const components: string[] = [];
  strings.forEach((s, i) => {
    components.push(s);
    if (values[i]) {
      let exp = escapeRegExp(values[i]);
      exp = exp.replace(/\\\*/g, '[^/]+');
      components.push(exp);
    }
  });
  return components.join('');
}

export default {
  escape,
  escapeWildcard,
}
