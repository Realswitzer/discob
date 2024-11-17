export interface DatabaseMessage {
    DisplayName: string;
    ID: number;
    MessageDate: string;
    MessageID: string;
    MessageText: string;
    Reply: Reply | null;
    UserColor: string;
    UserID: null;
    Username: string;
}

export interface User {
    color: string;
    username: string;
}

export interface MessageData {
    text: string;
    sender: {
        username: string;
        color: string;
    };
    timestamp: Date;
    reply: Reply | null;
    chained: boolean;
}

export interface Reply {
    color: string | null;
    username: string | null;
    text: string | null;
}

export const UsernameRegex = /[^a-zA-Z0-9]+/g;
export const EmailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

export enum Events {
    Message = "message",
}

export enum StatusMessage {
    UsernameTaken = "Username already taken",
    InvalidEmail = "Invalid email",
    InvalidUsername = "Invalid username",
    EmailTaken = "Email already used",
    EnterInformation = "Please enter all information",
    PasswordMismatch = "Passwords do not match",
    EnterCode = "Please enter a code",
    IncorrectCode = "Incorrect code",
    Default = "An error has occured",
    AccountVerified = "Account successfully verified",
}