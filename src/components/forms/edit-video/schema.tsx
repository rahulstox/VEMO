import { z } from "zod";
export const editVideoInfoSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Video title must have at least 5 characters" }),
  description: z.string().min(5, {
    // <-- Changed from 100 to 5
    message: "Video description must have at least 5 characters",
  }),
});
