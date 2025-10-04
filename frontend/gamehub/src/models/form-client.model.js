import { z } from "zod";

const clientSchema = z.object({
    
    nombre: z.string().trim().regex( /^[a-zA-Z]+(\s[a-zA-Z]+)+$/,"El nombre y el apellido son obligatorios"),
    cedula: z.union([
        z.string().min(1,"La cedula es obligatoria"),
        z.number()
    ]).transform((val) => Number(val))
    .refine((val) => val >= 7, "Debe tener minimo 7 digitos"),
    telefono: z.string().trim().min(1,"El telefono es obligatorio")
    .transform((val) => Number(val))
      .refine((val) => val ==10, "Debe tener 10 digitos"),
    direccion: z.string().trim().min(1, "La direccion es obligatoria")


});

export default clientSchema;