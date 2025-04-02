var logincadastrados = []; //usado apenas para teste no front

$(document).ready(function() {
 
    $('#data_nascimento_cadastro').mask('00/00/0000');

    $('#data_nascimento_cadastro').on('input', function () {
        $(this).mask('00/00/0000');
    });

});

async function Login(){

    let email = $("#email").val();
    let senha = $("#senha").val();

    if(email == "" || email == null || email == undefined){

        $("#mensagem_erro_login").text("Campo 'Email' não pode ser vazio!");

    }else if(senha == "" || senha == null || senha == undefined){

        $("#mensagem_erro_login").text("Campo 'Senha' não pode ser vazio!");

    }else{

        $("#mensagem_erro_login").text("");

        let existe_cadastro = await ValidaCadadastroExistente(email , senha);

        if(existe_cadastro == true){
            for (let i = 0; i < logincadastrados.length; i++) {
                if(logincadastrados[i].email == email){
                    var senhaCodificada = logincadastrados[i].senha;
                    var senhaDecryptada = await decryptMessage(senhaCodificada, 'senhaCrypt'); //nunca usar no front, apenas para teste
                    if(senhaDecryptada == senha){

                        $("#mensagem_erro_login").css("font-weight", "bold");
                        $("#mensagem_erro_login").css("color", "green");
                        $("#mensagem_erro_login").text("Login realizado com sucesso!");

                        setTimeout(function () {

                            window.location.href = "login.html";

                        }, 3000);
                    }else{
                        $("#mensagem_erro_login").text("Senha Incorreta!");
                    }
                    
                }
            }

        }else{
            $("#mensagem_erro_login").text("Não Existe Cadastro com esse Email!");
        }
        
    }

};

function AlternaCards(tela){

    if(tela == 'login'){

        $("#card_cadastro").hide();
        $("#card_login").show();   

    }else if('cadastro'){

        $("#card_login").hide();
        $("#card_cadastro").show();

    }

    $("#mensagem_erro_login").text("");
    $("#card_login input, #card_cadastro input").val("");
    
}

async function Cadastrar(){

    $("#mensagem_erro_cadastro").text("");

    let nome = $("#nome_cadastro").val();
    let sobrenome = $("#sobrenome_cadastro").val();
    let nascimento = $("#data_nascimento_cadastro").val();
    let email = $("#email_cadastro").val();
    let senha = $("#senha_cadastro").val();

    if(nome == "" || nome == null || nome == undefined){

        $("#mensagem_erro_cadastro").text("Campo 'Nome' não pode ser vazio!");

    }else if(sobrenome == "" || sobrenome == null || sobrenome == undefined){

        $("#mensagem_erro_cadastro").text("Campo 'Sobrenome' não pode ser vazio!");

    }else if(nascimento == "" || nascimento == null || nascimento == undefined){

        $("#mensagem_erro_cadastro").text("Campo 'Nascimento' não pode ser vazio!");

    }else if(email == "" || email == null || email == undefined){

        $("#mensagem_erro_cadastro").text("Campo 'Email' não pode ser vazio!");

    }else if (!validarDominioEmail(email)){

        $("#mensagem_erro_cadastro").text("Campo 'Email' não está no padrão!");

    }else if(senha == "" || senha == null || senha == undefined){

        $("#mensagem_erro_cadastro").text("Campo 'Senha' não pode ser vazio!");

    }else if(senha.length < 6 || senha.length > 10){
        
        $("#mensagem_erro_cadastro").text("A 'Senha' deve ser de 6 à 10 caracteres!");

    }else{

        let existe_cadastro = await ValidaCadadastroExistente(email , senha);

        if(existe_cadastro != true){

             //nunca Usar Encrypt ou Decrypt no front, isso é apenas para teste
            var senhaEncryptada = await encryptMessage(senha, 'senhaCrypt');

            logincadastrados.push({email: email ,senha: senhaEncryptada, nome: nome, sobrenome: sobrenome, nascimento: nascimento});

            $("#mensagem_erro_cadastro").css("font-weight", "bold");
            $("#mensagem_erro_cadastro").css("color", "green");
            $("#mensagem_erro_cadastro").text("Cadastro realizado com sucesso!");

            setTimeout(function () {

                AlternaCards('login');

            }, 3000);

        }
        
       

    }

}

function ValidaCadadastroExistente(email , senha){

    if(logincadastrados.length  > 0){

        for (let i = 0; i < logincadastrados.length; i++) {
            if(logincadastrados[i].email == email){
                $("#mensagem_erro_cadastro").text("Email já cadastrado!");
                return true;
            }
        }

        return false;

    }
}

function validarDominioEmail(email) {
    // Expressão regular para verificar se o email contém um dos domínios desejados
    var dominiosPermitidos = /@(gmail\.com|hotmail\.com|outlook\.com)$/i;

    // Testa o email com a expressão regular
    return dominiosPermitidos.test(email);
}

// Encrypt
function encryptMessage(message, passphrase) {
    return CryptoJS.AES.encrypt(message, passphrase).toString();
}

// Decrypt
function decryptMessage(ciphertext, passphrase) {
    var bytes  = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
}