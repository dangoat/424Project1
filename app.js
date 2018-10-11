const CreateUser = document.querySelector('.CreateUser')

export class Container extends React.Component {
  render() {
    if (!this.props.loaded) {
      return '<div>Loading...</div>'
    }
    return (
      '<div>Map will go here</div>'
    )
  }
}

export default GoogleApiComponent({
  apiKey: __GAPI_KEY__
})(Container)



CreateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = CreateUser.querySelector('.username').value
  const password = CreateUser.querySelector('.password').value
  post('/createUser', { username, password })
})
function post (path, data) {
  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}