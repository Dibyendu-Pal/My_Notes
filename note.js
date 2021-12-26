const LOCAL_STORAGE_ITEM = "notes";

let db = [];

const initializeLocalStore = () => {
  const notes = localStorage.getItem(LOCAL_STORAGE_ITEM);
  if (notes) {
    db = JSON.parse(atob(notes));
  }
};

const saveInLocalStore = () => {
  localStorage.setItem(LOCAL_STORAGE_ITEM, btoa(JSON.stringify(db)));
};

const createNote = (title, content, isFavorite = false) => {
  db.push({
    id: db.length + 1,
    title: title,
    content: content,
    isFavorite: isFavorite,
  });
  saveInLocalStore();
  readNotes();
};

const readNotes = () => {
  const sortCallback = (item1, item2) => {
    return item1.id - item2.id;
  };
  db = db.sort(sortCallback);

  let html = "";
  db.forEach((element, index) => {
    html += `<div class="noteCard my-2 mx-2 card" style="width: 18rem; background-color: ${
      element.isFavorite ? "blue" : "white"
    }">
                    <div class="card-body">
                        <div>
                            <h5 class="card-title" style="margin-right : 0px; display : inline" >${
                              element.title
                            }</h5>
                            <button class="btn btn-primary" onclick="toggleFavorite(${
                              element.id
                            })" style="float : right ;background-color : yellow; color : black">Favorite</button>
                            </div>
                            <p class="card-text">${element.content}</p>
                            <button onclick="deleteNote(${
                              element.id
                            })" class="btn btn-primary" style="background-color : red">Delete Note</button>
                            <button onclick="editNote(${
                              element.id
                            })" class="btn btn-primary" style="float : right; background-color : orange; color : black">Edit Notes</button>
                        </div>
                    </div>`;
  });
  displayNoteDiv = document.getElementById("notes");
  if (db.length != 0) {
    displayNoteDiv.innerHTML = html;
  } else {
    displayNoteDiv.innerHTML = "Nothing to show!";
  }
};

const updateNote = (id, title, content, isFavorite = false) => {
  db = db.filter((item) => item.id !== id);
  db.push({
    id: id,
    title: title,
    content: content,
    isFavorite: isFavorite,
  });
  saveInLocalStore();
  readNotes();
};

const deleteNote = (id) => {
  db = db.filter((item) => item.id !== id);
  saveInLocalStore();
  readNotes();
};

function editNote(noteId) {
  let addText = document.getElementById("addText");
  let addTitle = document.getElementById("title");

  const notes = db.filter((item) => item.id == noteId);

  if (notes.length > 0) {
    addText.value = notes[0].content;
    addTitle.value = notes[0].title;
    editId = noteId;
    document.getElementById("addBtn").innerText = "Edit Notes";
  }
}

let editId = 0;

document.getElementById("addBtn").addEventListener("click", () => {
  const content = document.getElementById("addText");
  const title = document.getElementById("title");

  if (editId === 0) createNote(title.value, content.value);
  else {
    updateNote(editId, title.value, content.value);
    editId = 0;
  }
  content.value = "";
  title.value = "";
  document.getElementById("addBtn").innerText = "Add Notes";
});

const toggleFavorite = (id) => {
  const notes = db.filter((item) => item.id == id);
  if (notes.length > 0) {
    updateNote(id, notes[0].title, notes[0].content, !notes[0].isFavorite);
  }
};

let allClearButton = document.getElementById("allDel")
allClearButton.addEventListener("click",() => {
    db = []
    saveInLocalStore()
    readNotes()
})


let search = document.getElementById("searchTxt")
search.addEventListener("input", () => {
    let searchValue = search.value
    let fullCard = document.getElementsByClassName("noteCard")

    Array.from(fullCard).forEach(function (element) {
        let cardTxt = element.getElementsByTagName("p")[0].innerText.toLowerCase()
        let cardTitle = element.getElementsByTagName("h5")[0].innerText.toLowerCase()
        if (cardTxt.includes(searchValue.toLowerCase()) || cardTitle.includes(searchValue.toLowerCase())) {
            element.style.display = "block"
        }
        else {
            element.style.display = "none"
        }
    })
})


initializeLocalStore();
readNotes();