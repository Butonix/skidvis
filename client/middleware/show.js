
export default async ({ store, params }) => {
  if (params['articleId']) {
    try {
      let id = Number(params['articleId'])
      if (!Number.isNaN(id)) {
        await store.dispatch('auth/addVisited', { type: 'articles', id })
      }
    } catch (e) {
      console.log(e)
    }
  }
  if (params['productId']) {
    try {
      let id = Number(params['productId'])
      if (!Number.isNaN(id)) {
        await store.dispatch('auth/addVisited', { type: 'products', id })
      }
    } catch (e) {
      console.log(e)
    }
  }
}
