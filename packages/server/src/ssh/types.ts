type SSHBaseConfig = {
  host: string
  username: string
  port?: number
}

export type SSHConfig = SSHBaseConfig
export type SSHConfigWithPassword = SSHBaseConfig & {
  password: string
}
