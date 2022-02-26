const toDoContainer = document.getElementById('to-do-container');
const addField = document.getElementById('add');
const searchField = document.getElementById('search');
const addSearchSlider = document.getElementById('add-search-slider');
const addContainer = document.getElementById('add-container');
const searchContainer = document.getElementById('search-container');

document.addEventListener('DOMContentLoaded', loadLocalStorage());
document.addEventListener('DOMContentLoaded', hideSearchContainer());

function saveLocalToDos(toDo){
    let toDos;
    if (localStorage.getItem('toDos') === null){
        toDos = [];
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDos'));
    }
    toDos.push(toDo);
    localStorage.setItem('toDos', JSON.stringify(toDos));
}

function editLocalToDos(toDo, prevText){
    let toDos;
    if (localStorage.getItem('toDos') === null){
        toDos = [];
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDos'));
    }
    const toDoIndex = toDo.children[0].innerText;
    toDos.splice(toDos.indexOf(prevText), 1);
    toDos.push(toDoIndex);
    localStorage.setItem('toDos', JSON.stringify(toDos));
}

function removeLocalToDos(toDo){
    let toDos;
    if (localStorage.getItem('toDos') === null){
        toDos = [];
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDos'));
    }
    const toDoIndex = toDo.children[0].innerText;
    toDos.splice(toDos.indexOf(toDoIndex), 1);
    localStorage.setItem('toDos', JSON.stringify(toDos));
}

function loadLocalStorage(){
    let toDos;
    if (localStorage.getItem('toDos') === null){
        toDos = [];
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDos'));
    }
    toDos.forEach(function(toDo){
        const toDoItem = document.createElement('div');
        const toDoText = document.createElement('div');
        toDoItem.classList.add('to-do-item');
        toDoItem.classList.add('slow-rise');
        toDoText.classList.add('to-do-text');
        createToDoText(toDoItem, toDoText, toDo);
        createEditButton(toDoItem, toDoText);
        createDeleteButton(toDoItem);
        toDoContainer.appendChild(toDoItem);
    });
}

function countLocalStorage(){
    let toDos;
    if (localStorage.getItem('toDos') === null){
        toDos = [];
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDos'));
    }
    return toDos.length;
}

function placeCaretAtEnd(el) {
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined"){
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    else if (typeof document.body.createTextRange != "undefined"){
        let textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function createToDoText(toDoItem, toDoText, val){
    toDoItem.classList.add('to-do-item');
    toDoText.classList.add('to-do-text');
    toDoText.innerText = val;
    toDoItem.appendChild(toDoText);
    let prevText = '';
    toDoText.addEventListener('focus', function(){
        prevText = toDoText.innerText;
    });
    toDoText.addEventListener('blur', function(){
        if (toDoText.innerText.length > 49){
            alert('Please enter an item less than 50 characters');
            toDoText.innerText = prevText;
        }
        if (toDoText.innerText.length == 0){
            alert('Please enter a valid value.');
            toDoText.innerText = prevText;
        }
    });
}

// add character counts to each item that update live
// should also add this to the add field

function createEditButton(toDoItem, toDoText){
    const editButton = document.createElement('button');
    let prevText = '';
    editButton.innerHTML = '<i class="fas fa-edit" style="color:white"></i>';
    editButton.classList.add('edit-button');
    toDoItem.appendChild(editButton);
    editButton.addEventListener('click', function(){
        toDoText.contentEditable = 'true';
        prevText = toDoText.innerText; //
        toDoText.focus();
        placeCaretAtEnd(toDoText);
    });
    toDoText.addEventListener('keypress', function(e){  
        if (e.key === 'Enter'){
            toDoText.contentEditable = 'false';
            editLocalToDos(toDoItem, prevText);
        }
    });
    toDoText.addEventListener('blur', function(){
        toDoText.contentEditable = 'false';
        editLocalToDos(toDoItem, prevText);
    }); // need an event listener to check if it's already contenteditable
}

function createDeleteButton(toDoItem){
    const deleteButton = document.createElement('button'); 
    deleteButton.innerHTML = '<i class="fas fa-trash" style="color:white" aria-hidden="true"></i>';
    deleteButton.classList.add('delete-button');
    toDoItem.appendChild(deleteButton);
    deleteButton.addEventListener('click', function(){
        toDoItem.classList.add('fall');
    });
    toDoItem.addEventListener('transitionend', function(){
        toDoContainer.removeChild(toDoItem);
        removeLocalToDos(toDoItem);
    });
}

addField.addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        if (addField.value.trim() != ''){
            if (addField.value.length > 49){
                alert('Please enter an item less than 50 characters');
            }
            else if (countLocalStorage() == 8){
                alert('Maximum items reached! Start completing some tasks!');
            }
            else{
                const toDoItem = document.createElement('div');
                const toDoText = document.createElement('div');
                toDoItem.classList.add('rise');
                createToDoText(toDoItem, toDoText, addField.value);
                createEditButton(toDoItem, toDoText);
                createDeleteButton(toDoItem);
                toDoContainer.appendChild(toDoItem);
                
                saveLocalToDos(addField.value);
                addField.value = '';
            }
        }
        else{
            alert('Please enter a valid value.');
        }
    }
});

addField.addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        const toDos = document.querySelectorAll('.to-do-text');
        const toDosArray = Array.from(toDos);
        for (let i = 0; i < toDosArray.length; i++){
            if (toDosArray[i].innerText.toUpperCase().indexOf(searchField.value.toUpperCase()) > -1){
                toDosArray[i].parentElement.style.display = '';
            }
            else{
                toDosArray[i].parentElement.style.display = 'none';
            }
        }
    }
});

searchField.addEventListener('input', function(){
    const toDos = document.querySelectorAll('.to-do-text');
    const toDosArray = Array.from(toDos);
    for (let i = 0; i < toDosArray.length; i++){
        if (toDosArray[i].innerText.toUpperCase().indexOf(searchField.value.toUpperCase()) > -1){
            toDosArray[i].parentElement.style.display = '';
        }
        else{
            toDosArray[i].parentElement.style.display = 'none';
        }
    }
});

addSearchSlider.addEventListener('change', function(){
    if (this.checked){   
        searchContainer.style.display = '';
        addContainer.style.display = 'none';     
    }
    else{
        searchContainer.style.display = 'none';
        addContainer.style.display = ''; 
    }
});

function hideSearchContainer(){
    searchContainer.style.display = 'none';
}
