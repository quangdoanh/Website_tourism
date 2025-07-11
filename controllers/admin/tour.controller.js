// Models
const Tour = require("../../models/tour.model")
const Category = require("../../models/category.model")
const accountAdmin = require("../../models/accountAdmin.model")
const City = require("../../models/city.model")

const slugify = require('slugify');
slugify.extend({ 'đ': 'd', 'Đ': 'D' }); // tránh d thành ds

const moment = require("moment/moment")
const { object } = require("joi")

//
// helpers
const CategoryHelpers = require("../../helpers/category.helper")
// --


//----------List---------
module.exports.list = async (req, res) => {


  const find = {
    deleted: false,
  }

  // status
  if (req.query.status) {
    find.status = req.query.status
  }
  // name
  if (req.query.name) {
    find.createdBy = req.query.name
  }

  //Filter Date
  const FilterDate = {}

  //dateStart
  if (req.query.dateStart) {
    const startDate = moment(req.query.dateStart).startOf("date").toDate();
    FilterDate.$gte = startDate;

  }
  //dateEnd
  if (req.query.dateEnd) {
    const endDate = moment(req.query.dateEnd).endOf("date").toDate();
    FilterDate.$lte = endDate;
  }
  //object.keys(FilterDate) : trả về 1 mảng key

  if (Object.keys(FilterDate).length > 0) {
    find.createdAt = FilterDate;
  }

  // Filter category
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryTree = CategoryHelpers.CategoryTree(categoryList)

  if (req.query.category) {
    find.category = req.query.category;

  }

  //  priceNewAdult:
  if (req.query.price) {
    const priceFilter = req.query.price;

    switch (priceFilter) {
      case 'under-2':
        find.priceNewAdult = { $lt: 2000000 };
        break;
      case '2-4':
        find.priceNewAdult = { $gte: 2000000, $lte: 4000000 };
        break;
      case '4-8':
        find.priceNewAdult = { $gt: 4000000, $lte: 8000000 };
        break;
      case 'over-8':
        find.priceNewAdult = { $gt: 8000000 };
        break;
    }
  }
  // end

  // Tìm kiếm

  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);

    console.log("tour", keywordRegex)

    find.slug = keywordRegex;
  }

  // Phân trang 
  const limit = 3;

  let page = 1

  if (req.query.page) {
    const pageCurrent = parseInt(req.query.page);
    if (pageCurrent > 0) {
      page = pageCurrent
    }
  }

  const skip = (page - 1) * limit

  const totalTour = await Tour.find({
    deleted: false
  })

  const totalPage = Math.ceil(totalTour.length / limit)

  const pagination = {
    skip: skip,
    totalTour: totalTour,
    totalPage: totalPage
  }

  //end
  const tourList = await Tour
    .find(find)
    .sort({
      position: "desc"
    })
    .limit(limit)
    .skip(skip)


  for (const item of tourList) {
    if (item.createdBy) {
      const inforAccountCreated = await accountAdmin.findOne({
        _id: item.createdBy,
      })
      item.nameCeatedBy = inforAccountCreated.fullName;

    }


    if (item.updatedBy) {
      const inforAccountUpdate = await accountAdmin.findOne({
        _id: item.createdBy,
      })
      item.namedUpdatedBy = inforAccountUpdate.fullName;
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Body
  const accountList = await accountAdmin.find({}).select("id name");

  res.render('admin/pages/tour-list', {
    pageTitle: "Danh sách tour",
    tourList: tourList,
    accountAdmin: accountList,
    pagination: pagination,
    categoryList: categoryTree

  })
}

// --------- Create ------
module.exports.create = async (req, res) => {

  const categoryList = await Category.find({
    deleted: false
  });



  const city = await City.find({})

  const categoryTree = CategoryHelpers.CategoryTree(categoryList)

  res.render('admin/pages/tour-create', {
    pageTitle: "Trang tạo tour",
    categoryList: categoryTree,
    city: city
  })
}

module.exports.createPost = async (req, res) => {

  if (!req.permissions.includes("tour-create")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }

  const findaaa = await Tour.findOne({
    name: req.body.name,
  })

  if (findaaa) {
    res.json({
      code: "error",
      message: "lỗi trùng tên",
    })
    return;
  }


  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const totalRecord = await Tour.countDocuments({});
    req.body.position = totalRecord + 1;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  if (req.files && req.files.avatar) {
    req.body.avatar = req.files.avatar[0].path;
  } else {
    delete req.body.avatar;
  }

  console.log("avatar", req.body.avatar)


  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
  req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
  req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
  req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
  req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];

  if (req.files && req.files.images && req.files.images.length > 0) {
    req.body.images = req.files.images.map(file => file.path);
  } else {
    delete req.body.images;
  }


  const newRecord = new Tour(req.body);
  await newRecord.save();

  req.flash("success", "Tạo tour thành công!")

  res.json({
    code: "success"
  })

}
// ---- Edit ------

module.exports.edit = async (req, res) => {

  const id = req.params.id

  const tourDetail = await Tour.findOne({
    _id: id,
    deleted: false
  })

  if (tourDetail) {
    tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
  }
  const categoryList = await Category.find({})

  const city = await City.find({})

  const categoryTree = CategoryHelpers.CategoryTree(categoryList)

  res.render('admin/pages/tour-edit', {
    pageTitle: "Trang sửa tour",
    tourDetail: tourDetail,
    categoryList: categoryTree,
    cityList: city
  })
}
module.exports.editPatch = async (req, res) => {

  console.log("Chạy vào đây")

  if (!req.permissions.includes("tour-edit")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }


  try {
    const id = req.params.id

    if (req.body.position) {
      req.body.position = parseInt(req.body.position)
    } else {
      delete req.body.position
    }


    req.body.updatedBy = req.account.id;
    if (req.files && req.files.avatar) {
      req.body.avatar = req.files.avatar[0].path;
    } else {
      delete req.body.avatar;
    }


    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];

    if (req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }





    // updata Model

    await Tour.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Sửa danh mục thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    req.flash("error", "Sửa danh mục thất bại!");
  }
}

