/**
 * 数据缓存辅助工具
 */

export default class ApiCache {
  private caches: Array<{ key: string; timer: number; result: any }> = [];

  private promises: Array<{ key: string; req: any }> = [];

  private timer: ReturnType<typeof setTimeout>;

  private innerFetch;

  private cacheHoldTime = 10;

  /**
   *
   * @param apiFn
   * @param cacheHoldTime 缓存时间 默认十分钟
   */
  constructor(apiFn, cacheHoldTime = 10) {
    this.innerFetch = apiFn;
    this.cacheHoldTime = cacheHoldTime;
  }

  /**
   * 根据key值获取缓存中的数据，如果没有命中或者缓存失效则使用innerFetch重新获取
   * @param key
   */
  async fetch(params = {}, useCache = true, throttle = 1000) {
    const { caches, innerFetch, promises } = this;
    const key = JSON.stringify(params);
    const cache = caches.find((c) => c.key === key);

    const removePromise = () => {
      let p = promises.find((p) => p.key === key);
      if (p) {
        promises.splice(promises.indexOf(p), 1);
      }
    };

    const addPromise = (req) => {
      let p = promises.find((p) => p.key === key);
      if (p) {
        return;
      } else {
        promises.push({ key, req });
      }
    };

    const req = () => {
      let p = promises.find((p) => p.key === key);
      let request = p ? p.req : innerFetch(params);
      addPromise(request);
      setTimeout(() => {
        removePromise();
      }, throttle);
      return request;
    };

    if (cache) {
      if (useCache) {
        return cache.result;
      }
      cache.result = await req();
      return cache.result;
    } else {
      const newResult = await req();
      const newCache = { key, timer: new Date().getTime(), result: newResult };
      caches.unshift(newCache);
      // 限制缓存大小保留最近10条数据
      this.caches = caches.slice(0, 9);
      // 长时间无新数据就释放缓存数据  暂定10分钟
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(
        () => {
          this.clearCache();
        },
        this.cacheHoldTime * 60 * 1000
      );
      return newResult;
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.caches = [];
  }
}
