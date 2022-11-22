export type FieldQuery<T> = T | {
    eq?: T;
    neq?: T;
    gt?: T;
    gteq?: T;
    lt?: T;
    lteq?: T;
    like?: T;
}

export type WhereQuery<T> = {
    [field in keyof T]?: FieldQuery<T[field]>;
}

export function buildFieldWhereQuery<T>(type: 'number' | 'boolean' | 'string', input: string): FieldQuery<T> {
    const parseValue = (value: any) => {
        if (type === 'number') return parseFloat(value);
        if (type === 'boolean') return value.toLowerCase() === 'true';
        if (type === 'string') return value;
    };
    const operators = [...input.matchAll(/(?:(?:\{([^\}]+)\})?([^\{]+))/g) || []];
    const query = operators.map(operatorMatch => {
        const operator = operatorMatch[1] || 'eq';
        const value = operatorMatch[2];
        return { [operator]: parseValue(value) };
    }).reduce((a, b) => Object.assign({}, a, b), {});
    return query;
}

export function buildSqlWhereQuery<T>(whereQuery: WhereQuery<T>): [string, any[]] {
    let where = '1=1';
    const values: any[] = [];
    for (const field in whereQuery) {
        const fieldQuery = whereQuery[field as keyof typeof whereQuery];
        if (typeof fieldQuery === 'object') {
            for (const comparatorName in fieldQuery) {
                const fieldCompQuery = fieldQuery[comparatorName as keyof typeof fieldQuery];
                if (typeof fieldCompQuery !== 'undefined') {
                    const build = {
                        'eq': (a: any, b: any) => `${a} = ${b}`,
                        'neq': (a: any, b: any) => `${a} != ${b}`,
                        'gt': (a: any, b: any) => `${a} > ${b}`,
                        'gteq': (a: any, b: any) => `${a} >= ${b}`,
                        'lt': (a: any, b: any) => `${a} < ${b}`,
                        'lteq': (a: any, b: any) => `${a} <= ${b}`,
                        'like': (a: any, b: any) => `${a} LIKE '%' || ${b} || '%'`,
                    }[comparatorName as keyof FieldQuery<T>] || '=';
                    values.push(fieldCompQuery);
                    const valueRef = values.length;
                    where += ` and ${build(field, `$${valueRef}`)}`;
                }
            }
        } else if (typeof fieldQuery !== 'undefined') {
            values.push(fieldQuery);
            const valueRef = values.length;
            where += ` and ${field} = $${valueRef}`;
        }
    }
    return [where, values];
}
