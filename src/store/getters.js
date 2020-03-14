const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes
}
export default getters
