import { LoginResponseSchema, UserHandleResponseSchema } from "@/schema";
import api from "./api";


export async function loginUser(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    const parsed = LoginResponseSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error("Respuesta con formato invalido en el login");
    }

    const { token } = parsed.data.data;
    if (token){
        localStorage.setItem("AUTH_TOKEN", token);
    }
    return parsed.data;
}

export async function getUserByHandle(handle: string) {
  const response = await api.get(`/auth/handle/${handle}`);
  const parsed = UserHandleResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    throw new Error('Respuesta con formato inválido al obtener usuario por handle');
  }
  return parsed.data;
}