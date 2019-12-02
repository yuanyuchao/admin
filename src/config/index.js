import { DEV_BASE_URL } from "./api";
import { getApiUrl } from "../libs/util";

export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '销售系统管理后台',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        // dev: 'http://api-m.zydl-tec.cn:8089/mock/20/sys',
        // dev: 'http://192.168.1.120:8090/sys',
        // dev: 'http://192.168.1.113:8088/sys',
        // dev: 'http://192.168.1.156:8089/sys',
        // dev: 'http://192.168.1.113/new-sale-sys/public/index.php',
        dev: DEV_BASE_URL,
        pro: getApiUrl(),
        // pro: 'http://131.0.0.2:8080/sys',
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    }
}
