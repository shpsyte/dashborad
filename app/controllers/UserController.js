class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.init();
    }
    init() {
        this.onSubmit();
    }

    onSubmit() {
        this.formEl.addEventListener("submit", (e) => {

            e.preventDefault();

            const user = this.getValues();
            user.photo = "";
            this.getPhoto();
            this.addLine(user);
        });
    }

    getPhoto() {
        const fileReader = new FileReader();

        let photo = [...this.formEl.elements].filter(item => item.name == "photo");

        console.log(photo);

        fileReader.onload = () => {};
        fileReader.readAsDataURL();
    }

    getValues() {
        const user = {};
        [...this.formEl.elements].forEach((field) => {
            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            }
        });
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }
    addLine(dataUser) {
        // console.log('AddLine', dataUser);
        this.tableEl.innerHTML = `<tr>
                            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                            <td>${dataUser.name}</td>
                            <td>${dataUser.email}</td>
                            <td>${dataUser.admin}</td>
                            <td>${dataUser.birth}</td>
                            <td>
                            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                            </td>
                        </tr>`;
    }
}
