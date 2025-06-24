declare module "bun" {
  interface Env {
    MYSQL_DATABASE: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    PORT?: number;
  }
}
