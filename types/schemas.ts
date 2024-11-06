import { z, ZodType } from "zod";
import { brandFormData, TokenFormData } from "./forms";

export const tokenValidationSchema: ZodType<TokenFormData> = z.object({
  template: z.string(),
  token: z.string(),
  user_id: z.string(),
  status: z.enum(["draft", "publish", "archive"]).optional(),
});

export const brandValidationSchema: ZodType<brandFormData> = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  image: z.string(),
  user_id: z.string(),
  status: z.enum(["draft", "publish", "archive"]).optional(),
});
