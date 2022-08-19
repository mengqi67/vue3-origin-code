/*
 * @Author: ymq
 * @Date: 2022-08-19 18:06:03
 * @LastEditors: ymq
 * @LastEditTime: 2022-08-19 18:49:42
 * @Description: 
 */
export function isObject(params:any) {
    return typeof params === "object" && params !== null
}