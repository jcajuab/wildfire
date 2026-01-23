import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { type DeviceRepository } from "#/application/ports/devices";
import { type PlaylistRepository } from "#/application/ports/playlists";
import { type AuthorizationRepository } from "#/application/ports/rbac";
import { type ScheduleRepository } from "#/application/ports/schedules";
import {
  CreateScheduleUseCase,
  DeleteScheduleUseCase,
  GetScheduleUseCase,
  ListSchedulesUseCase,
  NotFoundError,
  UpdateScheduleUseCase,
} from "#/application/use-cases/schedules";
import { type JwtUserVariables } from "#/interfaces/http/middleware/jwt-user";
import { setAction } from "#/interfaces/http/middleware/observability";
import { createPermissionMiddleware } from "#/interfaces/http/middleware/permissions";
import {
  badRequest,
  errorResponseSchema,
  notFound,
} from "#/interfaces/http/responses";
import {
  createScheduleSchema,
  scheduleIdParamSchema,
  scheduleListResponseSchema,
  scheduleSchema,
  updateScheduleSchema,
} from "#/interfaces/http/validators/schedules.schema";
import {
  validateJson,
  validateParams,
} from "#/interfaces/http/validators/standard-validator";

export interface SchedulesRouterDeps {
  jwtSecret: string;
  repositories: {
    scheduleRepository: ScheduleRepository;
    playlistRepository: PlaylistRepository;
    deviceRepository: DeviceRepository;
    authorizationRepository: AuthorizationRepository;
  };
}

export const createSchedulesRouter = (deps: SchedulesRouterDeps) => {
  const router = new Hono<{ Variables: JwtUserVariables }>();
  const scheduleTags = ["Schedules"];
  const { authorize } = createPermissionMiddleware({
    jwtSecret: deps.jwtSecret,
    authorizationRepository: deps.repositories.authorizationRepository,
  });

  const listSchedules = new ListSchedulesUseCase({
    scheduleRepository: deps.repositories.scheduleRepository,
    playlistRepository: deps.repositories.playlistRepository,
    deviceRepository: deps.repositories.deviceRepository,
  });
  const createSchedule = new CreateScheduleUseCase({
    scheduleRepository: deps.repositories.scheduleRepository,
    playlistRepository: deps.repositories.playlistRepository,
    deviceRepository: deps.repositories.deviceRepository,
  });
  const getSchedule = new GetScheduleUseCase({
    scheduleRepository: deps.repositories.scheduleRepository,
    playlistRepository: deps.repositories.playlistRepository,
    deviceRepository: deps.repositories.deviceRepository,
  });
  const updateSchedule = new UpdateScheduleUseCase({
    scheduleRepository: deps.repositories.scheduleRepository,
    playlistRepository: deps.repositories.playlistRepository,
    deviceRepository: deps.repositories.deviceRepository,
  });
  const deleteSchedule = new DeleteScheduleUseCase({
    scheduleRepository: deps.repositories.scheduleRepository,
  });

  router.get(
    "/",
    setAction("schedules.list", { route: "/schedules" }),
    ...authorize("schedules:read"),
    describeRoute({
      description: "List schedules",
      tags: scheduleTags,
      responses: {
        200: {
          description: "Schedules list",
          content: {
            "application/json": {
              schema: resolver(scheduleListResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const items = await listSchedules.execute();
      return c.json({ items });
    },
  );

  router.post(
    "/",
    setAction("schedules.create", {
      route: "/schedules",
      resourceType: "schedule",
    }),
    ...authorize("schedules:create"),
    validateJson(createScheduleSchema),
    describeRoute({
      description: "Create schedule",
      tags: scheduleTags,
      responses: {
        201: {
          description: "Schedule created",
          content: {
            "application/json": {
              schema: resolver(scheduleSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const payload = createScheduleSchema.parse(c.req.valid("json"));
      try {
        const result = await createSchedule.execute({
          name: payload.name,
          playlistId: payload.playlistId,
          deviceId: payload.deviceId,
          startTime: payload.startTime,
          endTime: payload.endTime,
          daysOfWeek: payload.daysOfWeek,
          priority: payload.priority,
          isActive: payload.isActive ?? true,
        });
        c.set("resourceId", result.id);
        return c.json(result, 201);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        if (error instanceof Error) {
          return badRequest(c, error.message);
        }
        throw error;
      }
    },
  );

  router.get(
    "/:id",
    setAction("schedules.get", {
      route: "/schedules/:id",
      resourceType: "schedule",
    }),
    ...authorize("schedules:read"),
    validateParams(scheduleIdParamSchema),
    describeRoute({
      description: "Get schedule",
      tags: scheduleTags,
      responses: {
        200: {
          description: "Schedule details",
          content: {
            "application/json": {
              schema: resolver(scheduleSchema),
            },
          },
        },
        404: {
          description: "Not found",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const params = c.req.valid("param");
      c.set("resourceId", params.id);
      try {
        const result = await getSchedule.execute({ id: params.id });
        return c.json(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.patch(
    "/:id",
    setAction("schedules.update", {
      route: "/schedules/:id",
      resourceType: "schedule",
    }),
    ...authorize("schedules:update"),
    validateParams(scheduleIdParamSchema),
    validateJson(updateScheduleSchema),
    describeRoute({
      description: "Update schedule",
      tags: scheduleTags,
      responses: {
        200: {
          description: "Schedule updated",
          content: {
            "application/json": {
              schema: resolver(scheduleSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const params = c.req.valid("param");
      c.set("resourceId", params.id);
      const payload = updateScheduleSchema.parse(c.req.valid("json"));
      try {
        const result = await updateSchedule.execute({
          id: params.id,
          name: payload.name,
          playlistId: payload.playlistId,
          deviceId: payload.deviceId,
          startTime: payload.startTime,
          endTime: payload.endTime,
          daysOfWeek: payload.daysOfWeek,
          priority: payload.priority,
          isActive: payload.isActive,
        });
        return c.json(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        if (error instanceof Error) {
          return badRequest(c, error.message);
        }
        throw error;
      }
    },
  );

  router.delete(
    "/:id",
    setAction("schedules.delete", {
      route: "/schedules/:id",
      resourceType: "schedule",
    }),
    ...authorize("schedules:delete"),
    validateParams(scheduleIdParamSchema),
    describeRoute({
      description: "Delete schedule",
      tags: scheduleTags,
      responses: {
        204: { description: "Deleted" },
        404: {
          description: "Not found",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const params = c.req.valid("param");
      c.set("resourceId", params.id);
      try {
        await deleteSchedule.execute({ id: params.id });
        return c.body(null, 204);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  return router;
};
