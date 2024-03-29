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

export function removeMinutesAndSeconds (time) {
  return time.substring(0, 2)
}

export function getCurrentTimeHourCET () {
  const d = new Date();
  //Return browser time's hour part in 24h style, e.g., 7 for 7am or 19 for 7pm, where time is CET
  return d.toLocaleString("en-EN", {timeZone: "Europe/Budapest", hour:"numeric", hour12: false}).substring(0,2);
}

export function getTodayNumeric () {
  const d = new Date();
  const CETdayString = d.toLocaleString("en-EN", {timeZone: "Europe/Budapest", weekday:"long"});
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(CETdayString)  
}

export function getTodayDateCET () {
  const d = new Date()
  const year = d.toLocaleString("en-EN", {timeZone: "Europe/Budapest", year: "numeric"}) 
  const month = d.toLocaleString("en-EN", {timeZone: "Europe/Budapest", month: "2-digit"}) 
  const day = d.toLocaleString("en-EN", {timeZone: "Europe/Budapest", day: "2-digit"})
  return `${year}-${month}-${day}`    
}

export function truncate (text, limit = 200) {
  if (text.length <= limit) {
    return text
  }
  return text.slice(0, limit).split(' ').slice(0, -1).join(' ') +
    (limit < text.length ? '...' : '')
}

export function htmlDecoder (string) {
  return decode(string)
}

export function slugify (str) {
  if (!str) {
    return ''
  }

  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôőùúüûűñç·/_,:;'
  const to = 'aaaaeeeeiiiiooooouuuuunc------'
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

export function getLanguageGraph (type) {
  if (type === 'music') {
    return '🎵'
  }
  if (type === 'hu_hu') {
    return '🇭🇺'
  }
  if (type === 'en_uk') {
    return '🇬🇧'
  }
}

// Input: all active arcsi shows
// Output: shows grouped by days (every day is an array) and sorted tarting today's day (CET)
export function groupShowsByDay (dbshows, rare_thu, rare_fri, customSchedule) {
  const shows = [...dbshows].sort((a, b) => a.day - b.day).sort((a, b) => parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10))
  let list = []
  const daybyMonday = getTodayNumeric() === 0 ? 7 : getTodayNumeric()
  const dayIndex = daybyMonday - 1
  const latestRareThursday = shows
    .filter(item => item?.playlist_name?.startsWith('Ritka csut'))
    .filter(item => item?.archive_lahmastore_base_url !== rare_thu.archive_lahmastore_base_url)
  const latestRareFriday = shows
    .filter(item => item?.playlist_name?.startsWith('Ritka pentek'))
    .filter(item => item?.archive_lahmastore_base_url !== rare_fri.archive_lahmastore_base_url)
  
  const filteredShows = shows
    .filter(val => !latestRareThursday.includes(val))
    .filter(val => !latestRareFriday.includes(val))
  
  let customScheduleDay = 0 
  let customScheduleEntries = []
  // custom Schedule Day
  if (customSchedule?.is_active) {
    customScheduleDay = parseInt(customSchedule.day_number, 10)
    customScheduleEntries = customSchedule.schedule
  }
  for (let i = 0; i < 7; i++) {
    list.push([])
    if (customScheduleDay - 1 === i) {
      customScheduleEntries.forEach((entry) => {
        list[i].push(entry)
      })
    }

    filteredShows.forEach((show) => {
      if (show.archive_lahmastore_base_url === 'off-air' || !show.active) { return false }
      if (show.day - 1 === i && customScheduleDay - 1 !== i) {
        list[i].push(show)
      }
    })
  }
  return [...list.slice(dayIndex), ...list.slice(0, dayIndex)]
}

export function showFrequency (frequency, week, playlist) {
  let showText = 'Not defined'
  if (playlist === "Ritka csut" || playlist === "Ritka pentek"){
    showText = 'New episode occasionally'
    return showText
  }
  if (frequency === 1) {
    showText = 'New episode monthly'
  }
  if (frequency === 2) {
    showText = 'New episode every second week'
  }
  if (frequency >= 3) {
    showText = 'New episode weekly'
  }
  return showText
}

export function getCorrectSlug (item) {
  if (!item) {
    return false
  }
  const processedName = item ? item.toLowerCase() : ''
  return processedName.replace('.mp3', '')
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
      stripHTMLTags,
      getLanguageGraph,
      showFrequency,
      getCorrectSlug,
      getCurrentTimeHourCET,
      getTodayDateCET,
      getTodayNumeric,
      groupShowsByDay,
      removeMinutesAndSeconds
    }
  })
}
