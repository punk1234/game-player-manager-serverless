import { handleApiError } from "../helpers";

export default function () {
  return (_target: any, _keyProperty?: any, descriptor?: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor?.value;

    if (!originalMethod) {
      return;
    }

    descriptor.value = async function (...args: any[]): Promise<ReturnType<typeof originalMethod>> {
      try {
        return originalMethod.apply(this, args);
      } catch (err: any) {
        return handleApiError(err);
      }
    };
  };
}
