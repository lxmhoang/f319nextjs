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
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
// const {onCreate} = require("firebase-functions/v2/auth");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
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


// exports.createUserDoc = auth.user().onCreate((user) => {
//     const data = JSON.parse(JSON.stringify(user))
    
//     data.amount = 0
//     const accessId = Math.random().toString(36).substring(2,8)
//     data['accessId'] = accessId
//     getFirestore().collection('user').doc(user.uid).set(data)

//     logger.log(user.displayName)
// });

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

// export enum TranType{
//   deposit, withDraw, 
//   registerSoloPerm, registerSoloYearly, followSolo, 
//   registerRankPerm, registerRankYearly, followRank,  
//   upgradeToSoloPerm, upgradeToRankPerm,
//   referReward, // only from registerExpert, registerRank, followRank 
//   rankReward,
//   unknown,
//   newFollower
// }




  exports.updateTransaction = onDocumentUpdated({document: "transaction/{documentId}", region: 'asia-southeast1'}, (event) => {

    const after = event.data.after.data();
    const before = event.data.before.data();
    const type = before.tranType
    logger.log("a transaction updated", event.params.documentId);
    const toUid = after.toUid
    const fromUid = after.fromUid
    if (!(toUid && fromUid)) {

         logger.log("khong co from hoac to UID", after);
        return
    }

    if (type != TranType.withDraw) {
        logger.log("Sth wrong, only update deposit type");
       return
    }
    
    // if (after.status == 'done' && before.status == 'pending') {

        logger.log("update status from pending to done" + event.params.documentId);
        getFirestore().collection('user/' + toUid + '/trans').doc(event.params.documentId).update(after)
        getFirestore().collection('user/' + fromUid + '/trans').doc(event.params.documentId).update(after)
    // }
});

// exports.createTransaction = onDocumentCreated({document: "transaction/{documentId}", region: 'asia-southeast1'}, async (event) => {

//         const data = event.data.data();
//         logger.log("new transaction created", event.params.documentId, data);
//         const toUid = data.toUid
//         if (toUid) {
//             await getFirestore().collection('user').doc(toUid).update({ 
//                 amount: FieldValue.increment(data.amount)
//             })
//             await getFirestore().collection('user/' + toUid + '/trans').doc(event.params.documentId).set(data)
//         }
//         const fromUid = data.fromUid
//         if (fromUid) {
//             await getFirestore().collection('user').doc(fromUid).update({ 
//                 amount: FieldValue.increment(-data.amount)
//             })
//             await getFirestore().collection('user/' + fromUid + '/trans').doc(event.params.documentId).set(data)
//         }

//     if (data.tranType in [
//         TranType.followRank,
//         TranType.followSolo,
//         TranType.registerSoloYearly,
//         TranType.upgradeToSoloPerm,
//         TranType.registerSoloPerm,
        
//         TranType.registerRankYearly,
//         TranType.upgradeToRankPerm,
//         TranType.registerRankPerm,
//         ]) 
//     {
//         const ratio = data.tranType == TranType.followSolo ? 0.1 : 0.2

//         logger.log("chia tien trans type " + data.tranType + ' amount : '  + data.amount);
//         const benefitUid = data.toUid
//         const paidUid = data.fromUid;
//         if (paidUid) {
//             const userRef = getFirestore().collection('user').doc(paidUid)
//             const snapshotUser = await userRef.get()//.then((snapshotUser) => {
//             const refID = snapshotUser.data().refID
//             const displayName = snapshotUser.data().displayName
//             logger.info("Ref ID : " + refID)
            
//             if (refID) {
//                 // chia tien cho ref
//                 const snapshot = await getFirestore().collection('user').where("accessId","==",refID).get()//.then((snapshot) => {
//                 if (snapshot.docs.length == 1) {

//                     const refUserDocID = snapshot.docs[0].id
//                     logger.info("Ref user ID : " + refUserDocID)
//                     const amountForReference = data.amount * ratio

//                     const detail = 'Do ' + displayName + '  ' + tranTypeText(data.tranType)

//                     await getFirestore().collection('transaction').add({
//                         amount: amountForReference,
//                         from: benefitUid,
//                         date: new Date(),
//                         toUid: refUserDocID,
//                         status: "Done",
//                         tranType: TranType.referReward,
//                         triggerTranId: event.params.documentId,
//                         triggerTranType: data.tranType,
//                         notebankacc: detail
//                         }
//                     )

//                     }  else  if (snapshot.docs.length > 1) {

//                         logger.error("result of search is > 1 " + snapshot.docs.length)
//                     } else {
//                         logger.info(' not found ref user with accessID ' + refID)
//                     }
//                     // })
    
//                 }
//         //     }
//         // )
           
           
//         }
//     }
   
    
// }
// );


// exports.createSubscription = onDocumentCreated({ document: "subscription/{documentId}", region: 'asia-southeast1'}, async (event) => {

//     const toDay = new Date()

//     const monthlaterDate = toDay()
//     monthlaterDate.setMonth(toDay.getMonth() + 1)

//     const data = event.data.data();
//     const uid = data.uid
//     const eid = data.eid
//     const perm = data.perm
//     const type = data.type
//     const value = data.value
    
//     const date = data.perm ? new Date('2050-01-01') : monthlaterDate

//     event.data.ref.update({"endDate":date}).then(() => {

//         const subInfo = {
//             eid: eid,
//             uid: uid,
//             perm: perm,
//             startDate: toDay,
//             endDate: date,
//             value: value,
//             subDocID: event.data.id,
//             type: type
//         }
//         console.log('Update sub enddate succeeded! Will add subInfo to user , expert with data' + JSON.stringify(subInfo));

//         getFirestore().doc('user/' + uid).update({
//             following: FieldValue.arrayUnion(subInfo)
//         })
//         getFirestore().doc('user/' + uid + '/subHistory/' + event.data.id).set(subInfo)

//         // notify user
//         if (type == 'rank') {
//             const notiForUser = {
//                 dateTime : toDay.getTime(),
//                 title: 'Đã tham gia tài trợ rank',
//                 content: 'Giờ đây quý nhà đầu tư đã có thể theo dõi toàn bộ chuyên gia đua rank',
//                 urlPath: '/expert'
//             }
//             getFirestore().doc('user/' + uid).update({ 
//                 notifies: FieldValue.arrayUnion(notiForUser)
//             })
//             getFirestore().collection('user/' + uid + '/notiHistory').add(notiForUser)
            
//         } else if (type == 'solo') {
//             getFirestore().doc('expert/' + eid + '/subHistory/' + event.data.id).set(subInfo)
//             getFirestore().doc('expert/' + eid).update({ 
//                 follower: FieldValue.arrayUnion(subInfo)
//             })
//             const notiForExpert = {
//                 dateTime : (new Date()).getTime(),
//                 title: 'Follower mới',
//                 content: 'Xin chúc mừng, 1 nhà đầu tư vừa mới theo dõi bạn'
//             }
//             getFirestore().doc('user/' + eid).update({ 
//                 notifies: FieldValue.arrayUnion(notiForExpert)
//             })
//         }    
//     });
// });
