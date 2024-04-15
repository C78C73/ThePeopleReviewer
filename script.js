// Array to store submitted data
let data = [];

// Load saved data from local storage
function loadSavedData() {
    let savedData = localStorage.getItem("userData");
    if (savedData) {
        data = JSON.parse(savedData);
        displayData();
    }
}

// Function to submit user data
function submitData() {
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const descriptionInput = document.getElementById("descriptionInput");

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!firstName || !lastName || !description) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const sanitizedFirstName = sanitizeInput(firstName);
        const sanitizedLastName = sanitizeInput(lastName);
        const sanitizedDescription = sanitizeInput(description);

        // Check if the combination of first and last name already exists
        const existingUser = data.find(user => user.firstName === sanitizedFirstName && user.lastName === sanitizedLastName);

        if (existingUser && existingUser.description === sanitizedDescription) {
            // Show error message as a popup modal
            const duplicateUserModal = document.getElementById("duplicateUserModal");
            const duplicateUserText = document.getElementById("duplicateUserText");
            duplicateUserText.innerText = "A user with the same first and last name already exists with the same description.";
            duplicateUserModal.style.display = "block";

            // Close the modal when the user clicks on the close button
            const closeButton = document.querySelector("#duplicateUserModal .close");
            closeButton.onclick = function () {
                duplicateUserModal.style.display = "none";
            };

            return; // Stop further execution
        }

        // Proceed with adding the user using sanitized data
        data.push({ firstName: sanitizedFirstName, lastName: sanitizedLastName, description: sanitizedDescription });
        localStorage.setItem("userData", JSON.stringify(data));

        // Clear input fields and display success message
        firstNameInput.value = "";
        lastNameInput.value = "";
        descriptionInput.value = "";
        document.getElementById("message").innerText = "User added successfully.";

        // Reload saved data and display after adding a new entry
        loadSavedData();
    } catch (error) {
        // Display error message as a popup modal
        const errorText = document.getElementById("errorText");
        errorText.innerText = error.message;

        const errorModal = document.getElementById("errorModal");
        errorModal.style.display = "block";

        // Close the modal when the user clicks on the close button
        const closeButton = document.querySelector("#errorModal .close");
        closeButton.onclick = function () {
            errorModal.style.display = "none";
        };
    }
}

// Function to display data in table
function displayData() {
    let tbody = document.getElementById("dataBody");
    tbody.innerHTML = ""; // Clear previous data

    data.forEach((item, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.firstName}</td>
            <td>${item.lastName}</td>
            <td>${item.description}</td>
            <td><button onclick="deleteEntry(${index})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Function to delete an entry securely
function deleteEntry(index) {
    // Prompt the user for confirmation with a secret word
    const secretWord = prompt("To delete this entry, enter the secret word:");
    if (secretWord && secretWord.toLowerCase() === "word") {
        data.splice(index, 1); // Remove entry from data array
        localStorage.setItem("userData", JSON.stringify(data)); // Update local storage
        displayData(); // Update the displayed data
    } else {
        alert("Incorrect secret word. Deletion canceled.");
    }
}

// Function to sanitize user input (exclude vulgar language)
function sanitizeInput(input) {
    // Sanitization logic here
    return input;
}

// Function to search data by first and last name
function searchData() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const results = data.filter(item =>
        item.firstName.toLowerCase().includes(query) ||
        item.lastName.toLowerCase().includes(query)
    );

    let usersFoundBody = document.getElementById("usersFoundBody");
    usersFoundBody.innerHTML = ""; // Clear previous search results

    if (results.length > 0) {
        results.forEach(item => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.firstName}</td>
                <td>${item.lastName}</td>
                <td>${item.description}</td>
            `;
            usersFoundBody.appendChild(row);
        });
    } else {
        let row = document.createElement("tr");
        row.innerHTML = `<td colspan="3">No matching results found.</td>`;
        usersFoundBody.appendChild(row);
    }
}

// Event listener for search button click
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    searchData();
});

// Call loadSavedData when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    loadSavedData();
});
