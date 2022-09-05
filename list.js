let token = '0f42da30f744460145c447a2983ba6fa'
let imglnk = 'https://pcfy.redberryinternship.ge'
async function getids() {
    let lnk = `https://pcfy.redberryinternship.ge/api/laptops?token=${token}`
    const ids = await fetch(lnk)
    const res = await ids.json()
    return res
}

async function getlaptops() {
    let ids = await getids()
    let idarr = []
    for (let i = 0; i < ids.data.length; i++) {
        idarr.push(ids.data[i].laptop.id)
    }
    let resarr = []
    for (let i = 0; i < idarr.length; i++) {
        let newthingn = await fetch(`https://pcfy.redberryinternship.ge/api/laptop/${idarr[i]}?token=${token}`)
        let res = await newthingn.json()
        resarr.push({ "main": res, "LapID": ids.data[i].laptop.id })
    }
    return resarr
}

async function inpData() {
    let maincont = document.getElementById('maincont')
    let data = await getlaptops()
    for (let i = 0; i < data.length; i++) {
        let div = document.createElement('div')
        let pdiv = document.createElement('div')
        let p = document.createElement('p')
        let a = document.createElement('a')
        let ModelP = document.createElement('p')
        ModelP.classList.add('ModelP')
        a.innerText = 'მეტის ნახვა'
        a.id = 'LapInfo'
        a.setAttribute('LapId', data[i].LapID)
        a.classList.add('smallA')
        p.innerText = `${data[i].main.data.user.name}  ${data[i].main.data.user.surname}`
        ModelP.innerText = `${data[i].main.data.laptop.name}`
        div.classList.add('Card-div')
        pdiv.classList.add('Pdiv')
        let img = document.createElement('img')
        img.src = imglnk + data[i].main.data.laptop.image
        div.append(img)
        div.append(pdiv)
        pdiv.append(p)
        pdiv.append(ModelP)
        pdiv.append(a)
        maincont.append(div)
    }
let lapA = document.querySelectorAll('#LapInfo')

lapA.forEach(lap => {
    lap.onclick = function() {
        localStorage.clear()
        localStorage.setItem('LapID', this.getAttribute('lapid'))
        window.location = 'LapDetail.html'
    }
})
}

inpData()


let backBtn = document.getElementById('backBtn')
backBtn.addEventListener('click', () => {
    history.back()
})