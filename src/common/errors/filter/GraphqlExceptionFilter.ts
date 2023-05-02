import { Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ApolloError } from 'apollo-server-express';
import { CustomException } from '../custom-exceptions/custom-exception';

@Catch(CustomException)
export class GraphqlExceptionFilter extends BaseExceptionFilter {
  catch(exception: CustomException) {
    const { message, code, name } = exception;
    return new ApolloError(message, code, { name });
  }
}
