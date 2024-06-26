import { useNavigate } from "react-router-dom";
import DisplayStudyData from "./AdminDisplayStudyData";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { useState, useEffect } from "react";
import './ManageStudyView.css';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import ValidateDomain from "./validation";
import NavigationBar from './NavigationBar';

function AdminManageStudy() {

    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state);


    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((userAuth) => {
        const user = {
          email: userAuth?.email,
          role: userAuth?.displayName,
          id: userAuth?.uid
        };
        setUser(user);
        setLoading(false);
  
        if (!userAuth || user.role !== "admin") {
          navigate("/Login");
        }
      });
  
      return unsubscribe;
    }, []);
  
    if (loading) {
      // Fixes the issue of the view briefly showing
      return null;
    }
    

    const logout = async () => {
      await signOut(auth);
      navigate("/");
    };

    const gotoHomePage = () => {
        navigate("/View", { state: { user } });
    };
    
    const gotoPatientPage = () => {
        navigate("/AdminManagePatient", { state: { user } });
    };

    return (
        <div className='adminViewMg'> 
            <NavigationBar isAdminView={true} user={user}/>

            <div className='doctorNavButtonLocations' >
                <div className="welcomeBro" style={{borderColor: '#6fabd0'}}>
                    <button onClick = {gotoHomePage} className='welcomeContainer' style={{color: '#6fabd0'}}>Welcome Page</button>
                </div>

                <div className='welcomeBro' style={{borderColor: '#6fabd0'}}>
                    <button onClick = {gotoPatientPage} className='welcomeContainer' style={{color: '#6fabd0'}}>Manage Patient</button>
                </div>
            </div>

            <Sidebar></Sidebar>

            <div className='patientTableLocation' >
                <DisplayStudyData nameSearch={""} statusSearch={""} startSearch={""} isAdminView={true}/>
            </div>

        </div>
    );

}

export default AdminManageStudy;