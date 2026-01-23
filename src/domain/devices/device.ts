export class DeviceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeviceValidationError";
  }
}

export interface DeviceInput {
  name: string;
  identifier: string;
  location?: string | null;
}

export interface DeviceProps {
  name: string;
  identifier: string;
  location: string | null;
}

const normalize = (value: string) => value.trim();

export const createDeviceProps = (input: DeviceInput): DeviceProps => {
  const name = normalize(input.name);
  const identifier = normalize(input.identifier);

  if (!name) {
    throw new DeviceValidationError("Device name is required");
  }

  if (!identifier) {
    throw new DeviceValidationError("Device identifier is required");
  }

  return {
    name,
    identifier,
    location: input.location ? input.location.trim() : null,
  };
};
