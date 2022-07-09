import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(process.cwd(), 'src/typescript/gql-generated-types.ts'),
  outputAs: 'class',
  watch: true,
  customScalarTypeMapping: {
    DateTime: 'Date',
  },
});
