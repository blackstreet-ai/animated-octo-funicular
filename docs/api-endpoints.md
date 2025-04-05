# AI Cinematic Conversion Platform - API Endpoints

## Authentication

All API endpoints (except public endpoints) require authentication using Clerk. Authentication is handled through Next.js middleware.

## Base URL

For local development: `http://localhost:3000/api`
For production: `https://[your-domain]/api`

## API Versioning

The API does not use explicit versioning in the URL. Future versions will be managed through headers or new endpoints as needed.

## Response Format

All API responses follow a consistent format:

```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Endpoints

### User Management

#### GET /api/user
Get current user information including subscription details and usage.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    subscriptionTier: 'free' | 'basic' | 'pro';
    monthlyCredits: number;
    creditsUsed: number;
    lastResetDate: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### GET /api/user/usage
Get detailed usage information for the current user.

**Response:**
```typescript
{
  success: true,
  data: {
    subscriptionTier: 'free' | 'basic' | 'pro';
    monthlyCredits: number;
    creditsUsed: number;
    creditsRemaining: number;
    lastResetDate: string;
    nextResetDate: string;
    conversionHistory: {
      date: string;
      count: number;
    }[];
  }
}
```

### Projects

#### GET /api/projects
Get a list of projects for the current user.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: 'asc' or 'desc' (default: 'desc')

**Response:**
```typescript
{
  success: true,
  data: {
    projects: {
      id: string;
      name: string;
      description: string;
      isPublic: boolean;
      thumbnailUrl: string;
      createdAt: string;
      updatedAt: string;
    }[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}
```

#### POST /api/projects
Create a new project.

**Request Body:**
```typescript
{
  name: string;
  description?: string;
  isPublic?: boolean;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### GET /api/projects/:id
Get details for a specific project.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    shareableLink: string;
    createdAt: string;
    updatedAt: string;
    images: {
      id: string;
      url: string;
      thumbnailUrl: string;
      width: number;
      height: number;
      createdAt: string;
    }[];
    videos: {
      id: string;
      url: string;
      thumbnailUrl: string;
      duration: number;
      width: number;
      height: number;
      createdAt: string;
    }[];
  }
}
```

#### PATCH /api/projects/:id
Update a project.

**Request Body:**
```typescript
{
  name?: string;
  description?: string;
  isPublic?: boolean;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    updatedAt: string;
  }
}
```

#### DELETE /api/projects/:id
Delete a project.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
  }
}
```

#### POST /api/projects/:id/share
Generate or update a shareable link for a project.

**Response:**
```typescript
{
  success: true,
  data: {
    shareableLink: string;
  }
}
```

### Conversions

#### POST /api/conversions/text-to-image
Create a new text-to-image conversion.

**Request Body:**
```typescript
{
  projectId?: string; // Optional, will create a new project if not provided
  text: string;
  parameters: {
    style?: string;
    aspectRatio?: string;
    filter?: string;
    // Additional parameters supported by Fal Provider AI SDK
  };
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    projectId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    type: 'text-to-image';
    createdAt: string;
  }
}
```

#### POST /api/conversions/image-to-video
Create a new image-to-video conversion.

**Request Body:**
```typescript
{
  projectId: string;
  imageIds: string[]; // IDs of images to include in the video
  parameters: {
    duration?: number; // Duration per image in milliseconds
    transition?: string;
    // Additional parameters supported by Fal Provider AI SDK
  };
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    projectId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    type: 'image-to-video';
    createdAt: string;
  }
}
```

#### GET /api/conversions/:id
Get details for a specific conversion.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    projectId: string;
    type: 'text-to-image' | 'image-to-video';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    inputText: string;
    parameters: object;
    resultUrl: string;
    errorMessage: string;
    startedAt: string;
    completedAt: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### GET /api/conversions/:id/status
Check the status of a conversion.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    estimatedTimeRemaining: number; // in seconds
    startedAt: string;
    updatedAt: string;
  }
}
```

### Images

#### GET /api/images/:id
Get details for a specific image.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    projectId: string;
    conversionId: string;
    url: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    format: string;
    style: string;
    aspectRatio: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### PATCH /api/images/:id
Update image metadata.

**Request Body:**
```typescript
{
  projectId?: string; // Move to a different project
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    projectId: string;
    updatedAt: string;
  }
}
```

#### DELETE /api/images/:id
Delete an image.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
  }
}
```

### Videos

#### GET /api/videos/:id
Get details for a specific video.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    projectId: string;
    conversionId: string;
    url: string;
    thumbnailUrl: string;
    duration: number;
    width: number;
    height: number;
    format: string;
    createdAt: string;
    updatedAt: string;
    images: {
      id: string;
      url: string;
      sequenceOrder: number;
      durationMs: number;
    }[];
  }
}
```

#### PATCH /api/videos/:id
Update video metadata.

**Request Body:**
```typescript
{
  projectId?: string; // Move to a different project
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    projectId: string;
    updatedAt: string;
  }
}
```

#### DELETE /api/videos/:id
Delete a video.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
  }
}
```

## Error Codes

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `BAD_REQUEST`: Invalid request parameters
- `VALIDATION_ERROR`: Request validation failed
- `QUOTA_EXCEEDED`: User has exceeded their conversion quota
- `CONVERSION_FAILED`: Conversion process failed
- `INTERNAL_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Webhook Notifications

For asynchronous operations, the platform can send webhook notifications to a client-specified URL when a conversion is completed or fails. This is an optional feature that can be enabled in user settings.
