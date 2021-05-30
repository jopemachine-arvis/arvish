export default class Conf<T> implements Iterable<[string, T]> {
  readonly path: string;
  readonly size: number;

  constructor(options?: any) {
    this.path = '';
    this.size = 0;
  }

  private throwEnvNotSetErr() {
    throw new Error(
      'Arvis environment variable not set! Run this script on the Arvis.'
    );
  }

  [Symbol.iterator](): Iterator<[string, T], any, undefined> {
    this.throwEnvNotSetErr();
    throw new Error();
  }

  set(key: string, value: T): void {
    this.throwEnvNotSetErr();
  }

  get(key: string, defaultValue?: T) {
    this.throwEnvNotSetErr();
  }

  has(key: string) {
    this.throwEnvNotSetErr();
  }

  delete(key: string): void {
    this.throwEnvNotSetErr();
  }

  clear(): void {
    this.throwEnvNotSetErr();
  }

  onDidChange(
    key: string,
    callback: (newValue: T | undefined, oldValue: T | undefined) => void
  ) {
    this.throwEnvNotSetErr();
  }

  onDidAnyChange(
    callback: (
      oldValue: { [key: string]: T } | undefined,
      newValue: { [key: string]: T } | undefined
    ) => void
  ) {
    this.throwEnvNotSetErr();
  }
}
