export default function (options: any) {
  return function <T extends { new (...args: any[]): any }>(target: T): T {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);

        const methods = Object.getOwnPropertyNames(target.prototype).filter(
          (p: string) => typeof this[p] === "function" && p !== "constructor",
        );

        methods.forEach((methodName: string) => {
          const originalMethod = this[methodName];

          Object.defineProperty(this, methodName, {
            value: async (...arg: any[]) => {
              const schema = originalMethod.apply(this, arg);
              await schema.validate(arg[0], options);
            },
          });
        });
      }
    };
  };
}
