import { write } from 'bun'
import { mkdir, rm } from 'node:fs/promises'
import { generatePrivateKey } from 'sshpk'
import { z } from 'zod/v4'

import { SSHManagerError } from './errors'
import { ClientIdSchema } from './schemas'

export class SSHManager {
  private static readonly SSH_KEYS_DIR = new URL('./.ssh/', import.meta.url)
  private static readonly PRIVATE_KEY_NAME = 'id_ed25519'
  private static readonly PUBLIC_KEY_NAME = `${SSHManager.PRIVATE_KEY_NAME}.pub`
  private static readonly FILE_PERMISSION = 0o600 // -rw-------

  private readonly clientId: string
  private readonly clientDir: URL
  private readonly privateKeyPath: URL
  private readonly publicKeyPath: URL

  constructor(clientId: string) {
    const { success, data, error } = ClientIdSchema.safeParse(clientId)

    if (!success) {
      throw new SSHManagerError(z.flattenError(error).formErrors[0], { cause: error.cause })
    }

    this.clientId = data
    this.clientDir = new URL(`${this.clientId}/`, SSHManager.SSH_KEYS_DIR)
    this.privateKeyPath = new URL(SSHManager.PRIVATE_KEY_NAME, this.clientDir)
    this.publicKeyPath = new URL(SSHManager.PUBLIC_KEY_NAME, this.clientDir)
  }

  /**
   * Generates an ED25519 SSH key pair for the client.
   *
   * @throws {SSHManagerError} If keys already exist or a file system error occurs.
   */
  async generateKeyPair(): Promise<void> {
    try {
      // TODO: Add a check to see if the key pair exists to avoid overwriting

      await mkdir(this.clientDir, { recursive: true })

      const privateKey = generatePrivateKey('ed25519')
      const publicKey = privateKey.toPublic()

      await Promise.all([
        write(this.privateKeyPath, privateKey.toString('pem'), {
          mode: SSHManager.FILE_PERMISSION,
        }),
        write(this.publicKeyPath, publicKey.toString('ssh'), { mode: SSHManager.FILE_PERMISSION }),
      ])
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new SSHManagerError(error.message, { cause: error.cause })
      } else {
        throw new SSHManagerError(`An unknown error occurred: ${error}`)
      }
    }
  }

  /**
   * Destroys (deletes) the SSH key pair and the client's key directory.
   *
   * @throws {SSHManagerError} If a file system error occurs.
   */
  async destroyKeyPair(): Promise<void> {
    try {
      // TODO: Add a check to see if the key pair exists before DESTRUCTION!

      await rm(this.clientDir, { recursive: true, force: true })
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new SSHManagerError(error.message, { cause: error.cause })
      } else {
        throw new SSHManagerError(`An unknown error occurred: ${error}`)
      }
    }
  }
}
