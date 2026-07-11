const fs = require("fs")
const { fileTypes, fileIcon } = require("./supportFile")
const path = require("path")
exports.load = (root, location) => {
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(location)
        const result = []
        files.forEach(file => {
            if (file.startsWith(".")) {
                return
            }
            let name = file
            let pathFile
            if (location.endsWith("/")) {
                pathFile = location + name
            }
            else {
                pathFile = location + "/" + name
            }
            let supath = pathFile.replace(root, "")
            let ext = path.extname(name)
            let stat = fs.statSync(pathFile)
            if (stat.isDirectory()) {
                supath = `?dir=${supath}`
            }
            result.push({
                name,
                pathFile,
                size: stat.size,
                lastModify: stat.mtime,
                ext: ext,
                icon: fileIcon[ext] || "Other File",
                type: fileTypes[ext] || '<i class="fas fa-file"></i>',
                supath
            })
        })
        resolve(result)
    })
}