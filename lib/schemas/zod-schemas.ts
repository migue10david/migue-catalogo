import { z } from "zod";

export const catalogSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  business_category_id: z.string().min(1, "Selecciona una categoría"),
  province_id: z.string().min(1, "Selecciona una provincia"),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapp_url: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  logo_file: z.custom<File>().optional(),
  cover_file: z.custom<File>().optional(),
  catalog_id: z.string().optional(),
});

export type CatalogFormData = z.infer<typeof catalogSchema>;