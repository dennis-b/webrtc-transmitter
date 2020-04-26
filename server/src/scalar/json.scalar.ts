import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';
import { identity, parseLiteral } from './graphql-type-json';

@Scalar('Object', type => Object)
export class JsonScalar implements CustomScalar<any, any> {
    description = 'Date custom scalar type';

    parseValue(value: any): any {
        return identity(value);
    }

    serialize(value: any): any {
        return identity(value);
    }

    parseLiteral(ast: ValueNode): any {
        return parseLiteral(ast);
    }
}
