import { z } from "zod";

const loginSchema = z.object({

    username: z.string().trim().min(1, "El username es obligatorio"),
    password: z.string().trim().min(1, "La contraseña es obligatoria")
    .refine((val) => val.length >= 5, "La contraseña debe tener al menos 5 caracteres"),
})

export default loginSchema;