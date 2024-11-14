import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const images = useMemo(() => [
    '/Images/images1.jpeg',
    '/Images/images2.jpeg',
    '/Images/images3.jpeg',
  ], []);

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [rotation, setRotation] = useState(0);
  const [products, setProducts] = useState([]);

  // Fetch products from "wings" database
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const changeImage = useCallback(() => {
    const nextImage = images[(images.indexOf(currentImage) + 1) % images.length];
    setCurrentImage(nextImage);
  }, [currentImage, images]);

  const rotateImage = () => {
    setRotation((prevRotation) => prevRotation + 45);
  };

  useEffect(() => {
    const imageInterval = setInterval(changeImage, 1000);
    const rotateInterval = setInterval(rotateImage, 1000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(rotateInterval);
    };
  }, [changeImage]);

  const data = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: 'Quantity',
        data: products.map(product => product.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Price (M)',
        data: products.map(product => product.price),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ textAlign: 'center' }}>
        <img
          src={currentImage}
          alt="Dashboard background"
          style={{
            width: '300px',
            height: 'auto',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
      <div style={{ width: '600px', margin: '20px auto' }}>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
}

export default Dashboard;
