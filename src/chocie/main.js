if (process.env.NODE_ENV !== 'production') {
  require('./index.html')
}
require('./styles.sass')
require('whatwg-fetch')
import { get } from '@/component/request'
const list = document.querySelector('.choice-slide > ul')
let loading = false,
nextPage = 2

function loadMore(first) {
  if (!first && !nextPage) {
    let nomore = document.querySelector('.no-more')
    !nomore && (list.innerHTML += '<li class="no-more">没有更多了~</li>')
    return
  }

  loading = true
  if (first) {
    list.innerHTML = '<li class="loading">加载中...</li>'
  } else {
    list.innerHTML += '<li class="loading">加载中...</li>'
  }
  get('api/stream/jingxuan', {
    page: nextPage,
    per_page: 20
  }).then(data => {
    loading = false
    nextPage = data && data.page_info && data.page_info.next_page || 0
    if (data && data.data && data.data.length) {
      let tpl = data.data.map(item => `<li>
      <div class="choice-card">
        <div 
          style="background-image: url(${item.package}?imageMogr2/auto-orient|imageMogr2/quality/90!/thumbnail/672x284);"
          class="card-poster"
        ></div>
        <div class="card-info">
          <h1 class="card-title">
            ${item.title || ''}
          </h1>
          <h2 class="card-summary">
            ${item.desc || ''}
          </h2>
        </div>
      </div>
    </li>`).join('')
      if (first) {
        list.innerHTML = tpl
      } else {
        let loading = document.querySelector('.loading')
        loading && list.removeChild(loading)
        list.innerHTML += tpl
      }
    } else {
      if (first) {
        list.innerHTML = '<li class="loading">当前无内容。</li>'
      }
    }
  })
}

window.onscroll = function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
  scrollHeight = document.body.scrollHeight,
  height = window.innerHeight

  // 加载更多
  if (scrollTop >= scrollHeight - height  - 20) {
    if (!loading) loadMore(false)
  }
}
