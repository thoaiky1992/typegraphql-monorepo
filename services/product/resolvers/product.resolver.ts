import { Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Product } from './product.type'

@Service()
@Resolver(() => Product)
export class ProductResolver {
  constructor() {}

  @Query(() => [Product])
  async PRODUCT_getAll() {
    const products: Array<Product> = [{ id: 1, productName: 'Macbook', price: 5000 }]
    return products
  }
}
