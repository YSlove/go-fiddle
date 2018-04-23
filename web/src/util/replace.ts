const replaceExpression = /\{([^}\s]+)\}/gi

export default function replace(template: string, values: any): string {
  return template.replace(replaceExpression, (s, ...args) => values[args[0]]);
}
