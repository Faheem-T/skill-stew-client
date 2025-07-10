import { api } from "../baseApi"

export const getUsers = async () => {
    const result = await api.get("/users")
    console.log(result);
    return result;
}