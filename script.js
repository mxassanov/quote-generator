const quoteContainer = document.getElementById('quote-container')
const quoteText = document.getElementById('quote')
const quoteAuthor = document.getElementById('author')
const twitterBtn = document.getElementById('twitter')
const newQuoteBtn = document.getElementById('new-quote')
const loader = document.getElementById('loader')

function showLoadingSpinner() {
  loader.hidden = false
  quoteContainer.hidden = true
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false
    loader.hidden = true
  }
}

// Получение цитаты с помощью API
async function getQuote() {
  showLoadingSpinner()

  // Используем proxy-костыль для обхода CORS
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru'
  const proxyUrl = 'https://cors.bridged.cc/'

  try {
    const response = await fetch(proxyUrl + apiUrl)
    const data = await response.json()

    // Если автор неизвестен, указываем это
    if (data.quoteAuthor === '') {
      quoteAuthor.innerText = 'Автор неизвестен'
    } else {
      quoteAuthor.innerText = data.quoteAuthor
    }

    // Уменьшение размера шрифта для длинных текстов
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote')
    } else {
      quoteText.classList.remove('long-quote')
    }

    quoteText.innerText = data.quoteText

    removeLoadingSpinner()
  } catch (error) {
    throw new Error('whoops', error)
  }
}

// Твитнуть цитату
function tweetQuote() {
  const quote = quoteText.innerText
  const author = quoteAuthor.innerText
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`
  window.open(twitterUrl, '_blank')
}

twitterBtn.addEventListener('click', tweetQuote)
newQuoteBtn.addEventListener('click', getQuote)

// Загрузка
getQuote()