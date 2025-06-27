import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../../components/MaterialRequirementBAckButton';
import Spinner from '../../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ShowMaterialRequirement = () => {
  const [materialRequirement, setMaterialRequirement] = useState({});
  const [designs, setDesigns] = useState({}); // Define the designs state
  const [loading, setLoading] = useState(false);
  const [designQty, setDesignQty] = useState(1);  // State to capture user input for required quantity
  const [totalRequirements, setTotalRequirements] = useState([]);  // To store total material requirements
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/materialRequirement/${id}`)
      .then((response) => {
        setMaterialRequirement(response.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  // Convert Base64 string to Data URL
  const getBase64ImageUrl = (base64String) => {
    return `data:${designs.contentType};base64,${base64String}`;
  };

  // Function to calculate total material requirement based on design quantity
  const calculateTotalRequirements = () => {
    if (materialRequirement.materials) {
      const totals = materialRequirement.materials.map(material => ({
        materialID: material.materialID,
        totalQty: material.qtyRequired * designQty
      }));
      setTotalRequirements(totals);
    }
  };

  // Function to generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);

    // Report Title
    doc.text('Alpha Apperal (PVT) LTD', 80, 20);
    doc.text('Material Requirement Report', 75, 35);
    doc.text('------------------------------------------------------------------------------------------', 15, 45);

    // Design and Size Info (Displayed only once at the top)
    doc.setFontSize(12);
    doc.text(`Design ID: ${materialRequirement.designID}`, 15, 55);
    doc.text(`Size ID: ${materialRequirement.sizeID}`, 15, 65);

    // Table columns
    const columns = ['Material ID', 'Total Quantity Required'];

    // Table data (without Design ID and Size ID)
    const rows = totalRequirements.map(req => [
      req.materialID,
      req.totalQty
    ]);

    // Generate the table starting after the Design ID and Size ID
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 75  // Adjust the start position after the Design/Size info
    });

    // Save the PDF
    doc.save('MaterialRequirementReport.pdf');
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src="/company-logo.png" className='company-logo' alt='company-logo'></img>
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to="/design/home"><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to= ""><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
          <h1 className='text-3xl font-bold company-name'>Alpha Apperals PVT LTD</h1>
        </header>
        <div className='button-container'></div>

        <div className="main-content flex-1 p-6">
          <BackButton />
          <h1 className='text-3xl my-4'>Show Material Requirement Record</h1>
          {loading ? (
            <Spinner />
          ) : (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              {/* Input for design quantity */}
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Design ID: </span>
                <span>{materialRequirement.designID}</span>
              </div>

              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Size ID: </span>
                <span>{materialRequirement.sizeID}</span>
              </div>

              {materialRequirement.materials && materialRequirement.materials.map((material, index) => (
                <div key={index} className='my-4'>
                  <div className='my-4'>
                    <span className='text-xl mr-4 text-gray-500'>Material ID {index + 1}: </span>
                    <span>{material.materialID} {material.unit}</span>
                  </div>
                  <div className='my-4'>
                    <span className='text-xl mr-4 text-gray-500'>Quantity Required {index + 1}: </span>
                    <span>{material.qtyRequired}</span>
                  </div>
                </div>
              ))}
              <div className='my-4'>
                <label className='text-xl mr-4 text-gray-500'>Enter Design Quantity: </label>
                <input
                  type="number"
                  value={designQty}
                  onChange={(e) => setDesignQty(e.target.value)}
                  className='border p-2'
                />
                <button onClick={calculateTotalRequirements} className='ml-4 p-2 bg-blue-500 text-white'>Calculate</button>
              </div>
              {/* Display total material requirements */}
              {totalRequirements.length > 0 && (
                <div className='my-4'>
                  <h2 className='text-2xl font-bold'>Total Material Requirements:</h2>
                  {totalRequirements.map((req, index) => (
                    <div key={index} className='my-2'>
                      <span className='text-xl'>{`Material ${index + 1} (ID: ${req.materialID}): `}</span>
                      <span>{req.totalQty}</span>
                    </div>
                  ))}
                  <button onClick={generateReport} className='mt-4 p-2 bg-green-500 text-white'>
                    Generate Report
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMaterialRequirement;
