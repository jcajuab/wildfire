import { sql } from 'drizzle-orm'
import slugify from 'slug'

import { db } from '../../db'
import * as schema from '../../db/schema'
import { privateProcedure, publicProcedure } from '../procedures'

export const findAllDisplay = publicProcedure.display.findAll.handler(
  async ({ input: { limit, offset } }) => {
    return await db.query.displays.findMany({
      limit,
      offset,
    })
  },
)

export const findDisplayBySlug = publicProcedure.display.findBySlug.handler(
  async ({ input: { slug }, errors }) => {
    const display = await db.query.displays.findFirst({
      where: (displays, { eq }) => eq(displays.slug, slug),
    })

    if (!display) {
      throw errors.NOT_FOUND({
        message: `Display with the slug "${slug}" does not exist`,
        data: { slug },
      })
    }

    return display
  },
)

// References: https://orm.drizzle.team/docs/insert#on-duplicate-key-update
export const createDisplay = privateProcedure.display.create.handler(
  async ({ input: { name, description }, errors }) => {
    const slug = slugify(name)

    const [display] = await db
      .insert(schema.displays)
      .values({
        name,
        slug,
        description,
      })
      .onDuplicateKeyUpdate({
        set: { slug: sql`slug` },
      })
      .$returningId()

    if (!display) {
      throw errors.CONFLICT({
        message: `Display with the slug "${slug}" already exists`,
        data: { slug },
      })
    }

    return display
  },
)
