import { z } from "zod";

export const AdminLoginReqSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const AdminLoginResSchema = z.object({
  success: z.literal(true),
});

export type AdminLoginReq = z.infer<typeof AdminLoginReqSchema>;
export type AdminLoginRes = z.infer<typeof AdminLoginResSchema>;
