module.exports = { getEmailBody }

function getEmailBody(email) {
    const parts = email.payload.parts;
    if (parts) {
        for (const part of parts) {
            //console.log(part)
            if (part.mimeType === 'text/plain') {
                return Buffer.from(part.body.data, 'base64').toString();
            }
        }
    }
    return 'No email body found.';
}


