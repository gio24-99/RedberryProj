async function getBrands() {
    let teams = await fetch("https://pcfy.redberryinternship.ge/api/brands")
    const res = await teams.json()
    return res
}

async function getCpus() {
    let pos = await fetch("https://pcfy.redberryinternship.ge/api/cpus")
    const res = await pos.json()
    return res
}
let cpus = []
let AMD = []
let Intel = []
let Apple = []
let brands = []
let Lnk_Mem = {}

let lapBrand = document.getElementById('lapBrand')
let cpuSel = document.getElementById('Cpu')
var preview = document.getElementById("preview-img")
let inpp = document.getElementById("uploadImg")
let upll = document.getElementById("upload")
let warningPP = document.getElementById('warningP')
async function inputData() {
    let brand = await getBrands()
    let cpu = await getCpus()
    for (let i = 0; i < brand.data.length; i++) {
        let opt = document.createElement('option')
        opt.innerText = brand.data[i].name
        opt.setAttribute('brandid', brand.data[i].id)
        lapBrand.append(opt)
        brands.push(brand.data[i].name)
    }
    for (let i = 0; i < cpu.data.length; i++) {
        cpus.push(cpu.data[i].name)
        if (cpus[i].includes('AMD')) {
            AMD.push(cpus[i])
        } else if (cpus[i].includes('Intel')) {
            Intel.push(cpus[i])
        } else if (cpus[i].includes('Apple')) {
            Apple.push(cpus[i])
        }
        let opt = document.createElement('option')
        opt.innerText = cpu.data[i].name
        cpuSel.append(opt)
    }

    for (let i = 0; i < brands.length; i++) {
        if (brands[i].includes('Apple')) {
            Lnk_Mem[brands[i]] = Apple.concat(Intel)

        } else {
            Lnk_Mem[brands[i]] = AMD.concat(Intel)
        }


    }
    lapBrand.addEventListener('change', () => {
        cpuSel.innerHTML = ''
        let placeholder = document.createElement('option')
        placeholder.innerText = 'CPU'
        cpuSel.append(placeholder)
        for (let i = 0; i < Lnk_Mem[lapBrand.value].length; i++) {
            let cpuOpt = document.createElement('option')
            cpuOpt.innerText = Lnk_Mem[lapBrand.value][i]
            cpuSel.append(cpuOpt)
        }
    })
}

inputData()

let ModelName = document.getElementById('ModelName')
let BrandName = document.getElementById('lapBrand')
let CpuCores = document.getElementById('CpuCores')
let CpuThreads = document.getElementById('CpuThreads')
let RamAmount = document.getElementById('RamAmount')
let PurDate = document.getElementById('PurDate')
let lapPrice = document.getElementById('lapPrice')
let MemType = document.getElementsByName('MemType');
let lapType = document.getElementsByName('lapType')
let LapExt = ''
let memtypeData = ''
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

window.addEventListener('beforeunload', () => {

    if (MemType[0].checked) {
        memtypeData = 'SSD'
    } else if (MemType[1].checked) { memtypeData = 'HDD' }

    if (lapType[0].checked) {
        LapExt = 'new'
    } else if (lapType[1].checked) { LapExt = 'used' }

    let LapformOBJ = {
        'ModelName': ModelName.value,
        'BrandName': BrandName.options[BrandName.selectedIndex].value,
        'CpuName': cpuSel.options[cpuSel.selectedIndex].value,
        'CpuCores': CpuCores.value,
        'CpuThreads': CpuThreads.value,
        'RamAmount': RamAmount.value,
        'PurDate': PurDate.value,
        'lapPrice': lapPrice.value,
        'MemType': memtypeData,
        'LapExt': LapExt,
        'brandid': BrandName.options[BrandName.selectedIndex].getAttribute('brandid')
    }
    localStorage.setItem('LapFormOBJ', JSON.stringify(LapformOBJ))
})

