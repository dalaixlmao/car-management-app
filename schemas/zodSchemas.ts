import z from "zod";

const createCarSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()).max(10),
  tags: z.array(z.string()),
});

const updateCarSchema = z.object({
  id: z.number().int().positive(), // Ensure 'id' is required and a positive integer
  tags: z.array(z.string()).optional(), // Optional array of strings
  images: z.array(z.string().url()).optional(), // Optional array of URLs
  title: z.string().optional(), // Optional string
  description: z.string().optional(), // Optional string
});

const deleteCarSchema = z.object({
  id: z.number(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signUpSchema = signInSchema.extend({
  name: z.string(),
});

export {
  signInSchema,
  signUpSchema,
  updateCarSchema,
  deleteCarSchema,
  createCarSchema,
};
