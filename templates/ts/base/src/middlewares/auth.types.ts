export interface AuthContext {
    userId?: string;
    roles: string[];
    isAuthenticated: boolean;
}
