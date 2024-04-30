import { gql } from 'graphql-request';

export const Document_USER_getUserById = gql`
  query ($userGetUserByIdId: Float!) {
    USER_getUserById(id: $userGetUserByIdId) {
      id
      email
      password
      userName
      __typename
      profile {
        id
      }
    }
  }
`;

export const Document_PRODUCT_getAllUser = gql`
  query {
    USER_getAllUser {
      id
      email
    }
  }
`;
