const SEVER = "https://maivanmanh.github.io/503106/lab01/students.json"
$(document).ready(() => {
    $("#ajax").click(() => loadByAjax())
    $("#fetch").click(() => loadByFetch())
});

function loadByAjax() {
    let xhr = new XMLHttpRequest()
    xhr.responseType = "json"
    xhr.addEventListener('load', e => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let data = xhr.response
            let users = data.data

            displayUsers(users)
        }
        else {
            alert("Error!!")
        }
    })
    xhr.open("GET", SEVER, true);
    xhr.send();
}

function loadByFetch() {
    fetch(SEVER)
        .then(result => result.json())
        .then(json => {
            let users = json.data
            displayUsers(users)
        })
        .catch(e => console.log(e))

}

function displayUsers(users) {
    $("#table-body").empty()

    users.forEach(u => {
        let tr = $("<tr>"),
            name = $("<td>"),
            id = $("<td>"),
            age = $("<td>")
        name.text(u.name)
        id.text(u.id)
        age.text(u.age)
        tr.append(id, name, age)
        $("#table-body").append(tr)
    });
}