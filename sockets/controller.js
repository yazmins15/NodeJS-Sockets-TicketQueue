const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

const socketController = (socket) => {
    //cuando un cliente se conecta
    socket.emit('last-ticket', ticketControl.last);
    socket.emit('current-state', ticketControl.last4);
    socket.emit('ticket-queue', ticketControl.tickets.length);
    
    socket.on('next-ticket', (payload, callback) => {   
        const next = ticketControl.next();
        callback(next);
        //Notifica que hay nuevo ticket pendiente de asignar    
        socket.broadcast.emit('ticket-queue', ticketControl.tickets.length);
             
    });

    socket.on('attend-ticket', (payload, callback) => {
        const { escritorio } = payload;

        if(!escritorio){
            return callback({
                ok : false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.attendTicket(escritorio);

        socket.broadcast.emit('current-state', ticketControl.last4);
        socket.emit('ticket-queue', ticketControl.tickets.length);
        socket.broadcast.emit('ticket-queue', ticketControl.tickets.length);

        if(!ticket){
          callback({
            ok: false,
            msg: 'No hay tickets pendientes'
          });  
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })
}

module.exports = {
    socketController
}