$('#flash').fadeOut(2000)
$('.btn-delete').click(e => {
    const btn = e.target
    const id = btn.dataset.id
    const name = btn.dataset.name
    $('#confirm-delete .modal-body strong').html(name)
    $('#confirm-delete-btn').attr('data-id', id)
    $('#confirm-delete-btn').attr('data-name', name)
    $('#confirm-delete').modal("show")
})

$('#confirm-delete-btn').click(e => {

  $('#confirm-delete').modal("hide")
  const btn = e.target
  const id = btn.dataset.id
  const name = btn.dataset.name
  fetch('http://localhost:3000/delete/' + id, {
    method: 'POST',

  }).then(res => res.json())
  .then(json => {
    if(json.code === 200) {
      let total = $("#total strong").html()
      total = parseInt(total) -1
      $("#total strong").html(total)
      $(`tr#${id}`).remove()
        $('#flash-alert strong').html(name)
        $('#flash-alert').show()
        setTimeout(() => {
          $('#flash-alert').fadeOut(2000)
        }, 1000);
    }
  })
  .catch(e => console.log(e))
})

$('.btn-edit').click(e => {
  const btn = e.target
  const gender = btn.dataset.gender
  $('#name').val(btn.dataset.name)
  $('#age').val(btn.dataset.age)
  $('#email').val(btn.dataset.email)
  $("#class").val(btn.dataset.class)
  $("#address").val(btn.dataset.address)
  if(gender === "male") 
    $("#gender-male").prop("checked", true)
  else 
    $("#gender-female").prop("checked", true)

  $("#confirm-edit-btn").attr('data-id', btn.dataset.id)
  $('#confirm-edit').modal('show')
})

$("#confirm-edit-btn").click(e => {
  let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
  const btn = e.target
  const id = btn.dataset.id
  let email = $('#email').val()
  let address = $('#address').val()
  let member = $('#class').val()
  let age = $('#age').val()
  let name = $('#name').val()
  let err = ""
  let gender = $("input[type = 'radio']:checked");
  if(name === "") {
    err = "Vui lòng nhập tên người dùng"
  }
  else if(age === "") {
    err = "Vui lòng nhập tuổi người dùng"
  }
  else if(Number.isInteger(age) || isNaN(age)) {
    err = "Tuổi người dùng phải là số"
  }
  else if(Number(age) <18 || Number(age) >100) {
    err = "Tuổi người dùng phải từ 18 đến 100"
  }
  else if(gender.length<=0) {
    err = "Vui lòng chọn giới tính người dùng"
  }
  else if(email === "") {
    err = "Vui lòng nhập email người dùng"
  }
  else if(!regex.test(email)) {
    err = "Email người dùng không hợp lệ"
  }
  else if(member === "") {
    err = "Vui lòng nhập lớp người dùng"
  }
  else if(address === "") {
    err = "Vui lòng nhập địa chỉ người dùng"
  }

  if(err) {
    $("#edit-error").addClass("alert")
    $("#edit-error").html(err)
  }
  else {
    var checkbox = document.getElementsByName("gender");
    let valueGender;
    for (var i = 0; i < checkbox.length; i++){
      if (checkbox[i].checked === true){
        valueGender = checkbox[i].value
      }
    }
    let student = {
      email: email,
      name: name,
      gender: valueGender,
      age: parseInt(age),
      class: member,
      address
    }
    fetch('http://localhost:3000/edit/' + id, {
      method: "post",
      headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded'
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(student)
    }).then(res => res.json())
    .then(json => {
      if(json.code != 200) {
        $("#edit-error").addClass("alert")
        $("#edit-error").html(json.message)
      }
      else {
        location.reload()
      }
    })
    .catch(e => console.log(e))
  }
})