window.onload = async function () {
    if (window.localStorage.length > 1) {
        let GetLapOBJ = JSON.parse(localStorage.getItem('LapFormOBJ'))
        ModelName.value = GetLapOBJ.ModelName
        CpuCores.value = GetLapOBJ.CpuCores
        CpuThreads.value = GetLapOBJ.CpuThreads
        RamAmount.value = GetLapOBJ.RamAmount
        if (GetLapOBJ.MemType == 'SSD') {
            MemType[0].checked = true
        } else if (GetLapOBJ.MemType == 'HDD') { MemType[1].checked = true }
        PurDate.value = GetLapOBJ.PurDate
        lapPrice.value = GetLapOBJ.lapPrice
        if (GetLapOBJ.LapExt == 'new') {
            lapType[0].checked = true
        } else if (GetLapOBJ.LapExt == 'used') { lapType[1].checked = true }
        await new Promise(r => setTimeout(r, 500));
        BrandName.value = GetLapOBJ.BrandName
        var change = new Event('change');
        BrandName.dispatchEvent(change)
        cpuSel.value = GetLapOBJ.CpuName
    }
}
btnNext.addEventListener('click', (e) => {
    e.preventDefault();
    var unload = new Event('beforeunload')
    window.dispatchEvent(unload)
    let status = 0;
    status += ValidateLaptopName();
    status += ValidateLaptopBrand();
    status += ValidateCPU();
    status += ValidateCPUCores();
    status += ValidateCPUThreads();
    status += ValidateRam();
    status += ValidatePrice();
    status += ValidateImage();
    if (status == 8) {
        let Form = JSON.parse(localStorage.getItem('FormOBJ'))
        let LapForm = JSON.parse(localStorage.getItem('LapFormOBJ'))
        let apikey = '0f42da30f744460145c447a2983ba6fa'
        var url = 'https://pcfy.redberryinternship.ge/api/laptop/create';

        const body = {
            'name': Form.Fname,
            'surname': Form.Lname,
            'team_id': Form.Teamid,
            'position_id': Form.positionID,
            'phone_number': Form.Pnumber,
            'email': Form.Email,
            'token': apikey,
            'laptop_name': LapForm.ModelName,
            'laptop_image': inpp.files[0],
            'laptop_brand_id': LapForm.brandid,
            'laptop_cpu': LapForm.CpuName,
            'laptop_cpu_cores': LapForm.CpuCores,
            'laptop_cpu_threads': LapForm.CpuThreads,
            'laptop_ram': LapForm.RamAmount,
            'laptop_hard_drive_type': LapForm.MemType,
            'laptop_state': LapForm.LapExt,
            'laptop_purchase_date': LapForm.PurDate,
            'laptop_price': LapForm.lapPrice
        }
        var form_data = new FormData();

        for (var key in body) {
            form_data.append(key, body[key]);
        }
        fetch(url, {
            method: 'POST',
            body: form_data
        })
        setTimeout(() => {
            window.location = 'finish.html'
        }, 1000);

    }
})

let btnback = document.getElementById('btnback')
btnback.addEventListener('click', (e) => {
    e.preventDefault();
    var unload = new Event('beforeunload')
    window.dispatchEvent(unload)
    setTimeout(() => {
        window.location = 'form.html'
    }, 1000);
})

const ValidateLaptopName = () => {
    let regex = new RegExp(/^[a-zA-Z0-9 !@#\$%\^\&*\)\(+=._-]+$/g)
    let ModelName = document.getElementById('ModelName')
    if (!regex.test(ModelName.value)) {
        document.getElementById('ModelNameLabel').style.color = "red";
        return false;
    }
    document.getElementById('ModelNameLabel').style.color = "#2e2e2eb9";
    return true;
}

const ValidateLaptopBrand = () => {
    let SelectedIndexName = lapBrand.options[lapBrand.selectedIndex].value;
    for (let i = 0; i < brands.length; i++) {
        if (SelectedIndexName == brands[i]) {
            return true;
        }
    }
    document.getElementById('lapBrand').style.borderColor = "red";
    return false;
}

const ValidateCPU = () => {
    let SelectedIndexName = cpuSel.options[cpuSel.selectedIndex].value;
    for (let i = 0; i < cpus.length; i++) {
        if (SelectedIndexName == cpus[i]) {
            return true;
        }
    }
    document.getElementById('Cpu').style.borderColor = "red";
    return false;
}
const ValidateCPUCores = () => {
    if (CpuCores.value.length == "") {
        document.getElementById('CpuCoresLabel').style.color = "red";
        return false;
    }
    document.getElementById('CpuCoresLabel').style.color = "#2e2e2eb9";
    return true
}

const ValidateCPUThreads = () => {
    if (CpuThreads.value == "") {
        document.getElementById('CpuThreadLabel').style.color = "red";
        return false;
    }
    document.getElementById('CpuThreadLabel').style.color = "#2e2e2eb9";
    return true
}
const ValidateRam = () => {
    if (RamAmount.value.length <= 0) {
        document.getElementById('RamLabel').style.color = "red";
        return false;
    }
    document.getElementById('RamLabel').style.color = "#2e2e2eb9";
    return true
}
const ValidatePrice = () => {
    if (lapPrice.value <= 0) {
        document.getElementById('PriceLabel').style.color = "red";
        return false;
    }
    document.getElementById('PriceLabel').style.color = "#2e2e2eb9";
    return true
}
const ValidateImage = () => {

    if (inpp.files.length <= 0) {
        warningPP.style.display = 'block'
        preview.style.display = 'none'
        upll.style.borderColor = 'red'
        upll.style.backgroundColor = '#e52f2f1e'
        upll.setAttribute('data-content', 'ჩააგდე ან ატვირთე ლეპტოპის ფოტო')
        return false;
    }

    return true
}

let backBtn = document.getElementById('backBtn')

backBtn.addEventListener('click', () => {
    history.back()
})