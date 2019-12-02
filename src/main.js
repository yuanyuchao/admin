// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/css/custom.less'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import 'flex.css/dist/data-flex.css'
import {getApis} from "@/libs/util";
import {page_params} from '@/config/custom'
Object.defineProperty(Vue.prototype, '$_has', {
    value: function (access) {
        let userId = store.state.user.userId
        if (userId === 1) return true
        let apis = getApis()
        if(apis.indexOf(access) !== -1) {
            return true
        }else {
            return false
        }
    }
});
window._has = (access) => {
    let userId = store.state.user.userId
    if (userId === 1) return true
    let apis = getApis()
    if(apis.indexOf(access) !== -1) {
        return true
    }else {
        return false
    }
}
window.page_params = page_params
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

import eventHub from '@/libs/eventHub'
Vue.prototype.$eventHub = eventHub;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})
