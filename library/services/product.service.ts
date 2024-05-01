import BaseService from '.';

class ProductServiceIstance extends BaseService {
  static _instance: ProductServiceIstance;
  constructor() {
    super(String(process.env.APOLO_SERVICE_PRODUCT_URL), 'PRODUCT');
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
}

export const ProductService = ProductServiceIstance.getInstance();
