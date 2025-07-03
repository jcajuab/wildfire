import type { SSHManager } from '@/ssh/interfaces/ssh-manager.interface'
import type { SSHConfig, SSHConfigWithPassword } from '@/ssh/types'
import fs from 'node:fs/promises'
import path from 'node:path'
import { generatePrivateKey } from 'sshpk'
import { BaseSSHManagerError } from '@/ssh/errors'

export abstract class BaseSSHManager implements SSHManager {
  private static readonly BASE_SSH_KEYS_DIR = path.resolve('keys/ssh')

  constructor(private readonly clientId: string) {}

  public abstract uploadPublicKey(config: SSHConfigWithPassword): Promise<void>
  public abstract connect(config: SSHConfig): Promise<void>
  public abstract disconnect(): void
  public abstract executeCommand(command: string): Promise<void>

  public async generateKeyPair(): Promise<void> {
    if (await this.hasKeyPair()) {
      return
    }

    try {
      await fs.mkdir(this.getClientDir(), { recursive: true })

      const privateKey = generatePrivateKey('ed25519')
      const privateKeyPem = privateKey.toString('pkcs8')
      const publicKeyPem = privateKey.toPublic().toString('pkcs8')

      const privateKeyPath = this.getPrivateKeyPath()
      await fs.writeFile(privateKeyPath, privateKeyPem, { mode: 0o600 })

      if (process.platform !== 'win32') {
        const { mode } = await fs.stat(privateKeyPath)
        if ((mode & 0o777) !== 0o600) {
          throw new BaseSSHManagerError(
            'Failed to set secure file permissions',
            this.getClientId(),
          )
        }
      }

      await fs.writeFile(this.getPublicKeyPath(), publicKeyPem, { mode: 0o644 })
    } catch (error: unknown) {
      if (error instanceof BaseSSHManagerError) {
        throw error
      } else if (error instanceof Error) {
        throw new BaseSSHManagerError(error.message, this.getClientId())
      } else {
        throw new BaseSSHManagerError('Unknown error', this.getClientId())
      }
    }
  }

  protected getClientId(): string {
    return this.clientId
  }

  protected async getPrivateKey(): Promise<string> {
    try {
      return await fs.readFile(this.getPrivateKeyPath(), 'utf8')
    } catch (error: unknown) {
      if (error instanceof BaseSSHManagerError) {
        throw error
      } else if (error instanceof Error) {
        throw new BaseSSHManagerError(error.message, this.getClientId())
      } else {
        throw new BaseSSHManagerError('Unknown error', this.getClientId())
      }
    }
  }

  protected async getPublicKey(): Promise<string> {
    try {
      return await fs.readFile(this.getPublicKeyPath(), 'utf8')
    } catch (error: unknown) {
      if (error instanceof BaseSSHManagerError) {
        throw error
      } else if (error instanceof Error) {
        throw new BaseSSHManagerError(error.message, this.getClientId())
      } else {
        throw new BaseSSHManagerError('Unknown error', this.getClientId())
      }
    }
  }

  private async hasKeyPair(): Promise<boolean> {
    try {
      await Promise.all([
        fs.stat(this.getPrivateKeyPath()),
        fs.stat(this.getPublicKeyPath()),
      ])
      return true
    } catch {
      return false
    }
  }

  private getClientDir(): string {
    return path.join(BaseSSHManager.BASE_SSH_KEYS_DIR, this.getClientId())
  }

  private getPrivateKeyPath(): string {
    return path.join(this.getClientDir(), 'id_ed25519')
  }

  private getPublicKeyPath(): string {
    return path.join(this.getClientDir(), 'id_ed25519.pub')
  }
}
