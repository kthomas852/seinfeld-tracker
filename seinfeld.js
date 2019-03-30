/*These are the javascript fo the Seinfeld App*/
//require('dotenv').config();
//require('env2')('.env')

let programsArry = [];
let continuous = 0;
let longest = 0;
let programmed2Day = false;
let day = new Date();

 // Initialize Firebase
 var lego = {
    apiKey: config.KEY,
    authDomain: config.DOMAIN,
    databaseURL: config.URL,
    projectId: config.ID,
    storageBucket: config.SB,
    messagingSenderId: config.MSID
  };
  firebase.initializeApp(lego);
  db = firebase.database();

  //initial setup for Firebase (done once)
//   db.ref('/').set({
//     root: {
//        programsArry:[
//         {
//             name: "Seinfeld Tracker",
//             daysWorked: 6
//         },
//         {
//             name: "GitGoing",
//             daysWorked: 3
//         }
//     ],
//     days: 6,
//     longRun: 0
//     }
//   });

//Adds a new program name to the list using the input field
const addProgram = () => {
    if(programmed2Day === false){
        continuous++;
        programmed2Day = true;
    };
    let text = document.getElementById('listAdd').value;
    document.getElementById('listAdd').value = "";
    let newObj = {
        name: text,
        daysWorked: 1
    };
    programsArry.push(newObj);
    console.log(programsArry);
    db.ref('/root').update({days: continuous, programsArry: programsArry, programmed: programmed2Day});
}

//Prints the list of all the programs that have been created
const printList = () => {
    document.getElementById('progList').innerHTML = "";
    for(x in programsArry){
        let div = document.createElement('div');
        let pTag = document.createElement('span');
        let text = document.createTextNode(programsArry[x].name);
        let button = document.createElement('span');
        button.setAttribute('onClick', 'addDay(this.id, this.value)');
        button.setAttribute('id', x);
        button.classList.add('listBtn');
        button.setAttribute('value', programsArry[x].daysWorked);
        button.innerHTML = programsArry[x].daysWorked;
        pTag.appendChild(text);
        div.classList.add('listItem', 'row');
        div.appendChild(pTag);
        div.appendChild(button).classList.add('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'red');
        document.getElementById('progList').appendChild(div);
        document.getElementById('days').innerHTML = continuous;
        document.getElementById('longest').innerHTML = longest;
    }
    console.log(day.getHours());
    console.log(programmed2Day);
}

//Adds a day to the Continous Days Programming field
const addDay = (id) => {
    if(programmed2Day === false){
        continuous++;
        programmed2Day = true;
    };
    let current = document.getElementById(id).getAttribute('value');
    db.ref('/root').update({days: continuous, programmed: programmed2Day})
    db.ref('/root/programsArry').child(id).update({daysWorked: (parseInt(current) + 1)});
}

//Updates if no coding has taken place
const resetDays = () => {
    if(continuous > longest){
        longest = continuous;
        continuous = 0;
        db.ref('/root').update({longRun: longest, days: continuous});
    }else{
        continuous = 0;
        db.ref('/root').update({days: continuous});
    };
}
//Event listener for input to activate when Enter button is pressed
let input = document.getElementById("listAdd");

input.addEventListener("keyup", function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById("listBtn").click();
    }
  });
//inital load listener
db.ref('/').on('child_added', function(snapshot, prevChildKey){
    programsArry = snapshot.val().programsArry;
    continuous = snapshot.val().days;
    longest = snapshot.val().longRun;
    //programmed2Day = snapshot.val().programmed;
    printList();
});

//listener for Firebase Changes
db.ref('/').on('child_changed', function(snapshot, prevChildKey){
    programsArry = snapshot.val().programsArry;
    continuous = snapshot.val().days;
    longest = snapshot.val().longRun;
    //programmed2Day = snapshot.val().programmed;
    printList();
});
