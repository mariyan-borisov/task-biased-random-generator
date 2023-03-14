export default class IllegalArgumentError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args);
    this.name = 'IllegalArgumentError';
  }
}
