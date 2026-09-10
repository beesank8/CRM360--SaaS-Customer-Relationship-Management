import { useEffect } from "react";

import { useForm } from "react-hook-form";


function LeadForm({

  onSubmit,

  onClose,

  defaultValues = {}

}) {



  const {

    register,

    handleSubmit,

    reset

  } = useForm({

    defaultValues

  });







  useEffect(()=>{


    reset(defaultValues);


  },[defaultValues, reset]);









return (


<form

onSubmit={
handleSubmit(onSubmit)
}

className="
space-y-5
"

>





<div

className="
grid
grid-cols-2
gap-5
"

>







<input

{...register("name")}

placeholder="Full Name"

className="
border
rounded-xl
px-4
py-3
"

/>









<input

{...register("company")}

placeholder="Company"

className="
border
rounded-xl
px-4
py-3
"

/>









<input

{...register("email")}

placeholder="Email"

className="
border
rounded-xl
px-4
py-3
"

/>









<input

{...register("phone")}

placeholder="Phone"

className="
border
rounded-xl
px-4
py-3
"

/>









<input

{...register("industry")}

placeholder="Industry"

className="
border
rounded-xl
px-4
py-3
"

/>









<select

{...register("source")}

className="
border
rounded-xl
px-4
py-3
"

>


<option value="Website">
Website
</option>


<option value="Instagram">
Instagram
</option>


<option value="Facebook">
Facebook
</option>


<option value="Google Ads">
Google Ads
</option>


<option value="LinkedIn">
LinkedIn
</option>


<option value="Referral">
Referral
</option>


<option value="Walk-In">
Walk-In
</option>


<option value="Cold Call">
Cold Call
</option>


<option value="Other">
Other
</option>


</select>









<select

{...register("status")}

className="
border
rounded-xl
px-4
py-3
"

>


<option value="New">
New
</option>



<option value="Contacted">
Contacted
</option>



<option value="Interested">
Interested
</option>



<option value="Qualified">
Qualified
</option>



<option value="Negotiation">
Negotiation
</option>



<option value="Won">
Won
</option>



<option value="Lost">
Lost
</option>



</select>









<select

{...register("priority")}

className="
border
rounded-xl
px-4
py-3
"

>


<option value="High">
High
</option>


<option value="Medium">
Medium
</option>


<option value="Low">
Low
</option>


</select>









<input

type="number"

{...register("expectedValue")}

placeholder="Expected Value"

className="
border
rounded-xl
px-4
py-3
"

/>









<input

type="number"

{...register("probability")}

placeholder="Probability %"

className="
border
rounded-xl
px-4
py-3
"

/>







</div>









<textarea

{...register("notes")}

rows="5"

placeholder="Notes..."

className="
border
rounded-xl
px-4
py-3
w-full
"

/>









<div

className="
flex
justify-end
gap-3
"

>



<button

type="button"

onClick={onClose}

className="
px-6
py-3
rounded-xl
border
hover:bg-gray-100
"

>

Cancel

</button>









<button

type="submit"

className="
px-6
py-3
rounded-xl
bg-blue-600
text-white
hover:bg-blue-700
"

>

Save Lead

</button>






</div>







</form>


);


}


export default LeadForm;