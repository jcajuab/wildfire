import type { SSHConfig, SSHConfigWithPassword } from '@/ssh/types'

export interface SSHManager {
  generateKeyPair(): Promise<void>
  uploadPublicKey(config: SSHConfig): Promise<void>
  connect(config: SSHConfigWithPassword): Promise<void>
  disconnect(): Promise<void>
}
