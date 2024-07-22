import { List } from "flowbite-react"

export const tncFull = (
    <div>


    </div>
)

export function fullGuide() {
    return (
        <>

        </>
    )

}

export function explainInvestor(nested: boolean) {
    return (
        <div>
            <p className=" mt-6 ml-8">Mỗi tài khoản người dùng có thể trở thành nhà đâu tư bằng việc theo dõi chuyên gia solo hoặc tham gia tài trợ rank, hoặc cả 2 </p>
            <List nested={nested} className="mb-3" >

                <List.Item className="mt-6"> <span className="text-purple-500 dark:text-cyan-400  font-bold"> Theo dõi chuyên gia solo </span>

                    <List className="mb-6" ordered nested>
                        <List.Item> Mua các gói theo dõi theo tháng hoặc vĩnh viễn của từng chuyên gia muốn theo dõi </List.Item>
                        <List.Item> Trong thời gian theo dõi chuyên gia, được tự động nhận thông báo mỗi khi

                            <List className="" nested>
                                <List.Item> Chuyên gia tạo khuyến nghị mới</List.Item>
                                <List.Item> Chuyên gia thanh lý khuyến nghị</List.Item>
                                <List.Item> Khuyến nghị kết thúc tự động khi đến deadline hoặc chạm ngưỡng cutloss / chốt lãi </List.Item>
                            </List>

                        </List.Item>
                        <List.Item> Được xem tất cả các khuyến nghị đang tiếp diễn của chuyên gia  </List.Item>
                    </List>


                </List.Item>

                <List.Item className=""> <span className="text-purple-500 dark:text-cyan-400  font-bold">Tài trợ rank</span>

                    <List className="mb-6" ordered nested>
                        <List.Item> Tham gia tài trợ rank bằng cách mua gói tài trợ rank, để góp vào quỹ trả thưởng cho các chuyên gia rank có top performance theo từng tuần / tháng / quý / năm </List.Item>
                        <List.Item> Được theo dõi <span className="dark:text-cyan-500 text-violet-600">tất cả </span> các chuyên gia rank</List.Item>

                        <List.Item> Trong thời gian tài trợ rank, được tự động nhận thông báo mỗi khi

                            <List className="" nested>
                                <List.Item> Bất kỳ một chuyên gia rank tạo khuyến nghị mới</List.Item>
                                <List.Item> Bất kỳ một chuyên gia rank thanh lý khuyến nghị</List.Item>
                                <List.Item> Bất kỳ khuyến nghị tạo bởi chuyên gia rank kết thúc tự động khi đến deadline hoặc chạm ngưỡng cutloss / chốt lãi </List.Item>
                            </List>

                        </List.Item>

                    </List>


                </List.Item>

            </List>
        </div>
    )

}


export function tncExpertType(nested: boolean) {
    return (
        <div>
            <p className="font-normal mt-6 ml-8">Mỗi tài khoản người dùng được đăng ký 1 trong 2 loại chuyên gia là solo hoặc rank. Sau khi chọn rồi sẽ không thể thay đổi, tuy nhiên nếu muốn tham gia tư vấn dưới tư cách loại chuyên gia còn lại thì bạn chỉ cần tạo tài khoản người dùng mới và đăng ký loại chuyên gia đó</p>
            <List nested={nested} className="mb-3" >

                <List.Item className="mt-6"> <span className="text-purple-500 dark:text-cyan-400  font-bold">Chuyên gia solo </span>

                    <List className="mb-6" ordered nested>
                        <List.Item>Ra giá các gói theo dõi riêng và nhận thu nhập khi nhà đầu tư mua các gói theo dõi </List.Item>
                        <List.Item>Dành cho những chuyên gia theo hướng xây dựng uy tín cá nhân, có khả năng thu hút nhiều người theo dõi </List.Item>
                        <List.Item>Thu nhập ổn định dài hạn </List.Item>
                        <List.Item>Chuyên gia hưởng 80% doanh thu từ người theo dõi, còn lại là 10% cho người giới thiệu chuyên gia đến với website, admin hưởng 10% </List.Item>
                        <List.Item > VD chuyên gia ra giá gói theo tháng là 4 triệu và thu hút được 50 người theo dõi thì mỗi tháng chuyên gia sẽ hưởng 160 triệu / tháng. người giới thiệu hưởng 20 triệu  </List.Item>
                    </List>


                </List.Item>

                <List.Item className=""> <span className="text-purple-500 dark:text-cyan-400  font-bold">Chuyên gia rank</span>

                    <List className="mb-6" ordered nested>
                        <List.Item> Được gia nhập nhóm các chuyên gia đua rank, đồng thời được theo dõi bởi tất cả các nhà đầu tư mua gói tài trợ rank</List.Item>
                        <List.Item>  Hưởng doanh thu khi đạt top performance theo Tuần, Tháng, Quý, Năm, quỹ thưởng này chỉ dành cho chuyên gia rank </List.Item>
                        <List.Item>Dành cho những người đang xây dựng uy tín, muốn nhanh chóng hưởng doanh thu từ kết quả thực chiến  </List.Item>
                        <List.Item>Thu nhập tuỳ thuộc phong độ   </List.Item>
                        <List.Item>Quỹ thưởng được lấy từ doanh thu của những nhà đầu tư tham gia tài trợ rank,   </List.Item>
                        <List.Item>Mỗi khi có người dùng mua gói tài trợ rank thì tiền sau chiết khấu sẽ chia cho quỹ tuần, tháng, quý, năm (mỗi quỹ 1/4) và chia đều về các mốc trả thưởng nằm trong thời gian tài trợ, tiền từ gói tài trợ rank vĩnh viễn được chia cho các mốc trong 3 năm </List.Item>
                        <List.Item> Các nhà đầu tư taì trợ rank được phép xem và nhận thông báo từ tất cả các chuyên gia rank  </List.Item>

                    </List>


                </List.Item>

            </List>
        </div>
    )
}

