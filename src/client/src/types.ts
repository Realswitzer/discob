export enum Status {
    Error = "Error",
    Notice = "Notice",
}

export type RegisterData = {
    username: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
    email: string | undefined;
};

export type LoginData = {
    username: string | undefined;
    password: string | undefined;
};
