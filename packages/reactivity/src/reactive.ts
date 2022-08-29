/*
 * @Author: ymq
 * @Date: 2022-08-22 11:50:13
 * @LastEditors: ymq
 * @LastEditTime: 2022-08-25 10:58:23
 * @Description: 
 */
import { isObject } from "@vue/shared"
import { ReactiveFlags, mutableHandlers } from "./baseHandler"

const reactiveMap = new WeakMap()   // 存储已经代理过的对象 避免重复代理同一对象 使用weakMap避免内存泄漏

export function reactive(target) {
    if (!isObject(target)) {
        return
    }

    if (target[ReactiveFlags.IS_REACTIVE]) {    // 如果target是代理对象（proxy）那么获取属性值时会触发get；若target是普通对象，获取值会undefined 跳过if
        return target
    }

    const exisitingProxy = reactiveMap.get(target)
    if (exisitingProxy) {       // 如果target已经被代理过 直接返回存储的proxy对象
        return exisitingProxy
    }

    const proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)      // 未被代理过的对象 存储到map中
    return proxy
}