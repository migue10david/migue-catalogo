import { z } from "zod";

export const catalogSchema = z.object({
    id: z.string(),
    owner_id: z.string(),
    name: z.string(),
    description: z.string().nullish(),
    address: z.string().nullish(),
    phone: z.string().nullish(),
    facebook_url: z.string().nullish(),
    instagram_url: z.string().nullish(),
    whatsapp_url: z.string().nullish(),
    province_id: z.number().nullish(),
    business_category_id: z.number().nullish(),
    logo_url: z.string().nullish(),
    cover_url: z.string().nullish(),
    is_active: z.boolean(),
})

export type Catalog = z.infer<typeof catalogSchema>;