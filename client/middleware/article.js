
export default async ({ store, params }) => {
  if (params['articleId']) {
    try {
      let id = Number(params['articleId'])
      if (!Number.isNaN(id)) {
        await store.dispatch('auth/addArticle', id)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
