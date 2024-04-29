import { Service } from 'typedi';
import { Product, UserRelation } from '@apolo-services/product/resolvers/product.type';
import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { UserService } from '@library/services/user.service';
import { gql } from 'graphql-request';

@Service()
@Resolver(() => Product)
export class ProductResolver {
  constructor() {}

  @FieldResolver(() => UserRelation, { nullable: true })
  async userRelation(@Root() product: Product, @Ctx() context: any) {
    // console.log(context.req.headers);
    // const doccument = gql`
    //   query ($userGetUserByIdId: Float!) {
    //     USER_getUserById(id: $userGetUserByIdId) {
    //       id
    //       email
    //       password
    //       userName
    //       __typename
    //       profile {
    //         id
    //       }
    //     }
    //   }
    // `;
    // const data: any = await UserService.query(
    //   doccument,
    //   { userGetUserByIdId: product.userId },
    //   { ...context.req.headers }
    // );
    // return data?.USER_getUserById;

    return product?.userRelation
  }

  @Authorized()
  @Query(() => [Product])
  async PRODUCT_getAllProduct() {
    const product: Array<Product> = [
      {
        id: 1,
        productName: 'MacBook M1',
        price: 41000000,
        quantity: 1,
        userId: 1,
        userRelation: {
          id: 1,
          email: 'thoaiky1992@gmail.com',
          password: '123456',
          userName: 'thoaiky1992'
        }
      },
      { id: 2, productName: 'Dell', price: 20000000, quantity: 2, userId: 2 }
    ];
    return product;
  }
}
