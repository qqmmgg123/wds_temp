if (process.env.NODE_ENV !== 'production') {
  require('./index.html')
}
require('./styles.sass')
require('whatwg-fetch')
import { get } from '@/component/request'
const bar = document.querySelector('.news-swipe-bar')
const list = document.querySelector('.new-list')
let curId = '',
loading = false,
nextPage = 2

function loadMore(id, first) {
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
  get('api/stream/tuijian', {
    type: id,
    page: nextPage,
    per_page: 20
  }).then(data => {
    loading = false
    nextPage = data && data.page_info && data.page_info.next_page || 0
    if (data && data.data && data.data.length) {
      let tpl = data.data.map(item => `<li>
        <a href="javascript:openAppFunc('global_link', 1, '${item.url}', null, true, '${item.url}');">
          <div 
            class="news-pic"
            style="background-image: url(${item.package}?imageMogr2/auto-orient|imageMogr2/quality/90!/thumbnail/322x180);"
          ></div>
          <div class="news-info">
            <h2>${item.title}</h2>
            <h3>${item.writer}</h3>
          </div>
        </a>
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
bar.onclick = (ev) => {
  var ev = ev || window.event
  var target = ev.target || ev.srcElement
  if (target.nodeName.toLowerCase() == "h4") {
    let li = target.parentNode
    bar.querySelectorAll('li').forEach(li => {
      li.className = ''
    })
    li.className = 'active'
    loading = false
    nextPage = 1
    loadMore(li.id, true)
  }
}

window.onscroll = function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
  scrollHeight = document.body.scrollHeight,
  height = window.innerHeight

  // 加载更多
  if (scrollTop >= scrollHeight - height  - 20) {
    if (!loading) loadMore(curId, false)
  }
}
