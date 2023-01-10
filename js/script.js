const doc = document,
    container = doc.getElementById('container'),
    createItemBtn = doc.getElementById("createBtn"),
    popupWindow = doc.getElementById('popup'),
    closePopup = doc.getElementById("closePopup"),
    title = doc.getElementById('titleValue'),
    text = doc.getElementById('textValue'),
    saveBtn = doc.getElementById('saveBtn'),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    notes = JSON.parse(localStorage.getItem('notes') || '[]'),
    editing = false,
    itemFocused = null, indexFocused = null
window.onload = () => {
    showNotes('all')
    createItemBtn.addEventListener(('click'), ()=>{
        popupWindow.querySelector(".header h2").innerText = "Creating new note"
        popupWindow.classList.toggle('disabled')
    })
    saveBtn.addEventListener(('click'), () => {
        if(title.value || text.value){
            editing ? editItem(itemFocused, indexFocused) : createItem(title.value, text.value)
        }
        title.value = ''
        text.value = ''
    })
    closePopup.addEventListener(('click'), ()=>{popupWindow.classList.add('disabled')})
}
function showNotes(filter){
    notes.forEach((el, index)=>{
        if(el.status === filter || filter==="all")
            showItem({title: el.title, text: el.text, date: el.date, status: el.status}, index)
    })
}
function hideItem(item){
    item.classList.add('removed')
    setTimeout(()=>{item.remove()}, 500)
}
function removeItem(item, index){
    item.classList.add('removed')
    setTimeout(()=>{item.remove()}, 500)
    notes = notes.slice(0, index).concat(notes.slice(index+1, notes.length))
    localStorage.setItem("notes", JSON.stringify(notes))
}
function editItem(item, index){
    if(title.value || text.value){
        notes[index].title = title.value
        notes[index].text = text.value
        item.querySelector("#title").innerText = notes[index].title
        item.querySelector("#text").innerText = notes[index].text
    }
    editing = false
    localStorage.setItem("notes", JSON.stringify(notes))
    closePopup.click()
}
function showItem(note, index){
    let item = doc.createElement('div')
    item.className = `item container_item note_item_container ${note.status}`
    item.innerHTML = `<div class="content">
        <div class="header">
            <div class="markers">
                <p>Mark as:</p>
                <div class="buttons">
                    <i class="fa-solid fa-check" title="Done" id="done"></i>
                    <i class="fa-solid fa-circle-notch" title="In Process" id="process"></i>
                    <i class="fa-regular fa-clock" title="Deadline!" id="deadline"></i>
                </div>
            </div>
            <div class="buttons">
                <i class="fa-solid fa-trash" title="Delete?" id='deleteBtn'></i>
            </div>
        </div>
        <div class="main">
            <label>Title:</label>
            <p id="title">${note.title}</p>
            <label>Text:</label>
            <p id="text">${note.text}</p>
        </div>
        <div class="footer">
            <p>| ${note.date} |</p>
            <p id="status">${note.status[0].toUpperCase() + note.status.slice(1, note.status.length)}</p>
            <div class="buttons">
                <i class="fa-solid fa-gear" title="Edit?" id='editBtn'></i>
            </div>
        </div>
        </div>`
    let btns = item.querySelectorAll('.markers .buttons i'),
        status = item.querySelector("#status"),
        deleteBtn = item.querySelector('#deleteBtn'),
        editBtn = item.querySelector("#editBtn")
    deleteBtn.addEventListener(('click'), ()=>{if(confirm('Are you sure?')) removeItem(item, index)})
    editBtn.addEventListener(('click'), ()=>{
        editing = true
        itemFocused = item
        indexFocused = index
        popupWindow.querySelector(".header h2").innerText = "Editing note"
        popupWindow.classList.remove('disabled')
    })
    btns.forEach(el => {
        el.addEventListener(('click'), ()=>{
            btns.forEach(c => item.classList.remove(c.id))
            item.className += " " + el.id
            status.innerText = el.id[0].toUpperCase() + el.id.slice(1, el.id.length)
            notes[index].status = el.id
            localStorage.setItem("notes", JSON.stringify(notes))
        })
    })
    container.appendChild(item)

}
function createItem(itemTitle, itemText){
    let currDate = new Date(),
        note = {
            title: itemTitle,
            text: itemText,
            date: `${months[currDate.getMonth()]} ${currDate.getDate()}`,
            status: 'process'
        }
    notes.push(note)

    localStorage.setItem("notes", JSON.stringify(notes))

    closePopup.click() 
    showItem(note, notes.length-1)
}
