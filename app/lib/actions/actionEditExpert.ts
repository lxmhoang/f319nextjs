'use server'
'server only'
import { z } from 'zod';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getthuquyUID, setClaim } from '@/app/lib/firebaseadmin/adminauth';
import { TranType, Transaction } from '@/app/model/transaction';
import { storage } from '../firebase/firebase';
import { revalidatePath } from 'next/cache';
import { addComma } from '../utils';
import { Expert, ExpertStatus } from '@/app/model/expert';
import { UserNoti } from '@/app/model/noti';
import { getUserDBInfo, sendNotificationToBoard, sendNotificationToUser, serverAddANewTransaction, serverInsertNewExpert, serverUpdateExpertInfo, serverUpdateUserInfo } from '../server';


const ExpertFormSchema = z.object({
    // name: z.string({
    //   invalid_type_error: 'wrong type of name field'
    // }),
    monthlyPrice: z.number(),
    permPrice: z.number(),
    // shortIntro: z.string({
    //   invalid_type_error: 'Chọn 1 cái shortIntro'
    // }),
})

const RegisterExpert = ExpertFormSchema;

export type RegisterExpertFormState = {
    errors?: {
        name?: string[]
        monthlyPrice?: string[]
        permPrice?: string[]
        shortIntro?: string[]
        generic?: string[]
        avatar?: string[]
    };
    message?: string | null;
    justDone?: boolean
};

