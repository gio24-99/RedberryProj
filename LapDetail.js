let backBtn = document.getElementById('backBtn')
backBtn.addEventListener('click', () => {
  history.back()
})
function PHnumGen(val, pat) {
  var i = 0,
    phone = val.toString();
  return pat.replace(/#/g, _ => phone[i++]);
}
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

window.onload = async function () {
  let lapid = localStorage.getItem('LapID')
  let token = '0f42da30f744460145c447a2983ba6fa'
  let req = await fetch(`https://pcfy.redberryinternship.ge/api/laptop/${lapid}?token=${token}`)
  let res = await req.json()
  let img = `https://pcfy.redberryinternship.ge${res.data.laptop.image}`
  let MainIMG = document.getElementById('MainIMG')
  MainIMG.src = img
  let Datainp = document.getElementById('Datainp')
  Datainp.children[0].textContent = `${res.data.user.name} ${res.data.user.surname}`
  Datainp.children[3].textContent = res.data.user.email
  Datainp.children[4].textContent = PHnumGen(res.data.user.phone_number, '#### ### ## ## ##')
  let DataGeneral = document.getElementById('DataGeneral')
  DataGeneral.children[0].textContent = res.data.laptop.name
  DataGeneral.children[1].textContent = res.data.laptop.brand_id
  DataGeneral.children[2].textContent = res.data.laptop.ram
  DataGeneral.children[3].textContent = res.data.laptop.hard_drive_type
  let DataCpu = document.getElementById('DataCpu')
  DataCpu.children[0].textContent = res.data.laptop.cpu.name
  DataCpu.children[1].textContent = res.data.laptop.cpu.cores
  DataCpu.children[2].textContent = res.data.laptop.cpu.threads
  let DataExtra = document.getElementById('DataExtra')
  let LapState
  if (res.data.laptop.state == 'new') { LapState = 'ახალი' } else if (res.data.laptop.state == 'used') { LapState = 'მეორადი' }
  DataExtra.children[0].textContent = LapState
  DataExtra.children[1].textContent = `${res.data.laptop.price} ₾`
  let DataDate = document.getElementById('DataDate')
  if (res.data.laptop.purchase_date == null) { res.data.laptop.purchase_date = 'არ არის' }
  DataDate.children[0].textContent = res.data.laptop.purchase_date
  let teams = await getTeams()
  let pos = await getPos()

  for (let i = 0; i < teams.data.length; i++) {
    if (res.data.user.team_id == teams.data[i].id) {
      Datainp.children[1].textContent = teams.data[i].name
    }
  }
  for (let i = 0; i < pos.data.length; i++) {
    if (res.data.user.position_id == pos.data[i].id) {
      Datainp.children[2].textContent = pos.data[i].name
      break;
    }
  }


  if (window.screen.height < 845) {
    let bot = document.querySelector('.bot1')
    bot.children[0].children[0].innerHTML = 'მდგომარეობა:'
  }
}