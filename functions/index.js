/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {auth}  = require('firebase-functions');
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
// const {onCreate} = require("firebase-functions/v2/auth");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { getAuth } = require('firebase-admin/auth');
initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
// exports.addmessage = onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await getFirestore()
//         .collection("messages")
//         .add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
//   });


exports.createUserDoc = auth.user().onCreate((user) => {
    const data = JSON.parse(JSON.stringify(user))
    data.amount = 0
    const paymentId = Math.random().toString(36).substring(2,8)
    data['paymentId'] = paymentId
    getFirestore().collection('user').doc(user.uid).set(data)

    logger.log(user.displayName)
});

exports.createExpertHandler = onDocumentCreated("expert/{expertId}", (event) => {
    getAuth().setCustomUserClaims(event.params.expertId, {"isExpert" : true})   
})

exports.createTransaction = onDocumentCreated("/transaction/{documentId}", (event) => {

    const data = event.data.data();
    logger.log("new transaction created", event.params.documentId, data);
    if (data.status == "adminCreated" || data.status == "pending") {
        const toUid = data.toUid;
        const fromUid = data.fromUid
        if (toUid) {
            getFirestore().collection('user').doc(toUid).update({ 
                amount: FieldValue.increment(data.amount)
            })
        }
        if (fromUid) {
            getFirestore().collection('user').doc(fromUid).update({ 
                amount: FieldValue.increment(-data.amount)
            })
        }
    }
}
);




// exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
//     // Grab the current value of what was written to Firestore.
//     const original = event.data.data().original;
  
//     // Access the parameter `{documentId}` with `event.params`
//     logger.log("Uppercasing", event.params.documentId, original);
  
//     const uppercase = original.toUpperCase();
  
//     // You must return a Promise when performing
//     // asynchronous tasks inside a function
//     // such as writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return event.data.ref.set({uppercase}, {merge: true});
//   });
  
  