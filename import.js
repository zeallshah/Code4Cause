// This script is used to import data from a local JSON file into your Firebase Firestore database.
// It uses the Firebase Admin SDK, which provides powerful backend access to your Firebase project.

// 1. Import the Firebase Admin SDK.
const admin = require('firebase-admin');

// 2. Import your service account key.
// Make sure the path to your serviceAccountKey.json is correct.
const serviceAccount = require('./serviceAccountKey.json');

// 3. Import your data file.
// Make sure the path to your events.json file is correct.
const data = require('./events.json');

// 4. Initialize the Firebase Admin App.
// This uses your service account key to authenticate and gain access to your project.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 5. Get a reference to your Firestore database.
const db = admin.firestore();

// 6. Define the main function to upload the data.
// This function will loop through your JSON data and add each item to a specific collection.
async function uploadData() {
  console.log('Starting data import...');
  
  // Get a reference to the collection you want to upload to.
  const collectionRef = db.collection('events');

  for (const event of data) {
    try {
      // The `add` function creates a new document with an automatically generated ID.
      // We convert the date string from the JSON into a Firebase Timestamp, which is what the app expects.
      const newEvent = {
        ...event,
        date: admin.firestore.Timestamp.fromDate(new Date(event.date)),
        registeredUsers: [] // Initialize with an empty array for registered users
      };

      await collectionRef.add(newEvent);
      console.log(`Added event: ${event.title}`);
    } catch (error) {
      console.error(`Error adding event: ${event.title}`, error);
    }
  }

  console.log('Data import finished successfully!');
}

// 7. Call the function to start the upload process.
uploadData();
