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
