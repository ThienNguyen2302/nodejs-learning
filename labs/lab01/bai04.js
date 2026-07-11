let ten, age

$(document).ready(() => {
    let localStudents = JSON.parse(window.localStorage.getItem("students"))
    if (!localStudents) {
        localStudents = []
    }
    else {
        localStudents.forEach(s => displayStudent(s, "table1"));
    }

    let sessionStudents = JSON.parse(window.sessionStorage.getItem("students"))
    if (!sessionStudents) {
        sessionStudents = []
    }
    else {
        sessionStudents.forEach(s => displayStudent(s, "table2"));
    }

    $("#btnLocal").click(() => {
        getInput()
        let id = localStudents.length + 1
        let newStudent = {
            id: id,
            name: ten,
            age: age
        }

        localStudents.push(newStudent)

        window.localStorage.setItem("students", JSON.stringify(localStudents))
        displayStudent(newStudent, "table1")
    })

    $("#btnSession").click(() => {
        getInput()
        let id = sessionStudents.length + 1
        let newStudent = {
            id: id,
            name: ten,
            age: age
        }

        sessionStudents.push(newStudent)

        window.sessionStorage.setItem("students", JSON.stringify(sessionStudents))
        displayStudent(newStudent, "table2")
    })
})


function displayStudent(student, id) {
    let tbody = $(`#${id}`)
    tbody.append(`
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
        </tr>
    `)
}

function getInput() {
    ten = $("#name").val()
    age = $("#age").val()
    $("#name").val('')
    $("#age").val('')
}