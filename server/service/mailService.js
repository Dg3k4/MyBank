import nodemailer from "nodemailer";
import "dotenv/config";

const {
    SMTP_USER,
    API_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN
} = process.env;

import {google} from "googleapis";
import ApiError from "../error/ApiError.js";

const OAuth2 = google.auth.OAuth2;

class MailService {
    constructor() {
        this.oauth2Client = new OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        this.oauth2Client.setCredentials({
            refresh_token: GOOGLE_REFRESH_TOKEN,
        });

        this.accessToken = this.oauth2Client.getAccessToken();

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: SMTP_USER,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: this.accessToken
            }
        });
    }

    async sendActivationMail(to, activationLink) {
        try {
            await this.transporter.sendMail({
                from: `BankProject <${SMTP_USER}>`,
                to,
                subject: `Активация аккаунта на ${API_URL}`,
                html: `
                    <body style="font-family: Arial, sans-serif; margin:0; padding:0; background-color:#f5f5f5;">
                        <div style="max-width:600px; margin:50px auto; background:#fff; padding:20px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color:#333;">Активация аккаунта</h2>
                            <p>Чтобы активировать ваш аккаунт, перейдите по ссылке ниже:</p>
                            <p><a href="${activationLink}" style="color:#1a73e8; text-decoration:none;">${activationLink}</a></p>
                            <p>Если вы не создавали аккаунт, просто проигнорируйте это письмо.</p>
                            <hr style="margin:20px 0;">
                            <p style="font-size:12px; color:#888;">© 2026 BankProject</p>
                        </div>
                    </body>
                `
            });
            console.log(`Письмо на ${to} успешно отправлено`);
        } catch (e) {
            console.error("Ошибка при отправке письма:", e);
            throw ApiError("Не удалось отправить письмо с активацией.", []);
        }
    }
}

export default new MailService();