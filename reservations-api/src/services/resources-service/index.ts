import { ResourcesServiceMock } from "./mock";
import { ResourcesServiceRemote } from "./remote";

export const ResourcesService = (
    process.env.RESOURCES_API_MOCK === 'true'
    ? ResourcesServiceMock
    : ResourcesServiceRemote
);
