export class NoAuthProvider {
    async extractContext(req) {
        return {
            isAuthenticated: false,
            roles: ['anonymous'],
        };
    }
}
