import { z } from 'zod';

export const messageSchema = z.object({
  message1: z.nullable(z.string()),
  message2: z.nullable(z.string()),
  message3: z.nullable(z.string()),
  message4: z.nullable(z.string()),
  message5: z.nullable(z.string()),
});
