const { GoogleSpreadsheet } = require('google-spreadsheet');

const fs = require('fs');

const RESPONSES_SHEET_ID ='1oeP2vnmigCD7x1MeJqgzWV_zYSZcCIUbqFhKgr82_eE'; //Aquí pondras el ID de

const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);

const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json'));

const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock');
const { transferableAbortSignal } = require('util');


//Aqui Empieza el Flujo 

const Flowbienvenida = addKeyword(['Doranjas','Doranjas 🍊'])
.addAnswer(
    'Hola Soy _*Anubis*_ Tu Asistente Virtual 🍊 recuerda que soy un Bot _*Por favor selecciona una de las siguientes opciones:*_',{
        buttons:[
            {
                body:'Usuario Nuevo 🍃'
            },
            {
                body:'Usuario Antiguo 🍃'
            }
        ]
    }
)

const Flowantiguis = addKeyword(['Usuario Antiguo 🍃'])
.addAnswer(
    'Para _*Doranjas*_ 🍊 es un placer Poder Atenderte _*Cuentame que estas buscando?*_ 😋',{
        buttons:[
            {
                body:'Actualizar Mis Datos 🍃'
            },
            {
                body:'Solicitar Recarga Jugosa 🍃'
            }
        ]
    }
)


const flowPrincipal = addKeyword(['Usuario Nuevo 🍃'])
.addAnswer(
    'Hola! somos _*Doranjas*_ 🍊 el mejor jugo de Naranja de Medellín y Sus alrededores 😎 al igual que a ti nos gusta siempre lo Natural _*Cuentanos en que te podemos ayudar?*_',{
        buttons:[
            {
                body:'Hacer Pedido 🍊'
            },
            {
                body:'Conocer el Producto 🍊'
            }
        ] }
)
    
// Pagos
const flowMetododepago = addKeyword('Sí 🍊').addAnswer('Excelente! Ya casi Terminamos _*¿Qué método de pago deseas?*_ 🍊',{
    buttons:[
        {
            body:'Pago por Transferencia ⚡'
        },
        {
            body:'Pago Contra entrega 🤝🏼'
        }
    ]
})

const Flowpagoqr = addKeyword(['Pago por Transferencia ⚡'])
.addAnswer(
    ['▪ _*Cuenta de Ahorros Bancolombia:* 91218681706_','▪ _*Daviplata:* 3052489862_','▪ _*Nequi:* 3052489862_']
).addAnswer(
    '_*Este es Nuestro Codigo QR*_ 🤞🏼',{
        media:'https://i.imgur.com/SI8TVNN.jpg'
    }
).addAnswer(
    '_*Si deseas puedes enviar tu comprobante seguido de la palabra OK*_ ',{capture:true},(ctx) => {console.log(ctx.body)}
).addAnswer(
    '✅ _Comprobante Recibido!_'
).addAnswer(
    '_*Genial!*_ 🍊 Entregaremos tu pedido lo antes posible muchas gracias por Preferirnos! 🍃'
)

const Flowpagocontra = addKeyword(['Pago Contra entrega 🤝🏼',]).addAnswer('_*Genial!*_ 🍊 Entregaremos tu pedido lo antes posible muchas gracias por Preferirnos! 🍃')



const flowasesor = addKeyword('Contactar Asesor 👩🏼‍💻').addAnswer('🍃 _*Pronto uno de nuestros asesores se pondrá en contacto contigo para atender tus solicitudes, agradecemos tu paciencia y tiempo en espera*_ ✨')

// Pedidos 

// Flujo Pauta

