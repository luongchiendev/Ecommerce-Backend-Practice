const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken')

// Hàm gửi email xác thực
const sendVerificationEmail = async (repicientMail) => {
    try {
        // Khởi tạo OAuth2Client với các thông tin cần thiết
        const myOAuth2Client = new OAuth2Client({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_MAILER_REFRESHTOKEN
        });
        myOAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_MAILER_REFRESHTOKEN
        })
        // Lấy AccessToken từ OAuth2Client
        const myAccessTokenObject = await myOAuth2Client.getAccessToken();
        const myAccessToken = myAccessTokenObject?.token;

        const verifyToken = jwt.sign({ email: repicientMail }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '1h' });
        // Tạo transporter để gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_MAILER_REFRESHTOKEN,
                accessToken: myAccessToken
            }
        });

        // Chuẩn bị nội dung email
        const mailOptions = {
            from: process.env.USER,
            to: repicientMail,
            subject: 'Account Verification Link',
            html: `Thank for regsiter our service. Please click link below to verify your account for user!
            <a href="${process.env.MAIN_HOST}/v1/api/shop/verify?token=${verifyToken}">Verify Email Here</a>`
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error; // Re-throw lỗi để nó được xử lý ở nơi gọi
    }
};

module.exports = { sendVerificationEmail };
