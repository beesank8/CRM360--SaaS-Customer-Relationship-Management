import {
  Users,
  UserCheck,
  UserPlus,
  Building2
} from "lucide-react";


function CustomerKPICards({ stats }) {


const cards = [

{
title:"Total Customers",
value:stats?.totalCustomers ?? 0,
icon:<Users size={22}/>,
style:"bg-blue-100 text-blue-600"
},


{
title:"Active Customers",
value:stats?.activeCustomers ?? 0,
icon:<UserCheck size={22}/>,
style:"bg-green-100 text-green-600"
},


{
title:"Added Today",
value:stats?.todayCustomers ?? 0,
icon:<UserPlus size={22}/>,
style:"bg-purple-100 text-purple-600"
},


{
title:"Companies",
value:stats?.companies ?? 0,
icon:<Building2 size={22}/>,
style:"bg-orange-100 text-orange-600"
}

];





return (

<div

className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-4
"

>


{

cards.map((card,index)=>(


<div

key={index}

className="
bg-white
rounded-2xl
border
border-gray-200
shadow-sm
p-5
hover:shadow-md
transition
"

>


<div

className="
flex
items-center
justify-between
"

>


<div>


<p

className="
text-sm
text-gray-500
"

>

{card.title}

</p>


<h2

className="
text-3xl
font-bold
text-gray-800
mt-2
"

>

{card.value}

</h2>


</div>





<div

className={`
w-12
h-12
rounded-xl
flex
items-center
justify-center
${card.style}
`}

>

{card.icon}

</div>



</div>


</div>


))


}


</div>


);


}


export default CustomerKPICards;