const flowacercade = addKeyword(['Conocer el Producto 🍊','facebook','informacion','información','info','precio','cuanto vale']).addAnswer('_*Te Presentamos nuestro jugo de Naranja 🍊 100% Natural*_')
.addAnswer('Contamos con un alto estandar en calidad y un sabor totalmente natural y delicioso 😋 somos una empresa que se preocupa por el medio ambiente 🍃 y buscamos siempre tener el menor impacto en el ecosistema, es por esto que implementamos el sistema de _*Recarga Jugosa*_ 🍊 donde recogemos tus envases usados y te entregamos unos completamente nuevos ⚡ así entre todos ayudamos al cuidado del medio ambiente 😊 si realizas tu pedido ya te regalamos el *Domicilio!*',{
    media:'https://i.imgur.com/yDOWAgz.png'
}).addAnswer('_*¿Te gustaria probar este delicioso Jugo?*_ 🍊',{
    buttons:[
        {
            body:'Hacer Pedido 🍊'
        }
    ]
}) 


let STATUS = {}
let STATUS2 = {}

// Flujo Pedido Usuario Nuevo

const flowDatospedido = addKeyword(['Hacer Pedido 🍊','No 🍊']).addAnswer(
    '_*Excelente!*_ 🍊 por favor selecciona tu _*Producto*_ ✌🏼',{capture:true,
        buttons:[
            {
                body:'Botella de Litro 🍊'
            },
            {
                body:'Four Pack 🍊'
            }
        ]
},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
producto = STATUS[telefono] = {...STATUS[telefono], producto : ctx.body}


flowDynamic()    

}).addAnswer('A continuación te pediré algunos datos para poder hacer la toma de tu pedido _*Porfavor responde a las siguientes preguntas*_🍊')
.addAnswer(
'🍃 ¿Cual es tu nombre? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
nombre = STATUS[telefono] = {...STATUS[telefono], nombre : ctx.body}                
telefono = STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}        
                                                                            
flowDynamic()
})
.addAnswer(
'🍃 ¿Cúal es tu dirección? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
  
telefono = ctx.from
direccion = STATUS[telefono] = {...STATUS[telefono], direccion : ctx.body}
flowDynamic()
})
.addAnswer(
'🍃 ¿Cúal es tu barrio? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
barrio = STATUS[telefono] = {...STATUS[telefono], barrio : ctx.body}      //Variable del STATUS
console.log('🚩Recibí un Pedido 🍊🚩')
flowDynamic()
})
.addAnswer('🍃 ¿Qué cantidad deseas? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    cantidad = STATUS[telefono] = {...STATUS[telefono], cantidad : ctx.body}           


   ingresarDatos();  
   async function ingresarDatos(){
    console.log(nombre)
    let rows = [{
   
   
    Nombre: STATUS[telefono].nombre ,    
    Direccion: STATUS[telefono].direccion,
    Barrio: STATUS[telefono].barrio,
    Telefono: STATUS[telefono].telefono,
    Cantidad: STATUS[telefono].cantidad,
    Producto: STATUS[telefono].producto
   
        }];
   
    await doc.useServiceAccountAuth({
            client_email: CREDENTIALS.client_email,
            private_key: CREDENTIALS.private_key
        });
        await doc.loadInfo();
        let sheet = doc.sheetsByIndex[0];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            await sheet.addRow(row);}
}




await flowDynamic ([{body:`🍊 Perfecto! _*${STATUS[telefono].nombre}*_, espero que te haya parecido sencillo este paso 😊`}])
await flowDynamic ({body:`_*¿Qué método de pago deseas?*_ 👇🏼`, buttons:[{body:'Pago por Transferencia ⚡'},{body:'Pago Contra entrega 🤝🏼'}]})

});


// Validacion para Pedidos Nuevos

