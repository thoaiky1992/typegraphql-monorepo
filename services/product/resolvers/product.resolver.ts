import { Service } from 'typedi';
import { Product } from '@apolo-services/product/resolvers/product.type';
import { Authorized, Query, Resolver } from 'type-graphql';

@Service()
@Resolver(() => Product)
export class ProductResolver {
  constructor() {}

  @Authorized()
  @Query(() => [Product])
  async PRODUCT_getAllProduct() {
    const product: Array<Product> = [{ id: 1, productName: 'MacBook M1', price: 41000000, quantity: 1 }];
    return product;
  }
}
