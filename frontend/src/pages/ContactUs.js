import React from 'react';
import Navbar from '../components/PatientNavbar';
import ContactForm from '../components/ContactForm';

function ContactUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white p-8 shadow-xl rounded-2xl">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Contact Support</h2>
          <p className="text-gray-600 mb-8 text-center">
            If you have questions, suggestions, or issues with appointments, reach out below.
          </p>
          <ContactForm />
        </div>
      </div>
    </>
  );
}

export default ContactUs;
