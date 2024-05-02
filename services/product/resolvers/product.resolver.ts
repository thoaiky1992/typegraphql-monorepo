import { Service } from 'typedi';
import { Product } from '@apolo-services/product/resolvers/product.type';
import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { UserService } from '@library/services/user.service';
import { User } from '@apolo-services/product/resolvers/product.type';
import { Document_PRODUCT_getAllUser, Document_USER_getUserById } from '@document/index';

@Service()
@Resolver(() => Product)
export class ProductResolver {
  constructor() {}

  @FieldResolver(() => User, { nullable: true })
  async user(@Root() product: Product, @Ctx() context: any) {
    return { __type: 'User', id: product.userId }
  }

  @Authorized()
  @Query(() => [Product])
  async PRODUCT_getAllProduct() {
    const product: Array<Product> = [
      { id: 1, productName: 'MacBook M1', price: 41000000, quantity: 1, userId: 1 },
      { id: 2, productName: 'Dell', price: 20000000, quantity: 2, userId: 2 }
    ];
    return product;
  }

  @Query(() => [User])
  async PRODUCT_getAllUser(@Ctx() context: any) {
    const data: any = await UserService.query(Document_PRODUCT_getAllUser, {}, { ...context.req.headers });
    return data?.USER_getAllUser || [];
  }
}
