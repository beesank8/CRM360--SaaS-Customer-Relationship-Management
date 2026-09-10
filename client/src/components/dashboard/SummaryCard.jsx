import {
  Users,
  UserPlus,
  IndianRupee
} from "lucide-react";

import { useNavigate } from "react-router-dom";



function SummaryCard({ stats }) {


  const navigate = useNavigate();




  const summary = [


    {
      title: "Today's Customers",

      value:
        stats
        ?
        stats.todayCustomers
        :
        "--",

      icon:
        <Users size={17} />,

      bg:
        "bg-blue-100",

      color:
        "text-blue-600",

      path:
        "/customers"

    },





    {
      title: "Today's Leads",

      value:
        stats
        ?
        stats.todayLeads
        :
        "--",

      icon:
        <UserPlus size={17} />,

      bg:
        "bg-purple-100",

      color:
        "text-purple-600",

      path:
        "/leads"

    },






    {
      title: "Today's Revenue",

      value:

        stats?.todayRevenue !== undefined

        ?

        `₹${stats.todayRevenue.toLocaleString("en-IN")}`

        :

        "--",


      icon:
        <IndianRupee size={17} />,

      bg:
        "bg-green-100",

      color:
        "text-green-600",

      path:
        "/analytics"

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





      {/* HEADER */}



      <div

        className="
        flex
        justify-between
        items-center
        mb-3
        "

      >



        <h2

          className="
          text-base
          font-semibold
          text-gray-800
          "

        >

          Today's Summary


        </h2>




      </div>









      {/* SUMMARY ITEMS */}



      <div

        className="
        space-y-2
        "

      >





      {

        summary.map((item,index)=>(



          <div


            key={index}


            onClick={()=>

              navigate(item.path)

            }


            className="
            flex
            items-center
            justify-between
            bg-gray-50
            rounded-lg
            px-3
            py-2
            cursor-pointer
            hover:bg-gray-100
            transition
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

                w-9
                h-9
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
                  text-gray-500
                  "

                >

                  {item.title}


                </p>







                <p

                  className="
                  text-sm
                  font-semibold
                  text-gray-800
                  "

                >

                  {item.value}


                </p>






              </div>







            </div>







          </div>




        ))

      }





      </div>






    </div>



  );


}



export default SummaryCard;