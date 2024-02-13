import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9b4q5VlmHFggJ1o-PFATssi6CWDJNcIk",
    authDomain: "sathyanantha-aashram-522df.firebaseapp.com",
    projectId: "sathyanantha-aashram-522df",
    storageBucket: "sathyanantha-aashram-522df.appspot.com",
    messagingSenderId: "1054494763112",
    appId: "1:1054494763112:web:ccf03927fa6e64321673dd",
    measurementId: "G-Y49Z15NJJ9"
}

// Initialize Firebase app (already done in your code)
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = getFirestore(app);

async function fetchEvents() {
    const eventsContainer = document.getElementById('eventsContainer');
    try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        eventsContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventCardAdmin = `
    <div class="col-md-4">
        <div class="card border-0 mb-4 rounded shadow">
            <img src=${eventData.posterURL} alt="poster" class="card-img-top w-100 rounded">
                <div class="card-body d-flex justify-content-between">
                    <h6 class="card-title">${eventData.title}</h6>
                    <div class="btn btn-danger rounded deleteBtn" id="deleteBtn" data-id="${doc.id}">Delete Event</div>
                </div>
        </div>
    </div>
    `;
            const eventCard = `
    <div class="col-md-4">
        <div class="card border-0 mb-4 rounded shadow">
            <img src=${eventData.posterURL} alt="poster" class="card-img-top w-100 rounded">
                <div class="card-body d-flex">
                    <h6 class="card-title">${eventData.title}</h6>
                </div>
        </div>
    </div>
    `;
            if (location.pathname == '/admin.html') {
                eventsContainer.insertAdjacentHTML('beforeend', eventCardAdmin);
            }
            else {
                eventsContainer.insertAdjacentHTML('beforeend', eventCard);
            }
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const eventId = button.getAttribute('data-id');
                deleteEvent(eventId);
            });
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

async function deleteEvent(eventId) {
    try {
        // Ask for confirmation before deleting
        const confirmed = window.confirm('Are you sure you want to delete this event?');

        if (!confirmed) {
            return; // If not confirmed, exit the function
        }

        // Reference to the event document in Firestore
        const eventDocRef = doc(db, 'events', eventId);

        // Delete the event document
        await deleteDoc(eventDocRef);

        console.log('Event deleted successfully');
        fetchEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}

const translationBtn = document.getElementById('translation');
translationBtn.addEventListener('click', handleTranslation);

function handleTranslation() {
    document.getElementById("aboutSec1").innerHTML = "Ashramam works for the upliftment of Hindus beyond castes and political parties by embracing the values of Sanatana Dharma and Indian culture to uplift the Hindu community Spiritually, Mentally, Intellectually Physically and Financially ."
    document.getElementById("aboutSec2").innerHTML = "On the coast of Chalakudiyar and Periyar, on the hilltop in the middle of the forest, the world's first four religious shrines (Hindu, Christian, Muslim, Jewish) are located within a radius of about two kilometers, Kottayil kovilakam Srikrishna Swamy Temple is a temple standing under Paliyam Devaswam which is still standing today as the family temple of King Villwarvattam, which is the Lord Balashrikrishna whose 1000 year old Chaturbahubimbam is enshrined. It is now managed by a temple committee with Swami Gurudasananda Saraswati as its patron."
}

// Fetch events automatically when the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);
// document.addEventListener('DOMContentLoaded', fetchCredentials);

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the button
    const addEventButton = document.querySelector('.btn-dark');
    addEventButton.addEventListener('click', function () {
        $('#addEventModal').modal('show');
    });

    // Define the handleEvent function
    function handleEvent() {
        const eventTitle = document.getElementById('eventTitle').value;
        const posterURL = document.getElementById('posterURL').value;

        const eventData = {
            title: eventTitle,
            posterURL: posterURL
        };

        addDoc(collection(db, "events"), eventData)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                $('#addEventModal').modal('hide');
                location.reload();
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    // Assuming you have a submit button inside the modal for saving the event
    // const saveEventButton = document.querySelector('#eventForm');
    const saveEventButton = document.getElementById('saveBtn');
    saveEventButton.addEventListener('click', handleEvent);
});
