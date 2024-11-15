import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

const apiSpec = createSwaggerSpec({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js Car Management API',
      version: '1.0.0',
      description: 'API documentation for car management system',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Cars', description: 'Car management endpoints' },
    ],
    components: {
      schemas: {
        Image: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            url: { type: 'string' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
          },
        },
        UserBasic: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
          },
        },
        GetCar: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            images: {
              type: 'array',
              items: { $ref: '#/components/schemas/Image' }
            },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' }
            },
            user: { $ref: '#/components/schemas/UserBasic' },
          },
        },
        CreateCar: {
          type: 'object',
          required: ['title', 'description', 'images', 'tags'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            images: {
              type: 'array',
              items: { type: 'string' }
            },
            tags: {
              type: 'array',
              items: { type: 'string' }
            },
          },
        },
        UpdateCar: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            images: {
              type: 'array',
              items: { type: 'string' }
            },
            tags: {
              type: 'array',
              items: { type: 'string' }
            },
          },
        },
        SignupCredentials: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            name: { type: 'string' },
          },
        },
        SigninCredentials: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
      securitySchemes: {
        sessionAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    paths: {
      '/api/auth/signin': {
        post: {
          tags: ['Authentication'],
          summary: 'Sign in user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SigninCredentials' },
              },
            },
          },
          responses: {
            200: { description: 'Successfully signed in' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/signup': {
        post: {
          tags: ['Authentication'],
          summary: 'Sign up new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignupCredentials' },
              },
            },
          },
          responses: {
            200: { description: 'User created successfully' },
            400: { description: 'Invalid input' },
          },
        },
      },
      '/api/car': {
        get: {
          tags: ['Cars'],
          summary: 'Get all cars',
          responses: {
            200: {
              description: 'List of all cars',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      cars: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/GetCar' },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'No cars found' },
            500: { description: 'Server error' },
          },
        },
      },
      '/api/car/{id}': {
        get: {
          tags: ['Cars'],
          summary: 'Get car by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'number' },
              description: 'Numeric ID of the car to retrieve',
            },
          ],
          responses: {
            200: {
              description: 'Car details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      car: { $ref: '#/components/schemas/GetCar' },
                    },
                  },
                },
              },
            },
            404: { description: 'Car not found' },
            400: { description: 'Invalid ID format' },
          },
        },
      },
      '/api/car/create': {
        post: {
          tags: ['Cars'],
          summary: 'Create new car',
          security: [{ sessionAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateCar' },
              },
            },
          },
          responses: {
            200: {
              description: 'Car created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/GetCar' },
                },
              },
            },
            401: { description: 'Not authenticated' },
            400: { description: 'Invalid input' },
            404: { description: 'User not found' },
          },
        },
      },
      '/api/car/update/{id}': {
        put: {
          tags: ['Cars'],
          summary: 'Update car',
          security: [{ sessionAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'number' },
              description: 'Numeric ID of the car to update',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCar' },
              },
            },
          },
          responses: {
            200: {
              description: 'Car updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/GetCar' },
                    },
                  },
                },
              },
            },
            401: { description: 'Not authenticated' },
            404: { description: 'Car not found' },
          },
        },
      },
      '/api/car/delete/{id}': {
        delete: {
          tags: ['Cars'],
          summary: 'Delete car',
          security: [{ sessionAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'number' },
              description: 'Numeric ID of the car to delete',
            },
          ],
          responses: {
            200: {
              description: 'Car deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { description: 'Not authenticated' },
            404: { description: 'Car not found' },
          },
        },
      },
    },
  },
  apiFolder: 'app/api',
});

export async function GET() {
  return NextResponse.json(apiSpec);
}