import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdSearch } from 'react-icons/md';
import Spinner from '../components/Spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EmployeeHome = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/employees')
      .then((response) => {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        setLoading(false);
      });
  }, []);
  

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter((employee) =>
        employee.fname.toLowerCase().includes(query) ||
        employee.idnumber.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(17);
    doc.text('Alpha Aperal(PVT)LTD', 120, 20);
    doc.text('Employee Report', 125, 35);
    doc.text('------------------------------------------------------------------------------------------', 60, 45);
    const columns = [
      { title: 'ID Number', dataKey: 'idnumber' },
      { title: 'Name', dataKey: 'fname' },
      { title: 'Designation', dataKey: 'designation' },
      { title: 'Department', dataKey: 'department' },
      { title: 'Join Date', dataKey: 'join_date' },
      { title: 'Basic Salary', dataKey: 'basic_salary' },
      { title: 'allowance', dataKey: 'allowance' }
    ];

    const data = filteredEmployees.map(emp => ({
      idnumber: emp.idnumber,
      fname: emp.fname,
      designation: emp.designation,
      department: emp.department,
      join_date: emp.join_date,
      basic_salary: emp.basic_salary,
      allowance: emp.allowance,
    }));

    doc.autoTable(columns, data, { startY: 50 });
    doc.save('employee_report.pdf');
  };

  // Convert Buffer data to base64 URL
  const getImageUrl = (bufferData) => {
    if (!bufferData) return null; // Handle undefined bufferData
    const base64String = btoa(
      new Uint8Array(bufferData.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:${bufferData.contentType};base64,${base64String}`;
  };



  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <img src='../public/company-logo.png' className='company-logo' alt='company-logo'></img>
        </div>
        <nav>
          <div className='nav-dept'><Link to="/"><img src='/public/home.png' className='icon' alt='Home' /> Home</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/inventory.png' className='icon' alt='Inventory' /> Inventory</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/tshirt.png' className='icon' alt='Design' /> Design</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/orders.png' className='icon' alt='Orders' /> Orders</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/supplier.png' className='icon' alt='Supplier' /> Supplier</Link></div>
          <div className='nav-dept'><Link to=""><img src='/public/marketing.png' className='icon' alt='Marketing' /> Marketing</Link></div>
          <div className='nav-dept'><Link to="/employee/home"><img src='/public/human-resource.png' className='icon' alt='Human Resource' /> Human Resource</Link></div>
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
        <div className='header-container'>
          <h1 className='text-3xl font-bold'>Manage All Employees Here</h1>
        </div>

        <div className='button-container'>
          <div className='search-container'>
            <div className='search-bar-container'>
              <MdSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search by Name or ID'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-bar'
              />
            </div>
          </div>
          <Link to='/employee/create'>
            <button className='button buttonAddNew'  style={{ width: "160px" }}>
              <img src='../public/add.png' className='icon' alt='Add' />Add Employee
            </button>
          </Link>
          <Link to='/training/home'>
            <button className='button buttonMaterial'  style={{ width: "160px" }}>
            <img src='../public/teaching.png' className='icon' alt='Add'/>Training
            </button>
          </Link>
          <button
            onClick={generatePDF}
            className='button generate-report'
          >
            <span className='icon'><img src='../public/pdf.png' alt='PDF' /></span>Report (PDF)
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='table-container'>
            <table className='dataTable'>
              <thead>
                <tr>
                  <th className='table-heading'>ID Number</th>
                  <th className='table-heading'>Name</th>
                  <th className='table-heading'>Designation</th>
                  <th className='table-heading'>Department</th>
                  <th className='table-heading'>Join Date</th>
                  <th className='table-heading'>Basic Salary</th>
                  <th className='table-heading'>Allowance</th>
                  <th className='table-heading'>Skill Level</th>
                  <th className='table-heading'>Birth Certificate</th>
                  <th className='table-heading'>Educational Certificate</th>
                  <th className='table-heading'>Medical Report</th>
                  <th className='table-heading'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="h-8">
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.idnumber || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.fname || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.designation || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.department || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.join_date || 'N/A'}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.basic_salary || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.allowance || 0}
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        {employee.skill_level || 'N/A'}
                      </td>
                      <td>
                            <img src={employee.doc1} alt="Birth Certificate" />
                      </td>
                      <td>
                            <img src={employee.doc2} alt="EducationaL Certificate" />
                      </td>
                      <td>
                            <img src={employee.doc3} alt="Medical Report" />
                      </td>
                      <td className="border border-slate-700 rounded-md text-center">
                        <div className="flex justify-center gap-x-4">
                          <Link to={`/employee/details/${employee._id}`}>
                            <BsInfoCircle className="text-2xl text-green-800" />
                          </Link>
                          <Link to={`/employee/edit/${employee._id}`}>
                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                          </Link>
                          <Link to={`/employee/delete/${employee._id}`}>
                            <MdOutlineDelete className="text-2xl text-red-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center p-4">
                      No employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHome;
