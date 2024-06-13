import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecentDocuments = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/documents');
                setDocuments(response.data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <div className="recent-docs">
            <h4>Recent Documents</h4>
            <div className="d-flex flex-wrap">
                {documents.map(doc => (
                    <div key={doc._id} className="doc-card m-2 p-2 border">
                        <h5>{doc.name || 'Untitled Document'}</h5>
                        <p>{doc.data.slice(0, 100)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentDocuments;
