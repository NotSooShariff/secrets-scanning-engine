"use client"
import React, { useState, useEffect } from "react";
import { FaFileCode } from "react-icons/fa";

const severityColors = {
  low: "bg-green-600 text-grey-300",
  medium: "bg-yellow-500 text-black",
  high: "bg-red-700 text-grey-300",
};

const Accordion = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeHeading, setActiveHeading] = useState(null);

  const toggleContent = (headingId) => {
    setActiveHeading(headingId === activeHeading ? null : headingId);
  };
  
  const mockData = [
      {
          "fileName": "/Desktop/site/auth.js",
          "sensitiveFindings": [
              "JWT_ASYNC_SECERT_KEY",
              "JWT_CLIENT_SECRET_KEY",
              "JWT_COMMAND_CENTER_SECRET_KEY",
              "JWT_LOOKUP_SECERT_KEY",
              "JWT_SECRET",
              "JWT_WEB_SECERT_KEY",
              "JWT_XMPP_SECERT_KEY"
              
            ],
            "cvssScore": 7.5,
            "epssScore": 4.2,
            "combinedScore": 5.8
        },
        {
            "fileName": "/Desktop/site/credentials.json",
            "sensitiveFindings": [
                "AWS_ACCESS_KEY",
                "AWS_SECRET_KEY",
                "AWS_REGION",
                "DB_HOST",
                "DB_PORT",
                "DB_NAME",
                "ADMIN_API_KEY",
                "ADMIN_PASSWORD",
                "FIREBASE_API_JSON",
                "FIREBASE_API_TOKEN",
                "DB_CONNECTION_STRING",
                "DB_USERNAME",
                "DB_PASSWORD"

            ],
            "cvssScore": 8.7,
            "epssScore": 6.5,
            "combinedScore": 7.6
        },
        {
            "fileName": "/Desktop/site/firebase.config",
            "sensitiveFindings": [
                "FIREBASE_API_JSON",
                "FIREBASE_API_TOKEN"
            ],
            "cvssScore": 9.4,
            "epssScore": 6.2,
            "combinedScore": 7.5
        },
        {
            "fileName": "/Desktop/app/controllers/userController.js",
            "sensitiveFindings": [
                "DB_CONNECTION_STRING",
                "DB_USERNAME",
                "DB_PASSWORD"
            ],
            "cvssScore": 8.2,
            "epssScore": 5.7,
            "combinedScore": 6.9
        },
        {
            "fileName": "/Desktop/app/routes/adminRoutes.js",
            "sensitiveFindings": [
                "ADMIN_API_KEY",
                "ADMIN_PASSWORD"
            ],
            "cvssScore": 7.8,
            "epssScore": 4.9,
            "combinedScore": 6.1
        },
        {
            "fileName": "/Desktop/site/config.js",
            "sensitiveFindings": [
                "DB_HOST",
                "DB_PORT",
                "DB_NAME"
            ],
            "cvssScore": 6.3,
            "epssScore": 3.8,
            "combinedScore": 5.0
        }
    ];
    
    useEffect(() => {
  //     const handleApiData = (event, data) => {
        setData(mockData);
  //     };
  
  //     window.addEventListener('api-data', handleApiData);
  
  //     return () => {
      //       window.removeEventListener('api-data', handleApiData);
  //     };
    }, []);
    
    const renderSeverityBadge = (numFindings) => {
    const severity =
      numFindings < 3
      ? "low"
      : numFindings > 10
      ? "high"
        : "medium";
        return (
      <span className={`font-medium ml-auto px-3 py-1 rounded-full ${severityColors[severity]}`}>
        Exposed : {numFindings}
      </span>
    );
  };

  const renderContent = (report) => (
    <div className="p-5 border border-gray-700 bg-gray-900">
      <p className="mb-5 text-gray-300">This code file has a CVSS score of {report.cvssScore} and an EPSS score of {report.epssScore}. Our systems give it a combined vulnerability rating of {report.combinedScore}</p>
      <p className="mb-2 text-gray-300"><strong>Sensitive Findings:</strong></p>
      <ul className="list-disc pl-4">
        {report.sensitiveFindings.map((finding) => (
          <li className="mb-2 text-gray-300" key={finding}>{finding}</li>
        ))}
      </ul>
    </div>
  );

  

  return (
    <div>
      {error ? (
        <p>Error fetching data: {error.message}</p>
      ) : isLoading ? (
        <p>Loading data...</p>
      ) : (
        <div className="pt-10 pb-16" id="accordion-collapse" data-accordion="collapse">
          {data.map((report) => (
            <div key={report.fileName}>
              <h2 id={`accordion-collapse-heading-${report.fileName}`}>
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right border focus:ring-4 focus:ring-gray-800 border-gray-700 text-gray-300 hover:bg-gray-800 gap-3"
                  data-accordion-target={`#accordion-collapse-body-${report.fileName}`}
                  aria-expanded="false"
                  aria-controls={`accordion-collapse-body-${report.fileName}`}
                  onClick={() => toggleContent(`accordion-collapse-heading-1`)}
                >
                  <FaFileCode className="text-3xl"/>
                  <span>{report.fileName}</span>
                  {renderSeverityBadge(report.sensitiveFindings.length)}
                  <svg
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-collapse-body-${report.fileName}`}
                className={activeHeading === "accordion-collapse-heading-1" ? "" : "hidden"}
                aria-labelledby={`accordion-collapse-heading-${report.fileName}`}
              >
                {renderContent(report)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accordion;
