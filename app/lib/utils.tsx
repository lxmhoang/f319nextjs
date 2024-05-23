import { Expert, User } from "./definitions";

export function convert(num: number) {
  let formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num)
}

export function addComma(num: number) {

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function didFollow(user: User, expert: Expert) {

  if (!user || !user.following) {
    return false
  }

  const followInfo = user.following.find((item) => item.eid == expert.id)
  console.log('follow Info ' + JSON.stringify(followInfo))
  if (!followInfo) {
    return false
  }
  const today = new Date()
  const endDate = followInfo.endDate 
  return (followInfo.perm == true || followInfo.endDate >= new Date())

  // return user && user.following && Object.keys(user.following).includes(expert.id) && ( user.following[expert.id].perm == true ||  user.following[expert.id].endDate >= new Date())


}