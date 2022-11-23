import { ResourcesApiClient } from "../../clients/resources-api-client";
import { ResourceDto } from "../../dtos/resources";
import { ResourcesServiceUnhandledStatusError } from "../../errors/resources-service-unhandled-status";
import { UnauthorizedError } from "../../errors/unauthorized-error";

export class ResourcesServiceRemote {
    static async getById(token: string, id: string): Promise<ResourceDto | undefined> {
        const { status, data } = await ResourcesApiClient.getResourceById(token, id);
        if (status === 404) return;
        if (status === 401) throw new UnauthorizedError();
        if (status !== 200) throw new ResourcesServiceUnhandledStatusError(status, data);
        return data;
    }
}
