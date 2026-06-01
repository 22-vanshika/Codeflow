import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

// Retrieve configuration from env, fallback to Gmail/Brevo friendly ports
const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'codeflowvisualizer@gmail.com';

// Initialize the Nodemailer transporter lazily to prevent crashing on boot if credentials aren't set yet
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
    if (transporter) return transporter;

    if (!SMTP_USER || !SMTP_PASS) {
        console.warn('⚠️ SMTP credentials not set. Email delivery will be simulated.');
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    return transporter;
}

interface ContactRequestBody {
    name: string;
    email: string;
    subject: string;
    message: string;
    type: 'feedback' | 'bug';
    attachedImage?: string; // Optional Base64 Data URL
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, subject, message, type, attachedImage } = req.body as ContactRequestBody;

        // Validation
        if (!name || !email || !subject || !message || !type) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const isBug = type === 'bug';
        const typeLabel = isBug ? 'Bug Report 🐛' : 'Feedback/Message 💬';
        const accentColor = isBug ? '#ef4444' : '#3b82f6'; // Red for bugs, Blue for feedback

        // Email HTML Template
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #0d1117;
                    color: #c9d1d9;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #161b22;
                    border: 1px solid #30363d;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .header {
                    background: linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%);
                    padding: 24px;
                    text-align: center;
                    border-bottom: 1px solid #30363d;
                }
                .header h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }
                .header p {
                    color: rgba(255, 255, 255, 0.8);
                    margin: 4px 0 0 0;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .content {
                    padding: 30px;
                }
                .field-group {
                    margin-bottom: 20px;
                }
                .label {
                    font-size: 11px;
                    font-weight: 800;
                    color: #8b949e;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                }
                .value {
                    font-size: 15px;
                    color: #f0f6fc;
                    background-color: #0d1117;
                    border: 1px solid #21262d;
                    padding: 12px 16px;
                    border-radius: 8px;
                    line-height: 1.6;
                }
                .message-box {
                    white-space: pre-wrap;
                }
                .footer {
                    background-color: #0d1117;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #8b949e;
                    border-top: 1px solid #21262d;
                }
                .footer a {
                    color: ${accentColor};
                    text-decoration: none;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>CodeFlow Notification</h1>
                    <p>${typeLabel}</p>
                </div>
                <div class="content">
                    <div class="field-group">
                        <div class="label">Sender Name</div>
                        <div class="value">${name}</div>
                    </div>
                    
                    <div class="field-group">
                        <div class="label">Sender Email</div>
                        <div class="value">${email}</div>
                    </div>
                    
                    <div class="field-group">
                        <div class="label">Subject</div>
                        <div class="value">${subject}</div>
                    </div>
                    
                    <div class="field-group">
                        <div class="label">Message Details</div>
                        <div class="value message-box">${message}</div>
                    </div>
                    
                    ${attachedImage ? `
                    <div class="field-group">
                        <div class="label">Attachment Info</div>
                        <div class="value" style="color: #58a6ff;">📸 A screenshot has been attached to this email.</div>
                    </div>
                    ` : ''}
                </div>
                <div class="footer">
                    Sent automatically by the <strong>CodeFlow Visualizer</strong> Contact form.
                    <br>
                    To reply to the sender, simply reply directly to this email.
                </div>
            </div>
        </body>
        </html>
        `;

        // Mail options
        const mailOptions: nodemailer.SendMailOptions = {
            from: `"${name} via CodeFlow" <${RECEIVER_EMAIL}>`,
            to: RECEIVER_EMAIL,
            replyTo: email, // This allows the admin to reply directly to the user
            subject: `[CodeFlow ${isBug ? 'BUG' : 'CONTACT'}] ${subject}`,
            html: htmlContent,
        };

        // If screenshot is attached, parse the base64 string
        if (attachedImage && attachedImage.startsWith('data:')) {
            const matches = attachedImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const contentType = matches[1];
                const base64Data = matches[2];
                // Determine file extension
                let extension = 'png';
                if (contentType.includes('jpeg') || contentType.includes('jpg')) {
                    extension = 'jpg';
                } else if (contentType.includes('webp')) {
                    extension = 'webp';
                } else if (contentType.includes('gif')) {
                    extension = 'gif';
                }
                
                mailOptions.attachments = [
                    {
                        filename: `screenshot-${Date.now()}.${extension}`,
                        content: Buffer.from(base64Data, 'base64'),
                        contentType: contentType
                    }
                ];
            }
        }

        // Send or simulate
        if (SMTP_USER && SMTP_PASS) {
            const mailTransporter = getTransporter();
            await mailTransporter.sendMail(mailOptions);
            console.log(`Email successfully sent to ${RECEIVER_EMAIL} for ${email}`);
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        } else {
            console.log('--- EMAIL SIMULATION (SMTP credentials not configured) ---');
            console.log('To:', RECEIVER_EMAIL);
            console.log('Reply-To:', email);
            console.log('Subject:', mailOptions.subject);
            console.log('Attachments count:', mailOptions.attachments ? mailOptions.attachments.length : 0);
            console.log('---------------------------------------------------------');
            res.status(200).json({ 
                success: true, 
                message: 'Message simulated successfully (Backend SMTP not configured yet)' 
            });
        }

    } catch (error: any) {
        console.error('Error handling contact message:', error);
        res.status(500).json({ message: 'Internal server error while sending email', error: error?.message || error });
    }
});

export default router;