const flowConsultar = addKeyword('unirme')
.addAnswer('_*Validando Datos*_ 🔎')
.addAnswer(['🍃 _¿Esta es tu información para próximas entregas?_ 👇🏼'],{delay:3000}, async (ctx, {flowDynamic}) =>{
    telefono = ctx.from
    
    const consultar = await consultarDatos(telefono)
    
    const Nombre = consultados['Nombre']                       
    const Direccion = consultados['Direccion']
    const Barrio = consultados['Barrio']
    
    await flowDynamic(`🍃 *Nombre*: ${Nombre}\n 🍃 *Direccion*: ${Direccion}\n 🍃 *Barrio*: ${Barrio}`)


}).addAnswer('🍊 _Si desea ser parte de nuestra familia *Doranjas* y recibir *promociones y descuentos* toca el siguiente botón_',{capture:true,
    buttons:[
        {
            body:'Confirmar 🍊'
        }
    ]
},
async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Telefono = STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}


    ingresarDatos();  
    async function ingresarDatos(){
     console.log('Se Registro en la DB a',consultados['Nombre'])
     let rows = [{
    
    
     Nombre: consultados['Nombre']  ,    
     Direccion: consultados['Direccion'],
     Barrio: consultados['Barrio'],
     Telefono: STATUS[telefono].telefono,
     
    
         }];
    
     await doc.useServiceAccountAuth({
             client_email: CREDENTIALS.client_email,
             private_key: CREDENTIALS.private_key
         });
         await doc.loadInfo();
         let sheet = doc.sheetsByIndex[2];
         for (let index = 0; index < rows.length; index++) {
             const row = rows[index];
             await sheet.addRow(row);}
 }
 
flowDynamic()

await flowDynamic(`_Excelente! *${consultados['Nombre']}* ahora haces parte de la familia *Doranjas*_ !`)

}
)




// Recargas Jugosas 




const flowConsultarrec = addKeyword(['recargar','Solicitar Recarga Jugosa 🍃'])
.addAnswer(
    ['Estos son Tus datos? 👇🏼'],{delay:3000}, async (ctx, {flowDynamic}) =>{
telefono = ctx.from

const consultar = await consultarDatos2(telefono)
Nombre = consultados2['Nombre'] 
Direccion = consultados2['Direccion']
Barrio = consultados2['Barrio']


await flowDynamic(`🍃 *Nombre*: ${Nombre}\n 🍃 *Direccion*: ${Direccion}\n 🍃 *Barrio*: ${Barrio}`)


}
).addAnswer(
    '🍊 ¿Esta Todo Correcto?',{
    buttons:[
        {
            body:'Sí 🍃'
        },
        {
            body:'No 🍃'
        }
    ]
}
)


const FlowRecompra = addKeyword('Sí 🍃').addAnswer('Muy bien! ').addAnswer(
    '_*Excelente!*_ 🍊 por favor selecciona tu _*Producto*_ ✌🏼',{capture:true,
        buttons:[
            {
                body:'Botella de Litro 🍊'
            },
            {
                body:'Four Pack 🍊'
            }
        ]
},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
producto = STATUS2[telefono] = {...STATUS2[telefono], producto : ctx.body}


flowDynamic()    

}
)
.addAnswer(
    '🍃 ¿Que Cantidad deseas? ⚡',
    {capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    console.log('Recibi una Recarga Jugosa 🍊',consultados2['Nombre'])
    cantidad = STATUS2[telefono] = {...STATUS2[telefono], cantidad : ctx.body}               
    Phone  = STATUS2[telefono] = {...STATUS2[telefono], Phone : ctx.from}        
    

    ingresarDatosRecarga();  
    async function ingresarDatosRecarga(){
  
     let rows = [{
    
     Producto: STATUS2[telefono].producto,  
     Cantidad: STATUS2[telefono].cantidad,
     Telefono: STATUS2[telefono].Phone,
     Nombre: consultados2['Nombre'],
     Direccion: consultados2['Direccion'],
     Barrio: consultados2['Barrio']
    
         }];
    console.log(rows)
     await doc.useServiceAccountAuth({
             client_email: CREDENTIALS.client_email,
             private_key: CREDENTIALS.private_key
         });
         await doc.loadInfo();
         let sheet = doc.sheetsByIndex[1];
         for (let index = 0; index < rows.length; index++) {
             const row = rows[index];
             await sheet.addRow(row);}
    }
flowDynamic()

await flowDynamic ([{body:`🍊 Perfecto!  muchas gracias por preferirnos! `}])

}
)


