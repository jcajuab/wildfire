import type { NodeSSH } from 'node-ssh'
import type { SSHConfig, SSHConfigWithPassword } from '@/ssh/types'
import { NodeSSHManagerError } from '@/ssh/errors'
import { BaseSSHManager } from '@/ssh/implementations/base-ssh-manager'

export class NodeSSHManager extends BaseSSHManager {
  constructor(
    clientId: string,
    private readonly ssh: NodeSSH,
  ) {
    super(clientId)
  }

  public async uploadPublicKey(config: SSHConfigWithPassword): Promise<void> {
    try {
      // TODO
      console.log(config)
    } catch (error: unknown) {
      this.handleError(error)
    }
  }

  public async connect({
    host,
    username,
    port = 22,
  }: SSHConfig): Promise<void> {
    try {
      const privateKey = await this.getPrivateKey()
      await this.ssh.connect({
        host,
        username,
        privateKey,
        port,
      })
    } catch (error: unknown) {
      this.handleError(error)
    }
  }

  public disconnect(): void {
    this.ssh.dispose()
  }

  public isConnected(): boolean {
    return this.ssh.isConnected()
  }

  public async executeCommand(): Promise<void> {}

  // TODO Properly handle error logging
  private handleError(error: unknown): never {
    if (error instanceof NodeSSHManagerError) {
      throw error
    } else if (error instanceof Error) {
      throw new NodeSSHManagerError(error.message, this.getClientId())
    } else {
      throw new NodeSSHManagerError('Unknown error', this.getClientId())
    }
  }
}
