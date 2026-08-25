const dropdownBtn = document.getElementById('dropdownBtn');
const dropdownContent = document.getElementById('dropdownContent');

dropdownBtn.addEventListener('click', function() {
    dropdownContent.classList.toggle('hidden'); 
});


const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const myModal = document.getElementById('myModal');


openModalBtn.addEventListener('click', function() {
    myModal.classList.remove('hidden');
});


closeModalBtn.addEventListener('click', function() {
    myModal.classList.add('hidden');
});


const myForm = document.getElementById('myForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const message = document.getElementById('message');


myForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Eta form ke reload hote dibe na

    const nameValue = nameInput.value;
    const emailValue = emailInput.value;

    
    if (nameValue === "" || emailValue === "") {
        message.style.color = "red";
        message.innerText = "Please fill out all fields!";
    } 
    
    else if (!emailValue.includes("@")) {
        message.style.color = "red";
        message.innerText = "Please enter a valid email address!";
    } 
    
    else {
        message.style.color = "green";
        message.innerText = "Form submitted successfully!";
        myForm.reset(); 
    }
});