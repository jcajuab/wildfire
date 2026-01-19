export class Permission {
  constructor(
    public readonly resource: string,
    public readonly action: string,
  ) {}

  static parse(value: string): Permission {
    const [resource, action] = value.split(":");
    if (!resource || !action) {
      throw new Error("Permission must be in resource:action format");
    }
    return new Permission(resource, action);
  }

  matches(required: Permission): boolean {
    const resourceMatches =
      this.resource === "*" || this.resource === required.resource;
    if (!resourceMatches) return false;

    if (this.action === "manage") {
      return true;
    }

    return this.action === required.action;
  }
}
