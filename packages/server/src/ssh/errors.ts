export class BaseSSHManagerError extends Error {
  constructor(
    message: string,
    public readonly clientId: string,
  ) {
    super(`Client(${clientId}): ${message}`)
    this.name = 'BaseSSHManagerError'
    Object.setPrototypeOf(this, BaseSSHManagerError.prototype)
  }
}

export class NodeSSHManagerError extends BaseSSHManagerError {
  constructor(message: string, clientId: string) {
    super(message, clientId)
    this.name = 'NodeSSHManagerError'
    Object.setPrototypeOf(this, NodeSSHManagerError.prototype)
  }
}
