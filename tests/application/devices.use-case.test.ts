import { describe, expect, test } from "bun:test";
import {
  type DeviceRecord,
  type DeviceRepository,
} from "#/application/ports/devices";
import {
  GetDeviceManifestUseCase,
  GetDeviceUseCase,
  ListDevicesUseCase,
  NotFoundError,
  RegisterDeviceUseCase,
} from "#/application/use-cases/devices";

const makeRepository = () => {
  const records: DeviceRecord[] = [];

  const repo: DeviceRepository = {
    list: async () => [...records],
    findById: async (id: string) =>
      records.find((record) => record.id === id) ?? null,
    findByIdentifier: async (identifier: string) =>
      records.find((record) => record.identifier === identifier) ?? null,
    create: async (input) => {
      const record: DeviceRecord = {
        id: `device-${records.length + 1}`,
        name: input.name,
        identifier: input.identifier,
        location: input.location,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      };
      records.push(record);
      return record;
    },
    update: async (id, input) => {
      const record = records.find((item) => item.id === id);
      if (!record) return null;
      if (input.name !== undefined) record.name = input.name;
      if (input.location !== undefined) record.location = input.location;
      record.updatedAt = "2025-01-02T00:00:00.000Z";
      return record;
    },
  };

  return { repo, records };
};

describe("Devices use cases", () => {
  test("ListDevicesUseCase returns devices", async () => {
    const { repo } = makeRepository();
    const listDevices = new ListDevicesUseCase({ deviceRepository: repo });

    await repo.create({
      name: "Lobby",
      identifier: "AA:BB",
      location: null,
    });

    const result = await listDevices.execute();
    expect(result).toHaveLength(1);
  });

  test("GetDeviceUseCase throws when missing", async () => {
    const { repo } = makeRepository();
    const getDevice = new GetDeviceUseCase({ deviceRepository: repo });

    await expect(getDevice.execute({ id: "missing" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("RegisterDeviceUseCase creates new device", async () => {
    const { repo } = makeRepository();
    const registerDevice = new RegisterDeviceUseCase({
      deviceRepository: repo,
    });

    const device = await registerDevice.execute({
      name: "Lobby",
      identifier: "AA:BB",
      location: "Main Hall",
    });

    expect(device.identifier).toBe("AA:BB");
  });

  test("RegisterDeviceUseCase updates existing device", async () => {
    const { repo } = makeRepository();
    const registerDevice = new RegisterDeviceUseCase({
      deviceRepository: repo,
    });

    const created = await repo.create({
      name: "Lobby",
      identifier: "AA:BB",
      location: null,
    });

    const updated = await registerDevice.execute({
      name: "Lobby Display",
      identifier: "AA:BB",
      location: "Hallway",
    });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Lobby Display");
    expect(updated.location).toBe("Hallway");
  });

  test("GetDeviceManifestUseCase returns empty when no schedule", async () => {
    const { repo } = makeRepository();
    const created = await repo.create({
      name: "Lobby",
      identifier: "AA:BB",
      location: null,
    });

    const useCase = new GetDeviceManifestUseCase({
      scheduleRepository: {
        listByDevice: async () => [],
        list: async () => [],
        findById: async () => null,
        create: async () => {
          throw new Error("not used");
        },
        update: async () => null,
        delete: async () => false,
      },
      playlistRepository: {
        list: async () => [],
        findById: async () => null,
        create: async () => {
          throw new Error("not used");
        },
        update: async () => null,
        delete: async () => false,
        listItems: async () => [],
        addItem: async () => {
          throw new Error("not used");
        },
        updateItem: async () => null,
        deleteItem: async () => false,
      },
      contentRepository: {
        findById: async () => null,
        create: async () => {
          throw new Error("not used");
        },
        list: async () => ({ items: [], total: 0 }),
        delete: async () => false,
      },
      contentStorage: {
        upload: async () => {},
        delete: async () => {},
        getPresignedDownloadUrl: async () => "",
      },
      deviceRepository: repo,
      downloadUrlExpiresInSeconds: 3600,
    });

    const result = await useCase.execute({
      deviceId: created.id,
      now: new Date("2025-01-01T00:00:00.000Z"),
    });

    expect(result.items).toHaveLength(0);
    expect(result.playlistId).toBeNull();
  });
});