export function explainCreateNewPred(nested: boolean) {
    return (
        <>
            <List nested={nested} className="mb-3">
                <List.Item>Chuyên gia ban đầu sẽ chọn 1 mã chứng khoán, từ đó hệ thống sẽ tự động chọn giá mua vào dựa vào giá giao dịch cao nhất tại phiên giao dịch đang tiếp diễn hoặc phiên gần nhất </List.Item>
                <List.Item>Chuyên gia sẽ chọn vùng giá chốt lời, cắt lỗ, tỷ trọng đầu tư, và deadline cho khuyến nghị </List.Item>
                <List.Item>Khuyến nghị sau khi đã tạo sẽ không thể xoá</List.Item>
            </List>
        </>
    )
}


export function explainObservePred(nested: boolean) {
    return (
        <>
            <List nested={nested} className="mb-3">
                <List.Item>Hệ thống tự động theo dõi khuyến nghị sau khi tạo mỗi 30 phút, so sánh với thông tin giao dịch cổ phiếu tại thị trường</List.Item>
                <List.Item>Nếu giá thấp nhất của phiên giao dịch hiện tại {'<='} giá chốt lời hoặc giá cao nhất của phiên giao dịch  {'>='} giá cắt lỗ, thì hệ thống sẽ tự động chốt giá kết thúc tương ứng sẽ là giá chốt lời / cắt lỗ, khuyến nghị sẽ được cập nhật trạng thái và coi như kết thúc  </List.Item>
                <List.Item> Nếu deadline đã tới mà khuyến nghị vẫn chưa chạm điểm chốt lời / cắt lỗ, hệ thống sẽ tự động lấy giá khớp lệnh thấp nhất tại phiên giao dịch gần nhất làm giá kết thúc khuyến nghị, khuyến nghị sẽ được cập nhật trạng thái và coi như kết thúc </List.Item>
                <List.Item> Sau khi tạo khuyến nghị 5 ngày và trước khi khuyến nghị kết thúc bởi hệ thống, nếu nhận thấy thị trường thay đổi và khuyến nghị cần kết thúc, chuyên gia có thể tự tay đóng khuyến nghị ngay lập tức, hệ thống sẽ tự động lấy giá khớp lệnh thấp nhất tại phiên giao dịch gần nhất làm giá kết thúc khuyến nghị, khuyến nghị sẽ được cập nhật trạng thái và coi như kết thúc  </List.Item>
                <List.Item> Khi khuyến nghị kết thúc, thông báo sẽ được gửi đi cho các nhà đầu tư theo dõi bạn </List.Item>
            </List>
        </>
    )
}


export function explainPersistPerf(nested: boolean) {
    return (
        <>

            <List nested={nested} className="mb-3">
                <List.Item> Tỷ suất lợi nhuận của mỗi khuyến nghị được tính bằng công thức <span className="dark:text-cyan-500 text-violet-600">Giá kết thúc / Giá mua vào * Tỷ trọng đầu tư</span>    </List.Item>
                <List.Item>Thành tích của chuyên gia được tính bằng cách nhân tổng hợp tỷ suất lợi nhuận của các khuyến nghị đã kết thúc của chuyên gia đó, nói cách khác, chính là tỷ suất lời / lỗ của nhà đầu tư nếu làm theo khuyến nghị của chuyên gia  </List.Item>
                <List.Item> Thành tích của chuyên gia sẽ được hiển thị cho mọi người, kể cả khách  </List.Item>
                <List.Item> Thành tích của chuyên gia có thể dùng làm tăng uy tín cho <span className="dark:text-cyan-500 text-violet-600">chuyên gia solo</span> hoặc nếu là <span className="dark:text-cyan-500 text-violet-600">chuyên gia rank</span>, sẽ được dùng để xếp hàng và trả thưởng theo tuần / tháng / quý / năm nếu chuyên gia lọt top 10 </List.Item>

            </List>
        </>
    )
}

