import * as GraphQlFields from 'graphql-fields'
import {GraphQLResolveInfo } from 'graphql';
import {difference, union} from 'lodash'

export class RequestedFields {
    getFields(info: GraphQLResolveInfo, options?: { keep?: string[], exclude?: string[] }): string[]{
        //retorna as chaves do nivel superior do objeto
        let fields: string[] = Object.keys(GraphQlFields(info))
        if (!options){return fields}
        fields = (options.keep) ? union<string>(fields, options.keep) : fields;
        fields = (options.exclude) ? difference<string>(fields, options.exclude) : fields;

    }
}