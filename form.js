async function getTeams() {
    let teams = await fetch("https://pcfy.redberryinternship.ge/api/teams")
    const res = await teams.json()
    return res
}

async function getPos() {
    let pos = await fetch("https://pcfy.redberryinternship.ge/api/positions")
    const res = await pos.json()
    return res
}

let team = document.getElementById("teams")
let position = document.getElementById("positions")
let Currpos = []

async function inputData() {
    let teams = await getTeams()
    let pos = await getPos()
    for (let index = 0; index < teams.data.length; index++) {
        let teamData = document.createElement("option")
        teamData.innerText = teams.data[index].name
        teamData.value = teams.data[index].name
        teamData.setAttribute("teamid", teams.data[index].id)
        team.append(teamData)
    }

    team.addEventListener("change", (e) => {
        position.innerHTML = ''
        for (let index = 0; index < pos.data.length; index++) {
            if (e.target.children[e.target.selectedIndex].getAttribute('teamid') == pos.data[index].team_id) {
                Currpos.push({ "name": pos.data[index].name, "id": pos.data[index].id })
            }
        }
        for (let index = 0; index < Currpos.length; index++) {
            let opt = document.createElement('option')
            opt.innerText = Currpos[index].name
            opt.value = Currpos[index].name
            opt.setAttribute('positionid', Currpos[index].id)
            position.append(opt)

        }
        Currpos = []
    }
    )
}
inputData()
let Fname = document.getElementById('Fname')
let Lname = document.getElementById('Lname')
let pNum = document.getElementById('Pnumber')
let email = document.getElementById('email')
const GEORGIAN_LETTERS = "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძჭხჯჰ"
function ValidateFirstName() {
    let UnderFname = document.getElementById('UnderFName')
    UnderFname.style.color = "red";
    if (Fname.value.length < 2) {
        UnderFname.innerText = 'მინიმუმ 2 სიმბოლო';
        return false;
    }
    let isIssue = false;
    for (let i = 0; i < Fname.value.length; i++) {
        if (GEORGIAN_LETTERS.indexOf(Fname.value[i]) == -1) {
            UnderFname.style.innerText = 'გამოიყენე ქართული ასოები';
            isIssue = true;
            break;
        }
    }
    if (!isIssue) {
        UnderFname.style.color = "#2e2e2eb9";
        UnderFname.innerText = 'მინიმუმ 2 სიმბოლო, ქართული ასოები';
    }
    return isIssue;
}

function ValidateLastName() {
    let UnderLname = document.getElementById('UnderLName')
    UnderLname.style.color = "red";
    if (Lname.value.length < 2) {
        UnderLname.innerText = 'მინიმუმ 2 სიმბოლო';
        return false;
    }
    let isIssue = false;
    for (let i = 0; i < Lname.value.length; i++) {
        if (GEORGIAN_LETTERS.indexOf(Lname.value[i]) == -1) {
            UnderLname.style.innerText = 'გამოიყენე ქართული ასოები';
            isIssue = true;
            break;
        }
    }
    if (!isIssue) {
        UnderLname.style.color = "#2e2e2eb9";
        UnderLname.innerText = 'მინიმუმ 2 სიმბოლო, ქართული ასოები';
    }
    return isIssue;
}


function ValidateEmail() {
    let regex = new RegExp(/^[a-zA-Z0-9]+@redberry\.ge$/)
    let EmailP = document.getElementById('emailP')
    EmailP.style.color = "#2e2e2eb9";
    let foundIssue = false;
    if (!regex.test(email.value)) {
        EmailP.style.color = 'red';
        EmailP.innerText = "უნდა მთავრდებოდეს @redberry.ge-ით";
        foundIssue = true;
    }
    return foundIssue;
}

function ValidatePhoneNumber() {
    const regex = new RegExp(/^(\+?995)?(79\d{7}|5\d{8})$/);
    let phoneP = document.getElementById('PhoneP')
    let foundIssue = false;
    phoneP.style.color = "#2e2e2eb9";
    if (!regex.test(pNum.value)) {
        phoneP.style.color = 'red';
        phoneP.innerText = "უნდა აკმაყოფილებდეს ქართული მობ-ნომრის ფორმატ";
        foundIssue = true;
    }
    return foundIssue;
}
window.addEventListener('beforeunload', () => {
    let formOBJ = {
        'Fname': Fname.value,
        'Lname': Lname.value,
        'Team': team.options[team.selectedIndex].value,
        'position': position.options[position.selectedIndex].value,
        'Email': email.value,
        'Pnumber': pNum.value,
        'Teamid': team.options[team.selectedIndex].getAttribute('teamid'),
        'positionID': position.options[position.selectedIndex].getAttribute('positionid'),
    }
    localStorage.setItem('FormOBJ', JSON.stringify(formOBJ))
})
window.onload = async function () {
    if (window.localStorage.length > 0) {
        let GetOBJ = JSON.parse(localStorage.getItem('FormOBJ'))
        Fname.value = GetOBJ.Fname
        Lname.value = GetOBJ.Lname
        email.value = GetOBJ.Email
        pNum.value = GetOBJ.Pnumber
        await new Promise(r => setTimeout(r, 500));
        team.value = GetOBJ.Team
        var change = new Event('change');
        team.dispatchEvent(change)
        position.value = GetOBJ.position
    }
}

let btnNext = document.getElementById('NextForm')

btnNext.addEventListener('click', (e) => {
    e.preventDefault();
    var unload = new Event('beforeunload')
    window.dispatchEvent(unload)
    let status = 0;
    status += ValidateFirstName();
    status += ValidateLastName();
    status += ValidateEmail();
    status += ValidatePhoneNumber()
    if (status == 0) {
        window.location.href = "/lapform.html";
    }
})


let backBtn = document.getElementById('backBtn')

backBtn.addEventListener('click', () => {
    history.back()
})