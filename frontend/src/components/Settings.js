import React, { useState } from 'react';
import '../styles/settings.css';
import ChangePassword from './ChangePassword'; 

export default function Settings() {

    //state variable to track current active tab
    const [currentTab, setCurrentTab] = useState('settings'); 

    const handleTabClick = (tabName) => {
        setCurrentTab(tabName); 
    };


    // rendering the content of the active tab based on the current tab state
    const renderTabContent = () => {
        // switch statement to determine current active tab
        switch (currentTab) {

          case 'changePassword':
            // resnder respective component
            return <ChangePassword />;


          default:
            return null;
        }
    };

    return (
        <div>
            <div className="settingsFeed">
                <div className="settings-box">
                    <h3>Settings</h3>
                </div>
                <div className="settings-content">
                <ul className="tabs">

                    {/* set the class based on whetehr the current tab is that particular class  and attach an event handler to handle tab clicks*/}

            <li className={currentTab === 'changePassword' ? 'active-tab' : 'inactive-tab'} onClick={() => handleTabClick('changePassword')}>
              Change Password
            </li>
            <li className={currentTab === 'privacy' ? 'active-tab' : 'inactive-tab'} onClick={() => handleTabClick('privacy')}>
              Privacy Settings
            </li>
            <li className={currentTab === 'terms' ? 'active-tab' : 'inactive-tab'} onClick={() => handleTabClick('terms')}>
              Terms and Conditions
            </li>
            <li className={currentTab === 'monetization' ? 'active-tab' : 'inactive-tab'} onClick={() => handleTabClick('monetization')}>
              Monetization
            </li>
          </ul>
       
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
