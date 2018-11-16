 class UserController {
     constructor(formId, tableId) {
         this.formEl = document.getElementById(formId);
         this.tableEl = document.getElementById(tableId);
         this.init();
     }

     init() {
         this.addEventToButton();

     }

     addEventToButton() {

         //button save
         this.formEl.addEventListener("submit", (e) => {
             e.preventDefault();
             const values = this.getValues();

             if (!values) return false;

             var btn = this.formEl.querySelector("[type=submit]");
             btn.disabled = true;


             this.getPhoto().then((response) => {
                 values.photo = response;
                 btn.disabled = false;
                 this.formEl.reset();
                 this.addLine(values);
             }, (error) => {
                 console.error(error);
             }).catch((error) => {
                 console.error(error);
             });
         });

         //button cancel edit
         document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
             this.showPanelCreate();
         });

     }


     showPanelCreate() {
         document.querySelector("#box-user-create").style.display = "block";
         document.querySelector("#box-user-update").style.display = "none";
     }

     showPanelEdit() {
         document.querySelector("#box-user-create").style.display = "none";
         document.querySelector("#box-user-update").style.display = "block";

     }

     getPhoto() {
         return new Promise((resolve, reject) => {
             const fileReader = new FileReader();
             const photo = [...this.formEl.elements].filter(item => item.name === "photo");
             const file = photo[0].files[0];


             fileReader.onload = () => {
                 resolve(fileReader.result);
             };

             fileReader.onerror = e => reject(e);

             if (file) {
                 fileReader.readAsDataURL(file);
             } else {
                 resolve("dist/img/boxed-bg.jpg");
             };
         });
     }


     // /leitura de arquivos
     // getPhoto(callback) {
     //     const fileReader = new FileReader();
     //     const photo = [...this.formEl.elements].filter(item => item.name === "photo");
     //     const file = photo[0].files[0];


     //     fileReader.onload = () => {
     //         callback(fileReader.result);
     //     };


     //     fileReader.readAsDataURL(file);
     // }

     getValues() {
         const user = {};
         let isValid = true;

         [...this.formEl.elements].forEach((field) => {

             if (["name", "email", "password"].indexOf(field.name) > -1) {
                 //pegar o pai

                 if (!field.value) {
                     field.parentElement.classList.add("has-error");
                     isValid = false;
                 } else {
                     field.parentElement.classList.remove("has-error");
                 }
             }

             if (field.name === "gender") {
                 if (field.checked) {
                     user[field.name] = field.value;
                 }
             } else if (field.name === "admin") {
                 user[field.name] = field.checked;
             } else {
                 user[field.name] = field.value;
             }
         });

         if (!isValid) {
             return false;
         }

         return new User(user.name, user.gender,
             user.birth, user.country,
             user.email, user.password,
             user.photo, user.admin);
     }

     addLine(dataUser) {
         // console.log('AddLine', dataUser);
         var tr = document.createElement("tr");

         tr.dataset.user = JSON.stringify(dataUser);

         tr.innerHTML =
             `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(dataUser.createAt)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

         tr.querySelector(".btn-edit").addEventListener("click", e => {
             this.loadValues(JSON.parse(tr.dataset.user));
             this.showPanelEdit();

         });

         this.tableEl.appendChild(tr);

         this.updateCount();

     }

     loadValues(dataUser) {
         let form = document.querySelector("#form-user-update");
         for (let name in dataUser) {
             let field = form.querySelector("[name=" + name.replace("_", "") + "]");


             if (field) {

                 switch (field.type) {
                     case "file":
                         continue;
                         break;
                     case "radio":
                         field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + dataUser[name] + "]");
                         field.checked = true;

                         break;
                     case "checkbox":
                         field.checked = dataUser[name];
                         break;
                     default:
                         field.value = dataUser[name];
                 }

             }

         }
     }

     updateCount() {

         let numberUsers = 0;
         let numberAdmin = 0;
         [...this.tableEl.children].forEach(tr => {
             numberUsers++;

             let user = JSON.parse(tr.dataset.user);

             if (user._admin) {
                 numberAdmin++;
             }


         });

         document.querySelector("#number-user-admin").textContent = numberAdmin;
         document.querySelector("#number-user").textContent = numberUsers;
     }
 }
