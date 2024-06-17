/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {auth}  = require('firebase-functions');

const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
// const {onCreate} = require("firebase-functions/v2/auth");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { getAuth } = require('firebase-admin/auth');

// The es6-promise-pool to limit the concurrency of promises.
// Maximum concurrent account deletions.
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
    const accessId = Math.random().toString(36).substring(2,8)
    data['accessId'] = accessId
    getFirestore().collection('user').doc(user.uid).set(data)

    logger.log(user.displayName)
});

// exports.modifyExpertHandler = onDocumentWritten({document: "/expert/{expertId}", region: 'asia-southeast1'}, (event) => {
//     const expireTimeBefore = event.data.before.data().expertExpire
//     const expireTimeAfter = event.data.after.data().expertExpire
//     const expertType = event.data.after.data().expertType

//     logger.log('expireTimeBefore ' + expireTimeBefore +' expireTimeAfter '+ expireTimeAfter)
//     // getFirestore().doc('/user/' + event.params.expertId).update({isExpert: true})
//     if (true) {
//         getFirestore().doc('/user/' + event.params.expertId).update({expertExpire: expireTimeAfter, expertType: expertType})
//         getAuth().setCustomUserClaims(event.params.expertId, {expertExpire: expireTimeAfter, expertType: expertType})
//     }
// });


// exports.deleteExpertHandler = onDocumentDeleted({document: "expert/{expertId}", region: 'asia-southeast1'}, (event) => {
//     getFirestore().doc('/user/' + event.params.expertId).update({isExpert: false})
//     getAuth().setCustomUserClaims(event.params.expertId, {isExpert: false})
// });


const TranType = {
    deposit: 0, 
    withDraw: 1, 
    registerSoloPerm: 2, 
    registerSoloYearly: 3, 
    followSolo: 4, 
    registerRankPerm: 5, 
    registerRankYearly: 6, 
    followRank: 7,  
    upgradeToSoloPerm: 8, 
    upgradeToRankPerm: 9,
    referReward: 10, // only from registerExpert, registerRank, followRank 
    rankReward: 11,
    unknown: 12
  }

  exports.updateTransaction = onDocumentUpdated({document: "transaction/{documentId}", region: 'asia-southeast1'}, (event) => {

    const after = event.data.after.data();
    const before = event.data.before.data();
    logger.log("a transaction updated", event.params.documentId);
    const toUid = after.toUid
    const fromUid = after.fromUid
    if (!(toUid && fromUid)) {

         logger.log("khong co from hoac to UID", after);
        return
    }
    
    if (after.status == 'done' && before.status == 'pending') {

        logger.log("update status from pending to done" + event.params.documentId);
        getFirestore().collection('user/' + toUid + '/trans').doc(event.params.documentId).update({ 
            status: after.status
        })
        getFirestore().collection('user/' + fromUid + '/trans').doc(event.params.documentId).update({ 
            status: after.status
        })
    }
});

exports.createTransaction = onDocumentCreated({document: "transaction/{documentId}", region: 'asia-southeast1'}, (event) => {

        const data = event.data.data();
        logger.log("new transaction created", event.params.documentId, data);
        const toUid = data.toUid
        if (toUid) {
            getFirestore().collection('user').doc(toUid).update({ 
                amount: FieldValue.increment(data.amount)
            })
            getFirestore().collection('user/' + toUid + '/trans').doc(event.params.documentId).set(data)
        }
        const fromUid = data.fromUid
        if (fromUid) {
            getFirestore().collection('user').doc(fromUid).update({ 
                amount: FieldValue.increment(-data.amount)
            })
            getFirestore().collection('user/' + fromUid + '/trans').doc(event.params.documentId).set(data)
        }

    if (data.tranType in [
        TranType.followRank,
        TranType.followSolo,
        TranType.registerRankPerm,
        TranType.registerRankYearly,
        TranType.registerSoloPerm,
        TranType.registerSoloYearly,
        TranType.upgradeToRankPerm,
        TranType.upgradeToSoloPerm
        ]) 
    {
        logger.log("revenue trans type " + data.tranType + ' amount : '  + data.amount);
        const toUid = data.toUid;
        if (toUid) {
            const userRef = getFirestore().collection('user').doc(toUid)
            userRef.get().then((snapshotUser) => {
                const refID = snapshotUser.data().refID
                logger.info("Ref ID : " + refID)
                if (refID) {
                    // chia tien cho ref
                    getFirestore().collection('user').where("accessId","==",refID).get().then((snapshot) => {
                        if (snapshot.docs.length == 1) {

                        const refUserDocID = snapshot.docs[0].id
                        logger.info("Ref user ID : " + refUserDocID)
                        const amountForReference = data.amount * 0.2
                        getFirestore().collection('transaction').add({
                            amount: amountForReference,
                            date: Date.now(),
                            toUid: refUserDocID,
                            status: "Done",
                            tranType: TranType.referReward,
                            fromTranId: event.params.documentId
                        })

                        }  else {

                            logger.error("result of search is not 1 " + snapshot.docs.length)
                        }
                    })
    
                }
            })
           
           
        }
    }
   
    
}
);

// exports.followerNum = onSchedule("25 * * * *", async () => {

//     logger.info("begin to set number of follower")
//     const expertsSnapshot = await getFirestore().collection('expert').get()
//     const toDay = new Date()
//     const expertIDs = expertsSnapshot.docs.map(doc => doc.id)
//     const subSnapshot = await getFirestore().collection('subscription').where('endDate','>=', toDay).get()
//     const subs = subSnapshot.docs.map((doc) => { 
//         return {
//         uid: doc.data().uid,
//         eid: doc.data().eid
//         }
//     })

//     const result = expertIDs.map ((id) => {
//         return {
//             id : id,
//             num: subs.filter((sub) => { 
//                 return sub.eid == id
//             }
//             ).length
//         }
//     })

//     logger.info("result to update " + JSON.stringify(result))

//     try {
//         for (const e of result) {
//             logger.info("--- aaaa"+JSON.stringify(e))
//             await getFirestore().collection('expert').doc(e.id).update({followerNum:e.num})
//         }
//     } catch (err) {
//         throw err
//     }
//   });



exports.createSubscription = onDocumentCreated({ document: "subscription/{documentId}", region: 'asia-southeast1'}, (event) => {

    const data = event.data.data();
    const date = new Date()
    const uid = data.uid
    const eid = data.eid
    const perm = data.perm

    date.setMonth(date.getMonth() + data.perm ? 1000 : 1)
    event.data.ref.update({"endDate":date}).then(() => {
        console.log('Write succeeded! with uid' + uid + "  eid " + eid);

        const subInfo = {
            eid: eid,
            uid: uid,
            perm: perm,
            endDate: date,
            subcriptionDocId: event.data.id
        }
        // const fieldPath = new FieldPath(['following', eid.toString()])
        // const str = 'following.'+eid
        // getFirestore().collection('user').doc(uid).update(str, subInfo)
        getFirestore().doc('user/' + uid).update({
            following: FieldValue.arrayUnion(subInfo)
        })
        getFirestore().doc('expert/' + eid).update({ 
            follower: FieldValue.arrayUnion(subInfo)
        })
        getFirestore().collection('expert/' + eid + '/follower').add(subInfo)

    });
});


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
  
