
export interface HasRoleInput {
    groups?: string[];
}

export class AuthorizationService {
    static async hasRole(input: HasRoleInput, roles?: string[]) {
        if (!roles || roles.length === 0) return true;
        if (!input.groups) return false;
        return input.groups.some(group => {
            return roles.some(role => group === role || group === `/${role}`);
        });
    }
}
