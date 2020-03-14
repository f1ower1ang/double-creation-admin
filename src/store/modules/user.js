import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '@/utils/storage'
import { SET_ROLES, SET_USER_INFO } from '@/store/mutation-types'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: getSessionStorage('userInfo'),
    roles: []
  }
}

const state = getDefaultState()

export const ROLE = {
  admin: 1,
  student: 3
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { email, password } = userInfo
    return new Promise(async(resolve, reject) => {
      try {
        const res = await login({ email: email.trim(), password: password })
        commit('SET_TOKEN', res.data.token)
        setToken(res.data.token)
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (data && data.roleid !== ROLE.admin) {
          reject('角色权限不够，请使用其他账号登录')
        } else {
          const userInfo = {
            name: data.name,
            account: data.account,
            avatar: data.avatar,
            roleId: data.roleid,
            id: data.id,
            roles: ['admin']
          }

          setSessionStorage('userInfo', userInfo)
          commit(SET_USER_INFO, userInfo)
          commit(SET_ROLES, data.roles ? data.roles : ['admin'])
          resolve(data.roles ? data : userInfo)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then((res) => {
        dispatch('resetToken').then(() => {
          resetRouter()
          resolve(res)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeSessionStorage('userInfo')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

