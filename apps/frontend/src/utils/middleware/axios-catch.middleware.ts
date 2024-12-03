/* eslint-disable @typescript-eslint/no-explicit-any */
export function axiosCatch(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args)
    } catch (error: unknown) {
      const message = (error as any).response?.data?.message
      if (message) throw new Error(message)
      throw error
    }
  }

  return descriptor
}
