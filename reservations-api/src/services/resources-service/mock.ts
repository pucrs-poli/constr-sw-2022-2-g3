import { ResourceDto } from "../../dtos/resources";

export class ResourcesServiceMock {
    static async getById(token: string, id: string): Promise<ResourceDto> {
        return {
            id: '1',
            description: 'Notebook 1',
            resourceType: {
                id: '1',
                name: 'Notebook'
            },
            status: 'Ativo',
        }
    }
}
