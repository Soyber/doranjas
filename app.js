const { GoogleSpreadsheet } = require('google-spreadsheet');

const fs = require('fs');

const RESPONSES_SHEET_ID ='1oeP2vnmigCD7x1MeJqgzWV_zYSZcCIUbqFhKgr82_eE'; //AquΓ­ pondras el ID de

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

const Flowbienvenida = addKeyword(['Doranjas','Doranjas π'])
.addAnswer(
    'Hola Soy _*Anubis*_ Tu Asistente Virtual π recuerda que soy un Bot _*Por favor selecciona una de las siguientes opciones:*_',{
        buttons:[
            {
                body:'Usuario Nuevo π'
            },
            {
                body:'Usuario Antiguo π'
            }
        ]
    }
)

const Flowantiguis = addKeyword(['Usuario Antiguo π'])
.addAnswer(
    'Para _*Doranjas*_ π es un placer Poder Atenderte _*Cuentame que estas buscando?*_ π',{
        buttons:[
            {
                body:'Actualizar Mis Datos π'
            },
            {
                body:'Solicitar Recarga Jugosa π'
            }
        ]
    }
)


const flowPrincipal = addKeyword(['Usuario Nuevo π'])
.addAnswer(
    'Hola! somos _*Doranjas*_ π el mejor jugo de Naranja de MedellΓ­n y Sus alrededores π al igual que a ti nos gusta siempre lo Natural _*Cuentanos en que te podemos ayudar?*_',{
        buttons:[
            {
                body:'Hacer Pedido π'
            },
            {
                body:'Conocer el Producto π'
            }
        ] }
)
    
// Pagos
const flowMetododepago = addKeyword('SΓ­ π').addAnswer('Excelente! Ya casi Terminamos _*ΒΏQuΓ© mΓ©todo de pago deseas?*_ π',{
    buttons:[
        {
            body:'Pago por Transferencia β‘'
        },
        {
            body:'Pago Contra entrega π€πΌ'
        }
    ]
})

const Flowpagoqr = addKeyword(['Pago por Transferencia β‘'])
.addAnswer(
    ['βͺ _*Cuenta de Ahorros Bancolombia:* 91218681706_','βͺ _*Daviplata:* 3052489862_','βͺ _*Nequi:* 3052489862_']
).addAnswer(
    '_*Este es Nuestro Codigo QR*_ π€πΌ',{
        media:'https://i.imgur.com/SI8TVNN.jpg'
    }
).addAnswer(
    '_*Si deseas puedes enviar tu comprobante seguido de la palabra OK*_ ',{capture:true},(ctx) => {console.log(ctx.body)}
).addAnswer(
    'β _Comprobante Recibido!_'
).addAnswer(
    '_*Genial!*_ π Entregaremos tu pedido lo antes posible muchas gracias por Preferirnos! π'
)

const Flowpagocontra = addKeyword(['Pago Contra entrega π€πΌ',]).addAnswer('_*Genial!*_ π Entregaremos tu pedido lo antes posible muchas gracias por Preferirnos! π')



const flowasesor = addKeyword('Contactar Asesor π©πΌβπ»').addAnswer('π _*Pronto uno de nuestros asesores se pondrΓ‘ en contacto contigo para atender tus solicitudes, agradecemos tu paciencia y tiempo en espera*_ β¨')

// Pedidos 

// Flujo Pauta

const flowacercade = addKeyword(['Conocer el Producto π','facebook','informacion','informaciΓ³n','info','precio','cuanto vale']).addAnswer('_*Te Presentamos nuestro jugo de Naranja π 100% Natural*_')
.addAnswer('Contamos con un alto estandar en calidad y un sabor totalmente natural y delicioso π somos una empresa que se preocupa por el medio ambiente π y buscamos siempre tener el menor impacto en el ecosistema, es por esto que implementamos el sistema de _*Recarga Jugosa*_ π donde recogemos tus envases usados y te entregamos unos completamente nuevos β‘ asΓ­ entre todos ayudamos al cuidado del medio ambiente π si realizas tu pedido ya te regalamos el *Domicilio!*',{
    media:'https://i.imgur.com/yDOWAgz.png'
}).addAnswer('_*ΒΏTe gustaria probar este delicioso Jugo?*_ π',{
    buttons:[
        {
            body:'Hacer Pedido π'
        }
    ]
}) 


let STATUS = {}
let STATUS2 = {}

// Flujo Pedido Usuario Nuevo

const flowDatospedido = addKeyword(['Hacer Pedido π','No π']).addAnswer(
    '_*Excelente!*_ π por favor selecciona tu _*Producto*_ βπΌ',{capture:true,
        buttons:[
            {
                body:'Botella de Litro π'
            },
            {
                body:'Four Pack π'
            }
        ]
},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
producto = STATUS[telefono] = {...STATUS[telefono], producto : ctx.body}


flowDynamic()    

}).addAnswer('A continuaciΓ³n te pedirΓ© algunos datos para poder hacer la toma de tu pedido _*Porfavor responde a las siguientes preguntas*_π')
.addAnswer(
'π ΒΏCual es tu nombre? β‘',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
nombre = STATUS[telefono] = {...STATUS[telefono], nombre : ctx.body}                
telefono = STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}        
                                                                            
