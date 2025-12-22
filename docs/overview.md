# WILDFIRE API Specification

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Content Types](#content-types)
4. [Modules](#modules)
   - [Auth Module](#1-auth-module)
   - [RBAC Module](#2-rbac-module)
   - [Content Module](#3-content-module)
   - [Playlists Module](#4-playlists-module)
   - [Schedules Module](#5-schedules-module)
   - [Devices Module](#6-devices-module)
5. [Database Schema](#database-schema)
6. [API Endpoints Summary](#api-endpoints-summary)
7. [Display Settings Reference](#display-settings-reference)

---

## Overview

### What Is This Application?

A **centralized backend platform** for managing digital signage content across a **school campus**. TVs connected to Raspberry Pi 4 devices display scheduled playlists containing images, videos, and PDFs.

### Core Flow

```
Admin uploads Content --> Stored in MinIO with checksum
                                |
                                v
Content added to Playlist --> Ordered items with duration
                                |
                                v
Schedule created --> "Play Playlist X on Device Y, Mon-Fri 8am-5pm"
                                |
                                v
Device polls for manifest --> Downloads & caches content --> Plays playlist
```

### Key Concepts

| Entity           | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| **Content**      | Raw media file (image, video, PDF) stored in MinIO         |
| **Playlist**     | Ordered collection of content items with display durations |
| **PlaylistItem** | Content + sequence + duration within a playlist            |
| **Schedule**     | Time-based rule assigning a Playlist to a Device           |
| **Device**       | Raspberry Pi 4 display unit with unique identifier         |

### What Gets Scheduled?

**Playlists are scheduled, NOT individual content items.**

This allows the same content to appear in multiple playlists with different durations and ordering.

---

## Architecture

| Aspect              | Choice                                |
| ------------------- | ------------------------------------- |
| **Pattern**         | Modular Monolith (6 bounded contexts) |
| **Runtime**         | Bun                                   |
| **Package Manager** | Bun                                   |
| **Framework**       | Hono                                  |
| **Database**        | MySQL + Drizzle ORM                   |
| **Storage**         | MinIO (S3-compatible)                 |
| **Auth**            | Hono JWT                              |
| **Validation**      | Zod                                   |
| **Testing**         | Bun Test Runner                       |
| **API Docs**        | Scalar                                |

### Infrastructure

| Service   | Image        | Purpose          |
| --------- | ------------ | ---------------- |
| **api**   | Bun (custom) | Hono API server  |
| **mysql** | mysql:8      | Primary database |
| **minio** | minio/minio  | Object storage   |

> **Note**: No Redis required - no async processing queues needed for this scope.

---

## Content Types

| Type      | Accepted Formats          | MIME Types                                           | Notes                                   |
| --------- | ------------------------- | ---------------------------------------------------- | --------------------------------------- |
| **IMAGE** | jpg, jpeg, png, webp, gif | `image/jpeg`, `image/png`, `image/webp`, `image/gif` | Direct use, pre-optimized               |
| **VIDEO** | mp4 (H.264)               | `video/mp4`                                          | Must be pre-optimized for Pi 4 playback |
| **PDF**   | pdf                       | `application/pdf`                                    | Rendered on client device               |

### Upload Requirements

- **No server-side processing** - users must upload optimized files
- **Max file size**: Configure based on storage capacity (recommend 100MB)
- **Video format**: H.264 codec, yuv420p pixel format for Pi 4 hardware decoding

---

## Modules

### 1. Auth Module

Purpose: Authenticate staff users and issue/revoke access tokens for API calls.

Authentication uses **JWTs** issued by the API and verified with **Hono JWT** middleware.

#### Routes

| Method | Endpoint       | Description                   | Auth   |
| ------ | -------------- | ----------------------------- | ------ |
| `POST` | `/auth/login`  | Authenticate user, return JWT | Public |
| `POST` | `/auth/logout` | Revoke current token          | Auth   |
| `GET`  | `/auth/me`     | Get current user profile      | Auth   |

#### Login Request

```typescript
{
  email: string; // Used as username lookup
  password: string; // Validated against /etc/htshadow
}
```

#### Login Response

```typescript
{
  type: "bearer",
  token: "jwt_eyJhbGci...", // JWT access token
  expiresAt: string, // ISO timestamp
  user: {
    id: string,
    email: string,
    name: string
  }
}
```

---

### 2. RBAC Module

Purpose: Define roles/permissions and enforce access control across the API.

Full dynamic permission system enforced by Hono middleware and policy checks.

#### Permission Pattern

Format: `resource:action` (e.g., `content:create`, `users:manage`)

#### How It Works

1. JWT middleware authenticates the request
2. RBAC middleware loads roles/permissions from the database
3. Policy check enforces `resource:action` rules (403 on denial)

#### Routes

| Method   | Endpoint                 | Description                    | Permission     |
| -------- | ------------------------ | ------------------------------ | -------------- |
| `GET`    | `/roles`                 | List all roles                 | `roles:read`   |
| `POST`   | `/roles`                 | Create a role                  | `roles:create` |
| `GET`    | `/roles/:id`             | Get role details               | `roles:read`   |
| `PATCH`  | `/roles/:id`             | Update role                    | `roles:update` |
| `DELETE` | `/roles/:id`             | Delete role                    | `roles:delete` |
| `GET`    | `/roles/:id/permissions` | Get role's permissions         | `roles:read`   |
| `PUT`    | `/roles/:id/permissions` | Set role's permissions         | `roles:update` |
| `GET`    | `/permissions`           | List all available permissions | `roles:read`   |
| `GET`    | `/users`                 | List all users                 | `users:read`   |
| `POST`   | `/users`                 | Create a user                  | `users:create` |
| `GET`    | `/users/:id`             | Get user details               | `users:read`   |
| `PATCH`  | `/users/:id`             | Update user                    | `users:update` |
| `DELETE` | `/users/:id`             | Delete user                    | `users:delete` |
| `PUT`    | `/users/:id/roles`       | Assign roles to user           | `users:update` |

#### Default Roles (Seed Data)

| Role                | Permissions                                              | System |
| ------------------- | -------------------------------------------------------- | ------ |
| **Super Admin**     | All `*:manage` permissions                               | Yes    |
| **Content Manager** | `content:manage`, `playlists:manage`, `schedules:manage` | Yes    |
| **Viewer**          | All `*:read` permissions                                 | Yes    |

---

### 3. Content Module

Purpose: Manage media assets (upload, metadata, downloads) stored in object storage.

File upload and storage using **MinIO (S3-compatible)** with server-side validation via **Zod**.

#### Routes

| Method   | Endpoint            | Description                | Permission       |
| -------- | ------------------- | -------------------------- | ---------------- |
| `POST`   | `/content`          | Upload a file              | `content:create` |
| `GET`    | `/content`          | List content (paginated)   | `content:read`   |
| `GET`    | `/content/:id`      | Get content details        | `content:read`   |
| `DELETE` | `/content/:id`      | Delete content             | `content:delete` |
| `GET`    | `/content/:id/file` | Get presigned download URL | `content:read`   |

#### Upload Flow

```
1. Client sends multipart/form-data
2. Request parsed in Hono and validated with Zod
3. File stored in MinIO (S3-compatible client)
4. SHA-256 checksum calculated from stream
5. Content record created in database
```

#### Content Object

```typescript
{
  id: string;
  title: string;
  type: "IMAGE" | "VIDEO" | "PDF";
  mimeType: string;
  fileSize: number; // bytes
  checksum: string; // SHA-256
  width: number | null; // pixels (images/videos)
  height: number | null; // pixels (images/videos)
  duration: number | null; // seconds (videos only)
  createdAt: string; // ISO timestamp
  createdBy: {
    id: string;
    name: string;
  }
}
```

#### MinIO Bucket Structure

```
content/
  ├── images/
  │   └── {uuid}.{ext}
  ├── videos/
  │   └── {uuid}.mp4
  └── documents/
      └── {uuid}.pdf
```

---

### 4. Playlists Module

Purpose: Group content into ordered playlists with per-item durations.

Ordered content collections with duration per item.

#### Routes

| Method   | Endpoint                       | Description              | Permission         |
| -------- | ------------------------------ | ------------------------ | ------------------ |
| `GET`    | `/playlists`                   | List playlists           | `playlists:read`   |
| `POST`   | `/playlists`                   | Create playlist          | `playlists:create` |
| `GET`    | `/playlists/:id`               | Get playlist with items  | `playlists:read`   |
| `PATCH`  | `/playlists/:id`               | Update playlist metadata | `playlists:update` |
| `DELETE` | `/playlists/:id`               | Delete playlist          | `playlists:delete` |
| `POST`   | `/playlists/:id/items`         | Add item to playlist     | `playlists:update` |
| `PATCH`  | `/playlists/:id/items/:itemId` | Update item              | `playlists:update` |
| `DELETE` | `/playlists/:id/items/:itemId` | Remove item              | `playlists:update` |

#### Playlist Object

```typescript
{
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
  items: PlaylistItem[]
}
```

#### PlaylistItem Object

```typescript
{
  id: string;
  sequence: number; // Order in playlist (10, 20, 30...)
  duration: number; // Seconds to display
  content: {
    id: string;
    title: string;
    type: "IMAGE" | "VIDEO" | "PDF";
    checksum: string;
  }
}
```

#### Sequencing Strategy

Items use explicit `sequence` integers with gaps (10, 20, 30) to allow insertion without reindexing:

- Insert between 10 and 20 → new item gets sequence 15
- Bulk reorder recalculates all sequences

---

### 5. Schedules Module

Purpose: Assign playlists to devices by time window with priority-based conflict resolution.

Time-based rules assigning playlists to devices with priority-based conflict resolution.

#### Routes

| Method   | Endpoint         | Description          | Permission         |
| -------- | ---------------- | -------------------- | ------------------ |
| `GET`    | `/schedules`     | List schedules       | `schedules:read`   |
| `POST`   | `/schedules`     | Create schedule      | `schedules:create` |
| `GET`    | `/schedules/:id` | Get schedule details | `schedules:read`   |
| `PATCH`  | `/schedules/:id` | Update schedule      | `schedules:update` |
| `DELETE` | `/schedules/:id` | Delete schedule      | `schedules:delete` |

#### Schedule Object

```typescript
{
  id: string
  name: string
  playlistId: string
  deviceId: string
  startTime: string    // "HH:mm" format (e.g., "08:00")
  endTime: string      // "HH:mm" format (e.g., "17:00")
  daysOfWeek: number[] // [0-6], where 0=Sunday
  priority: number     // Higher number = higher priority
  isActive: boolean
  createdAt: string
  updatedAt: string
  playlist: {
    id: string
    name: string
  }
  device: {
    id: string
    name: string
  }
}
```

#### Priority Resolution

When multiple schedules match the current time for a device, the schedule with the **highest priority** wins.

```
Example:
  Schedule A: priority=10, "Morning Announcements"
  Schedule B: priority=20, "Emergency Alert"

  Both active at 9:00 AM → Device plays "Emergency Alert"
```

---

### 6. Devices Module

Purpose: Register playback devices and provide the manifest they need to sync content.

Device registration and content manifest delivery.

#### Routes

| Method | Endpoint                       | Description                     | Auth           |
| ------ | ------------------------------ | ------------------------------- | -------------- |
| `POST` | `/devices`                     | Register/re-register device     | Shared API Key |
| `GET`  | `/devices/:id/manifest`        | Get content manifest            | Shared API Key |
| `GET`  | `/devices/:id/active-schedule` | Get current playlist for device | Shared API Key |
| `GET`  | `/devices`                     | List all devices                | `devices:read` |
| `GET`  | `/devices/:id`                 | Get device details              | `devices:read` |

#### Device Registration

Devices authenticate using a shared API key passed in the `X-API-Key` header.

```typescript
// Registration Request
POST /devices
Headers: { "X-API-Key": "shared-secret-key" }
Body: {
  identifier: string  // Hardware ID (MAC address, serial, etc.)
  name: string        // Display name
  location?: string   // Physical location
}

// Registration Response
{
  id: string
  identifier: string
  name: string
  location: string | null
}
```

#### Content Manifest

The manifest contains everything a device needs to sync and play content.

```typescript
GET /devices/:id/manifest
Headers: { "X-API-Key": "shared-secret-key" }

// Response
{
  playlistId: string | null
  playlistVersion: string      // Hash for cache invalidation
  generatedAt: string          // ISO timestamp
  items: [{
    id: string
    sequence: number
    duration: number           // Seconds to display
    content: {
      id: string
      type: 'IMAGE' | 'VIDEO' | 'PDF'
      checksum: string         // SHA-256 for local cache check
      downloadUrl: string      // Presigned URL (1 hour expiry)
      mimeType: string
      width: number | null
      height: number | null
      duration: number | null  // Video duration
    }
  }]
}
```

#### Device Sync Flow

```
1. Device boots, calls /devices/register with identifier
2. Device receives device ID
3. Device polls /devices/:id/manifest periodically (e.g., every 60s)
4. Device compares checksums with local cache
5. Device downloads only changed/new content
6. Device plays playlist items in sequence order
7. Repeat from step 3
```

---

## Database Schema

Drizzle ORM schema (MySQL).

```typescript
import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  json,
  primaryKey,
} from "drizzle-orm/mysql-core";

// ===========================================
// AUTH & RBAC
// ===========================================

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roles = mysqlTable("roles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  isSystem: boolean("is_system").notNull().default(false),
});

export const permissions = mysqlTable("permissions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  resource: varchar("resource", { length: 120 }).notNull(),
  action: varchar("action", { length: 120 }).notNull(),
});

export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: varchar("user_id", { length: 36 }).notNull(),
    roleId: varchar("role_id", { length: 36 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: varchar("role_id", { length: 36 }).notNull(),
    permissionId: varchar("permission_id", { length: 36 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

// ===========================================
// CONTENT
// ===========================================

export const content = mysqlTable("content", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 16 }).notNull(), // IMAGE | VIDEO | PDF
  fileKey: varchar("file_key", { length: 512 }).notNull(),
  checksum: varchar("checksum", { length: 128 }).notNull(),
  mimeType: varchar("mime_type", { length: 120 }).notNull(),
  fileSize: int("file_size").notNull(),
  width: int("width"),
  height: int("height"),
  duration: int("duration"),
  createdById: varchar("created_by_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ===========================================
// PLAYLISTS
// ===========================================

export const playlists = mysqlTable("playlists", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdById: varchar("created_by_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const playlistItems = mysqlTable("playlist_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  playlistId: varchar("playlist_id", { length: 36 }).notNull(),
  contentId: varchar("content_id", { length: 36 }).notNull(),
  sequence: int("sequence").notNull(),
  duration: int("duration").notNull(),
});

// ===========================================
// DEVICES
// ===========================================

export const devices = mysqlTable("devices", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===========================================
// SCHEDULES
// ===========================================

export const schedules = mysqlTable("schedules", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  playlistId: varchar("playlist_id", { length: 36 }).notNull(),
  deviceId: varchar("device_id", { length: 36 }).notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(), // "HH:mm"
  endTime: varchar("end_time", { length: 5 }).notNull(), // "HH:mm"
  daysOfWeek: json("days_of_week").notNull(), // [0-6], where 0=Sunday
  priority: int("priority").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

---

## API Endpoints Summary

| Module        | Count  | Endpoints                                            |
| ------------- | ------ | ---------------------------------------------------- |
| **Auth**      | 3      | login, logout, me                                    |
| **RBAC**      | 14     | roles CRUD, permissions, users CRUD, role assignment |
| **Content**   | 5      | upload, list, get, delete, download                  |
| **Playlists** | 8      | CRUD, item management                                |
| **Schedules** | 5      | CRUD                                                 |
| **Devices**   | 5      | create, manifest, active-schedule, list, get         |
| **Total**     | **40** |                                                      |

---

## Display Settings Reference

> **Note**: These settings are handled by the **frontend/client**, not stored in the backend database. Documented here for integration reference.

### Universal Settings (All Content Types)

| Setting   | Type | Default   | Description                 |
| --------- | ---- | --------- | --------------------------- |
| `fitMode` | enum | `CONTAIN` | How content fits the screen |

**Fit Mode Options**:

- `CONTAIN` - Fit within bounds, preserve aspect ratio (letterbox)
- `COVER` - Fill bounds, crop if needed
- `FILL` - Stretch to fill (may distort)

### Image-Specific Settings

| Setting           | Type    | Default  | Description                           |
| ----------------- | ------- | -------- | ------------------------------------- |
| `scrollEnabled`   | boolean | `false`  | Enable scrolling for oversized images |
| `scrollDirection` | enum    | `UP`     | Scroll direction                      |
| `scrollSpeed`     | enum    | `MEDIUM` | Scroll speed                          |

**Scroll Direction Options**: `UP`, `DOWN`, `LEFT`, `RIGHT`
**Scroll Speed Options**: `SLOW`, `MEDIUM`, `FAST`

### Video-Specific Settings

| Setting | Type    | Default | Description         |
| ------- | ------- | ------- | ------------------- |
| `muted` | boolean | `false` | Mute video audio    |
| `loop`  | boolean | `false` | Loop video playback |

### Transition Settings

| Setting         | Type | Default | Description      |
| --------------- | ---- | ------- | ---------------- |
| `transitionIn`  | enum | `NONE`  | Entry transition |
| `transitionOut` | enum | `NONE`  | Exit transition  |

**Transition Options**: `NONE`, `FADE`

### Future Implementation

If display settings need to be stored in the backend, add these fields to the `playlist_items` table:

```typescript
import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const playlistItems = mysqlTable("playlist_items", {
  // ... existing fields

  // Display settings (optional future addition)
  fitMode: varchar("fit_mode", { length: 16 }),
  scrollEnabled: boolean("scroll_enabled"),
  scrollDirection: varchar("scroll_direction", { length: 8 }),
  scrollSpeed: varchar("scroll_speed", { length: 8 }),
  muted: boolean("muted"),
  loop: boolean("loop"),
  transitionIn: varchar("transition_in", { length: 8 }),
  transitionOut: varchar("transition_out", { length: 8 }),
});
```

---

## Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=signage
DB_PASSWORD=signage
DB_DATABASE=signage

# Auth
JWT_SECRET=your-jwt-secret

# Drive (MinIO/S3)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=content
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true

# Device API
DEVICE_API_KEY=shared-device-secret-key

# DCISM Auth
HTPASSWD_PATH=/etc/example_htshadow
```

---

## Docker Compose (Development)

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=mysql://signage:signage@mysql:3306/signage
      - S3_ENDPOINT=minio
    depends_on:
      - mysql
      - minio
    volumes:
      - .:/app
      - /app/node_modules

  mysql:
    image: mysql:8
    environment:
      MYSQL_DATABASE: signage
      MYSQL_USER: signage
      MYSQL_PASSWORD: signage
      MYSQL_ROOT_PASSWORD: signage
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

volumes:
  mysql_data:
  minio_data:
```

---

## Quick Reference

### Key Decisions

| Decision             | Choice               | Rationale                                  |
| -------------------- | -------------------- | ------------------------------------------ |
| What gets scheduled? | Playlists            | Same content can be in multiple playlists  |
| Auth strategy        | JWT, 24h expiry      | Simple, stateless, sufficient for capstone |
| RBAC                 | Dynamic permissions  | Required for flexible access control       |
| Content processing   | None (pre-optimized) | Reduces complexity, meets timeline         |
| Display settings     | Frontend handles     | Backend stays simple                       |
| Device sync          | Polling + checksums  | Reliable, simple to implement              |

### Common Operations

```bash
# Start development server
bun run dev

# Run tests
bun test

# Run database migrations (Drizzle Kit)
bunx drizzle-kit migrate

# View API documentation (Scalar)
open http://localhost:3000/docs
```

---

_This specification is scoped for a 1-2 month capstone project. Features are intentionally simplified to ensure completion within the timeline while demonstrating core functionality._
