import type { loginSchema } from "@/pages/LoginPage"
import { api, type ApiResponseType } from "../baseApi"
import {z}from "zod"
import axios from "axios"

export const loginRequest = async (body: z.infer<typeof loginSchema>): Promise<ApiResponseType<{}>> => {
    return api.post("/users/login", body)
}