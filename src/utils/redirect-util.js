/**
 * 快速跳转别的网站工具
 *
 * @author fengshuonan
 * @date 2022/3/19 16:59
 */
export class RedirectUtil {
  /**
   * 跳转到别的网站，新打开标签
   *
   * @author fengshuonan
   * @date 2022/4/12 15:45
   */
  static redirect(url) {
    let newTab = window.open('about:blank');
    let myPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    myPromise.then(() => {
      newTab.location.href = url;
      setTimeout(() => {
        newTab = null;
      }, 1);
    });
  }
}
