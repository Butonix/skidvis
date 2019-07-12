export default async ({ store, req }) => {
  const length = store.getters['organizations/getItemsLength']

  if (length === 0) {
    await store.dispatch('organizations/fetchItems')
  }
}
