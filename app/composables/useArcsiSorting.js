import { computed, ref, unref } from 'vue'

// Composable to sort Arcsi episode lists by air date or alphabetically
// itemsRef: Ref<Array>
// options.excludeId: Ref|number|string optional: filter out a specific episode id
export function useArcsiSorting (itemsRef, options = {}) {
  const sortingType = ref('air') // 'air' | 'abc'
  const alphabeticAsc = ref(false)
  const airtimeAsc = ref(true)

  const sorted = computed(() => {
    const items = Array.isArray(itemsRef?.value) ? [...itemsRef.value] : null
    if (!items || !items.length) return null
    const excludeId = options && options.excludeId != null ? unref(options.excludeId) : null
    const base = excludeId != null ? items.filter(i => i.id !== excludeId) : items
    const primed = base
      .sort((a, b) => b.number - a.number)
      .sort((a, b) => new Date(b.play_date) - new Date(a.play_date))

    if (sortingType.value === 'air') {
      return primed.sort((a, b) => airtimeAsc.value
        ? new Date(b.play_date) - new Date(a.play_date)
        : new Date(a.play_date) - new Date(b.play_date))
    } else if (sortingType.value === 'abc') {
      return primed.sort((a, b) => alphabeticAsc.value
        ? (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' })
        : (b.name || '').localeCompare(a.name || '', 'en', { sensitivity: 'base' }))
    }
    return primed
  })

  function sortAlphabeticaly () {
    sortingType.value = 'abc'
    alphabeticAsc.value = !alphabeticAsc.value
    airtimeAsc.value = false
  }
  function sortAirtime () {
    sortingType.value = 'air'
    airtimeAsc.value = !airtimeAsc.value
    alphabeticAsc.value = false
  }

  return { sorted, sortingType, alphabeticAsc, airtimeAsc, sortAlphabeticaly, sortAirtime }
}
