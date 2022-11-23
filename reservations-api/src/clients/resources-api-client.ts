import request from "request";
import { ResourceDto } from "../dtos/resources";

export interface ResourcesApiResponse<T> {
    status: number;
    data: T,
}

export type ResourcesApiGetResourceResponse = ResourcesApiResponse<ResourceDto>;

export class ResourcesApiClient {
    public static async getResourceById(token: string, id: string): Promise<ResourcesApiGetResourceResponse> {
        const url = process.env.RESOURCES_API_SERVER_URL;
        return new Promise(resolve => {
            request({
                url: `${url}/resources/${id}`,
                method: 'GET',
                headers: {
                    Authorization: token,
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }
}
