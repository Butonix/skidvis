export default async ({ store, params }) => {
  if (Object.keys(params).length > 0) {
    await store.dispatch('variables/fetchReactData', params)
  }
}
