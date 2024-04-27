import { Request, Response } from 'express'
import { AuthChecker, ResolverData } from 'type-graphql'

export const formaterApoloServer = (formattedError: any, error: any) => {
  switch (formattedError.extensions!.code) {
    case 'BAD_USER_INPUT':
      const validationErrors: any = []
      const validationErrorsTemp = (formattedError.extensions as any).validationErrors
      validationErrorsTemp?.forEach((err: any) => {
        const { constraints, value, property } = err
        validationErrors.push({ constraints, value, property })
      })
      return { message: formattedError.message, extensions: { code: formattedError.extensions!.code, validationErrors } }

    default:
      return { message: formattedError.message }
  }
}

type ContextType = {
  req: Request
  res: Response
}
export const customAuthChecker: AuthChecker<ContextType> = ({ root, args, context, info }, roles) => {
  // Read user from context
  // and check the user's permission against the `roles` argument
  // that comes from the '@Authorized' decorator, eg. ["ADMIN", "MODERATOR"]
  if (context.req.headers.authorization?.split(' ')[1] === 'abc') return true

  return false // or 'false' if access is denied
}
