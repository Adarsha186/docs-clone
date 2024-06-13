import React, { useCallback, useEffect, useState } from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'

const TextEditor = () => {
  const { id:documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const TOOLBAR_OPTIONS = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ align: [] }],
        ['image', 'blockquote', 'code-block'],
        ['clean'],
    ]
    const wrapperRef = useCallback((wrapper) => {//initialize the quill editor
      if(wrapper==null) return
      wrapper.innerHTML = ''
      const editor = document.createElement('div')
      wrapper.append(editor)
      const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })
      q.disable()
      q.setText('Loading...')
      setQuill(q)
    }, [])
  
  
  useEffect(() => {//socket connection
    const s = io('http://localhost:3001')
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {//if changes made ask server
    if(quill==null || socket==null) return
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return

      socket.emit('send-changes', delta)

    }
    quill.on('text-change', handler)//on text change notify the server by emitting

    return () => {
      quill.off('text-change',handler)
    }
  },[socket,quill])

  useEffect(() => {//after asking the server, bring the changes to the document
    if (quill == null || socket == null) return
    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)//on receiving the changes execute handler function

    return () => {
      socket.off('receive-changes', handler)
    }
  }, [socket, quill])

  useEffect(() => {//get and load document requested of the same id
    if (socket == null || quill == null) return

    socket.emit('get-document', documentId)
    
    socket.on('load-document', document => {
      quill.setContents(document)
      quill.enable()
    })
  }, [socket, quill, documentId])
  
  useEffect(() => {
    if (socket == null || quill == null) return
    const interval = setInterval(() => {
      socket.emit('save-changes', quill.getContents())
    },2000)
  },[socket,quill])

  return (
    <div className='container' ref={wrapperRef}>
          
    </div>
  )
}

export default TextEditor