// ---- Delete-----
module.exports.deletePatch = async (req, res) => {

  if (!req.permissions.includes("tour-delete")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }


  try {
    const id = req.params.id
    // deleted Model

    await Tour.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()

    })

    req.flash("success", "Xóa tour thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    req.flash("error", "Xóa tour thất bại!");
  }
}

// 

// ---- Thùng rác -------
module.exports.trash = async (req, res) => {

  // if (!req.permissions.includes("tour-trash")) {
  //     res.json({
  //         code: "error",
  //         message: "Không có quyền sử dụng tính năng này!"
  //     })
  //     return;
  // }


  const find = {
    deleted: true,
  }

  // status
  if (req.query.status) {
    find.status = req.query.status
  }
  // name
  if (req.query.name) {
    find.createdBy = req.query.name
  }

  //Filter Date
  const FilterDate = {}

  //dateStart
  if (req.query.dateStart) {
    const startDate = moment(req.query.dateStart).startOf("date").toDate();
    FilterDate.$gte = startDate;

  }
  //dateEnd
  if (req.query.dateEnd) {
    const endDate = moment(req.query.dateEnd).endOf("date").toDate();
    FilterDate.$lte = endDate;
  }
  //object.keys(FilterDate) : trả về 1 mảng key

  if (Object.keys(FilterDate).length > 0) {
    find.createdAt = FilterDate;
  }

  // Filter category
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryTree = CategoryHelpers.CategoryTree(categoryList)

  if (req.query.category) {
    find.category = req.query.category;

  }

  //  priceNewAdult:
  if (req.query.price) {
    const priceFilter = req.query.price;

    switch (priceFilter) {
      case 'under-2':
        find.priceNewAdult = { $lt: 2000000 };
        break;
      case '2-4':
        find.priceNewAdult = { $gte: 2000000, $lte: 4000000 };
        break;
      case '4-8':
        find.priceNewAdult = { $gt: 4000000, $lte: 8000000 };
        break;
      case 'over-8':
        find.priceNewAdult = { $gt: 8000000 };
        break;
    }
  }
  // end

  // Tìm kiếm

  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);

    console.log("tour", keywordRegex)

    find.slug = keywordRegex;
  }

  // Phân trang 
  const limit = 3;

  let page = 1

  if (req.query.page) {
    const pageCurrent = parseInt(req.query.page);
    if (pageCurrent > 0) {
      page = pageCurrent
    }
  }

  const skip = (page - 1) * limit

  const totalTour = await Tour.find({
    deleted: true
  })

  const totalPage = Math.ceil(totalTour.length / limit)

  const pagination = {
    skip: skip,
    totalTour: totalTour,
    totalPage: totalPage
  }

  //end
  const tourList = await Tour
    .find(find)
    .sort({
      position: "desc"
    })
    .limit(limit)
    .skip(skip)


  for (const item of tourList) {
    if (item.createdBy) {
      const inforAccountCreated = await accountAdmin.findOne({
        _id: item.createdBy,
      })
      item.nameCeatedBy = inforAccountCreated.name;

    }

    if (item.updatedBy) {
      const inforAccountUpdate = await accountAdmin.findOne({
        _id: item.createdBy,
      })
      item.namedUpdatedBy = inforAccountUpdate.name;
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Body
  const accountList = await accountAdmin.find({}).select("id name");

  res.render('admin/pages/tour-trash', {
    pageTitle: "Danh sách tour trash    ",
    tourTrash: tourList,
    accountAdmin: accountList,
    pagination: pagination,
    categoryList: categoryTree

  })
}
module.exports.undoPatch = async (req, res) => {

  if (!req.permissions.includes("tour-trash")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }


  try {
    const id = req.params.id;

    await Tour.updateOne({
      _id: id
    }, {
      deleted: false
    })

    req.flash("success", "Khôi phục tour thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    req.flash("error", "Khôi phục thất bại!");
  }

}
module.exports.deleteDestroyDelete = async (req, res) => {

  if (!req.permissions.includes("tour-trash")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }


  try {
    const id = req.params.id;
    await Tour.deleteOne({
      _id: id
    })

    req.flash("success", "Đã xóa vĩnh viễn tour thành công!");


    res.json({
      code: "success"
    })
  } catch (error) {
    req.flash("error", "Khôi phục thất bại!");
  }

}

// Change Multil

// -------------- ChangeMulti -----------
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await Tour.updateMany({
          _id: { $in: ids }
        }, {
          status: option
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await Tour.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        });
        req.flash("success", "Xóa thành công!");
        break;
    }

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!"
    })
  }


}

module.exports.trashChangeMultiPatch = async (req, res) => {

  if (!req.permissions.includes("tour-trash")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }


  try {
    const { option, ids } = req.body;

    console.log("chạy vado đây")
    switch (option) {
      case "undo":
        await Tour.updateMany({
          _id: { $in: ids }
        }, {
          deleted: false
        });
        req.flash("success", "Khôi phục thành công!");
        break;
      case "delete-destroy":
        await Tour.deleteMany({
          _id: { $in: ids }
        });
        req.flash("success", "Xóa viễn viễn thành công!");
        break;
    }

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!"
    })
  }
}
