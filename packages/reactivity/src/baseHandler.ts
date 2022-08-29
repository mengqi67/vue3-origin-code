/*
 * @Author: ymq
 * @Date: 2022-08-25 10:56:22
 * @LastEditors: ymq
 * @LastEditTime: 2022-08-29 14:56:18
 * @Description: 
 */

import { track, trigger } from "./effect"

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {    // 若target为代理对象 则在取值时会触发get
            return true
        }
        track(target, 'get', key)   // 依赖收集 effect中使用的变量需要记录下来
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)

        if (oldValue != result) {
            // 需要更新
            trigger(target, 'set', key, result, oldValue)
        }
        return result
    }
}