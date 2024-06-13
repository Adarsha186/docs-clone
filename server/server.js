const mongoose = require('mongoose')
const Document = require('./Document')


mongoose.connect(`mongodb://localhost:27017/google-docs-clone`, {
    useNewUrlParser: true,
})

async function getDocById(id) {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({_id: id, data: ""})
}

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods:['GET','POST'],
    },
})

io.on('connection', socket => {
    socket.on('get-document', async documentId => {//after users asks for the document, load it with empty data
        const document = await getDocById(documentId)
        socket.join(documentId)//make a room for that particular socket
        socket.emit('load-document', document.data)//load the document

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta)//send the changes w.r.to the document ID
        })

        socket.on('save-changes', async data => {
            await Document.findByIdAndUpdate(documentId, {data})
        })
    })
})