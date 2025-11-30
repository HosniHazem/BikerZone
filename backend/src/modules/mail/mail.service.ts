import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendMail(to: string, subject: string, html: string) {
    // In a real application, you would implement email sending logic here
    // For example, using Nodemailer, SendGrid, etc.
    console.log(`Sending email to: ${to}`); // eslint-disable-line no-console
    console.log(`Subject: ${subject}`); // eslint-disable-line no-console
    console.log(`Body: ${html}`); // eslint-disable-line no-console
    
    // This is just a mock implementation
    return { success: true };
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verifyUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    const subject = 'Verify Your Email';
    const html = `
      <p>Hello ${name},</p>
      <p>Thank you for registering! Please click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>If you didn't create an account, please ignore this email.</p>
    `;
    
    return this.sendMail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    const subject = 'Password Reset Request';
    const html = `
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    
    return this.sendMail(to, subject, html);
  }
}
