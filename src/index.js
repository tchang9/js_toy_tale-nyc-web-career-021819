function getDom(id){
  return document.querySelector(`${id}`)
}

toysURL = "http://localhost:3000/toys"
let allToys

document.addEventListener('DOMContentLoaded', function(){
  // Event Listeners
  addNewToy()
  likeToy()

  // Get All Toys from DB
  getAllToys()

  // Creates New Toy in DB and Renders All Toys
  createNewToy()
})

  // Hidden Form to Add New Toy
function addNewToy() {
  addBtn = getDom("#new-toy-btn")
  toyForm = getDom(".container")
  let addToy = false
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      // submit listener here
    } else {
      toyForm.style.display = 'none'
    }
  })
}

function getAllToys(){
  fetch(toysURL)
  .then(function(response){
    return response.json()
  })
  .then(function(toys){
    allToys = toys
    renderToys()
  })
}

function renderToys(){
  toyCollection = getDom('#toy-collection')

  toyCollection.innerHTML = ''

  allToys.forEach(function(toy){
    toyCollection.innerHTML += `
    <div class="card" data-id=${toy.id}>
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
      <button data-action="delete" class="delete-btn">Delete</button>
    </div>
    `
  })
}

function createNewToy(){
  addToyForm = getDom('.add-toy-form')
  addToyForm.addEventListener('submit', function(e){
    e.preventDefault()
    inputs = document.querySelectorAll('.input-text')
    newToyName = inputs[0].value
    newToyImage = inputs[1].value
    newToyObj = {name: newToyName, image: newToyImage, likes: 0}
    insertNewToy(newToyObj)

  })
}

function insertNewToy(newToyObj){
  fetch(toysURL, {
    method: 'POST',
    body: JSON.stringify(newToyObj), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  })
  .then(function(response){
    return response.json()
  })
  .then(function(newToy){
    allToys.push(newToy)
    renderToys()
  })
}

function likeToy(){
  toyCollection = getDom('#toy-collection')
  toyCollection.addEventListener('click', function(e){
    if (e.target.className === "like-btn") {
      const toyId = e.target.parentNode.dataset.id
      let toyLikes = parseInt(e.target.previousElementSibling.innerText) 
      toyLikes++ 
      changeLikes(toyId, toyLikes)
      e.target.previousElementSibling.innerText = `${toyLikes} likes`
    } else if (e.target.dataset.action === "delete") {
      const toyId = e.target.parentNode.dataset.id
      deleteToy(toyId).then(() => {
        e.target.parentNode.remove()
      })
    }
  })
}

function changeLikes(toyId, toyLikes) {
  fetch(`${toysURL}/${toyId}`, {
    method: 'PATCH',
    body: JSON.stringify({likes: toyLikes}), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  })
  .then(function(response){
    return response.json()
  })
  .then(console.log)
}

function deleteToy(toyId) {
  return fetch(`${toysURL}/${toyId}`, {
    method: "DELETE"
  })
  .then(res => res.json())
}
