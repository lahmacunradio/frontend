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
  const timeout = setTimeout(() => {
    history.replaceState(null, null, `#${elem}`)
    clearTimeout(timeout)
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

export function debounceFunction (func, delay = 300) {
  let debounceTimer
  return function () {
    // console.log("debouncing call..");
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
    // console.log("..done");
  }
}

export function convertHourMinuteSecond (value) {
  const sec = parseInt(value, 10) // convert value to number if it's string
  let hours = Math.floor(sec / 3600) // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60) // get minutes
  let seconds = sec - (hours * 3600) - (minutes * 60) //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (!hours && !minutes && !seconds) { return '' }
  if (hours && hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  return hours + ':' + minutes + ':' + seconds // Return is HH : MM : SS
}

export function stripHTMLTags (htmlString) {
  if (!htmlString) { return false }
  return htmlString.replace(/(<([^>]+)>)/gi, '')
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
      slugify,
      debounceFunction,
      convertHourMinuteSecond,
      stripHTMLTags
    }
  })
}
