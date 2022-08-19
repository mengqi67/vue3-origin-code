var VueReactivity = (() => {
  // packages/shared/src/index.ts
  function isObject(params) {
    return typeof params === "object" && params !== null;
  }

  // packages/reactivity/src/index.ts
  console.log(isObject(true));
})();
//# sourceMappingURL=reactivity.global.js.map
