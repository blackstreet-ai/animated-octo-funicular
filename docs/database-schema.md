# AI Cinematic Conversion Platform - Database Schema

## Overview

This document outlines the database schema for the AI Cinematic Conversion Platform using Neon Serverless Postgres with Drizzle ORM. The schema is designed to support the core functionality of the platform while maintaining scalability and performance.

## Tables

### Users

Stores user-specific information that extends Clerk's authentication data.

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  subscriptionTier: text('subscription_tier').notNull().default('free'),
  monthlyCredits: integer('monthly_credits').notNull().default(20),
  creditsUsed: integer('credits_used').notNull().default(0),
  lastResetDate: timestamp('last_reset_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Projects

Stores information about user projects, including metadata and settings.

```typescript
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  shareableLink: text('shareable_link'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Conversions

Tracks individual conversion jobs and their status.

```typescript
export const conversions = pgTable('conversions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'text-to-image' or 'image-to-video'
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  inputText: text('input_text'),
  parameters: jsonb('parameters'), // Store conversion parameters as JSON
  resultUrl: text('result_url'), // URL to the generated image or video
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Images

Stores metadata about generated images.

```typescript
export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  conversionId: uuid('conversion_id').references(() => conversions.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  width: integer('width'),
  height: integer('height'),
  format: text('format'),
  style: text('style'),
  aspectRatio: text('aspect_ratio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Videos

Stores metadata about generated videos.

```typescript
export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  conversionId: uuid('conversion_id').references(() => conversions.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // Duration in seconds
  width: integer('width'),
  height: integer('height'),
  format: text('format'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### ImageToVideoMappings

Maps the relationship between images and videos for image-to-video conversions.

```typescript
export const imageToVideoMappings = pgTable('image_to_video_mappings', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  imageId: uuid('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  sequenceOrder: integer('sequence_order').notNull(), // Order of images in the video
  durationMs: integer('duration_ms'), // Duration of this image in the video (milliseconds)
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

### UserActivityLogs

Tracks user activity for monitoring and analytics.

```typescript
export const userActivityLogs = pgTable('user_activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // e.g., 'login', 'conversion', 'project_create'
  details: jsonb('details'), // Additional details about the action
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

## Indexes

To optimize query performance, the following indexes will be created:

```typescript
// User lookup by email
createIndex('users_email_idx', users.email);

// Project lookup by user
createIndex('projects_user_id_idx', projects.userId);

// Conversion lookup by user and project
createIndex('conversions_user_id_idx', conversions.userId);
createIndex('conversions_project_id_idx', conversions.projectId);

// Image lookup by user, project, and conversion
createIndex('images_user_id_idx', images.userId);
createIndex('images_project_id_idx', images.projectId);
createIndex('images_conversion_id_idx', images.conversionId);

// Video lookup by user, project, and conversion
createIndex('videos_user_id_idx', videos.userId);
createIndex('videos_project_id_idx', videos.projectId);
createIndex('videos_conversion_id_idx', videos.conversionId);

// Image-to-video mapping lookup
createIndex('image_to_video_mappings_video_id_idx', imageToVideoMappings.videoId);
createIndex('image_to_video_mappings_image_id_idx', imageToVideoMappings.imageId);

// User activity logs lookup
createIndex('user_activity_logs_user_id_idx', userActivityLogs.userId);
createIndex('user_activity_logs_action_idx', userActivityLogs.action);
```

## Relationships

The schema establishes the following relationships:

1. Users have many Projects
2. Users have many Conversions
3. Projects have many Conversions
4. Conversions can produce Images or Videos
5. Videos can be composed of multiple Images (through ImageToVideoMappings)
6. Users have many ActivityLogs

## Migration Strategy

Database migrations will be managed using Drizzle Kit:

1. Initial schema creation
2. Incremental schema updates as features evolve
3. Data backfilling for new columns or tables
4. Index optimization based on query patterns

## Implementation Notes

- Use Drizzle ORM for type-safe database access
- Implement database connection pooling for efficient resource usage
- Use transactions for operations that modify multiple tables
- Implement proper error handling and retry mechanisms
- Consider adding soft delete functionality for important data
