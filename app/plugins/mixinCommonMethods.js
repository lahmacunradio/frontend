import Vue from 'vue'
import { decode } from 'html-entities'

export function romanize (num) {
  if (isNaN(num)) { return NaN }
  const digits = String(+num).split('')
  const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  let roman = ''
  let i = 3
  while (i--) { roman = (key[+digits.pop() + i * 10] || '') + roman }
  return Array(+digits.join('') + 1).join('M') + roman
}

export function scrollToRef (ref) {
  this.$refs[ref].scrollIntoView({ behavior: 'smooth' })
}

export function scrollToAnchor (elem) {
  const target = document.getElementById(elem)
  target.scrollIntoView({ behavior: 'smooth' })
  setTimeout(() => {
    history.replaceState(null, null, `#${elem}`)
  }, 1000)
}

export function removeSeconds (time) {
  return time.substring(0, time.length - 3)
}

export function truncate (text, limit = 200) {
  return text.slice(0, limit) + (limit < text.length ? '...' : '')
}

export function htmlDecoder (string) {
  return decode(string)
}

export function slugify (str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

// Make sure to pick a unique name for the flag
// so it won't conflict with any other mixin.
if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true
  // Set up your mixin then
  Vue.mixin({
    methods: {
      romanize,
      scrollToRef,
      scrollToAnchor,
      removeSeconds,
      truncate,
      htmlDecoder,
      slugify
    }
  })
}
