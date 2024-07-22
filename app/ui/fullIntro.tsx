'use client'

import { useState } from "react"
import { Divider, Link } from "@nextui-org/react"
import { List } from "flowbite-react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { useAppContext } from "../lib/context"
import { login } from "../lib/client"
import { explainExpert, explainInvestor } from "./tnc/explain"

export default function FullIntro() {

  const { user } = useAppContext()

  const [expandInvestorInfo, setExpandInvestorInfo] = useState<boolean>(false)
  const [expandAdvisorInfo, setExpandAdvisorInfo] = useState<boolean>(false)
  const [expandProfit, setExpandProfit] = useState<boolean>(false)

  const InvestorIcon = expandInvestorInfo ? ChevronUpIcon : ChevronDownIcon
  const AdvisorIcon = expandAdvisorInfo ? ChevronUpIcon : ChevronDownIcon
  const ProfitIcon = expandProfit ? ChevronUpIcon : ChevronDownIcon

  return (
    <>
        <p>F319.NET kết nối nhà đầu tư với chuyên gia với mục đích <span className="dark:text-cyan-500 text-violet-600 text-lg md:text-2xl"> cùng nhau thành công </span></p>
      <div className="p-4 mt-3 md:mt-6 ">
        <div>
          <div className="flex mb-2 max-w-sm justify-between" onClick={() => {
            setExpandInvestorInfo(!expandInvestorInfo)
          }} >
            <p className="text-xl max-w-sm mr-5"> Nhà đầu tư  <span className="text-xs">  </span> </p>
            <InvestorIcon className=" w-6" />
          </div>
          {expandInvestorInfo && explainInvestor(true)
          }
        </div>
        <Divider className="mt-4 mb-4" />

        <div>
          <div className="flex mb-2 w-300 max-w-sm justify-between" onClick={() => {
            setExpandAdvisorInfo(!expandAdvisorInfo)
          }} >
            <p className="text-xl mr-20"> Chuyên gia </p>
            <AdvisorIcon className="w-6" />
          </div>
          {
            expandAdvisorInfo && explainExpert()
          }
        </div>
        <Divider className="mt-4 mb-4" />

        <div>
          <div className="flex mb-2 w-300 max-w-sm justify-between" onClick={() => {
            setExpandProfit(!expandProfit)
          }}>
            <p className="text-xl mr-20"> Chính sách cùng nhau thành công <span className="text-xs">   </span>  </p>
            <ProfitIcon className=" w-6" />
          </div>
          {
            expandProfit && (<>
              <List className="">

                {/* <List.Item className="mb-6 mt-6">
                <span className="text-cyan-400  font-bold">Nhà đầu tư </span>  biết chính xác thành tích thật của từng chuyên gia và có hiệu quả đầu tư tương đương nếu đầu tư theo khuyến nghị. Các khuyến nghị đã kết thúc được xem miễn phí 
                </List.Item> */}
                <List.Item className="mt-6"> <span className="text-purple-500 dark:text-cyan-400  font-bold">Chuyên gia solo </span> hưởng doanh thu khi có nhà đầu tư mua các gói theo dõi mình (trọn đời hoặc theo tháng )

                  <List className="mb-6" ordered nested>
                    <List.Item>Dành cho những người muốn xây dựng uy tín cá nhân, có khả năng thu hút nhiều người theo dõi mình </List.Item>
                    <List.Item>Thu nhập ổn định dài hạn </List.Item>
                    <List.Item>Chuyên gia hưởng 80% doanh thu, còn lại là 10% cho người giới thiệu chuyên gia đến với website, admin hưởng 10% </List.Item>
                    <List.Item > VD chuyên gia ra giá gói theo tháng là 4 triệu và thu hút được 50 người theo dõi thì mỗi tháng chuyên gia sẽ hưởng 160 triệu / tháng. người giới thiệu hưởng 20 triệu  </List.Item>
                  </List>


                </List.Item>

                <List.Item className=""> <span className="text-purple-500 dark:text-cyan-400  font-bold">Chuyên gia rank</span> hưởng doanh thu khi đạt top performance theo Tuần, Tháng, Quý, Năm

                  <List className="mb-6" ordered nested>
                    <List.Item>Dành cho những người đang xây dựng uy tín, muốn hưởng doanh thu từ kết quả thực chiến thay vì uy tín cá nhân  </List.Item>
                    <List.Item>Thu nhập tuỳ thuộc phong độ   </List.Item>
                    <List.Item>Quỹ thưởng được lấy từ doanh thu của những nhà đầu tư tham gia tài trợ rank,   </List.Item>
                    <List.Item> Các nhà đầu tư taì trợ rank được phép xem và nhận thông báo từ tất cả các chuyên gia rank  </List.Item>

                  </List>


                </List.Item>

                <List.Item className=""> <span className="text-purple-500 dark:text-cyan-400  font-bold">Người giới thiệu</span> nhận được thu nhập mỗi khi người mà bạn giới thiệu có các hoạt động dưới đây


                  <div className="p-6 flex gap-8 text-sm">
                    <div className="">
                      {/* <List> */}
                      <p className="mb-4"> Hoạt động   </p>
                      <List.Item>Trở thành chuyên gia solo hoặc rank  </List.Item>
                      <Divider className="mb-1 mt-1" />
                      <List.Item>Nâng cấp hoặc gia hạn tài khoản chuyên gia </List.Item>
                      <Divider className="mb-1 mt-1" />
                      <List.Item>Là chuyên gia solo và được theo dõi </List.Item>
                      <Divider className="mb-1 mt-1" />
                      <List.Item>Là nhà đầu tư và tài trợ rank  </List.Item>
                      {/* </List> */}
                    </div>
                    <div>
                      <p className="mb-4">Được chia</p>
                      {/* <List> */}
                      <p>20% gói đăng ký chuyên gia  </p>
                      <Divider className="mb-1 mt-1" />
                      <p>20% gói nâng cấp/gia hạn</p>
                      <Divider className="mb-1 mt-1" />
                      <p>10% gói theo dõi chuyên gia solo  </p>
                      <Divider className="mb-1 mt-1" />
                      <p>20% gói theo dõi chuyên gia rank</p>
                    </div>
                  </div>

                </List.Item>
                <List.Item>Có thể giới thiệu và hưởng doanh thu không giới hạn số người, chỉ bằng cách gửi link affiliate liên kết với tài khoản được tạo ở {user ? <Link href="/profile"> đây</Link> : <Link onClick={() => { 
                    login()
                  }}> đăng nhập để xem </Link>}   </List.Item>
              </List>
            </>)
          }
        </div>
        <Divider className="mt-4" />




      </div >
    </>
  )
}