import React from "react";
import {
  FaTshirt,
  FaCheckCircle,
  FaPalette,
  FaListOl,
  FaLightbulb,
} from "react-icons/fa";

const YogaClothingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-8 px-2">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center gap-3 mb-2">
          <FaTshirt className="text-indigo-500 text-4xl" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 tracking-tight">
            Hướng dẫn chọn trang phục quần áo tập yoga
          </h1>
        </div>
        <p className="text-gray-500 mb-6 text-base md:text-lg">
          11/03/2020 &nbsp;|&nbsp;{" "}
          <span className="font-medium text-indigo-400">
            Đăng bởi: Đồ tập Yoga Tốt
          </span>
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-600 mb-2 flex items-center gap-2">
            <FaCheckCircle className="text-teal-400" /> Hướng dẫn chọn trang
            phục quần áo tập yoga
          </h2>
          <p className="text-gray-700 mb-2">
            Ở bài viết trước Đồ tập Yoga Tốt đã hướng dẫn bạn cách chọn mua một
            tấm thảm tập Yoga như ý rồi. Vậy khi tập yoga cần mặc trang phục như
            thế nào? Bài viết này sẽ trả lời câu hỏi đó của bạn.
          </p>
          <p className="text-gray-700">
            Việc tập luyện yoga không đòi hỏi nhiều sức lực, tuy nhiên các tư
            thế, động tác yoga cần sự di chuyển uyển chuyển, dẻo dai của toàn bộ
            cơ thể. Do đó, việc lựa chọn trang phục, quần áo tập yoga phù hợp
            với người tập là cần thiết, giúp việc tập luyện mang lại hiệu quả
            cao.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-600 mb-2 flex items-center gap-2">
            <FaListOl className="text-teal-400" /> Có thể bạn quan tâm:
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Danh mục quần áo tập yoga</li>
            <li>Danh mục thảm tập yoga</li>
            <li>Danh mục dụng cụ tập yoga</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            1. Chất lượng
          </h3>
          <p className="text-gray-700">
            Chỉ sử dụng những sản phẩm được dệt từ bông (cotton) và sợi đay
            (thoát khí tốt, lại rất mềm mại) vì chúng sẽ không tạo cảm giác gò
            bó. Hãy chọn những bộ quần áo có chất liệu co giãn cao (spandex,
            thun…), nhưng vẫn giữ đúng được “vị trí” khi vận động, ưu tiên chất
            liệu có tác dụng hút mồ hôi. Đặc biệt, độ bền của trang phục cũng
            cần được quan tâm, bởi trong khi tập Yoga, bạn sẽ thực hiện nhiều
            động tác căng duỗi, gập người, hay thậm chí lăn trên sàn, vì vậy bạn
            cần một bộ quần áo chắc chắn.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            2. Kiểu dáng
          </h3>
          <p className="text-gray-700">
            Cần đáp ứng các tiêu chí: Đơn giản, thoải mái và thuận tiện. Trên
            trang phục không có nhiều vật trang trí (đặc biệt là kim loại), dây
            hay nơ, để tránh vướng vào người tạo nên những tổn thương không cần
            thiết.
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-500">Áo tập:</span> Bạn
            nên chọn cho mình một chiếc áo sát cánh ôm vừa phải, không bó sát
            người. Tránh chọn áo rộng thùng thình, không chỉ gây khó khăn khi
            tập mà còn cản trở người huấn luyện theo dõi những động tác của bạn.
          </p>
          <p className="text-gray-700">
            Với các bạn nữ, đừng quên một chiếc áo ngực thể thao vô cùng quan
            trọng trong bất kỳ việc tập luyện nào, giúp bảo vệ vòng một và hỗ
            trợ người tập trong các động tác uốn dẻo, gập người. Hơn nữa, với
            những động tác cúi người hay lộn ngược, áo quá rộng sẽ khiến bạn bối
            rối và đỏ mặt khi trong lớp học có đông người.
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-500">Quần tập:</span>{" "}
            Quần lửng hay quần short là lựa chọn hợp lý, mùa đông nếu nhiệt độ
            quá lạnh có thể mặc quần dài. Loại vải của quần không được quá trơn
            để bạn có thể giữ thăng bằng tốt trên một chân. Phần đáy quần nên có
            lớp vải đệm thêm để bảo đảm độ chắc chắn cho trang phục. Cần lưu ý
            là chúng không quá “phô bày” trong lúc bạn tập luyện, vì điều đó có
            thể khiến bạn bối rối và không thoải mái, tự tin.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">3. Màu sắc</h3>
          <p className="text-gray-700">
            Sử dụng màu tươi mát, thanh nhã, tốt nhất là đơn sắc, như thế có thể
            giúp thư giãn tinh thần, và cũng giúp bạn tập trung vào bài tập tốt
            hơn.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            4. Số lượng
          </h3>
          <p className="text-gray-700">
            Trang phục Yoga thường nên chuẩn bị 2 bộ, để chúng ta có thể thay
            đổi. Đặc biệt là khi luyện tập Yoga trong điều kiện nhiệt độ cao, đổ
            nhiều mồ hôi, nên chuẩn bị thêm một bộ để thay đổi.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            5. Phong cách
          </h3>
          <p className="text-gray-700">
            Có thể chọn trang phục mang dấu ấn của dân tộc Ấn Độ, thoải mái, tự
            nhiên; mặc vào vừa có cảm giác phóng khoáng, vừa mang phong cách
            hiện đại. Những bộ trang phục ôm người và đàn hồi tốt mặc vào cũng
            tôn lên vóc dáng xinh đẹp, rất thích hợp khi luyện tập Yoga trong
            điều kiện nhiệt độ cao.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            6. Lưu ý khi giặt
          </h3>
          <p className="text-gray-700">
            Do tính chất chất liệu của quần áo tập Yoga là co giãn, nên cách bạn
            giặt sẽ quyết định độ bền của nó. Bạn nên dùng nước lạnh, lộn mặt
            trong ra ngoài và tránh dùng chức năng sấy khô của máy giặt. Không
            nên giặt chung với các đồ có chất liệu thô cứng khác, bởi như vậy
            chúng sẽ làm hư thớ sợi trong chất liệu dành cho quần áo Yoga.
          </p>
        </section>

        <div className="flex items-center gap-2 mt-8 p-4 bg-indigo-50 rounded-xl shadow-inner">
          <FaLightbulb className="text-yellow-400 text-2xl" />
          <p className="text-gray-800 font-medium text-lg">
            Hy vọng những hướng dẫn trong bài viết này sẽ giúp bạn lựa chọn được
            trang phục tập Yoga ưng ý và phát huy tốt hiệu quả của Yoga trong
            các buổi tập!
          </p>
        </div>
      </div>
    </div>
  );
};

export default YogaClothingGuide;