flowDynamic()
})
.addAnswer(
'π ΒΏCΓΊal es tu direcciΓ³n? β‘',
{capture:true},
async (ctx,{flowDynamic}) =>{
  
telefono = ctx.from
direccion = STATUS[telefono] = {...STATUS[telefono], direccion : ctx.body}
flowDynamic()
})
.addAnswer(
'π ΒΏCΓΊal es tu barrio? β‘',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
barrio = STATUS[telefono] = {...STATUS[telefono], barrio : ctx.body}      //Variable del STATUS
console.log('π©RecibΓ­ un Pedido ππ©')
flowDynamic()
})
.addAnswer('π ΒΏQuΓ© cantidad deseas? β‘',
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




await flowDynamic ([{body:`π Perfecto! _*${STATUS[telefono].nombre}*_, espero que te haya parecido sencillo este paso π`}])
await flowDynamic ({body:`_*ΒΏQuΓ© mΓ©todo de pago deseas?*_ ππΌ`, buttons:[{body:'Pago por Transferencia β‘'},{body:'Pago Contra entrega π€πΌ'}]})

});


// Validacion para Pedidos Nuevos

const flowConsultar = addKeyword('unirme')
.addAnswer('_*Validando Datos*_ π')
.addAnswer(['π _ΒΏEsta es tu informaciΓ³n para prΓ³ximas entregas?_ ππΌ'],{delay:3000}, async (ctx, {flowDynamic}) =>{
    telefono = ctx.from
    
    const consultar = await consultarDatos(telefono)
    
    const Nombre = consultados['Nombre']                       
    const Direccion = consultados['Direccion']
    const Barrio = consultados['Barrio']
    
    await flowDynamic(`π *Nombre*: ${Nombre}\n π *Direccion*: ${Direccion}\n π *Barrio*: ${Barrio}`)


}).addAnswer('π _Si desea ser parte de nuestra familia *Doranjas* y recibir *promociones y descuentos* toca el siguiente botΓ³n_',{capture:true,
    buttons:[
        {
            body:'Confirmar π'
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




const flowConsultarrec = addKeyword(['recargar','Solicitar Recarga Jugosa π'])
.addAnswer(
    ['Estos son Tus datos? ππΌ'],{delay:3000}, async (ctx, {flowDynamic}) =>{
telefono = ctx.from

const consultar = await consultarDatos2(telefono)
Nombre = consultados2['Nombre'] 
Direccion = consultados2['Direccion']
Barrio = consultados2['Barrio']


await flowDynamic(`π *Nombre*: ${Nombre}\n π *Direccion*: ${Direccion}\n π *Barrio*: ${Barrio}`)


}
).addAnswer(
    'π ΒΏEsta Todo Correcto?',{
    buttons:[
        {
            body:'SΓ­ π'
        },
        {
            body:'No π'
        }
    ]
}
)


const FlowRecompra = addKeyword('SΓ­ π').addAnswer('Muy bien! ').addAnswer(
    '_*Excelente!*_ π por favor selecciona tu _*Producto*_ βπΌ',{capture:true,
        buttons:[
            {
                body:'Botella de Litro π'
            },
            {
                body:'Four Pack π'
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
    'π ΒΏQue Cantidad deseas? β‘',
    {capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    console.log('Recibi una Recarga Jugosa π',consultados2['Nombre'])
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

await flowDynamic ([{body:`π Perfecto!  muchas gracias por preferirnos! `}])

}
)


// Datos 

const flowtratamiento = addKeyword(['Datos','Actualizar Mis Datos π']).addAnswer('π© _Sus datos son protejidos segΓΊn *la Ley de ProtecciΓ³n de Datos Personales o Ley 1581 de 2012*_ π©',{
    buttons:[
        {
            body:'Acepto π©'
        }
    ]
})

const florbasededatos = addKeyword(['Acepto π©','No π']).addAnswer('π _*Muchas gracias!*_ A continuaciΓ³n te hare unas pocas preguntas β‘ ')
.addAnswer(
'π ΒΏCual es tu nombre? β‘',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
nombre = STATUS[telefono] = {...STATUS[telefono], nombre : ctx.body}               
telefono = STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}
                                                                            

flowDynamic()
})
.addAnswer(
'π ΒΏCΓΊal es tu direcciΓ³n? β‘',
{capture:true},
async (ctx,{flowDynamic}) =>{
  
telefono = ctx.from
direccion = STATUS[telefono] = {...STATUS[telefono], direccion : ctx.body}
flowDynamic()
})
.addAnswer(
'π ΒΏCΓΊal es tu barrio? β‘',
{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
barrio = STATUS[telefono] = {...STATUS[telefono], barrio : ctx.body}     
console.log(STATUS[telefono].nombre)
flowDynamic()

   ingresarDatos();  
   async function ingresarDatos(){
    console.log('π©Recibi Informacion de un Cliente!π©')
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




await flowDynamic ([{body:`π Perfecto! _*${STATUS[telefono].nombre}*_, muchas gracias! si dedeas hacer un pedido toca aquΓ­ ππΌ`, buttons:[{body:'Usuario Antiguo π'}]}])

});



async function consultarDatos2(telefono){
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Base de Datos'];                        // AQUΓ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
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
    let sheet = doc.sheetsByTitle['Pedidos Nuevos'];                        // AQUΓ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
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
