import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  // handleRequest(err, user, info, context: ExecutionContext) {
  //   let request;
  //   const ctx = context.switchToHttp();
  //   if (ctx.getRequest()) {
  //     request = ctx.getRequest();
  //     request.user = user;
  //   } else {
  //     const gqlContext = GqlExecutionContext.create(context);
  //     request = gqlContext.getContext().req;
  //     request.user = user;
  //   }
  //   return user;
  // }
}
