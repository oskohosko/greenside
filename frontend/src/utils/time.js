export function timeConverter(timestamp) {
  var a = new Date(timestamp * 1000)
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var month = months[a.getMonth()]
  var date = a.getDate()
  var time = month + ' ' + date
  return time
}