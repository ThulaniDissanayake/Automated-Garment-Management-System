import React, { useState, useEffect } from 'react';
import BackButton from '../../components/SizeBackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditCustomer = () => {
  const [customerID, setCustomerID] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [contactNo1, setContactNo1] = useState('');
  const [contactNo2, setContactNo2] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/customers/${id}`)
      .then((response) => {
        const customerData = response.data;
        setCustomerID(customerData.CustomerID);
        setCustomerName(customerData.CustomerName);
        setAddress(customerData.Address);
        setCity(customerData.City);
        setCountry(customerData.Country);
        setCountryCode(customerData.CountryCode);
        setContactNo1(customerData.ContactNo1);
        setContactNo2(customerData.ContactNo2);
        setEmail(customerData.Email);
        
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage('An error occurred. Please check the console.');
        console.log(error);
      });
  }, [id]);

  const validateInputs = () => {
    const errors = {};

    // Validate Customer Name
    if (!customerName) {
      errors.customerName = 'Customer Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(customerName)) {
      errors.customerName = 'Customer Name must contain only letters and spaces';
    }

    // Validate City
    if (!city) {
      errors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(city)) {
      errors.city = 'City must contain only letters and spaces';
    }

    // Validate Country
    if (!country) {
      errors.country = 'Country is required';
    } else if (!/^[a-zA-Z\s]+$/.test(country)) {
      errors.country = 'Country must contain only letters and spaces';
    }

    // Validate Country Code
    if (!countryCode) {
      errors.countryCode = 'Country Code is required';
    } else if (!/^\+\d{1,3}$/.test(countryCode)) {
      errors.countryCode = 'Country Code must start with + and be 1 to 3 digits long';
    }

    // Validate Contact Numbers (minimum 12 digits)
    const contactNumberPattern = /^[0-9]{12,}$/; // Only digits, minimum 12 digits
    if (!contactNo1) {
      errors.contactNo1 = 'Primary Contact Number is required';
    } else if (!contactNumberPattern.test(contactNo1)) {
      errors.contactNo1 = 'Primary Contact Number must be at least 12 digits long and contain only numbers';
    }

    if (!contactNo2) {
      errors.contactNo2 = 'Secondary Contact Number is required';
    } else if (!contactNumberPattern.test(contactNo2)) {
      errors.contactNo2 = 'Secondary Contact Number must be at least 12 digits long and contain only numbers';
    }

    // Validate Address (optional, but can be added)
    if (!address) {
      errors.address = 'Address is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleEditCustomer = () => {
    const data = {
      CustomerID: customerID,
      CustomerName: customerName,
      Address: address,
      City: city,
      Country: country,
      CountryCode: countryCode,
      ContactNo1: contactNo1,
      ContactNo2: contactNo2,
      Email: email,
    };

    // Validate inputs
    if (!validateInputs()) return;

    setLoading(true);
    setErrorMessage(''); // Reset error message before making the request

    axios.put(`http://localhost:5555/customers/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/customers/home');
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 409) {
          setErrorMessage(error.response.data.message); // Display duplicate ID message
        } else {
          setErrorMessage('An error occurred. Please check the console.');
        }
        console.log(error);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
      <div className="brand">
          <img src="/company-logo.png" className='company-logo' alt='company-logo' />
        </div>
        <nav>
        <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to="/customers/home"><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apparels PVT LTD</h1>
        </header>
        <div className='button-container'></div>
        <div className='main-content p-4'>
          <BackButton />
          <h1 className='text-3xl my-4'>Edit Customer Record</h1>
          {loading && <Spinner />}
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Customer ID</label>
              <input
                type='text'
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
                readOnly
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Customer Name</label>
              <input
                type='text'
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.customerName && <p className='text-red-500'>{validationErrors.customerName}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Address</label>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.address && <p className='text-red-500'>{validationErrors.address}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>City</label>
              <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.city && <p className='text-red-500'>{validationErrors.city}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Country</label>
              <input
                type='text'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.country && <p className='text-red-500'>{validationErrors.country}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Country Code</label>
              <input
                type='text'
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.countryCode && <p className='text-red-500'>{validationErrors.countryCode}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Primary Contact Number</label>
              <input
                type='text'
                value={contactNo1}
                onChange={(e) => setContactNo1(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.contactNo1 && <p className='text-red-500'>{validationErrors.contactNo1}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Secondary Contact Number</label>
              <input
                type='text'
                value={contactNo2}
                onChange={(e) => setContactNo2(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              {validationErrors.contactNo2 && <p className='text-red-500'>{validationErrors.contactNo2}</p>}
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
            </div>
            <button onClick={handleEditCustomer} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
