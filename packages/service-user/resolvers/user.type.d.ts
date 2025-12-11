export declare class Profile {
    id: number;
    address?: string;
    phone?: string;
    userId?: number;
}
export declare class User {
    id?: number;
    email?: string;
    userName?: string;
    password?: string;
    profile?: Profile;
}
