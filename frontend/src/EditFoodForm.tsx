import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import env from 'react-dotenv';
import axios from 'axios';
import Header from './Header';

type FoodData = {
    name: string;
    description: string;
    price: number | undefined;
    image: string;
    visible: boolean;
};

function EditFoodForm() {
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const history = useNavigate();
    const [foodData, setFoodData] = useState<FoodData>();

    useEffect(() => {
        async function fetchFood() {
            try {
                const response = await axios.get(`${env.REACT_APP_BACKEND_URL}/api/food/${id}`, {
                    withCredentials: true,
                });
                setFoodData(response.data["data"]);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchFood();
    }, [id]);

    const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.put(`${env.REACT_APP_BACKEND_URL}/api/food/${id}`, foodData, {
                withCredentials: true,
            });

            Swal.fire({
                icon: 'success',
                title: 'Succes!',
                text: 'Retten er netop opdateret',
            });

            history("/add")
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Fejl',
                text: 'Der opstod en fejl ved opdatering af retten',
            });
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const target = event.target as HTMLInputElement; // Add this line
        const { name, value, checked } = target; // Change this line
    
        if (foodData) {
            if (name === 'price') {
                const price = parseFloat(value);
                setFoodData({ ...foodData, [name]: isNaN(price) ? 0 : price });
            } else if (name === 'visible') {
                setFoodData({ ...foodData, [name]: checked });
            } else {
                setFoodData({ ...foodData, [name]: value });
            }
        }
    };

            return (
            <div>
                <Header />
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='form'>
                        <Form onSubmit={onFormSubmit}>
                            <Form.Control
                                name='name'
                                type='text'
                                placeholder='Navn på retten'
                                value={foodData?.name || ''}
                                onChange={handleChange}
                            />
                            <br />
                            <Form.Control
                                name='description'
                                type='text'
                                placeholder='Beskrivelse af retten'
                                value={foodData?.description || ''}
                                onChange={handleChange}
                            />
                            <br />
                            <Form.Control
                                name='price'
                                type='text'
                                placeholder='Pris i kr.'
                                value={foodData?.price || ''}
                                onChange={handleChange}
                            />
                            <br />
                            <Form.Control
                                name='image'
                                type='text'
                                placeholder='Billed URL'
                                value={foodData?.image || ''}
                                onChange={handleChange}
                            />
                            <br />
                            <Form.Check
                                name='visible'
                                //  id='visible-switch'
                                type='switch'
                                label='Synlig'
                                checked={foodData?.visible || false}
                                onChange={handleChange}
                            />
                            <br />
                            <div className='d-grid gap-2'>
                                <Button variant='primary' type='submit'>
                                    Opdater
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
            );
}

            export default EditFoodForm;
