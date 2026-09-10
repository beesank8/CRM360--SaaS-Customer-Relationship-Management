import { useEffect, useState } from "react";

import {
  Database,
  Server,
  HardDrive,
  Globe
} from "lucide-react";

import { getCrmStatus } from "../../services/dashboardService";


function CRMStatus() {

  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {

    let isMounted = true;

    getCrmStatus()
      .then((data) => {
        if (isMounted) {
          setStatus(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
        }
      });

    return () => {
      isMounted = false;
    };

  }, []);

  const storageLabel =
    status && typeof status.storagePercent === "number"
      ? `${status.storagePercent}%`
      : "Unknown";

  const items = [

    {
      title: "Server",
      value: error ? "Unreachable" : status?.server || "Checking...",
      icon: <Server size={16}/>,
      bg: "bg-green-100",
      color: "text-green-600",
      badge: error ? "Offline" : status?.server || "…",
      badgeColor: error ? "text-red-600" : "text-green-600"
    },


    {
      title: "Database",
      value: error ? "Unknown" : status?.database || "Checking...",
      icon: <Database size={16}/>,
      bg: "bg-blue-100",
      color: "text-blue-600",
      badge: error ? "Unknown" : status?.database || "…",
      badgeColor:
        status?.database === "Connected"
          ? "text-green-600"
          : "text-orange-500"
    },


    {
      title: "Storage",
      value: error ? "Unknown" : storageLabel,
      icon: <HardDrive size={16}/>,
      bg: "bg-orange-100",
      color: "text-orange-600",
      badge: error ? "Unknown" : storageLabel,
      badgeColor: "text-orange-500"
    },


    {
      title: "API",
      value: error ? "Unreachable" : status?.api || "Checking...",
      icon: <Globe size={16}/>,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
      badge: error ? "Offline" : status?.api || "…",
      badgeColor: error ? "text-red-600" : "text-green-600"
    }

  ];


  return (


    <div
      className="
      bg-white
      rounded-xl
      border
      border-gray-200
      shadow-sm
      p-4
      "
    >




      <h2
        className="
        text-base
        font-semibold
        text-gray-800
        mb-3
        "
      >

        CRM Status

      </h2>






      <div
        className="
        space-y-2
        "
      >



        {

          items.map((item,index)=>(


            <div

              key={index}

              className="
              flex
              items-center
              justify-between
              "

            >





              <div
                className="
                flex
                items-center
                gap-3
                "
              >



                <div
                  className={`
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                  ${item.color}
                  `}
                >

                  {item.icon}

                </div>







                <div>

                  <p
                    className="
                    text-xs
                    font-medium
                    text-gray-800
                    "
                  >

                    {item.title}

                  </p>


                  <p
                    className="
                    text-xs
                    text-gray-500
                    "
                  >

                    {item.value}

                  </p>


                </div>



              </div>






              <span
                className={`
                text-xs
                font-semibold
                ${item.badgeColor}
                `}
              >

                {item.badge}

              </span>




            </div>


          ))

        }




      </div>




    </div>


  );


}


export default CRMStatus;
