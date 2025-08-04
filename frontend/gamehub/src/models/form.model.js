import { z } from "zod";

const schema = z.object({

    titulo:z.string().trim().min(2, "El título debe tener al menos 2 caracteres" ),
    genero: z.string().trim().min(1, "El género es obligatorio"),
    plataforma: z.string().trim().min(1, "La plataforma es obligatoria"),
    precioVenta: z.union([
        z.string().trim().min(1, "El precio de venta es obligatorio"),
        z.number()
      ])
      .transform((val) => Number(val))
      .refine((val) => val >= 30000, "Debe ser mayor a 30000"),
      
      precioAlquiler: z.union([
        z.string().trim().min(1, "El precio de alquiler es obligatorio"),
        z.number()
      ])
      .transform((val) => Number(val))
      .refine((val) => val >= 30000, "Debe ser mayor a 30000"),
    stock: z.union([
      z.string().trim().min(1, "El stock es obligatorio"),
      z.number()
    ])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Debe ser mayor a 0"),
    imagen: z
    .instanceof(File, { message: "Debes seleccionar una imagen" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "El archivo debe pesar menos de 5MB",
    }),
});


export default schema;