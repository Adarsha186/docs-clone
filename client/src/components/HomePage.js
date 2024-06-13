import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
const HomePage = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        socket.emit('get-all-documents');

        socket.on('load-all-documents', (docs) => {
            setDocuments(docs);
            console.log(documents)
        });

        return () => {
            socket.off('load-all-documents');
        };
    }, []);
    return (
        <div>
            <h1>All Documents</h1>
            <ul>
                {documents.map((doc) => (
                    <li key={doc._id}>{doc._id}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
