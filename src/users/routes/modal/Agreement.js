import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Agreement() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
        <h3>Thank you for choosing the Tricycle Fare Matrix Application ("Taxicle"). By using the App, you agree to the following terms and conditions and privacy policy:</h3>
            
            <h4>1. Acceptance of Terms</h4>
            <p> By accessing or using the App, you agree to comply with and be bound by these terms and conditions. If you do not agree to these terms, please do not use the App. </p>
            <h4>2. Use of the App</h4>
            <p> The App is intended for residents and visitors of Tarlac City seeking information about tricycle fares. Users must use the App in accordance with local laws and regulations. </p>
            <h4>3. Accuracy of Information</h4>
            <p> While we strive to provide accurate and up-to-date information, the tricycle fares displayed on the App are for reference purposes only. Fares may be subject to change, and users are encouraged to verify with local tricycle operators. </p>
            <h4>4. User Conduct</h4>
            <br></br>
            <em>Users agree not to:</em>
            <p> a. Use the App for any illegal or unauthorized purpose. </p>
            <p> b. Attempt to access, interfere with, or disrupt the App or its associated servers and networks.  </p>
            <p> c. Provide false or misleading information. </p>
            <h4>5. Privacy Policy</h4>
            <p> a. Information We Collect: </p>
            <p> When you use the App, we may collect personal information, such as your name, contact details, and location. </p>
            <p> We may also collect information about how you use the App, including the pages you view and other statistical data. </p>
            <p> b. How We Use Your Information: </p>
            <p> We use the information collected to provide you with accurate tricycle fare information for Tarlac City. </p>
            <p> Your usage data helps us improve the App's functionality, content, and user experience. </p>
            <p> c. Information Sharing: </p>
            <p> We may share your information with third-party service providers that assist us in delivering our services. </p>
            <p>  We may disclose your information in response to a court order, subpoena, or other legal process. </p>
            <h4> 6. User Privacy and Data Security </h4>
            <p> a. Data Security:</p>
            <p> We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. </p>
            <h4>7. Changes to Terms and Privacy Policy</h4>
            <p> We reserve the right to modify these terms and conditions and the privacy policy at any time. Users will be notified of any changes, and continued use of the App constitutes acceptance of the modified terms. </p>
            <h4>8. Contact Information </h4>
            <p> For questions or concerns regarding these terms and conditions and the privacy policy, please contact us at <em>[taxicleapptarlac@gmail.com]</em>. </p>

            <h4><em>By using the “Taxicle”, you acknowledge that you have read, understood, and agreed to these terms and conditions and the privacy policy.</em></h4>
    </div>
  );
  
}

export default Agreement;