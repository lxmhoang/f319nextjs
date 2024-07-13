'use client'

import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { rtDB } from "../lib/firebase/firebase"
import { userRTDBConverter } from "../model/user"
import { arrayFromData, contentOf } from "../lib/utils"
import { UserNoti } from "../model/noti"
import { Button, Divider, Link } from "@nextui-org/react"
import { List } from "flowbite-react"
import { ChevronDownIcon, ChevronUpIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { useAppContext } from "../lib/context"
import { login } from "../lib/client"

export default function QuickIntro() {

  const { user } = useAppContext()

  const [expandRealInfo, setExpendRealInfo] = useState<boolean>(false)
  const [expandPerf, setExpendPerf] = useState<boolean>(false)
  const [expandProfit, setExpendRealProfit] = useState<boolean>(false)

  const RealInfoIcon = expandRealInfo ? ChevronUpIcon : ChevronDownIcon
  const RealPerfIcon = expandPerf ? ChevronUpIcon : ChevronDownIcon
  const RealProfitIcon = expandProfit ? ChevronUpIcon : ChevronDownIcon

  return (
    <>
      <div className="p-4 mt-12 ">
        <div>
          <div className="flex mb-2 max-w-sm justify-between" onClick={() => {
            setExpendRealInfo(!expandRealInfo)
          }} >
            <p className="text-xl max-w-sm mr-5"> Thông tin thật <span className="text-xs">  </span> </p>
            <RealInfoIcon className=" w-6" />
          </div>
          {expandRealInfo && (<>
            <List>
              <List.Item> Tạo khuyến nghị
                <List ordered nested>
                  <List.Item className="text-sm p-2">Giá mua vào sẽ được hệ thống tự cài đặt là giá thị trường của cổ phiếu tại thời điểm tạo, chuyên gia không thể can thiệp
                  </List.Item>
                  <List.Item className="text-sm p-2"> Chuyên gia chỉ có thể chọn mã cổ phiếu, tạo vùng giá chốt lời, cắt lỗ dựa theo giá mua vào nói trên, và deadline nắm giữ cổ phiếu  </List.Item>
                  <List.Item className="text-sm p-2"> Tất cả các nhà đầu tư theo dõi chuyên gia sẽ được thông báo có khuyến nghị mới tạo </List.Item>
                </List>
              </List.Item>
              <List.Item> Theo dõi khuyến nghị
                <List ordered nested>
                  <List.Item className="text-sm p-2">  Hệ thống liên tục theo dõi giá cổ phiếu để xác định khuyến nghị chạm điểm chốt lời / cắt lỗ  dựa theo giá trị từ phiên giao dịch thực, nếu đúng sẽ chốt kết quả khuyến nghị là LỜI / LỖ ngay lập tức và tính vào thành tích chuyên gia, việc này chuyên gia không thể can thiệp
                  </List.Item>
                  <List.Item className="text-sm p-2"> Nếu chưa chạm điểm chốt lời, cắt lỗ, nhưng quá deadline nắm giữ, hệ thống cũng sẽ tự động chốt giá cuối của khuyến nghị dựa theo giá thị trường và tính thành tích cho chuyên gia
                  </List.Item>
                  <List.Item className="text-sm p-2"> Chuyên gia có thể thanh lý khuyến nghị trước deadline, hệ thống cũng sẽ tự động chốt giá cuối theo giá thị trường thực và tính thành tích cho chuyên gia </List.Item>
                  <List.Item className="text-sm p-2"> Tất cả các nhà đầu tư theo dõi chuyên gia sẽ lập tức được thông báo về những điều trên </List.Item>
                </List>
              </List.Item>
            </List>
          </>)
          }
        </div>
        <Divider className="mt-4 mb-4" />

        <div>
          <div className="flex mb-2 w-300 max-w-sm justify-between" onClick={() => {
            setExpendPerf(!expandPerf)
          }} >
            <p className="text-xl mr-20"> Thành tích thật </p>
            <RealPerfIcon className="w-6" />
          </div>
          {
            expandPerf && (<>
              <List className="">
                <List.Item className="text-sm p-2"> Chuyên gia không thể xoá sửa khuyến nghị đang có hoặc thêm khuyến nghị ảo, do đó thành tích đầu tư là thật 100% và không thể reset  </List.Item>
                <List.Item className="text-sm p-2"> Nhà đầu tư theo dõi chuyên gia được cập nhật thông tin khuyến nghị tức thời, do đó thành tích chuyên gia chính là hiệu quả đầu tư nếu làm theo khuyến nghị </List.Item>
                {/* <List.Item> Khuyến nghị được tạo với giá mua là giá trần tức thời, giá chốt là giá sàn  </List.Item> */}
              </List>
            </>)
          }
        </div>
        <Divider className="mt-4 mb-4" />

        <div>
          <div className="flex mb-2 w-300 max-w-sm justify-between" onClick={() => {
            setExpendRealProfit(!expandProfit)
          }}>
            <p className="text-xl mr-20"> Chính sách cùng nhau thành công <span className="text-xs">   </span>  </p>
            <RealProfitIcon className=" w-6" />
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
                      {/* </List> */}
                    </div>
                  </div>

                  {/* 
                  <List ordered nested>
                    <List.Item>Dành cho những người đang xây dựng uy tín, muốn hưởng doanh thu từ kết quả thực chiến thay vì uy tín cá nhân  </List.Item>
                    <List.Item>Thu nhập tuỳ thuộc phong độ   </List.Item>
                    <List.Item>Quỹ thưởng được lấy từ doanh thu của những nhà đầu tư tham gia tài trợ rank,   </List.Item>
                    <List.Item> Các nhà đầu tư taì trợ rank được phép xem và nhận thông báo từ tất cả các chuyên gia rank  </List.Item>
                  </List> */}


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