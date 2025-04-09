export const clearCacheView = async (key: string) => {
  try {
    await fetch(`https://erpraul.com/api/view/clear_cache?key=${key}`)
  } catch (err) {
    //
  }
}
