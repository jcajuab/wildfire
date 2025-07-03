import type { SSHConfig, SSHConfigWithPassword } from '@/ssh/types'

export interface SSHManager {
  generateKeyPair(): Promise<void>
  uploadPublicKey(config: SSHConfigWithPassword): Promise<void>
  connect(config: SSHConfig): Promise<void>
  disconnect(): void
  executeCommand(command: string): Promise<void>
}
