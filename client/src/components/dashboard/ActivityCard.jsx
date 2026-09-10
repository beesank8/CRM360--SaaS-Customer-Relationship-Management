import {
  Users,
  UserPlus,
  Clock
} from "lucide-react";

import { useState } from "react";

import ActivityDrawer from "./ActivityDrawer";



function ActivityCard({ stats }) {



  const [showActivities, setShowActivities] =
    useState(false);




  const activities =
    stats?.activities || [];






  return (


    <div

      className="
      bg-white
      rounded-xl
      border
      border-gray-200
      shadow-sm
      p-4
      h-full
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

          Recent Activity

        </h2>






        <button


          onClick={()=>
            setShowActivities(true)
          }


          className="
          text-xs
          text-blue-600
          hover:underline
          font-medium
          "

        >

          View All


        </button>





      </div>









      {/* ACTIVITY LIST */}



      <div

        className="
        space-y-3
        "

      >





      {

        activities.length === 0 ?



        (

          <div

            className="
            text-center
            text-sm
            text-gray-400
            py-6
            "

          >

            No recent activity


          </div>


        )



        :



        activities

        .slice(0,3)

        .map((item,index)=>(



          <div


            key={index}


            className="
            flex
            items-center
            gap-3
            bg-gray-50
            rounded-lg
            p-3
            hover:bg-gray-100
            transition
            "

          >







            {/* ICON */}



            <div


              className={`

              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center

              ${
                item.type === "lead"

                ?

                "bg-purple-100 text-purple-600"

                :

                "bg-blue-100 text-blue-600"

              }

              `}


            >



              {


                item.type === "lead"

                ?

                <UserPlus size={16}/>

                :

                <Users size={16}/>


              }



            </div>









            {/* CONTENT */}



            <div

              className="
              flex-1
              "

            >



              <p

                className="
                text-sm
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

                {item.description}


              </p>






            </div>









            {/* TIME */}



            <span

              className="
              text-xs
              text-gray-400
              flex
              items-center
              gap-1
              "

            >



              {

                item.time

                ?

                item.time

                :

                <Clock size={13}/>

              }



            </span>








          </div>



        ))

      }





      </div>












      <ActivityDrawer


        open={showActivities}


        onClose={()=>
          setShowActivities(false)
        }


        activities={activities}


      />









    </div>


  );


}



export default ActivityCard;