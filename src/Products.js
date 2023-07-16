import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './Axios';
import Loader from './loader/Loader';

function ProductsComponent() {
    const [lowerRange, setLowerRange] = useState(0);
    const [upperRange, setUpperRange] = useState(100000);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getAllProducts();
        
    }, []);
    const getAllProducts = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/v1/products');
            setProducts(data.data);
            setFilteredProducts(data.data);
            setIsLoading(false);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    const filterProducts = () => {
        const temp = [];
        products.forEach(product => {
            if (product.price > lowerRange && product.price < upperRange) {
                temp.push(product);
            }
        });
        setFilteredProducts(temp);
    };
    return (
       <div className="container my-5">
        <div className='row'>
            <div className="col-sm-3">
                <div className="row">
                    <div className="col-sm">
                        <select onChange={($event) => {setLowerRange(Number($event.target.value)); filterProducts();}}>
                            <option>0</option>
                            <option>10000</option>
                            <option>20000</option>
                        </select>
                    </div>
                    <div className="col-sm">
                        <select onChange={($event) => {setUpperRange(Number($event.target.value)); filterProducts();}}>
                            <option>10000</option>
                            <option>20000</option>
                            <option>30000</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-sm-9">
                {isLoading ? (
                    <Loader />
                ) : (<React.Fragment>
                    {filteredProducts.map(product => (
                        <div className="row my-3 py-3 border-bottom">
                            <div className="col-sm-3">
                                <img src={product.imgSrc} width="150px"/>
                            </div>
                            <div className="col-sm-6">
                                <h4><Link to={`/product-details/${product.id}/${product.name}/description?productName=${product.name}&price=${product.price}`} target="_blank">{product.name}</Link></h4>
                                <p><span class="badge text-bg-primary">{product.avgRating} <i class="fa-solid fa-star"></i></span><span className="mx-3">{product.rating}</span><span>{product.review}</span> </p>
                                <ul>
                                    {product.specifications.map(specification => (
                                        <li>{specification}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-sm-3">
                                <h4>{product && product.price}</h4>
                                {product.inStock ? (
                                    <button className="btn btn-success">Add to Cart</button>
                                ) : (
                                    <button className="btn btn-danger">Out of Stock</button>
                                )}
                            </div>
                        </div>
                    ))}
                </React.Fragment>)}
                
            </div>
        </div>
       </div> 
    )
}

export default ProductsComponent;