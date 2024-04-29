import { request } from 'graphql-request';

type SERVICE_NAME = 'USER' | 'PRODUCT'

export default class BaseService {
    public name: SERVICE_NAME;
    public url: string;

    constructor(url: string, name: SERVICE_NAME) {
        this.url = url;
        this.name = name;
    }

    async query(document: any, variables = {}, requestHeaders: any = {}) {
        return request({
            url: this.url,
            document,
            variables,
            requestHeaders,
        }).catch((e) => {
            console.log({ document, variables, serviceName: this.name, error: e })
            throw e;
        });
    }
}