// Datos 

const flowtratamiento = addKeyword(['Datos','Actualizar Mis Datos 🍃']).addAnswer('🚩 _Sus datos son protejidos según *la Ley de Protección de Datos Personales o Ley 1581 de 2012*_ 🚩',{
    buttons:[
        {
            body:'Acepto 🚩'
        }
    ]
})

const florbasededatos = addKeyword(['Acepto 🚩','No 🍃']).addAnswer('🍃 _*Muchas gracias!*_ A continuación te hare unas pocas preguntas ⚡ ')
.addAnswer(
'🍃 ¿Cual es tu nombre? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
nombre = STATUS[telefono] = {...STATUS[telefono], nombre : ctx.body}               
telefono = STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}
                                                                            

flowDynamic()
})
.addAnswer(
'🍃 ¿Cúal es tu dirección? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
  
telefono = ctx.from
direccion = STATUS[telefono] = {...STATUS[telefono], direccion : ctx.body}
flowDynamic()
})
.addAnswer(
'🍃 ¿Cúal es tu barrio? ⚡',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
barrio = STATUS[telefono] = {...STATUS[telefono], barrio : ctx.body}     
console.log(STATUS[telefono].nombre)
flowDynamic()

   ingresarDatos();  
   async function ingresarDatos(){
    console.log('🚩Recibi Informacion de un Cliente!🚩')
    let rows = [{
   
    Nombre: STATUS[telefono].nombre ,    
    Direccion: STATUS[telefono].direccion,
    Barrio: STATUS[telefono].barrio,
    Telefono: STATUS[telefono].telefono,
   
        }];
   
    await doc.useServiceAccountAuth({
            client_email: CREDENTIALS.client_email,
            private_key: CREDENTIALS.private_key
        });
        await doc.loadInfo();
        let sheet = doc.sheetsByIndex[2];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            await sheet.addRow(row);}
}




await flowDynamic ([{body:`🍊 Perfecto! _*${STATUS[telefono].nombre}*_, muchas gracias! si dedeas hacer un pedido toca aquí 👇🏼`, buttons:[{body:'Usuario Antiguo 🍃'}]}])

});



async function consultarDatos2(telefono){
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Base de Datos'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
    consultados2 = [];




    let rows = await sheet.getRows();
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.Telefono === telefono) {
           
           
            consultados2['Nombre'] = row.Nombre        
            consultados2['Direccion'] = row.Direccion                  // consultados['EL NOMBRE QUE QUIERAS'] = row.NOMBRE DE LA COLUMNA DE SHEET
            consultados2['Barrio'] = row.Barrio
            consultados2['Cantidad'] = row.Cantidad
            consultados2['Producto'] = row.Producto





        }
           
}
           
return consultados2




};










async function consultarDatos(telefono){
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Pedidos Nuevos'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
    consultados = [];




    let rows = await sheet.getRows();
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.Telefono === telefono) {
           
           
            consultados['Nombre'] = row.Nombre        
            consultados['Direccion'] = row.Direccion                  // consultados['EL NOMBRE QUE QUIERAS'] = row.NOMBRE DE LA COLUMNA DE SHEET
            consultados['Barrio'] = row.Barrio
            consultados['Cantidad'] = row.Cantidad
            consultados['Producto'] = row.Producto





        }
           
}
           
return consultados




};



// Aqui Termina

async function main() {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowDatospedido,flowPrincipal,flowasesor,flowacercade,Flowpagoqr,Flowpagocontra,flowMetododepago,florbasededatos,flowConsultarrec,flowConsultar,FlowRecompra,flowtratamiento,Flowbienvenida,Flowantiguis])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })


}

main()
