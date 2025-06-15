const Tour = require("../../models/tour.model");
const Order = require("../../models/order.model");
const City = require("../../models/city.model");

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
        // Cập nhật lại số lượng còn lại của tour

        if (inforTour.stockAdult < item.quantityAdult || inforTour.stockChildren < item.quantityChildren || inforTour.stockBaby < item.quantityBaby) {
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