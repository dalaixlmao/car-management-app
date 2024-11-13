import z from "zod";

const createCarSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.number()),
});

const updateCarSchema = createCarSchema.partial();

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
