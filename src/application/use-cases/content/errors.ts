export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InvalidContentTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidContentTypeError";
  }
}
