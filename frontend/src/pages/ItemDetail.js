import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/atoms/ui/button';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!item) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <div className="p-4">
        <Button variant="outline" asChild>
          <Link to="/">
            ← Back
          </Link>
        </Button>
      </div>
      
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
          <p className="mb-2"><strong>Category:</strong> {item.category}</p>
          <p><strong>Price:</strong> ${item.price}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;