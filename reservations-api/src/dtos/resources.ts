
export interface ResourceDto {
    id: string;
    description: string;
    status: string;
    resourceType: ResourceTypeDto;
}

export interface ResourceTypeDto {
    id: string;
    name: string;
}
