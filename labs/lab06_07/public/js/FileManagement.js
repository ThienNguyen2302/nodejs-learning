$(document).ready(() => {
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    //upload file
    $("#uploadButton").click(() => {
        let upload = document.getElementById("attachment")
        let dir = $("#user").attr("data-dir")
        if (upload.files.length === 0) {
            return alert("vui lòng chọn file")
        }
        let file = upload.files[0]
        let form = new FormData()
        form.set("attachment", file)
        form.set("dir", dir)
        let xhr = new XMLHttpRequest()
        xhr.open("POST", "http://localhost:3000/upload", true)
        xhr.addEventListener("load", e => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const json = JSON.parse(xhr.responseText)
                console.log(json)
            }
        })
        xhr.upload.addEventListener("progress", e => {
            let loaded = e.loaded
            let total = e.total
            let progress = Math.round(loaded * 100 / total)
            $("#upload_progress").css("width", progress + "%")
        })
        xhr.send(form)
    })

    $(".delete").click(() => {
        console.log("OK")
    })
    // delete file
})