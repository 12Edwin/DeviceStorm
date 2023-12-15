const {Response, Router} = require('express');
const {validateError, hashPassword, validateMiddlewares, textRegex} = require("../../util/functions");
const User = require('./User');
const {check} = require("express-validator");
const {validateEmail, validateId, validateJWT, validateAdmin, roles} = require("../../helpers/db-validations");
const {sendMail} = require("../email/mailer");
const getAll = async  (req, res = Response) =>{
    try {
        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find({ role: { $ne: 'ADMIN_ROLE' } })
        ]);

        res.status(200).json({total, users});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}
const getById = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json({msg:'Successful request',user});

    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}
const insert = async (req, res = Response) =>{
    try {
        const {name,surname, lastname, email,role,password} = req.body;
        if(textRegex.test(name) && textRegex.test(lastname)){
            const user = new User ({name,surname, lastname, email,role, password, status:true, token: ''});
            user.password = await hashPassword(password);
            await user.save();
            sendMail(email,"Correo de bienvenida",emailHtml(name, surname, lastname));
            res.status(200).json({message:'Successful request',user});
        }else {
            res.status(400).json({message:'Invalid name'});
        }
    }catch (error){
        const message = validateError(error);
        res.status(400).json({Error:message});
        console.log(error);
    }
}


const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const {email, password, ...rest} = req.body;
        if (password){
            rest.password = await hashPassword(password);
        }
        const user = await User.findByIdAndUpdate(id, rest);
        res.status(200).json({Message:'Successful request', user});
    }catch (error){
        const message = validateError(error);
        res.status(400).json({Error:message});
        console.log(error);
    }
}

