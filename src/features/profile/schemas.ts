import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, - and _",
    )
    .optional(),
  location: z.object({ placeId: z.string() }).optional(),
  languages: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof profileSchema>;
