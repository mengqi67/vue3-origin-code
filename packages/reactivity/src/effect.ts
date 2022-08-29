/*
 * @Author: ymq
 * @Date: 2022-08-22 11:49:48
 * @LastEditors: ymq
 * @LastEditTime: 2022-08-29 16:11:28
 * @Description: 
 */

export let activeEffect;   // 全局变量 用来保存当前执行的effect函数

class ReactiveEffect {
    public fn:Function
    public parent = null
    public deps = []
    constructor(fn) {
        this.fn = fn
        this.parent = null
    }
    run() {
        try {
            this.parent = activeEffect
            activeEffect = this;
            // 先清除依赖 为了解决effect函数中有if或三目运算导致依赖
            cleanupEffect(this)
            return this.fn()
        } finally {
            activeEffect = this.parent;
        }
    }
}

export function effect(fn) {
    const _effect = new ReactiveEffect(fn)

    _effect.run()
}

function cleanupEffect(effect) {
    let { deps } = effect
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect)  // 在Set中删除effect实例
    }
    effect.deps = []
}

let targetMap = new WeakMap()
export function track(target, type, key) {
    // 将依赖收集为 WeakMap{target对象：Map{ key: Set[effect实例，effect实例]}}
    if (!activeEffect) return;

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    let shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
        dep.add(activeEffect)
        activeEffect.deps.push(dep)
    }
}

export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return;   // 触发的值不在模版中使用 不需要更新

    const effects = depsMap.get(key)    // Set()

    if (effects) {
        let effectsCopy = new Set(effects)
        effectsCopy.forEach(effect => {
            if (effect != activeEffect) {
                effect.run()
            }
            
        })
    }
    
}