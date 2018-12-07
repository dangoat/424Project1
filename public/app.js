const CreateUser = document.querySelector('.CreateUser')
const QueryUser = document.querySelector('.QueryUser')

/*
CreateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = CreateUser.querySelector('.name').value
  const email = CreateUser.querySelector('.email').value
  const password = CreateUser.querySelector('.password').value
  const publisher = CreateUser.querySelector('.publisher').value
  post('/createUser', { name, email, password, publisher })
})

QueryUser.addEventListener('submit', (e) => {
	e.preventDefault()
	const name = QueryUser.querySelector('.name').value
	post('/queryUser', { name })
})

*/
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