const deletes = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        const status = !user.status;
        const result = await User.findByIdAndUpdate(id, {status})
        res.status(200).json(user.status ?{result_delete: 'Successful'}:{restored: 'Successful'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const emailHtml = (name, surname,lastname) => {
    return `<!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet" type="text/css"><!--<![endif]-->
        <style>
            * {
                box-sizing: border-box;
            }
    
            body {
                margin: 0;
                padding: 0;
            }
    
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
            }
    
            #MessageViewBody a {
                color: inherit;
                text-decoration: none;
            }
    
            p {
                line-height: inherit
            }
    
            .desktop_hide,
            .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
            }
    
            .image_block img+div {
                display: none;
            }
    
            @media (max-width:700px) {
                .desktop_hide table.icons-inner {
                    display: inline-block !important;
                }
    
                .icons-inner {
                    text-align: center;
                }
    
                .icons-inner td {
                    margin: 0 auto;
                }
    
                .image_block div.fullWidth {
                    max-width: 100% !important;
                }
    
                .mobile_hide {
                    display: none;
                }
    
                .row-content {
                    width: 100% !important;
                }
    
                .stack .column {
                    width: 100%;
                    display: block;
                }
    
                .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                }
    
                .desktop_hide,
                .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                }
    
                .row-2 .column-1 .block-2.heading_block td.pad {
                    padding: 10px 60px 30px !important;
                }
    
                .row-2 .column-1 .block-2.heading_block h1 {
                    font-size: 33px !important;
                }
    
                .row-4 .column-1 .block-1.paragraph_block td.pad {
                    padding: 5px 30px !important;
                }
    
                .row-8 .column-1 .block-1.heading_block h2 {
                    font-size: 20px !important;
                }
    
                .row-5 .column-2 {
                    padding: 30px 30px 30px 50px !important;
                }
            }
        </style>
    </head>
    
    <body style="margin: 0; background-color: #1b3b74; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1b3b74;">
            <tbody>
                <tr>
                    <td>
                        <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1b3b74; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; text-align: center;">
                                                                    <table class="alignment" cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td style="vertical-align: middle; text-align: center; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px;"><img class="icon" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/Logo.png" height="32" width="120" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #ffffff; border-bottom: 0 solid #FFFFFF; border-left: 0 solid #FFFFFF; border-radius: 30px 30px 0 0; border-right: 0px solid #FFFFFF; border-top: 0 solid #FFFFFF; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                                        <table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:30px;padding-left:60px;padding-right:60px;padding-top:30px;text-align:center;width:100%;">
                                                                    <h1 style="margin: 0; color: #020b22; direction: ltr; font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 40px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 60px;"><span class="tinyMce-placeholder">Bienvenido a REPADE, ${name} ${lastname} ${surname}</span></h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                    <div class="alignment" align="center" style="line-height:10px">
                                                                        <div class="fullWidth" style="max-width: 442px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/brand_awarenes.png" style="display: block; height: auto; border: 0; width: 100%;" width="442" alt="Social profile" title="Social profile"></div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 60px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:5px;padding-left:60px;padding-right:60px;padding-top:5px;">
                                                                    <div style="color:#878787;direction:ltr;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;">
                                                                        <p style="margin: 0;">El principal objetivo de nuestra aplicación es facilitar la gestión de solicitudes de prestamo de dispositivos dentro de la Universidad Tecnológica Emiliano Zapata</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; background-color: #f2f5ff; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #1A30EB; border-top: 1px solid #1A30EB; padding-bottom: 30px; padding-left: 45px; padding-right: 25px; padding-top: 30px; vertical-align: top; border-right: 0px; border-left: 0px;">
                                                        <div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
                                                        <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="width:100%;">
                                                                    <div class="alignment" align="center" style="line-height:10px">
                                                                        <div style="max-width: 270px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/post.png" style="display: block; height: auto; border: 0; width: 100%;" width="270" alt="Post" title="Post"></div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #1A30EB; border-top: 1px solid #1A30EB; padding-bottom: 30px; padding-left: 30px; padding-right: 30px; padding-top: 60px; vertical-align: top; border-right: 0px; border-left: 0px;">
                                                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:15px;padding-left:5px;padding-right:30px;padding-top:10px;">
                                                                    <div style="color:#353d46;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:20px;line-height:120%;text-align:left;mso-line-height-alt:24px;">
                                                                        <p style="margin: 0; word-break: break-word;"><span><span style="color: #1a30eb;">&gt; </span>Monitorea tus prestamos en tiempo real</span><br><br><span><span style="color: #1a30eb;">&gt;</span> Solicita un dispositivo en cualquier lugar</span><br><br><span><span style="color: #1a30eb;">&gt; </span>Mantente al corriente con tus sanciones</span></p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 50px; padding-right: 50px; padding-top: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:15px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                                                    <div style="color:#888888;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:20px;line-height:120%;text-align:center;mso-line-height-alt:24px;">
                                                                        <p style="margin: 0;">¿Ya sigues a la universidad en sus redes sociales?</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:15px;padding-top:15px;text-align:center;width:100%;">
                                                                    <h3 style="margin: 0; color: #020b22; direction: ltr; font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 28.799999999999997px;"><strong><span class="tinyMce-placeholder"><span id="05276ec3-3f46-45fb-8f44-d2df8fd334b8">@utezmorelos</span></span></strong></h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:15px;padding-left:5px;padding-right:30px;padding-top:10px;">
                                                                    <div style="color:#888888;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:20px;line-height:120%;text-align:center;mso-line-height-alt:24px;">
                                                                        <p style="margin: 0; word-break: break-word;"><span>or click on the links below</span></p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="image_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                    <div class="alignment" align="center" style="line-height:10px">
                                                                        <div style="max-width: 170px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/social-media.gif" style="display: block; height: auto; border: 0; width: 100%;" width="170" alt="Likes" title="Likes"></div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; background-color: #ffffff; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #c13584; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                                                    <tr>
                                                                                        <td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 25px; padding-left: 10px; padding-right: 10px;"><a href="https://instagram.com/utezmorelos?igshid=NGVhN2U2NjQ0Yg==" target="_self" style="text-decoration: none;"><img class="icon" alt="Instagram" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/insta.png" height="32" width="32" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style="font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 16px; font-weight: undefined; color: #ffffff; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://instagram.com/utezmorelos?igshid=NGVhN2U2NjQ0Yg==" target="_self" style="color: #ffffff; text-decoration: none;">Instagram</a></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #6386e0; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                                                    <tr>
                                                                                        <td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 25px; padding-left: 10px; padding-right: 10px;"><a href="https://www.facebook.com/UTEZ.Morelos?mibextid=ZbWKwL" target="_self" style="text-decoration: none;"><img class="icon" alt="Facebook" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/facebook.png" height="32" width="18" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style="font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 16px; font-weight: undefined; color: #ffffff; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.facebook.com/UTEZ.Morelos?mibextid=ZbWKwL" target="_self" style="color: #ffffff; text-decoration: none;">Facebook</a></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #7bc8ff; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                                                    <tr>
                                                                                        <td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 25px; padding-left: 10px; padding-right: 10px;"><a href="https://www.example.com" target="_self" style="text-decoration: none;"><img class="icon" alt="Web" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7311/twitter.png" height="32" width="32" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style="font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 16px; font-weight: undefined; color: #ffffff; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.example.com" target="_self" style="color: #ffffff; text-decoration: none;">Google</a></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f5ff; border-radius: 0 0 30px 30px; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:20px;padding-top:20px;text-align:center;width:100%;">
                                                                    <h2 style="margin: 0; color: #1a30eb; direction: ltr; font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 24px;"><span class="tinyMce-placeholder">REPADE DEV</span></h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1b3b74; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad">
                                                                    <div style="color:#fafafa;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:10px;line-height:150%;text-align:center;mso-line-height-alt:15px;">
                                                                        <p style="margin: 0; word-break: break-word;"><span><span>© 2022 Company.&nbsp;</span></span><span><span> All Rights Reserved.</span></span></p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                                                    <tr>
                                                                                        <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                                                        <td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="http://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table><!-- End -->
    </body>
    
    </html>`
}

const userRouter = Router()


userRouter.get('/',[
    validateJWT,
    validateAdmin,
    validateMiddlewares
],getAll);

userRouter.get('/:id',[
    validateJWT,
    check('id').custom(validateId),
    validateMiddlewares
],getById);
userRouter.put('/:id',[
    validateJWT,
    check('id','Id inválido para mongo').isMongoId(),
    check('id').custom(validateId),
    check('email').optional().isEmail().withMessage('Correo inválido').custom(validateEmail),
    check('password').optional().isLength({min:6}).withMessage('Su contraseña debe contener más de 6 caracteres'),
    validateMiddlewares
],update);
userRouter.post('/',[
    /* validateJWT, */
    check('email','Correo inválido').isEmail(),
    check('email').custom(validateEmail),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener más de 6 caracteres').isLength({min:6}),
    check('role').custom(roles),
    validateMiddlewares
],insert);
userRouter.delete('/:id',[
    validateJWT,
    validateAdmin,
    check('id','Id inválido para mongo').isMongoId(),
    check('id').custom(validateId),
    validateMiddlewares
],deletes);

module.exports= {
    userRouter
}