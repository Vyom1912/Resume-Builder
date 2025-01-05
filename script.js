// work Experience
function addNewWEField() {
  //   alert("mcbvbhj");
  let newNode = document.createElement("textarea");
  newNode.classList.add("form-control");
  newNode.classList.add("weField");
  newNode.classList.add("mt-2");

  newNode.setAttribute("rows", 3);
  newNode.setAttribute("placeholder", "Enter here");

  let weOb = document.getElementById("we");
  let addWEButtonOb = document.getElementById("weAddButton");
  weOb.insertBefore(newNode, addWEButtonOb);
}
// academic qulification
function addNewEDField() {
  //   alert("mcbvbhj");
  let newNode = document.createElement("textarea");
  newNode.classList.add("form-control");
  newNode.classList.add("edField");
  newNode.classList.add("mt-2");

  newNode.setAttribute("rows", 3);
  newNode.setAttribute("placeholder", "Enter here");

  let edOb = document.getElementById("ed");
  let addEDButtonOb = document.getElementById("edAddButton");
  edOb.insertBefore(newNode, addEDButtonOb);
}
// generateCV
function generateCV() {
  document.getElementById("nameT1").innerHTML =
    document.getElementById("nameField").value;
  document.getElementById("nameT2").innerHTML = nameT2.innerHTML = nameField;
  // contect
  document.getElementById("conNumField").value.innerHTML =
    document.getElementById("contectT");

  // address
  document.getElementById("addressT").innerHTML =
    document.getElementById("addressField").value;
  // facebook
  document.getElementById("fbT").innerHTML =
    document.getElementById("faceField").value;
  // instagram
  document.getElementById("instaT").innerHTML =
    document.getElementById("instaField").value;
  // linkedIn
  document.getElementById("liT").innerHTML =
    document.getElementById("linkedField").value;
  // objective
  document.getElementById("objectiveT").innerHTML =
    document.getElementById("objective").value;
  // we
  let wes = document.getElementsByClassName("weField");
  let str = "";
  for (let e of wes) {
    str = str + `<li>${e.value}</li>`;
  }
  document.getElementById("weT").innerHTML = str;
  // ed
  let eds = document.getElementsByClassName("edField");
  let str2 = "";
  for (let e of eds) {
    str2 = str2 + `<li>${e.value}</li>`;
  }
  document.getElementById("edT").innerHTML = str2;
  // setting image
  let imagefile = document.getElementById("photoField").files[0];
  let reader = new FileReader();
  reader.readAsDataURL(imagefile);
  reader.onload = function () {
    document.getElementById("photoT").src = reader.result;
  };

  document.getElementById("cv-form").style.display = "none";
  document.getElementById("cv-template").style.display = "block";
}
// printCV
function printCV() {
  window.print();
}
