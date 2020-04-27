export default ({ store, redirect }) => {
  if (!(store.getters['auth/isManagement'] || store.getters['auth/isAdministrator'])) {
    return redirect('/')
  }
}
