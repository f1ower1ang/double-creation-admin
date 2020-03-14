import request from '@/utils/request'
import path from '@/utils/path'

export function login(data) {
  return request({
    url: path.user.login,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: path.user.info,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: path.user.logout,
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: path.user.userList,
    method: 'get'
  })
}

export function editUser(data) {
  return request({
    url: path.user.edit,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: path.user.delete + '?id=' + id,
    method: 'delete'
  })
}
