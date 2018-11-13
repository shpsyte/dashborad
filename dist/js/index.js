
// let name = document.querySelector("#exampleInputName");
// let gender = document.querySelector("#form-user-create [name=gender]:checked");
// var birth = document.querySelector("#exampleInputBirth")
// var country = document.querySelector("#exampleInputCountry")
// var email = document.querySelector("#exampleInputEmail1")
// var password = document.querySelector("#exampleInputPassword1")
// var photo = document.querySelector("#exampleInputFile")
// var admin = document.querySelector("#inputAdmin")



var fields = document.querySelectorAll("#form-user-create [name]")
var user = {};

addLine = (dataUser) => {
    console.log('AddLine', dataUser);
    typeof(dataUser);
 
    document.getElementById("table-user").innerHTML =
                    `<tr>
                        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin}</td>
                        <td>${dataUser.birth}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    </tr>`

   




}


var form = document.getElementById('form-user-create').addEventListener('submit', e =>{
    e.preventDefault();
        
    fields.forEach((field,index) => {

        if (field.name == "gender")
        {
            if (field.checked){
                user[field.name] = field.value;
            }
        } else{

            user[field.name] = field.value;
        }
    });

    var obj = new User(
                        user.name, 
                        user.gender, 
                        user.birth, 
                        user.country, 
                        user.email, 
                        user.password, 
                        user.photo, 
                        user.admin
                    );


    addLine(obj);

    
})

