// 测试服地址
export const rootUrl = ''

export function get(api, data) {
  let queryStr = Object.keys(data || {})
  .map(key => key + '=' + data[key])
  .join('&');
  return request([api, queryStr].join('?'), 'GET')
}

export function post(api, data) {
  return request(api, 'POST', data)
}

export function put(api, data) {
  return request(api, 'PUT', data)
}

export function del(api, data) {
  return request(api, 'DELETE', data)
}

function request(api, method, data, headers = {}) {
  const FETCH_TIMEOUT = 5000;
  let didTimeOut = false;
  
  return new Promise(function(resolve, reject) {
    const timeout = setTimeout(function() {
      didTimeOut = true;
      reject(new Error('Request timed out'));
    }, FETCH_TIMEOUT)

    fetch([rootUrl, api].join('/'), {
      method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }, headers),
      credentials: 'include',
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(function(response) {
      const res = response.json()
      clearTimeout(timeout)
      resolve(res)
    }).catch(function(err) {
      setTimeout( () => {
        alert(err.message || '异常错误')
      }, 0)
      if(didTimeOut) return;
      reject(err);
    })
  })
}
