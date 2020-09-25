/** * 一些web效果实现 */

/**
 * 基础的图片懒加载，先设置 data-src，滚动到了再设置src属性
 */
function lazyImg() {
  function _lazy() {
    const imgs = document.querySelectorAll('img')
    const viewH = document.documentElement.clientHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

    for (let i = 0; i < imgs.length; i++) {
      const imgOffTop = imgs[i].offsetTop

      if (imgOffTop < viewH + scrollTop) {
        imgs[i].src = imgs[i].dataset.src
      }
    }
  }
  window.addEventListener('scroll', lazyImg)
}

/**
 * JSONP - GET only
 */
function jsonp({ url, params, callbackName }) {
  const _buildUrl = (url, params, fn) => `${url}?${params}&callback=${fn}` // omit stringify

  const script = document.createElement('script')
  script.src = _buildUrl(url, params, callbackName)
  document.body.appendChild(script)

  window[callbackName] = function (data) {
    // 如果想返回数据，可以添加回调函数，如 callback(data) or new Promise -> resolve(data)
    document.removeChild(script)
  }
}