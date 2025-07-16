/**
 * @see https://github.com/unovue/reka-ui/blob/ae80974fb12d1bb45a78a73d16d7a3ae7b556248/packages/core/src/shared/createContext.ts#L41
 */
export function createContextNotFoundError(injectionKey: symbol, providerComponentName: string | string[]): Error {
  return new Error(
    `Injection \`${injectionKey.toString()}\` not found. Component must be used within ${
      Array.isArray(providerComponentName)
        ? `one of the following components: ${providerComponentName.join(
          ', ',
        )}`
        : `\`${providerComponentName}\``
    }`,
  )
}
