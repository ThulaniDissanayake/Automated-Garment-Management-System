import React, { useState } from "react";
import BackButton from "../../components/MarketingBackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom"; // Make sure Link is imported

const DeleteDiscount = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteDiscount = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/discounts/${id}`)
      .then(() => {
        setLoading(false);
        navigate("/discounts/home"); // Redirect after successful deletion
      })
      .catch((error) => {
        setLoading(false);
        alert("An error occurred. Please try again later.");
        console.log(error);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="../public/company-logo.png" className="company-logo" alt="company-logo" />
        </div>
        <nav>
        <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to="e"><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to="/discounts/home"><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
          <div className='nav-dept financial'>
            <Link to="">
              <img src='/public/financial.png' className='icon' alt='Financial' /> Financial
            </Link>
            <div className='dropdown'>
              <Link to="/fundRequests/create">Request Fund</Link>
              <Link to="">Finance Dashboard</Link>
            </div>
          </div>
          <div className='nav-dept'><Link to=""><img src='/public/transport.png' className='icon' alt='Transport' /> Transport</Link></div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1 className="text-3xl font-bold company-name">Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'>
      </div>
        <div className="main-content p-4">
          <BackButton />
          <h1 className="text-3xl my-4">Delete Discount</h1>
          {loading && <Spinner />}
          <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
            <h3 className="text-2xl">Are you sure you want to delete this discount?</h3>
            <button
              className="p-4 bg-red-600 text-white m-8 w-full"
              onClick={handleDeleteDiscount}
            >
              Yes, Delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscount;
