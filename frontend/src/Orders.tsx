import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import './App.css';
import Swal from 'sweetalert2';
import env from "react-dotenv";
import { Link } from "react-router-dom";
import axios from 'axios';

interface Food {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  visible: boolean;
}

interface Order {
  id: string;
  food: Food;
  foodid: number;
  email: string;
  ready: boolean;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function fetchOrders() {
    try {
      const response = await axios.get(`${env.REACT_APP_BACKEND_URL}/api/order`, {withCredentials: true});
      const orders = response.data;
      setOrders(orders);
    } catch (error) {
      console.error(error);
    }
  }

  async function markOrderAsReady(orderId: string) {
    try {
      const response = await axios.put(`${env.REACT_APP_BACKEND_URL}/api/order/${orderId}`, { ready: true }, {withCredentials: true});
      if (response.status === 200) {
        setOrders(orders.map(order => order.id === orderId ? { ...order, ready: true } : order));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders">
      {orders.length > 0 ? (
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Navn</th>
              <th>Beskrivelse</th>
              <th>Pris</th>
              <th>Billede</th>
              <th>Email</th>
              <th>Klar</th>
              <th>Handling</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.food.name}</td>
                <td>{order.food.description}</td>
                <td>{order.food.price} kr.</td>
                <td>
                  <img src={order.food.image} alt={order.food.name} width="100" />
                </td>
                <td>{order.email}</td>
                <td>{order.ready ? 'Ja' : 'Nej'}</td>
                <td>
                  {!order.ready && (
                    <Button onClick={() => markOrderAsReady(order.id)} variant="success">
                      Marker som klar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Der er ingen ordrer</p>
      )}
    </div>
  );
}

export default Orders;
