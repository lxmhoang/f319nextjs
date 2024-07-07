
"use server"
// khong dung firebase client o day vi nhu the request.auth se bi null
import { serverAddNewModal } from './../firebaseadmin/adminfirestore';

import { getUserInfoFromSession } from './../firebaseadmin/adminauth';
import { FeedBack, feedBackAdminConverter } from '@/app/model/feedback';


export async function actionFeedback(prevState: any, formData: FormData) {
    console.log("transaction to be added : ")
    try {
        const rawFormData = Object.fromEntries(formData)
        const content = rawFormData.content as string
        const contact = rawFormData.contact as string

        if (!content) {
            return {
                success: false,
                message: 'hay nhap noi dung feedback'
            }
        }

        if (content.length > 1000  || (contact && contact.length > 1000)) {
            return {
                success: false,
                message: 'nội dung có vẻ quá dài, hãy nhập dưới 1000 ký tự '
            }
        }

        if (content.length < 20) {
            return {
                success: false,
                message: 'nội dung  có vẻ quá ngắn, xin nhập ít nhất 20 ký tự  '
            }
        }


        // must be perform with authed user
        const userInfo = await getUserInfoFromSession()
        if (!userInfo) {
            return {
                message: 'User not found',
                success: false
            };
        }

        const feedBack: FeedBack = {
            content: content,
            dateTime: (new Date()).getTime(),
            contact: contact, 
            uid: userInfo.uid,
            status: 'Submit'
        }

        console.log("transaction to be added : " + JSON.stringify(feedBack))
        await serverAddNewModal('feedBack', feedBack, feedBackAdminConverter)
        return {
            message: "Chan thanh cam on feedback của bạn, đội ngũ admin sẽ xem xét và phản hồi asap",
            success: true,
        }
    } catch (error) {
        return {
            success: false,
            message: JSON.stringify(error)
        }
    }

}