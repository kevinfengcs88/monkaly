const toDoContainer = document.getElementById('to-do-container');
const inputField = document.getElementById('add');
const searchField = document.getElementById('search');

document.addEventListener('DOMContentLoaded', loadLocalStorage());

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

function editLocalToDos(toDo){
    let toDos;
    if (localStorage.getItem('toDos') === null){
        toDos = [];
    }
    else{
        toDos = JSON.parse(localStorage.getItem('toDos'));
    }
    const toDoIndex = toDo.children[0].innerText;
    toDos.splice(toDos.indexOf(toDoIndex), 1);
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
        toDoText.classList.add('to-do-text');
        toDoText.innerText = toDo;
        toDoItem.appendChild(toDoText);
        createEditButton(toDoItem, toDoText);
        createDeleteButton(toDoItem);
        toDoContainer.appendChild(toDoItem);
    });
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
}

function createEditButton(toDoItem, toDoText){
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add('edit-button');
    toDoItem.appendChild(editButton);
    editButton.addEventListener('click', function(){
        toDoText.contentEditable = 'true';
        toDoText.focus();
        placeCaretAtEnd(toDoText);
    });
    toDoText.addEventListener('keypress', function(e){  
        if (e.key === 'Enter'){
            toDoText.contentEditable = 'false';
            editLocalToDos(toDoItem);
        }
    });
    toDoText.addEventListener('blur', function(){
        toDoText.contentEditable = 'false';
        editLocalToDos(toDoItem);
    });
}

function createDeleteButton(toDoItem){
    const deleteButton = document.createElement('button'); 
    deleteButton.innerHTML = '<i class="fa fa-trash" style="color:red;"aria-hidden="true"></i>';
    deleteButton.classList.add('delete-button');
    toDoItem.appendChild(deleteButton);
    deleteButton.addEventListener('click', function(){
        toDoContainer.removeChild(toDoItem);
        removeLocalToDos(toDoItem);
    });
}

inputField.addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        if (inputField.value.trim() != ''){
            if (inputField.value.length > 80){
                alert('Please enter an item less than 80 characters');
                // need to add eventListener to each to-do-text
            }
            else{
                const toDoItem = document.createElement('div');
                const toDoText = document.createElement('div');
                createToDoText(toDoItem, toDoText, inputField.value);
                createEditButton(toDoItem, toDoText);
                createDeleteButton(toDoItem);
                toDoContainer.appendChild(toDoItem);
                saveLocalToDos(inputField.value);
                inputField.value = '';
            }
        }
        else{
            alert('Please enter a valid value.');
        }
    }
});

inputField.addEventListener('keypress', function(e){
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