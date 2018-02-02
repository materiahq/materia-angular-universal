const path = require("path");
const fs = require("fs");
class MailjetSender {
    constructor(key, secret, from, name) {
        this.from = from

        this.mailjet = require('node-mailjet').connect(key, secret);
    }

    send(params) {
        var sendEmail = this.mailjet.post('send');

        var emailData = {
            'FromEmail': this.from,
            'Subject': params.subject,
            'Text-part': params.body,
            'Recipients': [{ 'Email': params.to }]
        }
        if (this.name) {
            emailData['FromName'] = this.name
        }

        return sendEmail.request(emailData)
    }

    sendTemplate(params) {
        var sendEmail = this.mailjet.post('send');

        var emailData = {
            'FromEmail': this.from,
            'Subject': params.subject,
            'Html-part': params.body,
            'Recipients': [{ 'Email': params.to }]
        }
        if (this.name) {
            emailData['FromName'] = this.name
        }

        return sendEmail.request(emailData)
    }

    getTemplates(params) {
        return new Promise((resolve, reject) => {
            const p = params.appPath + "/server/mailjet/templates";
            this._checkDirectory(p).then(() => {
                this._listFiles(p).then(files => resolve(files)).catch(err => resolve([]));
            }).catch(err => {
                resolve([]);
            })
        })
    }

    _listFiles(directory) {
        return new Promise((resolve, reject) => {
            const formatedFiles = []
            fs.readdir(directory, (err, files) => {
                if (err) {
                    reject(err)
                }
                console.log("files result : ", files)
                files.forEach((file, index) => {
                    console.log("File : ", file);
                    this._loadTemplateCode(directory, file, index).then((res) => {
                        formatedFiles.push({ name: file, code: res.code })
                        if (res.index == files.length - 1) {
                            resolve(formatedFiles);
                        }
                    })
                })
            })
        })
    }
    _checkDirectory(directory) {
        return new Promise((resolve, reject) => {
            fs.stat(directory, function (err, stats) {
                //Check if error defined and the error code is "not exists"
                if (err && err.errno === 34) {
                    //Create the directory, call the callback.
                    reject(err)
                }
                else if (!err) {
                    resolve()
                }
                else {
                    reject(err)
                }
            });
        });
    }
    _loadTemplateCode(directory, filename, index) {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(directory, filename),
                "utf-8",
                (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    if (data) {
                        console.log("Result data content : ", data)
                        const code = data.toString();
                        resolve({code: code, index: index});
                    }
                });
        })
    }
}

module.exports = MailjetSender