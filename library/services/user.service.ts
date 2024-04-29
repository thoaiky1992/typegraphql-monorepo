import BaseService from ".";

class UserServiceIstance extends BaseService {
    static _instance: UserServiceIstance;
    constructor() {
        super(String(process.env.APOLO_SERVICE_USER_URL), "USER")
    }

    static getInstance() {
        if(!this._instance) {
            this._instance = new this;
        }
        return this._instance;
    }
}

export const UserService = UserServiceIstance.getInstance();