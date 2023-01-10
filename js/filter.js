let filterSettings = doc.querySelectorAll('.content_filter .options .column .row input')
filterSettings.forEach(el=>{
    el.addEventListener(('input'), ()=>{
        for(let i = 1; i < container.children.length; i++){
            hideItem(container.children[i])
        }
        showNotes(el.id)
    })
})