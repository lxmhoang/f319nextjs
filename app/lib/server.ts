import { Expert, expertAdminConverter } from "../model/expert";
import { serverGetModal } from "./firebaseadmin/adminfirestore";

export async function getExpert(eid: string) {
    return await serverGetModal<Expert>('expert/' + eid, expertAdminConverter)
}

export async function getBestExpertsByMonth() {

}