
import nodemailer from "nodemailer";

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function sendEmailOTP(req, res, toEmail) {
    const otp = generateOTP();

    try {
        const transporter = nodemailer.createTransport({
            host: global.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: global.SMTP_USER,
                pass: global.googleAppPassword,
            },
        });

        const info = await transporter.sendMail({
            from: `"Your App" <${global.environementName}>`,
            to: toEmail,
            subject: "Agriniri OTP Code",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p>`,
        });

        console.log("Email OTP sent:", info.messageId);
        res.json({ "response": "otp", "message": "Otp send to your Email", "otpCode": `${otp}` })
    } catch (err) {
        res.statusCode = 401
        res.json({ "response": "Something went wrong. Try again later ! " + err })
        console.error("Error sending email OTP:", err);
        return
    }
}

export async function sendWhatsAppOTP(req, res, toNumber) {
    const otp = generateOTP();

    try {
        const phoneNumberId = global.WHATSAPP_PHONE_NUMBER_ID;
        const token = global.WHATSAPP_TOKEN;

        const response = await fetch(
            `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: toNumber, // include country code, e.g., "919876543210"
                    type: "text",
                    text: {
                        body: `Your OTP is: ${otp}`,
                    },
                }),
            }
        );

        const data = await response.json();
        console.log("WhatsApp OTP sent:", data);
        res.json({ "response": "otp", "message": "Otp send to your Whatsapp Number", "otpCode": `${otp}` })
    } catch (err) {
        res.statusCode = 401
        res.json({ "response": "Something went wrong. Try again later !" })
        console.error("Error sending WhatsApp OTP:", err);
        return
    }
}


