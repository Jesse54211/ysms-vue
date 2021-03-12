import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    },
    setUserInfo(state,userInfo){
      localStorage.setItem('userInfo', JSON.stringify(userInfo));//将传递的数据先保存到localStorage中
      state.userInfo = userInfo;// 之后才是修改state中的状态
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