export function explainExpertIncome() {
    return (
        <div>
            <p className="font-normal mt-6 ml-8">Mỗi tài khoản người dùng được đăng ký 1 trong 2 loại chuyên gia là solo hoặc rank. Sau khi chọn rồi sẽ không thể thay đổi, tuy nhiên nếu muốn tham gia tư vấn dưới tư cách loại chuyên gia còn lại thì bạn chỉ cần tạo tài khoản người dùng mới và đăng ký loại chuyên gia đó</p>
            <List nested className="mb-3" >

                <List.Item className="mt-6"> <span className="text-purple-500 dark:text-cyan-400  font-bold">Chuyên gia solo </span>

                    <List className="mb-6" ordered nested>
                        <List.Item>Ra giá các gói theo dõi riêng và nhận thu nhập khi nhà đầu tư mua các gói theo dõi </List.Item>
                        {/* <List.Item>Dành cho những chuyên gia theo hướng xây dựng uy tín cá nhân, có khả năng thu hút nhiều người theo dõi </List.Item> */}
                        {/* <List.Item>Thu nhập ổn định dài hạn </List.Item> */}
                        <List.Item>Chuyên gia hưởng 80% doanh thu từ người theo dõi, còn lại là 10% cho người giới thiệu chuyên gia đến với website, admin hưởng 10% </List.Item>
                        <List.Item > VD chuyên gia ra giá gói theo tháng là 4 triệu và thu hút được 50 người theo dõi thì mỗi tháng chuyên gia sẽ hưởng 160 triệu / tháng. người giới thiệu hưởng 20 triệu  </List.Item>
                    </List>


                </List.Item>

                <List.Item className=""> <span className="text-purple-500 dark:text-cyan-400  font-bold">Chuyên gia rank</span>

                    <List className="mb-6" ordered nested>
                        <List.Item> Được gia nhập nhóm các chuyên gia đua rank, đồng thời được theo dõi bởi tất cả các nhà đầu tư mua gói tài trợ rank</List.Item>
                        <List.Item>  Hưởng doanh thu khi đạt top performance theo Tuần, Tháng, Quý, Năm, quỹ thưởng này chỉ dành cho chuyên gia rank </List.Item>
                        {/* <List.Item>Dành cho những người đang xây dựng uy tín, muốn nhanh chóng hưởng doanh thu từ kết quả thực chiến  </List.Item>
                        <List.Item>Thu nhập tuỳ thuộc phong độ   </List.Item> */}
                        <List.Item>Quỹ thưởng được lấy từ doanh thu của những nhà đầu tư tham gia tài trợ rank  </List.Item>
                        <List.Item>Mỗi khi có nhà đầu tư mua gói tài trợ rank thì tiền sau chiết khấu sẽ chia cho quỹ tuần, tháng, quý, năm (mỗi quỹ 1/4) và chia đều về các mốc trả thưởng nằm trong thời gian tài trợ, tiền từ gói tài trợ rank vĩnh viễn được chia cho các mốc trong 3 năm </List.Item>
                        <List.Item> Các nhà đầu tư taì trợ rank được phép xem và nhận thông báo từ tất cả các chuyên gia rank  </List.Item>

                    </List>


                </List.Item>

            </List>
        </div>
    )
}


export function explainExpert() {
    return (
        <div className="p-1 space-y-5">
            {/* <p>Không đưa thông tin cá nhân như số điện thoại, zalo, telegram ... vào profile chuyên gia, tránh trường hợp lôi kéo người dùng sang nền tảng khác 
        </p> */}
            <p>Được cung cấp tính năng công nghệ trên website f319.net với các chức năng sau</p>
            <List >

                <List.Item className="text-sm p-0 text-gray-600 dark:text-zinc-200">

                    Tạo mới khuyến nghị
                    {explainCreateNewPred(true)}

                    <List.Item className="text-sm p-0  text-gray-600 dark:text-zinc-200">
                        Theo dõi khuyến nghị
                        {explainObservePred(true)}


                    </List.Item>
                    <List.Item className="text-sm p-0  text-gray-600 dark:text-zinc-200">
                        Ghi nhận thành tích

                        {explainPersistPerf(true)}
                    </List.Item>

                    <List.Item className="text-sm p-0 text-gray-600 dark:text-zinc-200">
                        Doanh thu chuyên gia
                        {explainExpertIncome()}

                    </List.Item>
                </List.Item>

            </List>
            <br />

        </div>
    )
}


