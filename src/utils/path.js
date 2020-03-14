const dockerUrl = 'http://175.24.130.223:2375'

export default {
  user: {
    login: '/login',
    logout: '/logout',
    info: '/user/info',
    userList: '/user/users',
    edit: '/user/updateUserStatus',
    delete: '/user/deleteUser'
  },
  course: {
    all: '/Course/getCourse',
    delete: '/Course/deleteCourse',
    edit: '/Course/updateCourse',
    add: '/Course/addCourse',
    oneById: '/Course/getCourse',
    uploadImage: '/upload/uploadImage',
    catalogs: '/Catlogs/getCatlogs',
    docker: dockerUrl + '/images/createOrUpdate'
  }
}
