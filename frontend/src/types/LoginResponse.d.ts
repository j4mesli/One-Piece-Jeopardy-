import UserSession from "./UserSession";

export default interface LoginResponse {
    message: string,
    status: number,
    session: UserSession
}