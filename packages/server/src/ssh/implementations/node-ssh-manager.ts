import type { SSHConfig, SSHConfigWithPassword } from '@/ssh/types'
import { NodeSSH } from 'node-ssh'
import sshpk from 'sshpk'
import {
  NodeSSHManagerError,
  NodeSSHManagerNotConnectedError,
} from '@/ssh/errors'
import { BaseSSHManager } from '@/ssh/implementations/base-ssh-manager'

export class NodeSSHManager extends BaseSSHManager {
  private readonly ssh: NodeSSH

  constructor(clientId: string) {
    super(clientId)
    this.ssh = new NodeSSH()
  }

  public async uploadPublicKey({
    host,
    username,
    password,
    port = 22,
  }: SSHConfigWithPassword): Promise<void> {
    const tempSSH = new NodeSSH()

    try {
      await tempSSH.connect({
        host,
        username,
        password,
        port,
      })

      const publicKeyPem = await this.getPublicKey()
      const publicKey = sshpk.parseKey(publicKeyPem, 'pkcs8').toString('ssh')

      const { stdout, stderr, code } = await tempSSH.execCommand(
        [
          'mkdir -p ~/.ssh',
          'chmod 700 ~/.ssh',
          `echo ${publicKey} >> ~/.ssh/authorized_keys`,
          'chmod 600 ~/.ssh/authorized_keys',
          'sort ~/.ssh/authorized_keys | uniq > ~/.ssh/authorized_keys.tmp',
          'mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys',
        ].join(' && '),
      )

      // TODO Properly handle logging
      if (stdout) {
        console.log(`[${this.getClientId()}] stdout: ${stdout}`)
      }

      if (code !== 0) {
        throw new NodeSSHManagerError(
          `Public key upload failed: exit code=${code}, stderr=${stderr}`,
          this.getClientId(),
        )
      }
    } catch (error: unknown) {
      if (error instanceof NodeSSHManagerError) {
        throw error
      } else if (error instanceof Error) {
        throw new NodeSSHManagerError(error.message, this.getClientId())
      } else {
        throw new NodeSSHManagerError('Unknown error', this.getClientId())
      }
    } finally {
      tempSSH.dispose()
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
      if (error instanceof NodeSSHManagerError) {
        throw error
      } else if (error instanceof Error) {
        throw new NodeSSHManagerError(error.message, this.getClientId())
      } else {
        throw new NodeSSHManagerError('Unknown error', this.getClientId())
      }
    }
  }

  public disconnect(): void {
    if (!this.isConnected()) {
      throw new NodeSSHManagerNotConnectedError(this.getClientId())
    }

    this.ssh.dispose()
  }

  public async executeCommand(command: string): Promise<void> {
    try {
      if (this.isConnected()) {
        throw new NodeSSHManagerNotConnectedError(this.getClientId())
      }

      const { stdout, stderr, code } = await this.ssh.execCommand(command)

      // TODO Properly handle logging
      if (stdout) {
        console.log(`[${this.getClientId()}] stdout: ${stdout}`)
      }

      if (code !== 0) {
        throw new NodeSSHManagerError(
          `Public key upload failed: exit code=${code}, stderr=${stderr}`,
          this.getClientId(),
        )
      }
    } catch (error: unknown) {
      if (error instanceof NodeSSHManagerError) {
        throw error
      } else if (error instanceof Error) {
        throw new NodeSSHManagerError(error.message, this.getClientId())
      } else {
        throw new NodeSSHManagerError('Unknown error', this.getClientId())
      }
    }
  }

  private isConnected(): boolean {
    return this.ssh.isConnected()
  }
}
