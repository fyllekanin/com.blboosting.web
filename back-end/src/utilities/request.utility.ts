import { InternalRequest } from './internal.request';
import { PaginationWhere } from '../persistance/repositories/base.repository';

export interface PaginationValue {
    key: string;
    operator: string;
}

export class RequestUtility {

    static getPaginationWheresFromQuery(req: InternalRequest, values: Array<PaginationValue>): Array<PaginationWhere> {
        const isExactSearch = req.query.isExactSearch ? req.query.isExactSearch : 'true';
        return values.map(value => {
            const queryValue = req.query[value.key];
            if (!queryValue) {
                return null;
            }
            return <PaginationWhere>{
                key: value.key,
                operator: value.operator,
                value: isExactSearch === 'true' ? queryValue : `%${queryValue}%`
            };
        })
            .filter(value => value);
    }
}
