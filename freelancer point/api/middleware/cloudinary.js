import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req,file,cn){
        cn(null,'./public/temp')
    },
    filename: function(req,file,cn){
        cn(null,file.originalname)
    }
})

export const upload = multer({ storage: storage })