import { Service } from 'typedi';
import { Product } from '@apolo-services/product/resolvers/product.type';
import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { User } from '@apolo-services/product/resolvers/product.type';

@Service()
@Resolver(() => Product)
export class ProductResolver {
  constructor() {}

  @FieldResolver(() => User, { nullable: true })
  async user(@Root() product: Product, @Ctx() context: any) {
    return { __type: 'User', id: product.userId };
  }

  @Authorized()
  @Query(() => [Product])
  async PRODUCT_getAllProduct() {
    // const user = await JobManager.waitJobUntilFinished('abc', MailUnit.GET_USER_BY_ID_TASK, { userId: 1 }, 3000);
    let products: Array<Product> = [];
    try {
      products = [
        { id: 1, productName: 'MacBook M1', price: 41000000, quantity: 1, userId: 1 },
        { id: 2, productName: 'Dell', price: 20000000, quantity: 2, userId: 2 }
      ];
    } catch (error) {
      console.log(error);
    }
    return products;
  }
}
