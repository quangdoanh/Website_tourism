const Tour = require("../../models/tour.model");
const Order = require("../../models/order.model");
const City = require("../../models/city.model");
const User = require("../../models/user.model");

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js


const variableConfig = require("../../config/variable.config");
const gererateHelper = require("../../helpers/generate.helper");
const moment = require("moment");


module.exports.createPost = async (req, res) => {
  try {

    req.body.orderCode = "OD" + gererateHelper.generateRandomNumber(10);

    // B1 Lấy Danh sách tour được đặt
    for (const item of req.body.items) {
      // item để làm gì ? => để bổ sung thêm thuộc tính cho các item của items
      const inforTour = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false
      })

      if (inforTour) {
        // Them gia
        item.priceNewAdult = inforTour.priceNewAdult;
        item.priceNewChildren = inforTour.priceNewChildren;
        item.priceNewBaby = inforTour.priceNewBaby;
        // Ngay khoi hanh
        item.departureDate = inforTour.departureDate;
        //Tiêu đề
        item.name = inforTour.name;
        // Hình ảnh
        item.avatar = inforTour.avatar
        // Cập nhật lại số lượng còn lại của tour

        if (inforTour.stockAdult < item.quantityAdult || inforTour.stockChildren < item.quantityChildren || inforTour.stockBaby < item.quantityBaby) {
          res.json({
            code: "error",
            message: `Số lượng chỗ của tour ${item.name} đã hết, vui lòng chọn lại`
          })
          return;
        }

        if (inforTour.stockAdult == 0 || inforTour.stockChildren == 0 || inforTour.stockBaby == 0) {
          res.json({
            code: "error",
            message: `Số lượng chỗ của tour ${item.name} đã hết, vui lòng chọn lại`
          })
          return;
        }

        await Tour.updateOne({
          _id: item.tourId
        }, {
          stockAdult: inforTour.stockAdult - item.quantityAdult,
          stockChildren: inforTour.stockChildren - item.quantityChildren,
          stockBaby: inforTour.stockBaby - item.quantityBaby,

        })
      }

    }
    // B2 Thanh toán
    // Tạm tính
    req.body.subTotal = req.body.items.reduce((sum, item) => {
      return sum + ((item.priceNewAdult * item.quantityAdult) + (item.priceNewChildren * item.quantityChildren) + (item.priceNewBaby * item.quantityBaby));
    }, 0);

    // Giảm
    req.body.discount = 0;

    // Thanh toán
    req.body.total = req.body.subTotal - req.body.discount;

    // Trạng thái thanh toán < xet theo dieu kien phuong thuc thanh toan >
    req.body.paymentStatus = "unpaid"; // unpaid: chưa thánh toán, paid: đã thanh toán

    // Trạng thái đơn hàng
    req.body.status = "initial"; // initial: khởi tạo, done: hoàn thành, cancel: hủy

    const newRecord = new Order(req.body);
    await newRecord.save();


    // User -- tên - sodienthoai --


    const exitUser = await User.findOne({
      phone: req.body.phone,
      fullName: req.body.fullName
    })

    if (!exitUser) {
      const user = new User({
        fullName: req.body.fullName,
        phone: req.body.phone
      });
      await user.save();
    }



    res.json({
      code: "success",
      message: "Đặt hàng thành công!",
      orderId: newRecord.id
    })
  } catch (error) {
    console.log(error);

    res.json({
      code: "error",
      message: "Đặt hàng không thành công!"
    })

  }
  // Thiếu
  // Id don hang

}

module.exports.success = async (req, res) => {

  try {
    const { orderId, phone } = req.query;

    console.log("orderId", orderId);
    console.log("phone", phone);


    const orderDetail = await Order.findOne({
      _id: orderId,
      phone: phone
    })

    console.log("detailOrrder", orderDetail);

    if (!orderDetail) {
      console.log("bị lỗi")
      res.redirect("/");
      return;
    }
    orderDetail.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;

    orderDetail.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == orderDetail.paymentStatus).label;

    orderDetail.statusName = variableConfig.orderStatus.find(item => item.value == orderDetail.status).label;

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of orderDetail.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false
      })

      if (infoTour) {
        item.slug = infoTour.slug;
      }

      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");

      const city = await City.findOne({
        _id: item.locationFrom
      })

      if (city) {
        item.locationFromName = city.name;
      }
    }

    console.log("bản cuối ", orderDetail);

    res.render("clients/pages/order-success", {
      pageTitle: "Đặt hàng thành công",
      orderDetail: orderDetail
    });


  } catch (error) {
    console.log("bị lỗi 2")
    res.redirect("/");
  }


}
module.exports.paymentZaloPay = async (req, res) => {
  try {
    const orderId = req.query.orderId;

    const orderDetail = await Order.findOne({
      _id: orderId,
      paymentStatus: "unpaid",
      deleted: false
    });

    if (!orderDetail) {
      res.redirect("/");
      return;
    }

    // APP INFO
    const config = {
      app_id: process.env.ZALOPAY_APPID,
      key1: process.env.ZALOPAY_KEY1, //  tạo chữ ký 
      key2: process.env.ZALOPAY_KEY2, // xác minh chữ ký
      endpoint: `${process.env.ZALOPAY_DOMAIN}/v2/create`
    };

    const embed_data = {
      redirecturl: `${process.env.DOMAIN_WEBSITE}/order/success?orderId=${orderDetail.id}&phone=${orderDetail.phone}`
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: `${orderDetail.phone}-${orderDetail.id}`,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: orderDetail.total,
      description: `Thanh toán đơn hàng ${orderDetail.orderCode}`,
      bank_code: "",
      callback_url: `${process.env.DOMAIN_WEBSITE}/order/payment-zalopay-result` // gọi ngược lại sever
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item // tạo chữ ký 
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString(); // mã hóa

    // gửi api cho sever zalopay
    const response = await axios.post(config.endpoint, null, { params: order });

    if (response.data.return_code == 1) {

      res.redirect(response.data.order_url);

      console.log("dd", response.data.order_url)
    } else {
      console.log("Thanh toán thất bại")
      res.redirect("/");
    }
  } catch (error) {
    console.log(error)
    res.redirect("/");
  }
}

module.exports.paymentZaloPayResultPost = async (req, res) => {

  console.log("Chạy vào đây")

  const config = {
    key2: process.env.ZALOPAY_KEY2
  };

  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      let dataJson = JSON.parse(dataStr, config.key2);
      const [phone, orderId] = dataJson.app_user.split("-");

      await Order.updateOne({
        _id: orderId,
        phone: phone,
        deleted: false
      }, {
        paymentStatus: "paid"
      })

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}


