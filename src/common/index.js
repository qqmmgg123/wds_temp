window.openPage = function  (type, id, url, params = {}, global_link) {
  if (window.webkit){
    if (window.webkit.messageHandlers.openAppPage){
      window.webkit.messageHandlers.openAppPage.postMessage({
        type,
        id,
        url,
        params,
        global_link
      })
    }
  } else if (window.jsCallback && window.jsCallback.openAppPage) {
    window.jsCallback.openAppPage(JSON.stringify({
      type,
      id,
      url,
      params,
      global_link
    }))
  }
}

window.openAppFunc = function(type, id, url, params = {}, isLink = false, global_link) {
  if (!window._IS_PPB_APP && isLink) {
    window.location.href = url
  } else {
    openPage(type, id, url, params, global_link)
  }
}
