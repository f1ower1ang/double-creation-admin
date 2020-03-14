import request from '@/utils/request'
import path from '@/utils/path'

export function getCourses(params) {
  return request({
    url: path.course.all,
    method: 'get',
    params
  })
}

export function deleteCourses(id) {
  return request({
    url: path.course.delete + '?courseId=' + id,
    method: 'delete'
  })
}

export function getCourseById(id) {
  return request({
    url: path.course.oneById + '/' + id,
    method: 'get'
  })
}

export function editCourse(data) {
  return request({
    url: path.course.edit,
    method: 'put',
    data
  })
}

export function addCourse(data) {
  return request({
    url: path.course.add,
    method: 'post',
    data
  })
}

export function updateCourseToDocker(courseId, data) {
  return request({
    url: path.course.docker + '?courseId=' + courseId + '&callback=http://175.24.130.223:2375/images/callback',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function uploadImage(data) {
  return request({
    url: path.course.uploadImage,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function getCatalogs() {
  return request({
    url: path.course.catalogs,
    method: 'get'
  })
}
