const productModel = require('../models/product.model');
const exceljs = require('exceljs');
class ProductService {

    // Tạo sản phẩm mới
    static createNewProduct = async ({ name, thumb, description, price, quantity }) => {
        try {
            const existProduct = await productModel.findOne({ name });
            if (existProduct) {
                return {
                    code: 403,
                    message: "Product is already exists!"
                };
            }

            const newProduct = await productModel.create({
                name,
                thumb,
                description,
                price,
                quantity,
            });

            if (newProduct) {
                return {
                    code: 201,
                    status: "Create new product Success!",
                    data: newProduct
                };
            }

            return {
                code: 200,
                status: "Create done!"
            };
        } catch (error) {
            return {
                code: 403,
                status: "CreateProduct Method has problem!",
                message: error.message
            };
        }
    }

    // Lấy tất cả sản phẩm
    static getAllProduct = async (limit, page, sort, searchTerm) => {
        try {
            const totalProduct = await productModel.countDocuments();

            if (searchTerm) {
                // Sử dụng RegExp để tạo một biểu thức chính quy tìm kiếm không phân biệt hoa thường
                const regex = new RegExp(searchTerm, 'i');

                const allObjectFilter = await productModel.find({
                    $or: [
                        { name: { $regex: regex } },
                        { description: { $regex: regex } },
                        // Thêm các trường khác cần tìm kiếm ở đây nếu cần
                    ],
                })
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });

                return {
                    status: 'OK',
                    message: 'Success at Filter',
                    data: allObjectFilter.map(product => ([
                        product._id,
                        product.name,
                        product.thumb,
                        product.description,
                        product.price,
                        product.quantity
                    ])),
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                };
            }

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];

                const allProductSort = await productModel.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort)
                    .sort({ createdAt: -1, updatedAt: -1 });

                return {
                    status: 'OK',
                    message: 'Success at Sort',
                    data: allProductSort.map(product => ([
                        product.name,
                        product.thumb,
                        product.description,
                        product.price,
                        product.quantity
                    ])),
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                };

            }

            let allProduct = [];
            if (!limit) {
                allProduct = await productModel.find().sort({ createdAt: -1, updatedAt: -1 });
            } else {
                allProduct = await productModel.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });
            }

            return {
                status: 'OK',
                message: 'Success at normal',
                data: allProduct.map(product => ([
                    product._id,
                    product.name,
                    product.thumb,
                    product.description,
                    product.price,
                    product.quantity
                ])),
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            };


        } catch (e) {
            throw e;
        }
    }

    // static getAllProduct = async () => {
    //     try {
    //         const allProduct = await productModel.find({});
    //         return {
    //             status: "OK",
    //             message: "Success",
    //             data: allProduct
    //         }
    //     } catch (error) {
    //         return {
    //             message: error
    //         }
    //     }
    // }




    // Lấy sản phẩm theo ID
    static getProductById = async (id) => {
        try {
            const product = await productModel.findOne({ _id: id });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật sản phẩm
    static updateProduct = async (id, updateData) => {
        try {
            const checkProduct = await productModel.findOne({
                _id: id
            })
            if (checkProduct === null) {
                return ({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true })
            return ({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        } catch (e) {
            console.log({ message: e })
        }
    }

    // Xoá sản phẩm
    static deleteProduct = async (id) => {
        try {
            const checkProduct = await productModel.findOne({
                _id: id
            })
            if (checkProduct === null) {
                return ({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            await productModel.findByIdAndDelete(id)
            return ({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            console.log({ message: e })
        }
    }

    // Tìm kiếm sản phẩm
    static searchProduct = async (query) => {
        try {
            const products = await productModel.find({ name: { $regex: query, $options: 'i' } });
            return products;
        } catch (error) {
            throw error;
        }
    }

    // Lọc sản phẩm
    static filterProduct = async (filterData) => {
        try {
            // Dựa vào filterData để lọc sản phẩm
            const filteredProducts = await productModel.find(filterData);
            return filteredProducts;
        } catch (error) {
            throw error;
        }
    }


    //Import File
    static importFile = async (buffer) => {
        const workbook = new exceljs.Workbook();
        const worksheet = await workbook.xlsx.load(buffer).then(function () {
            return workbook.getWorksheet(1);
        });

        const products = [];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber !== 1) { // Skip header row
                const product = {
                    name: row.getCell(1).value,
                    thumb: row.getCell(2).value,
                    description: row.getCell(3).value,
                    price: row.getCell(4).value,
                    quantity: row.getCell(5).value
                };
                products.push(product);
            }
        });

        // Process the imported products (save to database, etc.)
        // ...
        for (const productData of products) {
            const product = new productModel(productData);
            await product.save();
        }

        return products;
    }

    //Export File

    static async exportProductsToExcel() {
        // Lấy dữ liệu từ database
        const products = await productModel.find();

        // Tạo workbook và worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Products');

        // Tạo header cho worksheet
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Thumbnail', key: 'thumb', width: 20 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 15 },
        ];

        // Thêm dữ liệu vào worksheet từ products
        products.forEach(product => {
            worksheet.addRow({
                name: product.name,
                thumb: product.thumb,
                description: product.description,
                price: product.price,
                quantity: product.quantity
            });
        });

        // Lưu workbook thành file Excel
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }


}

module.exports = ProductService;
