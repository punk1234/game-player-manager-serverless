/**
 * @interface IDatabase
 */
export interface IDbAdapter {
    create(tableName: string, data: any): Promise<void>;

    update(
        tableName: string,
        key: Record<string, any>,
        updateExpr?: string,
        exprAttrValueMap?: Record<string, any>,
        updateExprNames?: Record<string, any>
    ): Promise<any>;

    getItemByKey(tableName: string, queryOpts: any): Promise<any>;

    getItemByFilter(
        tableName: string,
        filterExpression: string,
        filterKeyValues: Record<string, any>,
        filterExprNames?: Record<string, any>
    ): Promise<any>

    // getList(tableName: string, queryOpts: any): Promise<any>;
    // delete(tableName: string, queryOpts: any): Promise<any>;
}
