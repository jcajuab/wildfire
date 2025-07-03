import type { SSHManager } from '@/ssh/interfaces/ssh-manager.interface'
import type { SSHConfig, SSHConfigWithPassword } from '@/ssh/types'
import fs from 'node:fs/promises'
import path from 'node:path'
import { capitalize } from '@/lib/utils'
import { BaseSSHManagerError } from '@/ssh/errors'

export abstract class BaseSSHManager implements SSHManager {
  protected static readonly BASE_SSH_KEYS_DIR = path.resolve('keys/ssh')

  constructor(private readonly clientId: string) {}

  public abstract generateKeyPair(): Promise<void>
  public abstract uploadPublicKey(config: SSHConfig): Promise<void>
  public abstract connect(config: SSHConfigWithPassword): Promise<void>
  public abstract disconnect(): Promise<void>

  protected getClientId(): string {
    return this.clientId
  }

  protected getPrivateKey(): Promise<string> {
    return this.getKey('private')
  }

  protected getPublicKey(): Promise<string> {
    return this.getKey('public')
  }

  private getKeyFilePath(kind: 'private' | 'public'): string {
    const fileName = kind === 'private' ? 'id_ed25519' : 'id_ed25519.pub'
    return path.join(BaseSSHManager.BASE_SSH_KEYS_DIR, this.clientId, fileName)
  }

  private async getKey(kind: 'private' | 'public'): Promise<string> {
    const filePath = this.getKeyFilePath(kind)

    try {
      return await fs.readFile(filePath, 'utf8')
    } catch {
      throw new BaseSSHManagerError(
        `${capitalize(kind)} key not found.`,
        this.getClientId(),
      )
    }
  }
}
