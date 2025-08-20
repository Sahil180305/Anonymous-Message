import {z} from 'zod'

export const messageSchema = z.object({
    content:z
    .string()
    .min(10,"Content must be atleast of 10 characters")
    .max(500,"Content must be not more than 500 characters")
})