export async function editExpert(fileWrapper: FormData | undefined, currentAvatarURL: string | null | undefined, createNewExpert: boolean, _prevState: RegisterExpertFormState, formData: FormData) {

    console.log('******************************************************')
    console.log('previous state ' + JSON.stringify(_prevState))
    const userData = await getUserDBInfo()
    if (!userData) {
        return {
            errors: {
            },
            message: 'Không tìm thấy user',
            justDone: false
        };
    }
    if (!fileWrapper && !currentAvatarURL) {
        return {
            errors: {
                avatar: ["Không tìm thấy file upload và avatar hiện tại"],
            },
            message: 'Không tìm thấy file upload và avatar hiện tại' + JSON.stringify(formData),
            justDone: false
        };

    }

    console.log("uid for expert register : " + userData.uid)
    const uid = userData.uid
    const newName = formData.get('name')
    const expertType = formData.get('expertType')
    const expertPeriod = formData.get('expertPeriod')
    const newshortIntro = formData.get('shortIntro')
    const phoneNumber = Number(formData.get('phoneNumber'))
    const newmonthlyPrice = Number(formData.get('monthlyPrice'))
    const newPermPrice = Number(formData.get('permPrice'))

    console.log(' ================ editExpert formData ' + uid + newName  + phoneNumber + expertType + expertPeriod + newshortIntro + newmonthlyPrice + newPermPrice)
    // return {
    //     errors: {
    //         'expertType': 'chưa chọn loại tài khoản chuyên gia'
    //     },
    //     message: "chưa chọn loại tài khoản chuyên gia",
    //     justDone: false
    // };

    const validatedFields = RegisterExpert.safeParse({
        name: formData.get('name'),
        shortIntro: formData.get('shortIntro'),
        monthlyPrice: Number(formData.get('monthlyPrice')),
        permPrice: Number(formData.get('permPrice')),
        // subscriptionPrice: formData.get('subscriptionPrice'),
        // avatar: formData.get('avatar'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error validating",
            justDone: false
        };
    }
    
    // permType
    // if (newName != curExpert.name || newshortIntro != curExpert.shortIntro || newmonthlyPrice != curExpert.monthPerform || newPermPrice || curExpert.permPrice) {
    if (createNewExpert) {
        if (!(expertType && (expertType == 'solo' || expertType == 'rank') && expertPeriod && (expertPeriod == 'perm' || expertPeriod == 'yearly'))) {
            return {
                errors: {
                    'expertType': 'chưa chọn loại tài khoản chuyên gia'
                },
                message: "chưa chọn loại tài khoản chuyên gia",
                justDone: false
            };
        }
        let fee = expertType == "rank" ? expertPeriod == "perm" ?
            Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_PERM) :
            Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_YEAR)
            : expertPeriod == "perm" ?
                Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_PERM) :
                Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_YEAR)

        console.log('expert Type to register ' + expertType + " and fee " + fee)
        if (!(userData && userData.amount >= fee)) {
            return {
                errors: {
                    // generic: ["khong du tien"]
                },
                message: 'khong du tien, so tien cua ban chi co ' + userData?.amount + ' trong khi phi  dang ky la ' + fee,
                justDone: false
            };
            // ok
        }
        const thuquyuid = await getthuquyUID()

        if (!thuquyuid) {
            return {
                errors: {},
                message: 'Thu quy not found',
                justDone: false
            };
        }

        const tranType: TranType = expertType == "rank" ? expertPeriod == "perm" ?
            TranType.registerRankPerm :
            TranType.registerRankYearly
            : expertPeriod == "perm" ?
                TranType.registerSoloPerm :
                TranType.registerSoloYearly


        const tran: Transaction = {
            tranType: tranType,
            toUid: thuquyuid,
            fromUid: userData.uid,
            amount: fee,
            date: Date.now(),
            notebankacc: "",
            status: "Done"
        }

        await serverAddANewTransaction(tran)

        const yearlate = new Date()
        yearlate.setFullYear(yearlate.getFullYear() + 1)

        const manyyearlater = new Date('2050-01-01')
        const expertExpire = expertPeriod == 'perm' ? manyyearlater.getTime() : yearlate.getTime()
        

        await setClaim(uid, { expertType: expertType, expertExpire: expertExpire, expertPeriod: expertPeriod }) // set claim tren auth
        
        // await setExpert(uid, expertType,expertExpire )
        await serverUpdateUserInfo(uid, {
            expertType: expertType,
            expertExpire: expertExpire,
            expertPeriod: expertPeriod
        })
        if (expertType == 'solo') {
            const expert: Expert = {
                id: '',
                name: newName as string,
                shortIntro: newshortIntro as string,
                phoneNumber: phoneNumber.toString(),
                monthlyPrice: newmonthlyPrice,
                permPrice: newPermPrice,

                follower: [],
                expertPeriod: expertPeriod,
                expertType: expertType,
                expertExpire: expertExpire,
                joinDate: Date.now(),       
                status: ExpertStatus.activated,
                visible: true,
                imageURL: '',
                isExpired: false
            }
            await serverInsertNewExpert(expert, uid)
        } else {
            const expert: Expert = {
                id: '',
                name: newName as string,
                shortIntro: newshortIntro as string,
                phoneNumber: phoneNumber.toString(),

                follower: [],
                expertPeriod: expertPeriod,
                expertType: expertType,
                expertExpire: expertExpire,
                joinDate: Date.now(),
                status: ExpertStatus.activated,
                visible: true,
                imageURL: '',
                isExpired: false
            }
            await serverInsertNewExpert(expert, uid)
        }

        const boardNoti: UserNoti = {
            title: '',
            dateTime: (new Date()).getTime(),
            content: 'Chúc mừng mừng ' + newName + ' đã trở thành chuyên gia ' + expertType,
            urlPath: '/expert/details/' + uid
        }

        await sendNotificationToBoard(boardNoti)


        const noti: UserNoti = {
            title: '',
            dateTime: (new Date()).getTime(),
            content: 'Chúc mừng mừng bạn đã trở thành chuyên gia ',
            urlPath: '/advisor'
        }

        await sendNotificationToUser(uid, noti)
        

        // revalidatePath('/advisor/register')



    } else {
        // edit expert
        if (!userData.isExpert ) {
            // conflict data
            return {
                errors: {},
                message: 'Data sai, bạn đang không phải chuyên gia nên không thể edit thông tin ',
                justDone: false
            };
        }

        if (expertType) {
            return {
                errors: {},
                message: 'Data sai, bạn không thể đổi loại chuyên gia sang ' + expertType,
                justDone: false
            };

        }

        //  did update expert period
        if (expertPeriod) {
            if ((expertPeriod != 'perm')) {
                return {
                    errors: {},
                    message: 'expert Period is perm already or submiting period which is not perm  : ' + expertPeriod,
                    justDone: false
                };
            } 

            const fee = userData.expertType == 'solo' ? Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_PERM) - Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_YEAR) : Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_PERM) - Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_YEAR)



            console.log('expert Type to register ' + expertType + " and fee " + fee)
            if (!userData) {
                return {
                    errors: {
                        // generic: ["khong du tien"]
                    },
                    message: 'khong tim thay user record',
                    justDone: false
                };

            }
            if ((userData && userData.amount < fee)) {
                return {
                    errors: {
                        // generic: ["khong du tien"]
                    },
                    message: 'khong du tien, so tien cua ban chi co ' + addComma(userData.amount) + ' trong khi phi  dang ky la ' + addComma(fee),
                    justDone: false
                };
                // ok
            }

            const thuquyuid = await getthuquyUID()

            if (!thuquyuid) {
                return {
                    errors: {},
                    message: 'Không tìm thấy thủ quỹ ',
                    justDone: false
                };
            }

            const tranType: TranType = userData.expertType == 'rank' ? TranType.upgradeToRankPerm : TranType.upgradeToSoloPerm

            const tran: Transaction = {
                tranType: tranType,
                toUid: thuquyuid,
                fromUid: userData.uid,
                amount: fee,
                date: Date.now(),
                notebankacc: "",
                status: "Done"
            }

            await serverAddANewTransaction(tran)

            // const manyyearlater = new Date()
            // manyyearlater.setFullYear(manyyearlater.getFullYear() + 20)
            const manyyearlater = new Date('2050-01-01')
            const expertExpire = manyyearlater.getTime()

            await setClaim(uid, { expertType: userData.expertType, expertExpire: expertExpire, expertPeriod: expertPeriod }) // set claim tren 

            await serverUpdateUserInfo(uid, {
                expertExpire: expertExpire,
                expertPeriod: expertPeriod
            })
            const data = newName ? {
                name: newName,
                monthlyPrice: newmonthlyPrice,
                permPrice: newPermPrice,
                expertPeriod: expertPeriod,
                expertExpire: expertExpire
            } : 
            {
                monthlyPrice: newmonthlyPrice,
                permPrice: newPermPrice,
                expertPeriod: expertPeriod,
                expertExpire: expertExpire
            }
            await serverUpdateExpertInfo(uid, data)
        } else {


            const data = newName ? {
                name: newName,
                monthlyPrice: newmonthlyPrice,
                permPrice: newPermPrice
            } : 
            {
                monthlyPrice: newmonthlyPrice,
                permPrice: newPermPrice,
            }
            await serverUpdateExpertInfo(uid, data)
            
        }
    }


    if (fileWrapper) {

        const attached = fileWrapper.get('avatar') as File

        console.log('attached info ===================== type ' + attached.type + '   size   ' + attached.size)

        // console.log('aaaa has file ===================== type ' + attached.type + '   size   ' + attached.size)
        const storageRef = ref(storage, '/expertAvatar/' + uid)
        const snapshot = await uploadBytes(storageRef, attached)
        console.log('Uploaded a blob or file! with ref : ' + snapshot.ref.toString() + " pah " +
            snapshot.ref.fullPath);
        const imageURL = await getDownloadURL(snapshot.ref)

        await serverUpdateExpertInfo(uid, { imageURL: imageURL })

        console.log("successful update avatar ref to expert data " + imageURL)

        // revalidatePath('/advisor/edit');
        // revalidatePath('/(withDrawer)/advisor');

        // createNewExpert ? revalidatePath('/advisor/register') : revalidatePath('/advisor/edit')

        revalidatePath('/expert')
        return {
            errors: {},
            message: "Thành công đăng ký chuyên gia",
            justDone: true
        };
    } else if (createNewExpert) {
        if (currentAvatarURL) {
            await serverUpdateExpertInfo(uid, { imageURL: currentAvatarURL })
            console.log('revalidatePathrevalidatePathrevalidatePathrevalidatePathrevalidatePath')
            revalidatePath('/expert')
            // revalidatePath('/advisor')
            return {
                errors: {},
                message: "Done",
                justDone: true
            };
        } else {
            return {
                errors: {
                    avatar: [" Tao user moi nhung Không tìm thấy file upload và avatar hiện tại"],
                },
                message: 'Tao user moi nhung không tìm thấy file upload và avatar hiện tại',
                justDone: false
            };
        }


    } else {
        // console.log('aaaa NO file =====================')
        console.log('done, no upload file')
        // revalidatePath('/advisor/edit');
        // revalidatePath('/advisor');

        // revalidatePath('/advisor')

        revalidatePath('/expert')
        return {
            errors: {},
            message: "Thành công đăng ký chuyên gia",
            justDone: true
        };
    }


}