let dropped
let FileAmount
let upLBL = document.getElementById('upLbl')
let upLBLout = document.getElementById('upLblOut')
let FileInfo = document.getElementById('FileInfo')
let upl = document.getElementById("upload")
let inp = document.getElementById("uploadImg")
var preview = document.getElementById("preview-img")
let warningP = document.getElementById('warningP')
let uplAfter = document.querySelector('.upload::after')
function previewImg(e) {
    if (e.target.files[0].type.includes("image")) {
        let src = URL.createObjectURL(e.target.files[0]);
        warningP.style.display = 'none'
        upLBL.style.display = "none"
        upLBLout.style.display = 'block'
        upl.style.border = 'none'
        upl.style.backgroundColor = '#F6F6F6'
        upl.style.borderColor = '#4386A9'
        upl.setAttribute('data-content', '')
        let newfilename = inp.files[0].name.substring(0,8)
        if (dropped == true) { } else FileInfo.textContent = `✅ ${newfilename}, ${(inp.files[0].size / 1024 / 1024).toFixed(1)} mb `
        preview.src = src;
        preview.style.display = "block";

        dropped = false

    } else {
        warningP.style.display = 'block'
        preview.style.display = 'none'
        upl.style.borderColor = 'red'
        upl.style.backgroundColor = '#e52f2f1e'
        upl.setAttribute('data-content', 'ჩააგდე ან ატვირთე ლეპტოპის ფოტო')
    }
}

inp.addEventListener("change", (e) => {
    previewImg(e)
})

upl.ondrop = function (e) {
    if (e.dataTransfer.files[0].type.includes("image")) {
        warningP.style.display = 'none'
        upl.files = e.dataTransfer.files
        FileInfo.textContent = `✅ ${e.dataTransfer.files[0].name}, ${(e.dataTransfer.files[0].size / 1024 / 1024).toFixed(1)} mb `
        dropped = true
        previewImg(e)
    } else {
        warningP.style.display = 'block'
        preview.style.display = 'none'
        upl.style.borderColor = 'red'
        upl.style.backgroundColor = '#e52f2f1e'
        upl.setAttribute('data-content', 'ჩააგდე ან ატვირთე ლეპტოპის ფოტო')
    }
}

window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
}, false);