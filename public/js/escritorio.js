//Referencias HTML 
const lblDesk   = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert  = document.querySelector('.alert');
const lblPendientes  = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblDesk.innerText = escritorio;
divAlert.style.display = 'none';

const socket = io();


socket.on('connect', () => {
    btnAttend.disabled = false;
});

socket.on('disconnect', () => {
    btnAttend.disabled = true;
});


socket.on('ticket-queue', (countPending) => {
    if(countPending === 0) {
        lblPendientes.style.display = 'none'; 
    }else{
        lblPendientes.style.display = ''; 
        lblPendientes.innerText = countPending;
    }
    
})

btnAttend.addEventListener( 'click', () => {

    socket.emit('attend-ticket', { escritorio }, ( payload ) => {
        const { ok, ticket, msg } = payload;

        if(!ok){
            lblTicket.innerText = 'Nadie. ';
            return divAlert.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.number;

        socket.emit('ticket-queue', null, (countPending) => {
            lblPendientes.innerText = countPending;
        
        });
    });
});


