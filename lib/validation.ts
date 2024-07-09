import { z } from 'zod';

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(50, 'Name has a maximum of 50 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().refine((phone) => {
    const digits = phone.replace(/\D/g, '');
    return (
      /^\+\d{1,4}\d{9,15}$/.test(phone) &&
      digits.length >= 10 &&
      digits.length <= 15
    );
  }, 'Phone number must be a valid international number after the country code.'),
});
