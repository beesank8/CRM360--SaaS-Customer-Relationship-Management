function DeleteLeadModal({

  open,

  lead,

  onClose,

  onConfirm,

}) {



if(!open || !lead)

return null;





return (

<div

className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
"

>



<div

className="
bg-white
rounded-2xl
p-6
w-[400px]
shadow-xl
"

>



<h2

className="
text-xl
font-bold
mb-4
"

>

Delete Lead?

</h2>








<p

className="
text-gray-600
mb-6
"

>

Are you sure you want to delete

<b>

{" "}

{lead.name}

</b>

?

</p>









<div

className="
flex
justify-end
gap-3
"

>





<button

onClick={onClose}

className="
px-5
py-2
border
rounded-xl
hover:bg-gray-100
"

>

Cancel

</button>








<button

onClick={()=>{


onConfirm();


}}

className="
px-5
py-2
bg-red-600
text-white
rounded-xl
hover:bg-red-700
"

>

Delete

</button>






</div>







</div>



</div>


);


}



export default DeleteLeadModal;