/**
 * @interface IDbQueryExpressions
 */
export interface IDbQueryExpressions {
  queryExprs: string;
  exprValueMap: Record<string, any>;
  updateExprNames?: Record<string, any>;
}