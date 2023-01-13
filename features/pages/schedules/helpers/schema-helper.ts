import { z } from 'zod';

export const baseSchema = z.object({
  timeRange: z.array(z.string()),
  route: z.string().min(1, 'Route is required'),
  message1: z.nullable(z.string()),
  message2: z.nullable(z.string()),
  message3: z.nullable(z.string()),
  message4: z.nullable(z.string()),
  message5: z.nullable(z.string()),
});

export type BaseSchema = z.infer<typeof baseSchema>;

export function messageValidation<
  FormValues extends z.infer<typeof baseSchema>
>(data: FormValues, ctx: z.RefinementCtx) {
  if (
    !data.message1 &&
    !data.message2 &&
    !data.message3 &&
    !data.message4 &&
    !data.message5
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['message1'],
      message: 'At least one message is required.',
    });
  }
}
